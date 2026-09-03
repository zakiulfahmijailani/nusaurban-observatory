import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const DATABASE_URL = process.env.DATABASE_URL;

function createDb() {
  if (!DATABASE_URL) {
    console.warn('⚠️ DATABASE_URL not set. Using local fixture data.');
    return null;
  }
  const sql = neon(DATABASE_URL);
  return drizzle(sql, { schema });
}

export const db = createDb();
export { schema };
export type Database = NonNullable<ReturnType<typeof createDb>>;
