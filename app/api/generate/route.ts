/**
 * POST /api/generate
 *
 * Main API endpoint for EchoWrite
 * Handles the entire flow: scraping → analysis → generation
 *
 * Why a single endpoint: Simplifies the frontend and reduces round trips.
 * The entire process takes 10-15 seconds, which is acceptable for an MVP.
 *
 * For scale: Consider splitting into separate endpoints and using a job queue.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { scrapeLinkedInProfile, getMockLinkedInPosts } from '@/lib/scraper';
import { analyzeWritingStyle, generateMultiplePosts, DEFAULT_TOPICS } from '@/lib/chains';
import { checkRateLimit, getClientIp } from '@/lib/ratelimit';

// Input validation schema
const GenerateRequestSchema = z.object({
  profileUrl: z.string().url('Invalid URL format'),
  useMockData: z.boolean().optional().default(false), // For development/testing
});

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const validation = GenerateRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request: ' + validation.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    const { profileUrl, useMockData } = validation.data;

    // 2. Check rate limit
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(clientIp);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: rateLimitResult.error,
          rateLimit: {
            limit: rateLimitResult.limit,
            remaining: rateLimitResult.remaining,
            reset: rateLimitResult.reset,
          },
        },
        { status: 429 }
      );
    }

    // 3. Scrape LinkedIn profile (or use mock data)
    const scrapeResult = useMockData
      ? getMockLinkedInPosts()
      : await scrapeLinkedInProfile(profileUrl, 5);

    if (!scrapeResult.success || scrapeResult.posts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: scrapeResult.error || 'No posts found on this profile',
        },
        { status: 400 }
      );
    }

    // 4. Analyze writing style
    const posts = scrapeResult.posts.map((p) => p.text);
    const writingStyle = await analyzeWritingStyle(posts);

    // 5. Generate new posts
    const generatedPosts = await generateMultiplePosts(writingStyle, DEFAULT_TOPICS);

    // 6. Return success response
    return NextResponse.json({
      success: true,
      data: {
        writingStyle,
        generatedPosts: generatedPosts.map((post, index) => ({
          id: index + 1,
          topic: DEFAULT_TOPICS[index],
          content: post,
        })),
        originalPosts: posts, // Include for transparency
      },
      rateLimit: {
        limit: rateLimitResult.limit,
        remaining: rateLimitResult.remaining,
        reset: rateLimitResult.reset,
      },
    });
  } catch (error) {
    console.error('Generation error:', error);

    // Don't expose internal errors to users
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS (if needed)
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
