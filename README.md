# 🚗 KFZ-Tracker

Open-Source Fahrzeugverwaltung für den deutschsprachigen Raum.

Behalte den Überblick über Probleme, Ersatzteile und Gesamtkosten deiner Fahrzeuge.

## Features

- **Fahrzeugverwaltung** – Marke, Modell, Baujahr, Kennzeichen, TÜV/Pickerl-Datum
- **Problemtracking** – Probleme mit Foto erfassen, Status verfolgen (offen → in Bearbeitung → gelöst)
- **Teilelager** – Ersatzteile mit Preis, Teilenummer und Rechnung verwalten
- **Kostenübersicht** – Kaufpreis + Reparaturen + Teile = Gesamtinvestition auf einen Blick

## Tech Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- [SQLite](https://www.sqlite.org) via `better-sqlite3`
- [Tailwind CSS](https://tailwindcss.com)
- Datei-Uploads lokal (kein externer Speicher nötig)

## Lokal starten

```bash
npm install
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

Daten werden in `./data/kfz-tracker.db` gespeichert, Uploads in `./data/uploads/`.

## Mit Docker (Coolify / Self-hosted)

```bash
docker compose up -d
```

Oder manuell:

```bash
docker build -t kfz-tracker .
docker run -p 3000:3000 -v kfz-data:/data kfz-tracker
```

### Umgebungsvariablen

| Variable | Standard | Beschreibung |
|---|---|---|
| `DATA_DIR` | `./data` | Verzeichnis für SQLite-Datenbank |
| `UPLOAD_DIR` | `./data/uploads` | Verzeichnis für hochgeladene Dateien |
| `PORT` | `3000` | HTTP-Port |

## Lizenz

MIT
