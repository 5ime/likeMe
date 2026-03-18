function env(name, fallback) {
  const v = process.env[name];
  if (v === undefined || v === null || v === '') return fallback;
  return v;
}

module.exports = {
  port: Number(env('PORT', '3000')),
  allowOrigin: env('ALLOW_ORIGIN', '*'),
  trustProxy: env('TRUST_PROXY', '1'),
  infoCacheSeconds: Number(env('INFO_CACHE_SECONDS', '5')),
  likeRateLimitWindowMs: Number(env('LIKE_RATE_LIMIT_WINDOW_MS', '60000')),
  likeRateLimitMax: Number(env('LIKE_RATE_LIMIT_MAX', '20')),
  isVercel: Boolean(process.env.VERCEL),
};

