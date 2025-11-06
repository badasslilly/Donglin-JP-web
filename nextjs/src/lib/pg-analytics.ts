import { Pool } from 'pg';

export const analyticsPool = new Pool({
  connectionString: process.env.ANALYTICS_DATABASE_URL,
  max: 5, // 小并发足够
  idleTimeoutMillis: 30_000,
});

