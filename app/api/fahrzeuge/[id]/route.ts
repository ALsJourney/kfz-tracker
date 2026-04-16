import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const fahrzeug = db.prepare('SELECT * FROM fahrzeuge WHERE id = ?').get(id);
  if (!fahrzeug) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });

  const probleme = db.prepare('SELECT * FROM probleme WHERE fahrzeug_id = ? ORDER BY datum DESC').all(id);
  const teile = db.prepare('SELECT * FROM teile WHERE fahrzeug_id = ? ORDER BY kaufdatum DESC').all(id);

  return NextResponse.json({ ...fahrzeug as object, probleme, teile });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const body = await request.json();
  const now = new Date().toISOString();

  const existing = db.prepare('SELECT * FROM fahrzeuge WHERE id = ?').get(id);
  if (!existing) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });

  db.prepare(`
    UPDATE fahrzeuge SET
      marke = ?, modell = ?, baujahr = ?, kennzeichen = ?, farbe = ?,
      kaufpreis = ?, kilometerstand = ?, tuev_datum = ?, notizen = ?,
      fin = ?, antriebsart = ?, versicherung_name = ?, versicherung_nummer = ?,
      versicherung_aktiv = ?, letzter_service = ?, naechster_service = ?,
      aktualisiert_am = ?
    WHERE id = ?
  `).run(
    body.marke,
    body.modell,
    body.baujahr || null,
    body.kennzeichen || null,
    body.farbe || null,
    body.kaufpreis || 0,
    body.kilometerstand || 0,
    body.tuev_datum || null,
    body.notizen || null,
    body.fin || null,
    body.antriebsart || null,
    body.versicherung_name || null,
    body.versicherung_nummer || null,
    body.versicherung_aktiv ?? 1,
    body.letzter_service || null,
    body.naechster_service || null,
    now,
    id
  );

  return NextResponse.json(db.prepare('SELECT * FROM fahrzeuge WHERE id = ?').get(id));
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  db.prepare('DELETE FROM fahrzeuge WHERE id = ?').run(id);
  return NextResponse.json({ ok: true });
}
