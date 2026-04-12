import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'data', 'uploads');

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  // Only allow single-segment filenames (no path traversal)
  if (segments.length !== 1) {
    return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
  }

  const filename = segments[0];
  // Block path traversal
  if (filename.includes('..') || filename.includes('/')) {
    return NextResponse.json({ error: 'Ungültig' }, { status: 400 });
  }

  const filepath = path.join(UPLOAD_DIR, filename);
  if (!fs.existsSync(filepath)) {
    return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
  }

  const buffer = fs.readFileSync(filepath);
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const contentTypeMap: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    pdf: 'application/pdf',
  };
  const contentType = contentTypeMap[ext] || 'application/octet-stream';

  return new NextResponse(buffer, {
    headers: { 'Content-Type': contentType },
  });
}
