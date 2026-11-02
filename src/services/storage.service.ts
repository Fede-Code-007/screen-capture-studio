import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Recording } from '@/types/recorder.types'

interface RecorderDB extends DBSchema {
  recordings: {
    key: string
    value: Recording
    indexes: { 'by-date': number }
  }
}

let dbPromise: Promise<IDBPDatabase<RecorderDB>> | null = null

// La base se abre una sola vez y se reutiliza
function getDb() {
  dbPromise ??= openDB<RecorderDB>('screen-recorder', 1, {
    upgrade(db) {
      const store = db.createObjectStore('recordings', { keyPath: 'id' })
      store.createIndex('by-date', 'createdAt')
    },
  })
  return dbPromise
}

export async function saveRecording(recording: Recording): Promise<void> {
  const db = await getDb()
  await db.put('recordings', recording)
}

export async function getAllRecordings(): Promise<Recording[]> {
  const db = await getDb()
  const all = await db.getAllFromIndex('recordings', 'by-date')
  return all.reverse() // más recientes primero
}

export async function deleteRecording(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('recordings', id)
}