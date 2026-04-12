import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: fahrzeug_id } = await params;
  const db = getDb();
  const body = await request.json();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO teile (id, fahrzeug_id, name, teilenummer, hersteller, preis, menge, lieferant, kaufdatum, notizen, rechnung_pfad, erstellt_am, aktualisiert_am)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    fahrzeug_id,
    body.name,
    body.teilenummer || null,
    body.hersteller || null,
    body.preis || 0,
    body.menge || 1,
    body.lieferant || null,
    body.kaufdatum || null,
    body.notizen || null,
    body.rechnung_pfad || null,
    now,
    now
  );

  return NextResponse.json(db.prepare('SELECT * FROM teile WHERE id = ?').get(id), { status: 201 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: fahrzeug_id } = await params;
  const url = new URL(request.url);
  const teilId = url.searchParams.get('teilId');
  if (!teilId) return NextResponse.json({ error: 'teilId fehlt' }, { status: 400 });

  const db = getDb();
  const body = await request.json();
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE teile SET
      name = ?, teilenummer = ?, hersteller = ?, preis = ?, menge = ?,
      lieferant = ?, kaufdatum = ?, notizen = ?, rechnung_pfad = ?, aktualisiert_am = ?
    WHERE id = ? AND fahrzeug_id = ?
  `).run(
    body.name,
    body.teilenummer || null,
    body.hersteller || null,
    body.preis || 0,
    body.menge || 1,
    body.lieferant || null,
    body.kaufdatum || null,
    body.notizen || null,
    body.rechnung_pfad || null,
    now,
    teilId,
    fahrzeug_id
  );

  return NextResponse.json(db.prepare('SELECT * FROM teile WHERE id = ?').get(teilId));
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: fahrzeug_id } = await params;
  const url = new URL(request.url);
  const teilId = url.searchParams.get('teilId');
  if (!teilId) return NextResponse.json({ error: 'teilId fehlt' }, { status: 400 });

  const db = getDb();
  db.prepare('DELETE FROM teile WHERE id = ? AND fahrzeug_id = ?').run(teilId, fahrzeug_id);
  return NextResponse.json({ ok: true });
}
