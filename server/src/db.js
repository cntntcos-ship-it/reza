import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgres://lunora:lunora_dev_password@localhost:5432/lunora',
  max: 10,
});

export const query = (text, params) => pool.query(text, params);
