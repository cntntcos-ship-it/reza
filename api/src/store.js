import fs from 'node:fs';
import path from 'node:path';
import { buildSeed } from './seed.js';

// Tiny JSON-file data layer. Everything the store owns (catalogue, orders,
// newsletter, contact messages) lives in one document and is written
// atomically, so a crash mid-write never leaves a truncated file behind.
// Swap this module for a real database when the catalogue outgrows a prototype.

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

let db = null;

function freshDb() {
  const { categories, products } = buildSeed();
  return {
    categories,
    products,
    orders: [],
    newsletter: [],
    messages: [],
    seededAt: new Date().toISOString(),
  };
}

function persist() {
  const tmp = `${DB_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_FILE);
}

export function initDb() {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  if (fs.existsSync(DB_FILE)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch {
      db = freshDb();
      persist();
    }
  } else {
    db = freshDb();
    persist();
  }

  // A store file written by an older seed may miss collections.
  if (!Array.isArray(db.categories) || db.categories.length === 0) {
    const seed = freshDb();
    db.categories = seed.categories;
    db.products = seed.products;
  }
  for (const key of ['products', 'orders', 'newsletter', 'messages']) {
    if (!Array.isArray(db[key])) db[key] = [];
  }
  persist();
  return db;
}

export function getDb() {
  return db ?? initDb();
}

export function saveDb() {
  if (!db) throw new Error('Database is not initialised');
  persist();
}

export function dataFile() {
  return DB_FILE;
}
