import type { Part, PartImage, PartWithCount } from "@/types";

import { SQLiteRunResult } from "expo-sqlite";
import { withDb } from "./database/withDb";

export async function createPart(
  id: string,
  data: Part,
): Promise<SQLiteRunResult> {
  const { partNumber, description, family, supplier, risk } = data;

  return await withDb(async (db) => {
    return await db.runAsync(
      "INSERT INTO parts (id, partNumber, description, supplier, family, risk) VALUES (?, ?, ?, ?, ?, ?)",
      id,
      partNumber,
      description,
      family,
      supplier,
      risk,
    );
  });
}

export async function updatePart(id: string, data: Part) {
  const res = await withDb(async (db) => {
    return db.runAsync(
      `UPDATE parts
          SET partNumber = ?,
            description = ?,
            supplier = ?,
            risk = ?,
            family = ?
          WHERE id = ?
      `,
      data.partNumber,
      data.description,
      data.supplier,
      data.risk,
      data.family,
      id,
    );
  });

  return res;
}

export async function insertPartImage(
  id: string,
  partId: string,
  uri: string,
  createdAt: string,
): Promise<PartImage> {
  await withDb(async (db) => {
    return await db.runAsync(
      "INSERT INTO images (id, part_id, uri, created_at) VALUES (?, ?, ?, ?)",
      id,
      partId,
      uri,
      createdAt,
    );
  });

  return { id, part_id: partId, uri, created_at: createdAt };
}

export async function saveEmbedding(imageId: string, embedding: number[]) {
  await withDb((db) => {
    return db.runAsync(
      `UPDATE images SET embedding = ? WHERE id = ?`,
      JSON.stringify(embedding),
      imageId,
    );
  });
}

export async function getPartsSummary(): Promise<PartWithCount[]> {
  const res = await withDb(async (db) => {
    return db.getAllAsync<PartWithCount>(
      `SELECT A.*, COUNT(B.part_id) AS images
        FROM parts AS A 
      LEFT JOIN images AS B 
        ON A.id = B.part_id
      GROUP BY A.id
        ORDER BY A.partNumber;`,
    );
  });

  return res;
}

export default async function deletePartsById(ids: string[]) {
  const placeholders = ids.map(() => "?").join(",");
  return withDb(async (db) => {
    return db.runAsync(
      `DELETE FROM parts WHERE id IN (${placeholders})`,
      ...ids,
    );
  });
}

export async function countImagesByPartId(partId: string): Promise<number> {
  const res = await withDb(async (db) => {
    const response = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM images WHERE part_id = ?",
      partId,
    );

    return response;
  });

  return res ? res.count : 0;
}

export async function getImagesByPartId(part_id: string) {
  const res = await withDb(async (db): Promise<PartImage[]> => {
    return await db.getAllAsync(
      `SELECT * FROM images WHERE part_id = ?`,
      part_id,
    );
  });

  return res;
}

export async function getPartById(id: string) {
  const res = await withDb(async (db) => {
    return db.getFirstAsync<Part>(`SELECT * FROM parts WHERE id = "${id}"`);
  });

  return res;
}

export async function getPartsWithEmbeddings() {
  return await withDb(async (db) => {
    return db.getAllAsync(`
        SELECT A.partNumber, A.description, A.supplier, A.family, A.risk, B.part_id, B.uri, B.embedding 
          FROM parts AS A
        INNER JOIN images AS B
          ON A.id = B.part_id
        WHERE B.embedding IS NOT NULL;
      `);
  });
}


