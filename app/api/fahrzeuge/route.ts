import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const db = getDb();
  const fahrzeuge = db.prepare(`
    SELECT f.*,
      COALESCE(SUM(p.kosten), 0) AS problem_kosten,
      COALESCE((SELECT SUM(t.preis * t.menge) FROM teile t WHERE t.fahrzeug_id = f.id), 0) AS teil_kosten,
      COUNT(DISTINCT p.id) AS problem_anzahl,
      COUNT(DISTINCT t2.id) AS teil_anzahl
    FROM fahrzeuge f
    LEFT JOIN probleme p ON p.fahrzeug_id = f.id
    LEFT JOIN teile t2 ON t2.fahrzeug_id = f.id
    GROUP BY f.id
    ORDER BY f.aktualisiert_am DESC
  `).all();
  return NextResponse.json(fahrzeuge);
}

export async function POST(request: Request) {
  const db = getDb();
  const body = await request.json();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO fahrzeuge (id, marke, modell, baujahr, kennzeichen, farbe, kaufpreis, kilometerstand, tuev_datum, notizen, erstellt_am, aktualisiert_am)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    body.marke,
    body.modell,
    body.baujahr || null,
    body.kennzeichen || null,
    body.farbe || null,
    body.kaufpreis || 0,
    body.kilometerstand || 0,
    body.tuev_datum || null,
    body.notizen || null,
    now,
    now
  );

  const fahrzeug = db.prepare('SELECT * FROM fahrzeuge WHERE id = ?').get(id);
  return NextResponse.json(fahrzeug, { status: 201 });
}
