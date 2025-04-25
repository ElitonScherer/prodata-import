// In utils/db.ts
import { Pool } from 'pg';
import { dbConfig } from './dbConfig';

// Create a pool instead of a client
const pool = new Pool(dbConfig);

export async function executeQuery(query: string, params: any[] = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result;
  } finally {
    client.release();
  }
}