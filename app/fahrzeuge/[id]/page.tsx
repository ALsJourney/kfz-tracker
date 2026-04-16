import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/lib/db";
import type { Problem, Teil, Fahrzeug } from "@/lib/db";
import { TuevBanner } from "@/components/TuevBanner";
import { formatEuro } from "@/lib/formatEuro";
import ProblemSection from "./ProblemSection";
import TeileSection from "./TeileSection";
import { Icon } from "@/components/Icon";

export default async function FahrzeugPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();

  const fahrzeug = db.prepare("SELECT * FROM fahrzeuge WHERE id = ?").get(id) as Fahrzeug | undefined;
  if (!fahrzeug) notFound();

  const probleme = db.prepare(
    "SELECT * FROM probleme WHERE fahrzeug_id = ? ORDER BY datum DESC"
  ).all(id) as Problem[];

  const teile = db.prepare("SELECT * FROM teile WHERE fahrzeug_id = ? ORDER BY kaufdatum DESC").all(id) as Teil[];

  const problemKosten = probleme.reduce((s, p) => s + p.kosten, 0);
  const teilKosten = teile.reduce((s, t) => s + t.preis * t.menge, 0);
  const gesamt = fahrzeug.kaufpreis + problemKosten + teilKosten;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
              <Link href="/fahrzeuge" className="text-on-surface-variant hover:text-primary transition-colors flex items-center">
                <Icon name="arrow_back" className="text-sm mr-1" />
                <span className="text-sm font-medium">Zurück zu Fahrzeuge</span>
              </Link>
          </div>
          <h2 className="text-3xl font-bold text-on-surface font-geist flex items-center gap-3 flex-wrap">
            {fahrzeug.marke} {fahrzeug.modell}
            {fahrzeug.kennzeichen && (
              <span className="px-2.5 py-1 bg-surface-container-low text-on-surface-variant text-xs font-semibold rounded-sm uppercase tracking-wider ring-1 ring-outline-variant/10">
                {fahrzeug.kennzeichen}
              </span>
            )}
          </h2>
          {fahrzeug.baujahr && (
            <p className="text-on-surface-variant mt-1">{fahrzeug.baujahr} {fahrzeug.antriebsart ? `· ${fahrzeug.antriebsart}` : ""}</p>
          )}
        </div>
        <div className="flex gap-3">
          <Link href={`/fahrzeuge/${id}/bearbeiten`}>
            <button className="px-5 py-2.5 rounded-lg font-medium text-sm bg-surface-container-lowest text-on-surface ring-1 ring-outline-variant/20 hover:bg-surface-container-low transition-colors flex items-center gap-2 shadow-[0_2px_10px_-4px_rgba(0,63,177,0.05)]">
              <Icon name="edit" className="text-[18px]" />
              Bearbeiten
            </button>
          </Link>
        </div>
      </div>

      <TuevBanner tuev_datum={fahrzeug.tuev_datum} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-1 rounded-xl bg-surface-container-lowest cloud-shadow overflow-hidden ghost-border flex flex-col">
          <div className="h-48 bg-surface-container-high relative flex items-center justify-center">
            <Icon name="directions_car" className="text-6xl text-on-surface-variant/30" />
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            {fahrzeug.fin && (
              <div className="mb-4">
                <p className="label-md text-outline mb-1">FIN / Chassis</p>
                <p className="text-sm font-medium text-on-surface font-mono">{fahrzeug.fin}</p>
              </div>
            )}
            <div className={fahrzeug.fin ? "mt-4 pt-4 border-t border-surface-container-low" : ""}>
              <p className="label-md text-outline mb-1">Erstzulassung</p>
              <p className="text-sm font-medium text-on-surface">
                {fahrzeug.baujahr ? `${fahrzeug.baujahr}` : "—"}
              </p>
            </div>
            {fahrzeug.farbe && (
              <div className="mt-4 pt-4 border-t border-surface-container-low">
                <p className="label-md text-outline mb-1">Farbe</p>
                <p className="text-sm font-medium text-on-surface">{fahrzeug.farbe}</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest rounded-xl p-6 cloud-shadow ghost-border flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2.5 bg-secondary-fixed rounded-sm text-on-secondary-fixed">
                 <Icon name="speed" />
               </div>
              <h3 className="label-md text-outline">Kilometerstand</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-on-surface font-geist tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
                {fahrzeug.kilometerstand.toLocaleString("de-DE")}
              </span>
              <span className="text-lg font-medium text-on-surface-variant">km</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 cloud-shadow ghost-border flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2.5 bg-primary-fixed rounded-sm text-on-primary-fixed">
                 <Icon name="shield" />
               </div>
              <h3 className="label-md text-outline">Versicherung</h3>
            </div>
            {fahrzeug.versicherung_name ? (
              <>
                <p className="text-lg font-medium text-on-surface">{fahrzeug.versicherung_name}</p>
                {fahrzeug.versicherung_nummer && (
                  <p className="text-sm text-on-surface-variant mt-1">Police: {fahrzeug.versicherung_nummer}</p>
                )}
                <div className="mt-4 inline-flex items-center px-2.5 py-1 rounded-sm bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold uppercase tracking-wider w-max">
                  Aktiv
                </div>
              </>
            ) : (
              <p className="text-on-surface-variant text-sm">Nicht erfasst</p>
            )}
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 cloud-shadow ghost-border flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2.5 bg-surface-container-low rounded-sm text-on-surface-variant">
                 <Icon name="build" />
               </div>
              <h3 className="label-md text-outline">Letzter Service</h3>
            </div>
            {fahrzeug.letzter_service ? (
              <p className="text-lg font-medium text-on-surface">
                {new Date(fahrzeug.letzter_service).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            ) : (
              <p className="text-on-surface-variant text-sm">Nicht erfasst</p>
            )}
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 cloud-shadow ghost-border flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2.5 bg-surface-container-low rounded-sm text-on-surface-variant">
                 <Icon name="event" />
               </div>
              <h3 className="label-md text-outline">Nächster Service</h3>
            </div>
            {fahrzeug.naechster_service ? (
              <p className="text-lg font-medium text-on-surface">
                {new Date(fahrzeug.naechster_service).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            ) : (
              <p className="text-on-surface-variant text-sm">Nicht erfasst</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProblemSection fahrzeugId={id} initialProbleme={probleme} />
        <TeileSection fahrzeugId={id} initialTeile={teile} />
      </div>

      {fahrzeug.notizen && (
        <div className="bg-surface-container-low rounded-xl p-5 ring-1 ring-outline-variant/10">
          <h3 className="label-md text-on-surface-variant mb-2">Notizen</h3>
          <p className="text-sm text-on-surface">{fahrzeug.notizen}</p>
        </div>
      )}

      <section className="pt-4 pb-8">
        <h3 className="text-xl font-semibold text-on-surface font-geist mb-6">Kostenübersicht</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-xl ring-1 ring-outline-variant/10 shadow-sm flex flex-col">
            <span className="label-md text-outline mb-2">Kaufpreis</span>
            <span className="text-2xl font-bold text-on-surface font-geist" style={{ fontVariantNumeric: "tabular-nums" }}>
              {formatEuro(fahrzeug.kaufpreis)}
            </span>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-xl ring-1 ring-outline-variant/10 shadow-sm flex flex-col">
            <span className="label-md text-outline mb-2">Reparaturen</span>
            <span className="text-2xl font-bold text-on-surface font-geist" style={{ fontVariantNumeric: "tabular-nums" }}>
              {formatEuro(problemKosten)}
            </span>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-xl ring-1 ring-outline-variant/10 shadow-sm flex flex-col">
            <span className="label-md text-outline mb-2">Ersatzteile</span>
            <span className="text-2xl font-bold text-on-surface font-geist" style={{ fontVariantNumeric: "tabular-nums" }}>
              {formatEuro(teilKosten)}
            </span>
          </div>
          <div className="bg-primary p-5 rounded-xl shadow-[0_10px_30px_-10px_rgba(26,86,219,0.5)] flex flex-col justify-between bg-gradient-to-br from-primary to-primary-container text-on-primary">
            <div>
              <span className="label-md text-on-primary/80 mb-2 block">Gesamt investiert</span>
              <span className="text-3xl font-bold font-geist tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
                {formatEuro(gesamt)}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
