"use client";
import { useState } from "react";
import type { Teil } from "@/lib/db";
import UploadButton from "@/components/UploadButton";

function formatEuro(n: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);
}

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

  async function handleDelete(id: string) {
    if (!confirm("Teil wirklich löschen?")) return;
    const res = await fetch(`/api/fahrzeuge/${fahrzeugId}/teile?teilId=${id}`, { method: "DELETE" });
    if (res.ok) setTeile(teile.filter((t) => t.id !== id));
  }

  const gesamtTeile = teile.reduce((s, t) => s + t.preis * t.menge, 0);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Ersatzteile{" "}
          <span className="text-gray-400 font-normal text-sm">
            ({teile.length}{gesamtTeile > 0 ? ` · ${formatEuro(gesamtTeile)}` : ""})
          </span>
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
        >
          + Teil hinzufügen
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl border border-gray-200 p-5 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Bezeichnung *</label>
              <input name="name" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="z.B. Luftfilter" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Teilenummer</label>
              <input name="teilenummer" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="z.B. 1K0129620" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Preis (€)</label>
              <input name="preis" type="number" min="0" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Menge</label>
              <input name="menge" type="number" min="1" defaultValue="1" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Kaufdatum</label>
              <input name="kaufdatum" type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Hersteller</label>
              <input name="hersteller" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="z.B. Mann-Filter" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Lieferant / Händler</label>
              <input name="lieferant" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="z.B. ATU" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notizen</label>
            <textarea name="notizen" rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Rechnung (Foto/PDF)</label>
            <UploadButton onUploaded={setRechnungPfad} accept="image/*,application/pdf" />
            {rechnungPfad && (
              <a href={rechnungPfad} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-blue-600 hover:underline">
                📎 Datei angehängt
              </a>
            )}
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Speichert..." : "Speichern"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setRechnungPfad(null); }} className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
              Abbrechen
            </button>
          </div>
        </form>
      )}

      {teile.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl border border-gray-200 text-gray-500 text-sm">
          Noch keine Ersatzteile erfasst.
        </div>
      ) : (
        <div className="space-y-2">
          {teile.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between">
              <div>
                <div className="font-medium text-gray-900">{t.name}</div>
                <div className="text-sm text-gray-500 mt-0.5 flex flex-wrap gap-x-3">
                  {t.teilenummer && <span>Nr: {t.teilenummer}</span>}
                  {t.hersteller && <span>{t.hersteller}</span>}
                  {t.lieferant && <span>@ {t.lieferant}</span>}
                  {t.kaufdatum && <span>{new Date(t.kaufdatum).toLocaleDateString("de-DE")}</span>}
                </div>
                {t.notizen && <p className="text-xs text-gray-400 mt-1">{t.notizen}</p>}
                {t.rechnung_pfad && (
                  <a href={t.rechnung_pfad} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                    📎 Rechnung
                  </a>
                )}
              </div>
              <div className="text-right shrink-0 ml-4">
                <div className="font-bold text-gray-900">{formatEuro(t.preis * t.menge)}</div>
                {t.menge > 1 && <div className="text-xs text-gray-400">{t.menge}× {formatEuro(t.preis)}</div>}
                <button onClick={() => handleDelete(t.id)} className="text-xs text-red-500 hover:text-red-700 mt-1">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
