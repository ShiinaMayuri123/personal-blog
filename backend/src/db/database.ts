import initSqlJs, { Database } from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { CREATE_TABLES_SQL } from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = join(__dirname, '../../data');
const DB_PATH = join(DATA_DIR, 'blog.db');

let db: Database | null = null;
let isNewDatabase = false;

export async function getDatabase(): Promise<Database> {
  if (!db) {
    mkdirSync(DATA_DIR, { recursive: true });

    const SQL = await initSqlJs();

    if (existsSync(DB_PATH)) {
      const buffer = readFileSync(DB_PATH);
      db = new SQL.Database(buffer);
      isNewDatabase = false;
    } else {
      db = new SQL.Database();
      isNewDatabase = true;
    }

    db.run(CREATE_TABLES_SQL);
    if (isNewDatabase) {
      saveDatabase();
    }
  }
  return db;
}

export function saveDatabase(): void {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    writeFileSync(DB_PATH, buffer);
  }
}

export function closeDatabase(): void {
  if (db) {
    saveDatabase();
    db.close();
    db = null;
  }
}
