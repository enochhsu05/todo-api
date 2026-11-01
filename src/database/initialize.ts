import fs from "node:fs";
import path from "node:path";
import db from "../config/database";

const schemaPath = path.join(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf-8");

export function initializeDatabase(): void {
  db.exec(schema);
  console.log("Database initialized successfully");
}