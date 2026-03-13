import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

export const DATA_DIR = path.join(process.cwd(), "data");
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
export const SAMPLES_DIR = path.join(DATA_DIR, "samples");
const DB_PATH = path.join(DATA_DIR, "datasetverse.db");

// Ensure directories exist
for (const dir of [DATA_DIR, UPLOADS_DIR, SAMPLES_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Singleton for dev mode HMR
const globalForDb = globalThis as unknown as {
  __dvDb: Database.Database | undefined;
};

export function getDb(): Database.Database {
  if (!globalForDb.__dvDb) {
    globalForDb.__dvDb = new Database(DB_PATH);
    globalForDb.__dvDb.pragma("journal_mode = WAL");
    globalForDb.__dvDb.pragma("foreign_keys = ON");
    initTables(globalForDb.__dvDb);
  }
  return globalForDb.__dvDb;
}

function initTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS datasets (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'Upload',
      category TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '[]',
      size TEXT NOT NULL DEFAULT '0 B',
      formats TEXT NOT NULL DEFAULT '[]',
      downloads INTEGER DEFAULT 0,
      last_updated TEXT NOT NULL DEFAULT (date('now')),
      license TEXT NOT NULL DEFAULT 'CC BY 4.0',
      rows_count INTEGER,
      columns_count INTEGER,
      trending INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      file_path TEXT,
      user_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS research_papers (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      authors TEXT NOT NULL DEFAULT '[]',
      abstract TEXT NOT NULL,
      dataset_id TEXT NOT NULL,
      published_date TEXT NOT NULL,
      journal TEXT NOT NULL,
      url TEXT,
      FOREIGN KEY (dataset_id) REFERENCES datasets(id)
    );
  `);
}

// ── Helper functions ──

export interface DatasetRow {
  id: string;
  title: string;
  description: string;
  source: string;
  category: string;
  tags: string;
  size: string;
  formats: string;
  downloads: number;
  last_updated: string;
  license: string;
  rows_count: number | null;
  columns_count: number | null;
  trending: number;
  featured: number;
  file_path: string | null;
  user_id: string | null;
  created_at: string;
}

export interface UserRow {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface PaperRow {
  id: string;
  title: string;
  authors: string;
  abstract: string;
  dataset_id: string;
  published_date: string;
  journal: string;
  url: string | null;
}

export function serializeDataset(row: DatasetRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    source: row.source,
    category: row.category,
    tags: JSON.parse(row.tags),
    size: row.size,
    formats: JSON.parse(row.formats),
    downloads: row.downloads,
    lastUpdated: row.last_updated,
    license: row.license,
    rows: row.rows_count,
    columns: row.columns_count,
    trending: !!row.trending,
    featured: !!row.featured,
    filePath: row.file_path,
    userId: row.user_id,
  };
}

export function serializePaper(row: PaperRow) {
  return {
    id: row.id,
    title: row.title,
    authors: JSON.parse(row.authors),
    abstract: row.abstract,
    datasetId: row.dataset_id,
    publishedDate: row.published_date,
    journal: row.journal,
    url: row.url,
  };
}
