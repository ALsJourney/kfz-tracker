import Link from "next/link";
import { getDb } from "@/lib/db";

type FahrzeugRow = {
  id: string;
  marke: string;
  modell: string;
  baujahr: number | null;
  kennzeichen: string | null;
  kaufpreis: number;
  problem_kosten: number;
  teil_kosten: number;
  problem_anzahl: number;
  teil_anzahl: number;
  tuev_datum: string | null;
};

function formatEuro(n: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);
}

function tuevStatus(datum: string | null) {
  if (!datum) return null;
  const d = new Date(datum);
  const now = new Date();
  const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return { label: "Abgelaufen", cls: "bg-red-100 text-red-700" };
  if (diff < 60) return { label: `${Math.ceil(diff)} Tage`, cls: "bg-yellow-100 text-yellow-700" };
  return { label: d.toLocaleDateString("de-DE"), cls: "bg-green-100 text-green-700" };
}

export default function HomePage() {
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
  `).all() as FahrzeugRow[];

  const gesamtInvestition = fahrzeuge.reduce(
    (s, f) => s + f.kaufpreis + f.problem_kosten + f.teil_kosten, 0
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meine Fahrzeuge</h1>
          {fahrzeuge.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Gesamtinvestition: <span className="font-semibold text-gray-700">{formatEuro(gesamtInvestition)}</span>
            </p>
          )}
        </div>
      </div>

      {fahrzeuge.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">🚗</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Noch keine Fahrzeuge</h2>
          <p className="text-gray-500 mb-6">Füge dein erstes Fahrzeug hinzu, um loszulegen.</p>
          <Link
            href="/fahrzeuge/neu"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
          >
            Fahrzeug hinzufügen
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {fahrzeuge.map((f) => {
            const total = f.kaufpreis + f.problem_kosten + f.teil_kosten;
            const tuev = tuevStatus(f.tuev_datum);
            return (
              <Link
                key={f.id}
                href={`/fahrzeuge/${f.id}`}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="font-bold text-lg text-gray-900 group-hover:text-blue-700">
                      {f.marke} {f.modell}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {f.baujahr ?? "—"}{f.kennzeichen ? ` · ${f.kennzeichen}` : ""}
                    </p>
                  </div>
                  {tuev && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${tuev.cls}`}>
                      TÜV: {tuev.label}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mt-3 pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500">Kaufpreis</div>
                    <div className="font-semibold text-sm">{formatEuro(f.kaufpreis)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Reparaturen/Teile</div>
                    <div className="font-semibold text-sm">{formatEuro(f.problem_kosten + f.teil_kosten)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Gesamt</div>
                    <div className="font-bold text-sm text-blue-700">{formatEuro(total)}</div>
                  </div>
                </div>
                <div className="flex gap-3 mt-3 text-xs text-gray-500">
                  <span>{f.problem_anzahl} Problem{f.problem_anzahl !== 1 ? "e" : ""}</span>
                  <span>·</span>
                  <span>{f.teil_anzahl} Teil{f.teil_anzahl !== 1 ? "e" : ""}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
