import Link from "next/link";
import { getDb } from "@/lib/db";
import { StatusBadge, tuevBadgeFromDatum } from "@/components/StatusBadge";
import { formatEuro } from "@/lib/formatEuro";
import { Icon } from "@/components/Icon";

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

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h2 className="text-[2.75rem] font-bold text-on-surface font-geist tracking-tight leading-none mb-2">
            Dashboard
          </h2>
          <p className="text-on-surface-variant text-base font-geist">
            Ihre Fahrzeugflotte auf einen Blick.
          </p>
        </div>
        <Link href="/fahrzeuge/neu">
            <button className="bg-primary text-on-primary rounded-xl px-5 py-3 font-semibold text-sm hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-all duration-200 active:scale-95 flex items-center gap-2 shadow-[0_20px_40px_-12px_rgba(26,86,219,0.3)] bg-gradient-to-b from-primary/90 to-primary">
              <Icon name="add" className="text-lg" />
              + Fahrzeug hinzufügen
            </button>
        </Link>
      </div>

      {fahrzeuge.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-surface-container-lowest rounded-xl ghost-border text-center">
            <Icon name="directions_car" className="text-5xl text-outline-variant mb-4" weight={200} />
            <h3 className="text-[1.125rem] font-medium text-on-surface font-geist mb-2">
              Keine Fahrzeuge gefunden
            </h3>
          <p className="text-on-surface-variant text-sm max-w-sm mb-6">
            Fügen Sie Ihr erstes Fahrzeug hinzu, um mit dem Tracking zu beginnen.
          </p>
          <Link href="/fahrzeuge/neu">
            <button className="bg-surface-container text-primary rounded-xl px-5 py-2.5 font-semibold text-sm hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-all duration-200">
              + Fahrzeug hinzufügen
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fahrzeuge.map((f) => {
            const total = f.kaufpreis + f.problem_kosten + f.teil_kosten;
            const tuev = tuevBadgeFromDatum(f.tuev_datum);
            return (
              <Link
                key={f.id}
                href={`/fahrzeuge/${f.id}`}
                className="bg-surface-container-lowest rounded-xl p-6 relative flex flex-col ghost-border cloud-shadow group hover:cloud-shadow-hover transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="label-md text-on-surface-variant block mb-1">
                      {f.kennzeichen || "—"}
                    </span>
                    <h3 className="text-[1.125rem] font-medium text-on-surface font-geist leading-tight">
                      {f.marke} {f.modell}
                    </h3>
                  </div>
                  {tuev && (
                    <StatusBadge
                      variant={tuev.variant}
                      label={`TÜV: ${tuev.label}`}
                      className="shrink-0"
                    />
                  )}
                </div>
                <div className="mt-auto pt-6 flex flex-col gap-4">
                  {f.kilometerstand > 0 && (
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <Icon name="speed" className="text-[1.25rem]" />
                        <span
                          className="text-base font-geist"
                          style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                          {f.kilometerstand.toLocaleString("de-DE")} km
                        </span>
                      </div>
                  )}
                  <div className="bg-surface-container-low rounded-lg p-3 flex justify-between items-center ring-1 ring-outline-variant/5">
                    <span className="label-md text-on-surface-variant">Gesamt investiert</span>
                    <span
                      className="text-sm font-semibold text-on-surface font-geist"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {formatEuro(total)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
