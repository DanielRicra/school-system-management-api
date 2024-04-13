import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { envs } from "../../config";

const sql = new Pool({
  connectionString: envs.DB_URL,
  max: 1,
});
const db = drizzle(sql);

const main = async () => {
  try {
    console.log(`Before migrating ->${envs.DB_URL}`);
    await migrate(db, { migrationsFolder: "./src/db/drizzle/migrations" });
    console.log("💚 Migration successful ✔");
    sql.end();
  } catch (error) {
    console.log("❌Migration failed -> ", error);
    process.exit(1);
  }
};
main();
