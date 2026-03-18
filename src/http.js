function ok(res, data) {
  return res.json({ code: '200', msg: 'success', data });
}

function fail(res, msg) {
  return res.json({ code: '201', msg });
}

module.exports = { ok, fail };

