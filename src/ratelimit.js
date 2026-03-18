function createIpRateLimiter({ windowMs, max, keyFn }) {
  // key -> { count, resetAt }
  const hits = new Map();

  function cleanup(now) {
    for (const [k, v] of hits) {
      if (v.resetAt <= now) hits.delete(k);
    }
  }

  return function rateLimit(req, res, next) {
    const now = Date.now();
    cleanup(now);

    const key = (keyFn ? keyFn(req) : undefined) || 'unknown';
    const existing = hits.get(key);

    if (!existing || existing.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    existing.count += 1;
    if (existing.count > max) {
      res.setHeader(
        'Retry-After',
        String(Math.ceil((existing.resetAt - now) / 1000))
      );
      return res.status(429).json({ code: '201', msg: '请求太频繁啦，稍后再试~' });
    }

    return next();
  };
}

module.exports = { createIpRateLimiter };

