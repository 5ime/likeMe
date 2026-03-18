function sanitizeIp(ip) {
  if (!ip || typeof ip !== 'string') return 'unknown';
  // IPv6 最大长度 45
  const cleaned = ip.trim().slice(0, 45);
  if (!/^[a-fA-F0-9.:\-]+$/.test(cleaned)) return 'unknown';
  return cleaned;
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ip = String(forwarded).split(',')[0].trim();
    return sanitizeIp(ip);
  }
  const ip =
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    'unknown';
  return sanitizeIp(ip);
}

module.exports = { getClientIp, sanitizeIp };

