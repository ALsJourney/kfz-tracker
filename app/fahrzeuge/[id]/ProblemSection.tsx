"use client";
import { useState } from "react";
import type { Problem } from "@/lib/db";
import UploadButton from "@/components/UploadButton";

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  offen: { label: "Offen", cls: "bg-red-100 text-red-700" },
  in_bearbeitung: { label: "In Bearbeitung", cls: "bg-yellow-100 text-yellow-700" },
  geloest: { label: "Gelöst", cls: "bg-green-100 text-green-700" },
};

function formatEuro(n: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);
}

export default function ProblemSection({
  fahrzeugId,
  initialProbleme,
}: {
  fahrzeugId: string;
  initialProbleme: Problem[];
}) {
  const [probleme, setProbleme] = useState<Problem[]>(initialProbleme);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fotoPfad, setFotoPfad] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      titel: fd.get("titel"),
      beschreibung: fd.get("beschreibung") || null,
      datum: fd.get("datum"),
      status: fd.get("status") || "offen",
      kosten: fd.get("kosten") ? Number(fd.get("kosten")) : 0,
      foto_pfad: fotoPfad,
    };
    const res = await fetch(`/api/fahrzeuge/${fahrzeugId}/probleme`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const newP = await res.json();
      setProbleme([newP, ...probleme]);
      setShowForm(false);
      setFotoPfad(null);
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  async function handleStatusChange(p: Problem, newStatus: string) {
    const res = await fetch(`/api/fahrzeuge/${fahrzeugId}/probleme?problemId=${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, status: newStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProbleme(probleme.map((x) => (x.id === p.id ? updated : x)));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Problem wirklich löschen?")) return;
    const res = await fetch(`/api/fahrzeuge/${fahrzeugId}/probleme?problemId=${id}`, {
      method: "DELETE",
    });
    if (res.ok) setProbleme(probleme.filter((p) => p.id !== id));
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Probleme <span className="text-gray-400 font-normal text-sm">({probleme.length})</span>
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
        >
          + Problem melden
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl border border-gray-200 p-5 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Titel *</label>
              <input name="titel" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="z.B. Bremsscheiben verschlissen" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Datum</label>
              <input name="datum" type="date" defaultValue={new Date().toISOString().split("T")[0]} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Beschreibung</label>
            <textarea name="beschreibung" rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select name="status" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="offen">Offen</option>
                <option value="in_bearbeitung">In Bearbeitung</option>
                <option value="geloest">Gelöst</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Kosten (€)</label>
              <input name="kosten" type="number" min="0" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Foto</label>
            <UploadButton onUploaded={setFotoPfad} accept="image/*" />
            {fotoPfad && (
              <img src={fotoPfad} alt="Vorschau" className="mt-2 h-24 w-auto rounded-lg object-cover border border-gray-200" />
            )}
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Speichert..." : "Speichern"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setFotoPfad(null); }} className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
              Abbrechen
            </button>
          </div>
        </form>
      )}

      {probleme.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl border border-gray-200 text-gray-500 text-sm">
          Noch keine Probleme erfasst.
        </div>
      ) : (
        <div className="space-y-3">
          {probleme.map((p) => {
            const st = STATUS_LABELS[p.status] ?? STATUS_LABELS.offen;
            return (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.cls}`}>{st.label}</span>
                      <span className="text-xs text-gray-400">{new Date(p.datum).toLocaleDateString("de-DE")}</span>
                      {p.kosten > 0 && <span className="text-xs font-medium text-gray-700">{formatEuro(p.kosten)}</span>}
                    </div>
                    <h3 className="font-medium text-gray-900">{p.titel}</h3>
                    {p.beschreibung && <p className="text-sm text-gray-500 mt-1">{p.beschreibung}</p>}
                    {p.foto_pfad && (
                      <a href={p.foto_pfad} target="_blank" rel="noopener noreferrer">
                        <img src={p.foto_pfad} alt="Foto" className="mt-2 h-20 w-auto rounded-lg object-cover border border-gray-200 hover:opacity-80 transition-opacity" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {p.status !== "geloest" && (
                      <button
                        onClick={() => handleStatusChange(p, p.status === "offen" ? "in_bearbeitung" : "geloest")}
                        className="text-xs text-green-700 border border-green-200 bg-green-50 px-2 py-1 rounded hover:bg-green-100"
                      >
                        {p.status === "offen" ? "→ In Bearb." : "→ Gelöst"}
                      </button>
                    )}
                    <button onClick={() => handleDelete(p.id)} className="text-xs text-red-500 hover:text-red-700 px-1">✕</button>
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
