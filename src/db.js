const { sql } = require('@vercel/postgres');

let schemaInitPromise = null;

async function ensureSchema() {
  if (schemaInitPromise) return schemaInitPromise;

  schemaInitPromise = (async () => {
    // 总计数表
    await sql`
      CREATE TABLE IF NOT EXISTS like_count (
        id INT PRIMARY KEY DEFAULT 1,
        count BIGINT NOT NULL DEFAULT 0
      );
    `;
    await sql`
      INSERT INTO like_count (id, count)
      VALUES (1, 0)
      ON CONFLICT (id) DO NOTHING;
    `;

    // 去重表：同一 IP 每天一次（PRIMARY KEY (ip, day)）
    await sql`
      CREATE TABLE IF NOT EXISTS like_user (
        ip TEXT NOT NULL,
        day DATE NOT NULL DEFAULT CURRENT_DATE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (ip, day)
      );
    `;
  })();

  return schemaInitPromise;
}

async function getCurrentCount() {
  await ensureSchema();
  const { rows } = await sql`SELECT count FROM like_count WHERE id = 1;`;
  return Number(rows?.[0]?.count ?? 0);
}

async function likeOncePerDay(ip) {
  await ensureSchema();

  const client = await sql.connect();
  try {
    await client.sql`BEGIN;`;

    const exists = await client.sql`
      SELECT 1
      FROM like_user
      WHERE ip = ${ip} AND day = CURRENT_DATE
      LIMIT 1;
    `;

    if (exists.rows.length > 0) {
      await client.sql`ROLLBACK;`;
      return { ok: false, reason: 'already_liked_today' };
    }

    await client.sql`
      INSERT INTO like_user (ip, day)
      VALUES (${ip}, CURRENT_DATE)
      ON CONFLICT (ip, day) DO NOTHING;
    `;

    const updated = await client.sql`
      UPDATE like_count
      SET count = count + 1
      WHERE id = 1
      RETURNING count;
    `;

    await client.sql`COMMIT;`;
    const count = Number(updated.rows?.[0]?.count ?? 0);
    return { ok: true, count };
  } catch (err) {
    try {
      await client.sql`ROLLBACK;`;
    } catch (_) {
    }
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  ensureSchema,
  getCurrentCount,
  likeOncePerDay,
};

