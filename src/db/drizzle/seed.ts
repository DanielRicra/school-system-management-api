import { Pool } from "pg";
import { envs } from "../../config";
import roomsMockData from "../mock-data/rooms-mock.json";
import { rooms } from "./schema";
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new Pool({
  connectionString: envs.DB_URL,
});

const db = drizzle(pool);

async function seed() {
  try {
    console.log("Seeding rooms... 💞");
    await db.insert(rooms).values(
      roomsMockData.map((room) => ({
        ...room,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
      }))
    );
    console.log("Seeded rooms successfully ✔️");
    pool.end();
  } catch (error) {
    console.log("❌ Seeding rooms failed -> ", error);
    process.exit(1);
  }
}

seed();
