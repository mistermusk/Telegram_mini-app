import { openDB, DBSchema } from 'idb';

interface CryptocashDB extends DBSchema {
  users: {
    key: string;
    value: {
      userid: string;
      country: string;
      coins: number;
    };
    indexes: { 'by-country': string };
  };
}

const dbPromise = openDB<CryptocashDB>('cryptocash-db', 1, {
  upgrade(db) {
    const userStore = db.createObjectStore('users', {
      keyPath: 'userid',
    });
    userStore.createIndex('by-country', 'country');
  },
});

export const addUser = async (user: { userid: string; country: string; coins: number }) => {
  const db = await dbPromise;
  await db.put('users', user);
};

export const updateUserCoins = async (userid: string, coins: number) => {
  const db = await dbPromise;
  const user = await db.get('users', userid);
  if (user) {
    user.coins = coins;
    await db.put('users', user);
  }
};

export const getUser = async (userid: string) => {
  const db = await dbPromise;
  return db.get('users', userid);
};

export const getAllUsers = async () => {
  const db = await dbPromise;
  return db.getAll('users');
};

export const clearDB = async () => {
  const db = await dbPromise;
  const tx = db.transaction('users', 'readwrite');
  await tx.objectStore('users').clear();
  await tx.done;
};
