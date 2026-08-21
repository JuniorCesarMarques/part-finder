import * as FileSystem from 'expo-file-system/legacy';

import {
  getImagesByPartId,
} from '@/services/database';
import type { Part, PartImage } from '@/types';
import { createPart, insertPartImage } from './partRepository';
import { generateId } from './generated_id';
import { SQLiteRunResult } from 'expo-sqlite';

const DATASET_DIR = `${FileSystem.documentDirectory}dataset/`;
export const MAX_CAPTURE_COUNT = 10;
export const CAPTURE_INTERVAL_MS = 300;


export async function ensurePartDirectory(partId: string): Promise<string> {
  const partDir = `${DATASET_DIR}${partId}/`;
  const info = await FileSystem.getInfoAsync(partDir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(partDir, { intermediates: true });
  }
  return partDir;
}

export async function createPartWithId(data: Part): Promise<SQLiteRunResult> {
  const id = generateId();
  return createPart(id, data);
}


export async function saveCapturedImage(
  partId: string,
  tempUri: string
): Promise<PartImage> {
  const partDir = await ensurePartDirectory(partId);
  const imageId = generateId();
  const destinationUri = `${partDir}${imageId}.jpg`;

  await FileSystem.copyAsync({
    from: tempUri,
    to: destinationUri,
  });

  const createdAt = new Date().toISOString();
  const record = await insertPartImage(imageId, partId, destinationUri, createdAt);

  return record;
}


export async function getPartImages(partId: string): Promise<PartImage[]> {
  return getImagesByPartId(partId);
}

export function getQueryStoragePath(): string {
  return `${FileSystem.cacheDirectory}queries/`;
}

export async function saveQueryImage(tempUri: string): Promise<string> {
  const queryDir = getQueryStoragePath();
  const info = await FileSystem.getInfoAsync(queryDir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(queryDir, { intermediates: true });
  }

  const destinationUri = `${queryDir}${generateId()}.jpg`;
  await FileSystem.copyAsync({
    from: tempUri,
    to: destinationUri,
  });
  return destinationUri;
}
