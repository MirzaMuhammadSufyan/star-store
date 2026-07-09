const buckets = new Map();

/**
 * Simple in-memory rate limiter (per Worker isolate).
 * Returns { allowed: boolean, retryAfter?: number }.
 */
export function rateLimit(key, { windowMs = 60_000, max = 60 } = {}) {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || now - bucket.start > windowMs) {
    bucket = { start: now, count: 0 };
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  if (bucket.count > max) {
    return { allowed: false, retryAfter: Math.ceil((bucket.start + windowMs - now) / 1000) };
  }
  return { allowed: true };
}

export function clientIp(request) {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

export function rateLimitResponse(retryAfter) {
  return new Response(JSON.stringify({ error: 'Too many requests', retryAfter }), {
    status: 429,
    headers: {
      'content-type': 'application/json',
      'retry-after': String(retryAfter),
    },
  });
}
