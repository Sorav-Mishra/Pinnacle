// /lib/rate-limit.ts
interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limiting (use Redis in production)
const store: RateLimitStore = {};

// Cleanup interval to remove expired entries
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60000); // Clean up every minute

export async function rateLimit(
  identifier: string,
  limit: number = 100, // requests per window
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): Promise<RateLimitResult> {
  const now = Date.now();
  const key = `rate_limit:${identifier}`;

  // Get or create rate limit entry
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 0,
      resetTime: now + windowMs,
    };
  }

  const entry = store[key];

  // Check if limit exceeded
  if (entry.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.ceil(entry.resetTime / 1000),
    };
  }

  // Increment counter
  entry.count++;

  return {
    success: true,
    limit,
    remaining: Math.max(0, limit - entry.count),
    reset: Math.ceil(entry.resetTime / 1000),
  };
}

// Specific rate limiters for different endpoints
export const rateLimiters = {
  // General API rate limiting
  api: (identifier: string) => rateLimit(identifier, 100, 15 * 60 * 1000), // 100 requests per 15 minutes

  // User registration rate limiting
  registration: (identifier: string) =>
    rateLimit(identifier, 5, 60 * 60 * 1000), // 5 requests per hour

  // Profile update rate limiting
  profileUpdate: (identifier: string) =>
    rateLimit(identifier, 20, 60 * 60 * 1000), // 20 requests per hour

  // Login attempts
  login: (identifier: string) => rateLimit(identifier, 10, 15 * 60 * 1000), // 10 attempts per 15 minutes
};
