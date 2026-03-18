const express = require('express');
const path = require('path');

const {
  allowOrigin,
  trustProxy,
  infoCacheSeconds,
  likeRateLimitMax,
  likeRateLimitWindowMs,
} = require('./config');
const { getClientIp } = require('./ip');
const { getCurrentCount, likeOncePerDay } = require('./db');
const { ok, fail } = require('./http');
const { createIpRateLimiter } = require('./ratelimit');

function createApp() {
  const app = express();

  // 反代环境下正确识别客户端 IP（Vercel/CF 等）
  app.set('trust proxy', trustProxy);

  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader(
      'Permissions-Policy',
      'geolocation=(), microphone=(), camera=()'
    );
    next();
  });

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', allowOrigin);
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  });

  // 健康检查
  app.get('/healthz', (req, res) => res.status(200).send('ok'));

  // 静态资源
  app.use('/static', express.static(path.join(__dirname, '..', 'static')));
  app.use('/demo', express.static(path.join(__dirname, '..', 'demo')));
  app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
  );

  app.get('/info', async (req, res) => {
    try {
      // 计数查询短缓存
      res.setHeader('Cache-Control', `public, max-age=${infoCacheSeconds}`);
      const count = await getCurrentCount();
      return ok(res, { count });
    } catch (error) {
      console.error('Error in /info:', error?.message || 'Unknown error');
      return fail(res, '哎呀，数据偷懒跑掉了');
    }
  });

  // 点赞限流
  const likeLimiter = createIpRateLimiter({
    windowMs: likeRateLimitWindowMs,
    max: likeRateLimitMax,
    keyFn: (req) => getClientIp(req),
  });

  app.get('/like', likeLimiter, async (req, res) => {
    const ip = getClientIp(req);
    try {
      res.setHeader('Cache-Control', 'no-store');
      const result = await likeOncePerDay(ip);
      if (!result.ok) return fail(res, '今天的爱意已经收到啦~');
      return ok(res, { count: result.count });
    } catch (error) {
      console.error('Error in /like:', error?.message || 'Unknown error');
      return fail(res, '你的爱意传递失败~');
    }
  });

  return app;
}

module.exports = { createApp };

