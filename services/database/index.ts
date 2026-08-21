import * as SQLite from 'expo-sqlite';

import type { PartImage } from '@/types';

const DB_NAME = 'part_finder.db';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY NOT NULL,
  min_similarity INTEGER NOT NULL DEFAULT 30,
  min_photos INTEGER NOT NULL DEFAULT 200
);

INSERT OR IGNORE INTO settings (id, min_similarity) VALUES (1, 30);

CREATE TABLE IF NOT EXISTS parts (
  id TEXT PRIMARY KEY NOT NULL,
  partNumber TEXT NOT NULL,
  description TEXT NOT NULL,
  supplier TEXT NOT NULL,
  family TEXT NOT NULL,
  risk TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'CAPTURANDO'
);

CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY NOT NULL,
  part_id TEXT NOT NULL,
  uri TEXT NOT NULL,
  embedding,
  created_at TEXT NOT NULL,
  FOREIGN KEY (part_id) REFERENCES parts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_images_part_id ON images(part_id);
`;

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function initDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await db.execAsync(SCHEMA);
  dbInstance = db;
  return db;
}


export async function getImagesByPartId(partId: string): Promise<PartImage[]> {
  const db = await initDatabase();
  return db.getAllAsync<PartImage>(
    'SELECT id, part_id, uri, created_at FROM images WHERE part_id = ? ORDER BY created_at ASC',
    partId
  );
}

export async function getAllImages(): Promise<PartImage[]> {
  const db = await initDatabase();
  return db.getAllAsync<PartImage>(
    'SELECT id, part_id, uri, created_at FROM images ORDER BY created_at ASC'
  );
}


