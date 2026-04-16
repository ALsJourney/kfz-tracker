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

    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY
    );

    CREATE INDEX IF NOT EXISTS idx_probleme_fahrzeug ON probleme(fahrzeug_id);
    CREATE INDEX IF NOT EXISTS idx_teile_fahrzeug ON teile(fahrzeug_id);
  `);

  const migrated = db.prepare("SELECT 1 FROM _migrations WHERE name = ?").get("tuev_datum_yyyy_mm");
  if (!migrated) {
    db.exec(`
      UPDATE fahrzeuge SET tuev_datum = SUBSTR(tuev_datum, 1, 7)
      WHERE tuev_datum IS NOT NULL AND LENGTH(tuev_datum) = 10;
    `);
    db.prepare("INSERT INTO _migrations (name) VALUES (?)").run("tuev_datum_yyyy_mm");
  }

  const newFields = db.prepare("SELECT 1 FROM _migrations WHERE name = ?").get("add_vehicle_extended_fields");
  if (!newFields) {
    const cols = db.prepare("PRAGMA table_info(fahrzeuge)").all() as { name: string }[];
    const existing = new Set(cols.map(c => c.name));
    if (!existing.has('fin')) db.exec(`ALTER TABLE fahrzeuge ADD COLUMN fin TEXT`);
    if (!existing.has('antriebsart')) db.exec(`ALTER TABLE fahrzeuge ADD COLUMN antriebsart TEXT`);
    if (!existing.has('versicherung_name')) db.exec(`ALTER TABLE fahrzeuge ADD COLUMN versicherung_name TEXT`);
    if (!existing.has('versicherung_nummer')) db.exec(`ALTER TABLE fahrzeuge ADD COLUMN versicherung_nummer TEXT`);
    if (!existing.has('versicherung_aktiv')) db.exec(`ALTER TABLE fahrzeuge ADD COLUMN versicherung_aktiv INTEGER DEFAULT 1`);
    if (!existing.has('letzter_service')) db.exec(`ALTER TABLE fahrzeuge ADD COLUMN letzter_service TEXT`);
    if (!existing.has('naechster_service')) db.exec(`ALTER TABLE fahrzeuge ADD COLUMN naechster_service TEXT`);
    db.prepare("INSERT INTO _migrations (name) VALUES (?)").run("add_vehicle_extended_fields");
  }
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
  fin: string | null;
  antriebsart: string | null;
  versicherung_name: string | null;
  versicherung_nummer: string | null;
  versicherung_aktiv: number;
  letzter_service: string | null;
  naechster_service: string | null;
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
