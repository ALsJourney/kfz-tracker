"use client";
import { useState } from "react";
import type { Teil } from "@/lib/db";
import UploadButton from "@/components/UploadButton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { formatEuro } from "@/lib/formatEuro";

export default function TeileSection({
  fahrzeugId,
  initialTeile,
}: {
  fahrzeugId: string;
  initialTeile: Teil[];
}) {
  const [teile, setTeile] = useState<Teil[]>(initialTeile);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rechnungPfad, setRechnungPfad] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const heute = new Date().toISOString().split("T")[0];

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name"),
      teilenummer: fd.get("teilenummer") || null,
      hersteller: fd.get("hersteller") || null,
      preis: fd.get("preis") ? Number(fd.get("preis")) : 0,
      menge: fd.get("menge") ? Number(fd.get("menge")) : 1,
      lieferant: fd.get("lieferant") || null,
      kaufdatum: fd.get("kaufdatum") || null,
      notizen: fd.get("notizen") || null,
      rechnung_pfad: rechnungPfad,
    };
    const res = await fetch(`/api/fahrzeuge/${fahrzeugId}/teile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const newT = await res.json();
      setTeile([newT, ...teile]);
      setShowForm(false);
      setRechnungPfad(null);
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    const res = await fetch(`/api/fahrzeuge/${fahrzeugId}/teile?teilId=${id}`, { method: "DELETE" });
    if (res.ok) setTeile(teile.filter((t) => t.id !== id));
  }

  const gesamtTeile = teile.reduce((s, t) => s + t.preis * t.menge, 0);

  return (
    <section className="mb-8">
      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Teil löschen?"
        message="Dieser Ersatzteil-Eintrag wird unwiderruflich entfernt."
        confirmLabel="Löschen"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Teile{" "}
          <span className="text-gray-400 font-normal text-sm">
            ({teile.length}
            {gesamtTeile > 0 ? ` · ${formatEuro(gesamtTeile)}` : ""})
          </span>
        </h2>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors min-h-11"
        >
          + Teil erfassen
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-xl border border-gray-200 p-5 mb-4 space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="teil-name" className="block text-xs font-medium text-gray-600 mb-1">
                Name *
              </label>
              <input
                id="teil-name"
                name="name"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="z.B. Ölfilter"
              />
            </div>
            <div>
              <label htmlFor="teil-kaufdatum" className="block text-xs font-medium text-gray-600 mb-1">
                Kaufdatum
              </label>
              <input
                id="teil-kaufdatum"
                name="kaufdatum"
                type="date"
                defaultValue={heute}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="teil-nr" className="block text-xs font-medium text-gray-600 mb-1">
                Teilenummer
              </label>
              <input
                id="teil-nr"
                name="teilenummer"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="z.B. W 712/75"
              />
            </div>
            <div>
              <label htmlFor="teil-hersteller" className="block text-xs font-medium text-gray-600 mb-1">
                Hersteller
              </label>
              <input
                id="teil-hersteller"
                name="hersteller"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="z.B. MANN-Filter"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="teil-preis" className="block text-xs font-medium text-gray-600 mb-1">
                Preis (€)
              </label>
              <input
                id="teil-preis"
                name="preis"
                type="number"
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="teil-menge" className="block text-xs font-medium text-gray-600 mb-1">
                Menge
              </label>
              <input
                id="teil-menge"
                name="menge"
                type="number"
                min="1"
                defaultValue="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="teil-lieferant" className="block text-xs font-medium text-gray-600 mb-1">
              Lieferant
            </label>
            <input
              id="teil-lieferant"
              name="lieferant"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="z.B. Auto-Ersatzteile-Müller"
            />
          </div>
          <div>
            <label htmlFor="teil-notizen" className="block text-xs font-medium text-gray-600 mb-1">
              Notizen
            </label>
            <textarea
              id="teil-notizen"
              name="notizen"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <span className="block text-xs font-medium text-gray-600 mb-1">Rechnung</span>
            <UploadButton onUploaded={setRechnungPfad} accept="image/*,application/pdf" />
            {rechnungPfad && (
              <a
                href={rechnungPfad}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-blue-600 hover:underline"
              >
                Rechnung anzeigen
              </a>
            )}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 min-h-11"
            >
              {loading ? "Wird gespeichert…" : "Speichern"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setRechnungPfad(null);
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 min-h-11"
            >
              Abbrechen
            </button>
          </div>
        </form>
      )}

      {teile.length === 0 ? (
        <EmptyState
          icon="📦"
          title="Noch keine Teile erfasst"
          description="Erfasse Ersatzteile mit Preis, Menge und optionaler Rechnung."
          action={{ label: "Teil erfassen", onClick: () => setShowForm(true) }}
        />
      ) : (
        <div className="space-y-3">
          {teile.map((t) => {
            const meta = [t.hersteller, t.teilenummer].filter(Boolean).join(" · ");
            return (
              <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="font-medium text-gray-900">{t.name}</div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm text-gray-600">{t.menge}×</span>
                        <button
                          type="button"
                          onClick={() => setPendingDeleteId(t.id)}
                          className="p-2.5 rounded-lg text-red-600 hover:bg-red-50 min-h-11 min-w-11 flex items-center justify-center"
                          aria-label="Teil löschen"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1 flex flex-wrap justify-between gap-x-3 gap-y-0.5">
                      <span>{meta || "—"}</span>
                      {t.kaufdatum && (
                        <span className="shrink-0">
                          {new Date(t.kaufdatum).toLocaleDateString("de-DE")}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-800 mt-2">
                      {formatEuro(t.preis)} / Stück = {formatEuro(t.preis * t.menge)} gesamt
                    </div>
                    {t.lieferant && (
                      <p className="text-sm text-gray-600 mt-1">
                        Gekauft bei: {t.lieferant}
                      </p>
                    )}
                    {t.notizen && <p className="text-xs text-gray-400 mt-1">{t.notizen}</p>}
                    {t.rechnung_pfad && (
                      <a
                        href={t.rechnung_pfad}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                      >
                        Rechnung anzeigen
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
