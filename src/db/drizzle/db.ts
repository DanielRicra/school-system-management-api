import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { envs } from "../../config";

const pool = new Pool({
  connectionString: envs.DB_URL,
});

export const db = drizzle(pool);
