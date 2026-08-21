import { Settings } from "@/types/settings";
import { withDb } from "./database/withDb";

export async function getSettings() {
  return withDb(async (db) => {

    const res = await db.getFirstAsync<Settings>(
      "SELECT min_similarity AS minSimilarity, min_photos AS minPhotos FROM settings",
    );

    if (!res) {
    throw new Error("Tabela settings não foi inicializada.");
  }

    return res;
  });
}

export const saveSettings = async (value: Settings) => {

  const { minSimilarity, minPhotos } = value;

  return await withDb(async (db) => {
    return await db.runAsync(
      "UPDATE settings SET min_similarity = ?, min_photos = ?;",
      [minSimilarity, minPhotos],
    );
  });
};
