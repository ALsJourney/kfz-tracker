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
    INSERT INTO probleme (id, fahrzeug_id, titel, beschreibung, datum, status, kosten, foto_pfad, erstellt_am, aktualisiert_am)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    fahrzeug_id,
    body.titel,
    body.beschreibung || null,
    body.datum || now.split('T')[0],
    body.status || 'offen',
    body.kosten || 0,
    body.foto_pfad || null,
    now,
    now
  );

  return NextResponse.json(db.prepare('SELECT * FROM probleme WHERE id = ?').get(id), { status: 201 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: fahrzeug_id } = await params;
  const url = new URL(request.url);
  const problemId = url.searchParams.get('problemId');
  if (!problemId) return NextResponse.json({ error: 'problemId fehlt' }, { status: 400 });

  const db = getDb();
  const body = await request.json();
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE probleme SET
      titel = ?, beschreibung = ?, datum = ?, status = ?, kosten = ?, foto_pfad = ?, aktualisiert_am = ?
    WHERE id = ? AND fahrzeug_id = ?
  `).run(
    body.titel,
    body.beschreibung || null,
    body.datum,
    body.status,
    body.kosten || 0,
    body.foto_pfad || null,
    now,
    problemId,
    fahrzeug_id
  );

  return NextResponse.json(db.prepare('SELECT * FROM probleme WHERE id = ?').get(problemId));
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: fahrzeug_id } = await params;
  const url = new URL(request.url);
  const problemId = url.searchParams.get('problemId');
  if (!problemId) return NextResponse.json({ error: 'problemId fehlt' }, { status: 400 });

  const db = getDb();
  db.prepare('DELETE FROM probleme WHERE id = ? AND fahrzeug_id = ?').run(problemId, fahrzeug_id);
  return NextResponse.json({ ok: true });
}
