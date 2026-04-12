import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'kfz-tracker.db');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS fahrzeuge (
      id TEXT PRIMARY KEY,
      marke TEXT NOT NULL,
      modell TEXT NOT NULL,
      baujahr INTEGER,
      kennzeichen TEXT,
      farbe TEXT,
      kaufpreis REAL DEFAULT 0,
      kilometerstand INTEGER DEFAULT 0,
      tuev_datum TEXT,
      notizen TEXT,
      erstellt_am TEXT NOT NULL DEFAULT (datetime('now')),
      aktualisiert_am TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS probleme (
      id TEXT PRIMARY KEY,
      fahrzeug_id TEXT NOT NULL REFERENCES fahrzeuge(id) ON DELETE CASCADE,
      titel TEXT NOT NULL,
      beschreibung TEXT,
      datum TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'offen' CHECK(status IN ('offen', 'in_bearbeitung', 'geloest')),
      kosten REAL DEFAULT 0,
      foto_pfad TEXT,
      erstellt_am TEXT NOT NULL DEFAULT (datetime('now')),
      aktualisiert_am TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS teile (
      id TEXT PRIMARY KEY,
      fahrzeug_id TEXT NOT NULL REFERENCES fahrzeuge(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      teilenummer TEXT,
      hersteller TEXT,
      preis REAL DEFAULT 0,
      menge INTEGER DEFAULT 1,
      lieferant TEXT,
      kaufdatum TEXT,
      notizen TEXT,
      rechnung_pfad TEXT,
      erstellt_am TEXT NOT NULL DEFAULT (datetime('now')),
      aktualisiert_am TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_probleme_fahrzeug ON probleme(fahrzeug_id);
    CREATE INDEX IF NOT EXISTS idx_teile_fahrzeug ON teile(fahrzeug_id);
  `);
}

export type Fahrzeug = {
  id: string;
  marke: string;
  modell: string;
  baujahr: number | null;
  kennzeichen: string | null;
  farbe: string | null;
  kaufpreis: number;
  kilometerstand: number;
  tuev_datum: string | null;
  notizen: string | null;
  erstellt_am: string;
  aktualisiert_am: string;
};

export type Problem = {
  id: string;
  fahrzeug_id: string;
  titel: string;
  beschreibung: string | null;
  datum: string;
  status: 'offen' | 'in_bearbeitung' | 'geloest';
  kosten: number;
  foto_pfad: string | null;
  erstellt_am: string;
  aktualisiert_am: string;
};

export type Teil = {
  id: string;
  fahrzeug_id: string;
  name: string;
  teilenummer: string | null;
  hersteller: string | null;
  preis: number;
  menge: number;
  lieferant: string | null;
  kaufdatum: string | null;
  notizen: string | null;
  rechnung_pfad: string | null;
  erstellt_am: string;
  aktualisiert_am: string;
};
