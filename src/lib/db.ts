import { openDB, type IDBPDatabase } from "idb";
import type { CalculationRecord } from "@/types";

const DB_NAME = "hpp_calculator_db";
const STORE_NAME = "calculations";
const DB_VERSION = 1;

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    },
  });
}

export async function saveCalculation(record: Omit<CalculationRecord, "id">): Promise<number> {
  const db = await getDB();
  const id = await db.add(STORE_NAME, { ...record, createdAt: Date.now() });
  return id as number;
}

export async function getAllCalculations(): Promise<CalculationRecord[]> {
  const db = await getDB();
  const all = await db.getAll(STORE_NAME);
  return (all as CalculationRecord[]).sort((a, b) => b.createdAt - a.createdAt);
}

export async function getCalculation(id: number): Promise<CalculationRecord | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, id) as Promise<CalculationRecord | undefined>;
}

export async function deleteCalculation(id: number): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}
