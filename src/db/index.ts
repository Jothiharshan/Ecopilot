import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

console.log("========== DATABASE DEBUG ==========");
console.log("SQL_HOST:", process.env.SQL_HOST);
console.log("SQL_USER:", process.env.SQL_USER);
console.log("SQL_DB_NAME:", process.env.SQL_DB_NAME);
console.log("===================================");

const pool = new Pool({
  host: process.env.SQL_HOST,
  port: 5432,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle(pool, { schema });