/**
 * LinkedIn Profile Scraper
 *
 * Why: We need to extract recent posts from a LinkedIn profile to analyze writing style.
 * Gotcha: LinkedIn has aggressive anti-scraping measures. We use a simple approach that
 * works for public profiles but may fail if LinkedIn changes their HTML structure.
 *
 * Production Note: For a commercial product, consider using a dedicated scraping API
 * like ScrapingBee or Apify to handle rate limits and CAPTCHAs.
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

export interface LinkedInPost {
  text: string;
  timestamp?: string;
}

export interface ScrapeResult {
  success: boolean;
  posts: LinkedInPost[];
  error?: string;
}

/**
 * Scrapes recent posts from a LinkedIn profile URL
 *
 * @param profileUrl - Full LinkedIn profile URL (e.g., https://linkedin.com/in/username)
 * @param maxPosts - Maximum number of posts to scrape (default: 5)
 * @returns ScrapeResult with posts or error message
 */
export async function scrapeLinkedInProfile(
  profileUrl: string,
  maxPosts: number = 5
): Promise<ScrapeResult> {
  try {
    // Validate URL format
    if (!isValidLinkedInUrl(profileUrl)) {
      return {
        success: false,
        posts: [],
        error: 'Invalid LinkedIn profile URL. Please use format: https://linkedin.com/in/username',
      };
    }

    // Attempt to fetch the profile page
    // Note: This is a simplified approach. LinkedIn may block requests without proper headers.
    const response = await axios.get(profileUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 10000, // 10 second timeout to prevent hanging
    });

    const $ = cheerio.load(response.data);
    const posts: LinkedInPost[] = [];

    // LinkedIn's HTML structure varies, but we look for common post containers
    // This is a best-effort approach and may need updates if LinkedIn changes their structure
    const postSelectors = [
      '.feed-shared-update-v2__description',
      '.feed-shared-text',
      '[data-test-id="main-feed-activity-card__commentary"]',
    ];

    for (const selector of postSelectors) {
      $(selector).each((_, element) => {
        if (posts.length >= maxPosts) return false; // Stop when we have enough posts

        const text = $(element).text().trim();
        if (text && text.length > 50) {
          // Filter out very short snippets
          posts.push({ text });
        }
      });

      if (posts.length >= maxPosts) break;
    }

    // If we couldn't find posts with the above selectors, try a fallback
    if (posts.length === 0) {
      return {
        success: false,
        posts: [],
        error:
          "Could not extract posts from this profile. The profile may be private, or LinkedIn's structure has changed. Try using a different profile URL.",
      };
    }

    return {
      success: true,
      posts: posts.slice(0, maxPosts),
    };
  } catch (error) {
    // Handle different error types with specific messages
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return {
          success: false,
          posts: [],
          error: 'Profile not found. Please check the URL and try again.',
        };
      }
      if (error.response?.status === 429) {
        return {
          success: false,
          posts: [],
          error: 'Rate limit exceeded. Please try again in a few minutes.',
        };
      }
      if (error.code === 'ECONNABORTED') {
        return {
          success: false,
          posts: [],
          error: 'Request timeout. LinkedIn may be blocking automated requests.',
        };
      }
    }

    return {
      success: false,
      posts: [],
      error:
        "Failed to scrape profile. This could be due to LinkedIn's anti-bot protection. Please try again later.",
    };
  }
}

/**
 * Validates if a URL is a proper LinkedIn profile URL
 */
function isValidLinkedInUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return (
      (parsedUrl.hostname === 'linkedin.com' || parsedUrl.hostname === 'www.linkedin.com') &&
      parsedUrl.pathname.startsWith('/in/')
    );
  } catch {
    return false;
  }
}

/**
 * Mock scraper for development/testing
 * Returns fake posts to test the UI without hitting LinkedIn
 */
export function getMockLinkedInPosts(): ScrapeResult {
  return {
    success: true,
    posts: [
      {
        text: 'Just shipped a new AI feature that analyzes user behavior in real-time. The power of LangChain + Next.js is insane. 🚀\n\nBuilt the entire MVP in 3 hours. This is the future of SaaS development.',
        timestamp: '2 days ago',
      },
      {
        text: "Hot take: Most startups don't need microservices.\n\nYou need:\n- Fast iteration\n- Simple deployment\n- Low cognitive overhead\n\nMonoliths are underrated. Fight me. 💪",
        timestamp: '5 days ago',
      },
      {
        text: "The best investment I made this year wasn't in stocks or crypto.\n\nIt was learning to build with AI.\n\nOpenAI's API changed everything. Now I can build products that would've taken a team of 10 engineers just 2 years ago.\n\nThe solo founder era is here.",
        timestamp: '1 week ago',
      },
      {
        text: "Reminder: Your side project doesn't need to be perfect.\n\nIt needs to:\n✅ Solve a real problem\n✅ Be shipped TODAY\n✅ Get feedback from users\n\nPerfection is the enemy of progress.",
        timestamp: '2 weeks ago',
      },
      {
        text: 'Why I switched from Python to TypeScript for AI projects:\n\n1. End-to-end type safety\n2. Better DX with Next.js\n3. Deploy anywhere (Vercel, Cloudflare)\n4. LangChain.js is production-ready\n\nPython is great, but TS is the future for full-stack AI apps.',
        timestamp: '3 weeks ago',
      },
    ],
  };
}
