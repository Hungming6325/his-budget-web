import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const env = await readFile(".env.local", "utf8");
const match = env.match(/^DATABASE_URL=(.+)$/m);

if (!match) {
  throw new Error("DATABASE_URL missing in .env.local");
}

const sql = neon(match[1].trim());
const views = await readFile("database/views.sql", "utf8");
const statements = views
  .split(/;\s*(?:\r?\n|$)/)
  .map((statement) => statement.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
}

const createdViews = await sql.query(`
  SELECT table_name
  FROM information_schema.views
  WHERE table_schema = 'public'
    AND table_name IN ('計畫主檔', '經費明細', '計畫經費明細')
  ORDER BY table_name
`);

console.log(JSON.stringify(createdViews, null, 2));
