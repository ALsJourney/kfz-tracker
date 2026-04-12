import Link from "next/link";
import { getDb } from "@/lib/db";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge, tuevBadgeFromDatum } from "@/components/StatusBadge";
import { formatEuro } from "@/lib/formatEuro";

type FahrzeugRow = {
  id: string;
  marke: string;
  modell: string;
  baujahr: number | null;
  kennzeichen: string | null;
  kilometerstand: number;
  kaufpreis: number;
  problem_kosten: number;
  teil_kosten: number;
  problem_anzahl: number;
  teil_anzahl: number;
  tuev_datum: string | null;
};

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
    (s, f) => s + f.kaufpreis + f.problem_kosten + f.teil_kosten,
    0,
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meine Fahrzeuge</h1>
          {fahrzeuge.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Gesamtinvestition:{" "}
              <span className="font-semibold text-gray-700">{formatEuro(gesamtInvestition)}</span>
            </p>
          )}
        </div>
      </div>

      {fahrzeuge.length > 0 && (
        <details className="mb-4 group">
          <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900 list-none flex items-center gap-2 [&::-webkit-details-marker]:hidden">
            <span className="underline-offset-2 group-open:underline">Legende TÜV-Farben</span>
          </summary>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-600 items-center pl-0 sm:pl-0">
            <span className="inline-flex items-center gap-2">
              <StatusBadge variant="tuev_abgelaufen" />
              Abgelaufen oder unter 30 Tagen
            </span>
            <span className="inline-flex items-center gap-2">
              <StatusBadge variant="tuev_bald" label="z. B. 45 Tage" />
              30–59 Tage bis TÜV
            </span>
            <span className="inline-flex items-center gap-2">
              <StatusBadge variant="tuev_ok" label="Datum" />
              60+ Tage (OK)
            </span>
          </div>
        </details>
      )}

      {fahrzeuge.length === 0 ? (
        <EmptyState
          variant="hero"
          icon="🚗"
          title="Noch keine Fahrzeuge"
          description="Füge dein erstes Fahrzeug hinzu, um loszulegen."
          action={{ label: "Fahrzeug hinzufügen", href: "/fahrzeuge/neu" }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {fahrzeuge.map((f) => {
            const total = f.kaufpreis + f.problem_kosten + f.teil_kosten;
            const tuev = tuevBadgeFromDatum(f.tuev_datum);
            return (
              <Link
                key={f.id}
                href={`/fahrzeuge/${f.id}`}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <h2 className="font-bold text-lg text-gray-900 group-hover:text-blue-700">
                      {f.marke} {f.modell}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {f.baujahr ?? "—"}
                      {f.kennzeichen ? ` · ${f.kennzeichen}` : ""}
                      {f.kilometerstand > 0 && (
                        <> · 🛣️ {f.kilometerstand.toLocaleString("de-DE")} km</>
                      )}
                    </p>
                  </div>
                  {tuev && (
                    <StatusBadge variant={tuev.variant} label={`TÜV: ${tuev.label}`} className="shrink-0" />
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mt-3 pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500">Kaufpreis</div>
                    <div className="font-semibold text-sm">{formatEuro(f.kaufpreis)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Reparaturen/Teile</div>
                    <div className="font-semibold text-sm">
                      {formatEuro(f.problem_kosten + f.teil_kosten)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Gesamt</div>
                    <div className="font-bold text-sm text-blue-700">{formatEuro(total)}</div>
                  </div>
                </div>
                <div className="flex gap-3 mt-3 text-xs text-gray-500">
                  <span>
                    {f.problem_anzahl} Problem{f.problem_anzahl !== 1 ? "e" : ""}
                  </span>
                  <span>·</span>
                  <span>
                    {f.teil_anzahl} Teil{f.teil_anzahl !== 1 ? "e" : ""}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
