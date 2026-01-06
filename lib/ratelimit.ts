/**
 * Rate Limiting with Upstash Redis
 *
 * Why: We need to prevent abuse without requiring user authentication.
 * IP-based rate limiting is the simplest approach for an MVP.
 *
 * Gotcha: IP addresses can be spoofed, and users behind NAT share IPs.
 * For production, consider adding additional signals (user agent, fingerprinting)
 * or requiring email verification after the first free generation.
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Initialize Redis client
 * Upstash provides a serverless Redis with a generous free tier
 */
function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn(
      'UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set. ' +
        'Rate limiting is DISABLED. This is fine for development but DANGEROUS in production.'
    );
    return null;
  }

  return new Redis({
    url,
    token,
  });
}

/**
 * Create rate limiter instance
 * Limits: 3 requests per 24 hours per IP
 */
function getRateLimiter() {
  const redis = getRedis();

  if (!redis) {
    return null; // Rate limiting disabled
  }

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '24 h'), // 3 requests per 24 hours
    analytics: true, // Track usage for insights
    prefix: 'echowrite:ratelimit', // Namespace for this app
  });
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp when the limit resets
  error?: string;
}

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Usually the IP address, but can be any unique string
 * @returns RateLimitResult with success status and metadata
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const ratelimiter = getRateLimiter();

  // If rate limiting is disabled (dev mode), allow all requests
  if (!ratelimiter) {
    return {
      success: true,
      limit: 999,
      remaining: 999,
      reset: Date.now() + 86400000, // 24 hours from now
    };
  }

  try {
    const result = await ratelimiter.limit(identifier);

    if (!result.success) {
      // Calculate minutes until reset for user-friendly error message
      const resetDate = new Date(result.reset);
      const now = new Date();
      const minutesUntilReset = Math.ceil((resetDate.getTime() - now.getTime()) / 60000);
      const hoursUntilReset = Math.floor(minutesUntilReset / 60);

      let resetMessage = '';
      if (hoursUntilReset > 0) {
        resetMessage = `${hoursUntilReset} hour${hoursUntilReset > 1 ? 's' : ''}`;
      } else {
        resetMessage = `${minutesUntilReset} minute${minutesUntilReset > 1 ? 's' : ''}`;
      }

      return {
        success: false,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
        error: `Rate limit exceeded. You've used all ${result.limit} free generations. Try again in ${resetMessage}.`,
      };
    }

    return {
      success: true,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);

    // Fail open: If Redis is down, allow the request
    // This prevents Redis outages from breaking the entire app
    // In production, you might want to fail closed for security
    return {
      success: true,
      limit: 3,
      remaining: 0,
      reset: Date.now() + 86400000,
    };
  }
}

/**
 * Get the client's IP address from the request
 * Handles various proxy headers (Vercel, Cloudflare, etc.)
 */
export function getClientIp(request: Request): string {
  // Try to get IP from various headers (in order of preference)
  const headers = request.headers;

  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = headers.get('cf-connecting-ip'); // Cloudflare
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to a default (this should never happen on Vercel)
  return 'unknown';
}
