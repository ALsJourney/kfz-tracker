import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/lib/db";
import type { Problem, Teil } from "@/lib/db";
import ProblemSection from "./ProblemSection";
import TeileSection from "./TeileSection";

type FahrzeugDetail = {
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
  probleme: Problem[];
  teile: Teil[];
};

function formatEuro(n: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);
}

export default async function FahrzeugPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();

  const fahrzeug = db.prepare("SELECT * FROM fahrzeuge WHERE id = ?").get(id) as FahrzeugDetail | undefined;
  if (!fahrzeug) notFound();

  const probleme = db.prepare(
    "SELECT * FROM probleme WHERE fahrzeug_id = ? ORDER BY datum DESC"
  ).all(id) as Problem[];

  const teile = db.prepare(
    "SELECT * FROM teile WHERE fahrzeug_id = ? ORDER BY kaufdatum DESC"
  ).all(id) as Teil[];

  const problemKosten = probleme.reduce((s, p) => s + p.kosten, 0);
  const teilKosten = teile.reduce((s, t) => s + t.preis * t.menge, 0);
  const gesamt = fahrzeug.kaufpreis + problemKosten + teilKosten;

  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">← Alle Fahrzeuge</Link>
        <div className="flex items-start justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {fahrzeug.marke} {fahrzeug.modell}
              {fahrzeug.baujahr && <span className="text-gray-500 font-normal text-lg ml-2">({fahrzeug.baujahr})</span>}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {fahrzeug.kennzeichen && <span className="mr-3">📋 {fahrzeug.kennzeichen}</span>}
              {fahrzeug.farbe && <span className="mr-3">🎨 {fahrzeug.farbe}</span>}
              {fahrzeug.kilometerstand > 0 && <span>🛣️ {fahrzeug.kilometerstand.toLocaleString("de-DE")} km</span>}
            </p>
          </div>
          <Link
            href={`/fahrzeuge/${id}/bearbeiten`}
            className="text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            Bearbeiten
          </Link>
        </div>
      </div>

      {/* Kostenübersicht */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">Kaufpreis</div>
          <div className="font-bold text-gray-900">{formatEuro(fahrzeug.kaufpreis)}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">Reparaturen</div>
          <div className="font-bold text-gray-900">{formatEuro(problemKosten)}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">Ersatzteile</div>
          <div className="font-bold text-gray-900">{formatEuro(teilKosten)}</div>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 text-center">
          <div className="text-xs text-blue-600 mb-1">Gesamt investiert</div>
          <div className="font-bold text-blue-700 text-lg">{formatEuro(gesamt)}</div>
        </div>
      </div>

      {fahrzeug.tuev_datum && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">🔧</span>
          <div>
            <div className="text-sm font-medium text-gray-700">TÜV / Pickerl</div>
            <div className="text-sm text-gray-500">
              Fällig am {new Date(fahrzeug.tuev_datum).toLocaleDateString("de-DE")}
            </div>
          </div>
        </div>
      )}

      {fahrzeug.notizen && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="text-sm text-yellow-800">{fahrzeug.notizen}</div>
        </div>
      )}

      <ProblemSection fahrzeugId={id} initialProbleme={probleme} />
      <TeileSection fahrzeugId={id} initialTeile={teile} />
    </div>
  );
}
