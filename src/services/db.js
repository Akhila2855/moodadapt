import { openDB } from 'idb';

const DB_NAME = 'mood_adaptive_app';
const DB_VERSION = 1;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('mood_history')) {
        db.createObjectStore('mood_history', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('q_table')) {
        db.createObjectStore('q_table', { keyPath: ['state', 'action'] });
      }
      if (!db.objectStoreNames.contains('preferences')) {
        db.createObjectStore('preferences');
      }
    },
  });
}

export async function saveMoodEntry(entry) {
  const db = await initDB();
  return db.put('mood_history', entry);
}

export async function getMoodHistory() {
  const db = await initDB();
  return db.getAll('mood_history');
}

export async function getQValue(state, action) {
  const db = await initDB();
  const entry = await db.get('q_table', [state, action]);
  return entry ? entry.value : 0;
}

export async function updateQValue(state, action, value) {
  const db = await initDB();
  return db.put('q_table', { state, action, value });
}

export async function savePreference(key, value) {
  const db = await initDB();
  return db.put('preferences', value, key);
}

export async function getPreference(key) {
  const db = await initDB();
  return db.get('preferences', key);
}
