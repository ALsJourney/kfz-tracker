import { getDb } from "@/lib/db";
import { formatEuro } from "@/lib/formatEuro";
import { Icon } from "@/components/Icon";

type CostRow = {
  id: string;
  marke: string;
  modell: string;
  kennzeichen: string | null;
  kaufpreis: number;
  problem_kosten: number;
  teil_kosten: number;
  total: number;
  problem_count: number;
  teil_count: number;
};

export default function KostenPage() {
  const db = getDb();
  const fahrzeuge = db.prepare(`
    SELECT f.id, f.marke, f.modell, f.kennzeichen, f.kaufpreis,
      COALESCE(SUM(p.kosten), 0) AS problem_kosten,
      COALESCE((SELECT SUM(t.preis * t.menge) FROM teile t WHERE t.fahrzeug_id = f.id), 0) AS teil_kosten,
      (f.kaufpreis + COALESCE(SUM(p.kosten), 0) + COALESCE((SELECT SUM(t2.preis * t2.menge) FROM teile t2 WHERE t2.fahrzeug_id = f.id), 0)) AS total,
      COUNT(DISTINCT p.id) AS problem_count,
      (SELECT COUNT(*) FROM teile t3 WHERE t3.fahrzeug_id = f.id) AS teil_count
    FROM fahrzeuge f
    LEFT JOIN probleme p ON p.fahrzeug_id = f.id
    GROUP BY f.id
    ORDER BY total DESC
  `).all() as CostRow[];

  const gesamtKosten = fahrzeuge.reduce((s, f) => s + f.total, 0);
  const teuerstesFahrzeug = fahrzeuge.length > 0 ? fahrzeuge[0] : null;
  const averagePerMonth = fahrzeuge.length > 0 ? gesamtKosten / 12 : 0;

  const recentProblems = db.prepare(`
    SELECT p.id, p.titel, p.kosten, p.datum, p.status, f.marke, f.modell, f.kennzeichen
    FROM probleme p
    JOIN fahrzeuge f ON p.fahrzeug_id = f.id
    WHERE p.kosten > 0
    ORDER BY p.datum DESC LIMIT 5
  `).all() as { id: string; titel: string; kosten: number; datum: string; status: string; marke: string; modell: string; kennzeichen: string | null }[];

  const recentTeile = db.prepare(`
    SELECT t.id, t.name, t.preis, t.menge, t.kaufdatum, f.marke, f.modell, f.kennzeichen
    FROM teile t
    JOIN fahrzeuge f ON t.fahrzeug_id = f.id
    ORDER BY t.kaufdatum DESC LIMIT 5
  `).all() as { id: string; name: string; preis: number; menge: number; kaufdatum: string; marke: string; modell: string; kennzeichen: string | null }[];

  const totalProblemKosten = fahrzeuge.reduce((s, f) => s + f.problem_kosten, 0);
  const totalTeilKosten = fahrzeuge.reduce((s, f) => s + f.teil_kosten, 0);
  const totalKaufpreis = fahrzeuge.reduce((s, f) => s + f.kaufpreis, 0);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 className="text-[2.75rem] font-bold text-on-surface font-geist tracking-tight leading-none mb-2">
            Kosten-Analyse
          </h2>
          <p className="text-on-surface-variant text-base font-geist">
            Detaillierte Übersicht aller fahrzeugbezogenen Ausgaben.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl cloud-shadow ghost-border flex flex-col gap-2">
          <span className="label-md text-on-surface-variant">Gesamtkosten</span>
          <div className="flex items-baseline gap-2">
            <span className="text-[2.75rem] font-bold text-on-surface tracking-tight leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>
              {gesamtKosten.toLocaleString("de-DE", { minimumFractionDigits: 0 })}
            </span>
            <span className="text-lg font-medium text-on-surface-variant">&euro;</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl cloud-shadow ghost-border flex flex-col gap-2">
          <span className="label-md text-on-surface-variant">Durchschnitt pro Monat</span>
          <div className="flex items-baseline gap-2">
            <span className="text-[2.75rem] font-bold text-on-surface tracking-tight leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>
              {averagePerMonth.toLocaleString("de-DE", { minimumFractionDigits: 0 })}
            </span>
            <span className="text-lg font-medium text-on-surface-variant">&euro;</span>
          </div>
           <div className="flex items-center gap-1 text-sm font-medium text-on-surface-variant mt-2">
             <Icon name="trending_up" className="text-sm" />
             <span>Stabil über 12 Monate</span>
           </div>
        </div>
        {teuerstesFahrzeug && (
          <div className="bg-surface-container-lowest p-6 rounded-xl cloud-shadow ghost-border flex flex-col gap-2">
            <span className="label-md text-on-surface-variant">Teuerstes Fahrzeug</span>
            <span className="text-xl font-bold text-on-surface tracking-tight truncate">
              {teuerstesFahrzeug.kennzeichen || `${teuerstesFahrzeug.marke} ${teuerstesFahrzeug.modell}`}
            </span>
            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-surface-container-low">
               <div className="w-8 h-8 rounded-sm bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                 <Icon name="local_shipping" className="text-sm" />
               </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-on-surface">{teuerstesFahrzeug.marke} {teuerstesFahrzeug.modell}</span>
                <span className="text-xs text-on-surface-variant">{formatEuro(teuerstesFahrzeug.total)} gesamt</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-lowest p-5 rounded-xl ghost-border shadow-sm flex flex-col">
          <span className="label-md text-outline mb-2">Kaufpreise</span>
          <span className="text-2xl font-bold text-on-surface font-geist" style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatEuro(totalKaufpreis)}
          </span>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl ghost-border shadow-sm flex flex-col">
          <span className="label-md text-outline mb-2">Reparaturen</span>
          <span className="text-2xl font-bold text-on-surface font-geist" style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatEuro(totalProblemKosten)}
          </span>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl ghost-border shadow-sm flex flex-col">
          <span className="label-md text-outline mb-2">Ersatzteile</span>
          <span className="text-2xl font-bold text-on-surface font-geist" style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatEuro(totalTeilKosten)}
          </span>
        </div>
        <div className="bg-primary p-5 rounded-xl shadow-[0_10px_30px_-10px_rgba(26,86,219,0.5)] flex flex-col justify-between bg-gradient-to-br from-primary to-primary-container text-on-primary">
          <span className="label-md text-on-primary/80 mb-2 block">Gesamtkosten</span>
          <span className="text-3xl font-bold font-geist tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatEuro(gesamtKosten)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl cloud-shadow ghost-border">
          <h3 className="text-[1.125rem] font-medium text-on-surface font-geist mb-6">Kosten pro Fahrzeug</h3>
          <div className="space-y-3">
            {fahrzeuge.map((f) => {
              const maxTotal = fahrzeuge[0]?.total || 1;
              const percentage = Math.round((f.total / maxTotal) * 100);
              return (
                <div key={f.id} className="flex items-center gap-3">
                  <div className="w-32 shrink-0">
                    <span className="text-sm font-medium text-on-surface truncate block" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {f.kennzeichen || `${f.marke} ${f.modell}`}
                    </span>
                  </div>
                  <div className="flex-1 h-8 bg-surface-container-low rounded-sm overflow-hidden relative">
                    <div
                      className={`h-full rounded-sm transition-all duration-300 ${percentage > 70 ? "bg-primary" : "bg-primary/30"}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-24 text-right shrink-0">
                    <span className="text-sm font-semibold text-on-surface" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {formatEuro(f.total)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl cloud-shadow ghost-border">
          <h3 className="text-[1.125rem] font-medium text-on-surface font-geist mb-6">Kategorien</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-on-surface-variant">Kaufpreis</span>
              </div>
              <span className="font-medium text-on-surface" style={{ fontVariantNumeric: "tabular-nums" }}>{formatEuro(totalKaufpreis)}</span>
            </div>
            <div className="w-full bg-surface-container-low rounded-full h-2">
              <div className="bg-primary rounded-full h-2" style={{ width: `${gesamtKosten > 0 ? (totalKaufpreis / gesamtKosten * 100) : 0}%` }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary-nav" />
                <span className="text-on-surface-variant">Reparaturen</span>
              </div>
              <span className="font-medium text-on-surface" style={{ fontVariantNumeric: "tabular-nums" }}>{formatEuro(totalProblemKosten)}</span>
            </div>
            <div className="w-full bg-surface-container-low rounded-full h-2">
              <div className="bg-secondary-nav rounded-full h-2" style={{ width: `${gesamtKosten > 0 ? (totalProblemKosten / gesamtKosten * 100) : 0}%` }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary-container" />
                <span className="text-on-surface-variant">Ersatzteile</span>
              </div>
              <span className="font-medium text-on-surface" style={{ fontVariantNumeric: "tabular-nums" }}>{formatEuro(totalTeilKosten)}</span>
            </div>
            <div className="w-full bg-surface-container-low rounded-full h-2">
              <div className="bg-secondary-container rounded-full h-2" style={{ width: `${gesamtKosten > 0 ? (totalTeilKosten / gesamtKosten * 100) : 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-xl cloud-shadow ghost-border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[1.125rem] font-medium text-on-surface font-geist">Letzte Ausgaben</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="label-md text-on-surface-variant border-b border-surface-container-low">
                <th className="pb-3 px-2">Datum</th>
                <th className="pb-3 px-2">Fahrzeug</th>
                <th className="pb-3 px-2">Beschreibung</th>
                <th className="pb-3 px-2 text-right">Betrag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-on-surface">
              {recentProblems.filter(p => p.kosten > 0).map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 px-2">{new Date(p.datum).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td className="py-4 px-2 font-medium">{p.kennzeichen || `${p.marke} ${p.modell}`}</td>
                  <td className="py-4 px-2 text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-secondary-nav" />
                      {p.titel}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>{formatEuro(p.kosten)}</td>
                </tr>
              ))}
              {recentTeile.filter(t => t.preis > 0).map((t) => (
                <tr key={`teil-${t.id}`} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 px-2">{t.kaufdatum ? new Date(t.kaufdatum).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</td>
                  <td className="py-4 px-2 font-medium">{t.kennzeichen || `${t.marke} ${t.modell}`}</td>
                  <td className="py-4 px-2 text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-secondary-container" />
                      {t.name}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>{formatEuro(t.preis * t.menge)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recentProblems.length === 0 && recentTeile.length === 0 && (
          <p className="text-on-surface-variant text-sm text-center py-8">Noch keine Ausgaben erfasst.</p>
        )}
      </div>
    </div>
  );
}
