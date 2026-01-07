/**
 * POST /api/generate - GitHolo Edition
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  scrapeGitHubProfile,
  getMockGitHubData,
  fetchRecursiveTree,
  fetchRawFileContent,
} from '@/lib/scraper';
import { analyzeGitHubIdentity, generateCodeSample, identifyEvidenceTarget } from '@/lib/chains';
import { checkRateLimit, getClientIp } from '@/lib/ratelimit';

const GenerateRequestSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  useMockData: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = GenerateRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid username provided.' },
        { status: 400 }
      );
    }

    const { username, useMockData } = validation.data;

    // Rate Limit Check
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(clientIp);

    if (!rateLimitResult.success) {
      return NextResponse.json({ success: false, error: rateLimitResult.error }, { status: 429 });
    }

    // --- STEP 1: BROAD SCRAPE ---
    const scrapeResult = useMockData ? getMockGitHubData() : await scrapeGitHubProfile(username);

    if (!scrapeResult.success) {
      return NextResponse.json({ success: false, error: scrapeResult.error }, { status: 400 });
    }

    const { profile, commits, readmes, repoDetails, repos } = scrapeResult;
    const commitMessages = commits!.map((c) => c.message);

    // --- STEP 2: AI PASS 1 (THE SCOUT) ---
    // If we have repos, let the AI scout for the best code evidence
    let evidenceText = '';
    if (repos && repos.length > 0) {
      try {
        const scout = await identifyEvidenceTarget(repos, commitMessages, profile!.bio);

        if (scout.selectedRepo) {
          // --- STEP 3: DEEP SCRAPE (FETCH ACTUAL CODE) ---
          const tree = await fetchRecursiveTree(scout.selectedRepo);
          const evidenceFiles = scout.filePaths.filter((p) => tree.includes(p));

          if (evidenceFiles.length > 0) {
            const contents = await Promise.all(
              evidenceFiles.map(async (path) => {
                const content = await fetchRawFileContent(scout.selectedRepo, path);
                return `FILE: ${path}\n\`\`\`\n${content}\n\`\`\``;
              })
            );
            evidenceText = contents.join('\n\n');
          }
        }
      } catch (scoutError) {
        console.error('Scout pass failed, falling back to basic analysis:', scoutError);
      }
    }

    // --- STEP 4: AI PASS 2 (THE FINAL AUDIT) ---
    const identity = await analyzeGitHubIdentity(
      commitMessages,
      readmes || [],
      profile!.public_repos,
      profile!.followers,
      repoDetails || [],
      evidenceText
    );

    // Generate Code Sample
    const codeSample = await generateCodeSample(identity);

    return NextResponse.json({
      success: true,
      data: {
        profile: {
          username: profile!.username,
          name: profile!.name,
          bio: profile!.bio,
          avatar: profile!.avatar_url,
          stats: {
            repos: profile!.public_repos,
            followers: profile!.followers,
            following: profile!.following,
          },
        },
        identity,
        codeSample,
        sampleCommits: commits!.slice(0, 5).map((c) => ({
          message: c.message,
          repo: c.repo,
        })),
      },
      rateLimit: {
        limit: rateLimitResult.limit,
        remaining: rateLimitResult.remaining,
        reset: rateLimitResult.reset,
      },
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
