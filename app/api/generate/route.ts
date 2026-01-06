/**
 * POST /api/generate - GitHub Vibe Check Edition
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { scrapeGitHubProfile, getMockGitHubData } from '@/lib/scraper';
import { analyzeGitHubVibe, generateCodeSample } from '@/lib/chains';
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

    // Fetch GitHub Data
    const scrapeResult = useMockData ? getMockGitHubData() : await scrapeGitHubProfile(username);

    if (!scrapeResult.success) {
      return NextResponse.json({ success: false, error: scrapeResult.error }, { status: 400 });
    }

    const { profile, commits, readmes } = scrapeResult;

    // AI Analysis
    const commitMessages = commits!.map((c) => c.message);
    const vibe = await analyzeGitHubVibe(
      commitMessages,
      readmes || [],
      profile!.public_repos,
      profile!.followers
    );

    // Generate Code Sample (for shareability)
    const codeSample = await generateCodeSample(vibe);

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
        vibe,
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
