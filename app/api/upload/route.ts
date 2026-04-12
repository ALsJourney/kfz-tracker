import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'data', 'uploads');

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'Keine Datei' }, { status: 400 });
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Dateityp nicht erlaubt' }, { status: 400 });
  }

  // Max 10MB
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'Datei zu groß (max. 10 MB)' }, { status: 400 });
  }

  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const ext = file.name.split('.').pop() || 'bin';
  const filename = `${uuidv4()}.${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  const bytes = await file.arrayBuffer();
  fs.writeFileSync(filepath, Buffer.from(bytes));

  return NextResponse.json({ pfad: `/uploads/${filename}` }, { status: 201 });
}
