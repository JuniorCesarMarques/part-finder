import * as SQLite from 'expo-sqlite';
import { initDatabase } from "./index";

export async function withDb<T>(fn: (db: SQLite.SQLiteDatabase) => Promise<T>) {
    const db = await initDatabase();
    return fn(db);
}