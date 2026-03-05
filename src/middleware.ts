import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple in-memory rate limiter for sensitive endpoints.
 * Keyed by IP + path. Limits are per-window (sliding window).
 *
 * In production behind a reverse proxy (Traefik/nginx), use
 * X-Forwarded-For only when the proxy is trusted.
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// Clean up expired entries every 60 seconds
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  }
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Admin login: max 10 attempts per minute (brute-force protection)
  '/api/v1/admin/auth': { windowMs: 60_000, maxRequests: 10 },
  // Admin seed: max 5 attempts per minute
  '/api/v1/admin/seed': { windowMs: 60_000, maxRequests: 5 },
  // User login: max 10 attempts per minute (brute-force protection)
  '/api/v1/auth/login': { windowMs: 60_000, maxRequests: 10 },
  // User registration: max 5 attempts per minute
  '/api/v1/auth/register': { windowMs: 60_000, maxRequests: 5 },
};

function getClientIp(request: NextRequest): string {
  // In production behind trusted proxy, use x-forwarded-for.
  // Fallback to a generic key if IP unavailable.
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanup();
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt: now + config.windowMs };
  }

  entry.count++;
  if (entry.count > config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only rate-limit POST/PUT on sensitive endpoints
  if (request.method !== 'POST' && request.method !== 'PUT') {
    return NextResponse.next();
  }

  const config = RATE_LIMITS[pathname];
  if (!config) return NextResponse.next();

  const ip = getClientIp(request);
  const key = `${ip}:${pathname}`;
  const { allowed, remaining, resetAt } = checkRateLimit(key, config);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Te veel verzoeken. Probeer het later opnieuw.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
          'X-RateLimit-Remaining': '0',
        },
      },
    );
  }

  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Remaining', String(remaining));
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
