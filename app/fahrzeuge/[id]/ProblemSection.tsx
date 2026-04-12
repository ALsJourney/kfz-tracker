"use client";
import { useState } from "react";
import type { Problem } from "@/lib/db";
import UploadButton from "@/components/UploadButton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge, statusBadgeForProblemStatus } from "@/components/StatusBadge";
import { formatEuro } from "@/lib/formatEuro";

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
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

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

  async function confirmDelete() {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    const res = await fetch(`/api/fahrzeuge/${fahrzeugId}/probleme?problemId=${id}`, {
      method: "DELETE",
    });
    if (res.ok) setProbleme(probleme.filter((p) => p.id !== id));
  }

  return (
    <section className="mb-8">
      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Problem löschen?"
        message="Dieses Problem und das zugehörige Foto werden unwiderruflich entfernt."
        confirmLabel="Löschen"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Probleme <span className="text-gray-400 font-normal text-sm">({probleme.length})</span>
        </h2>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors min-h-11"
        >
          + Problem melden
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-xl border border-gray-200 p-5 mb-4 space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="problem-titel" className="block text-xs font-medium text-gray-600 mb-1">
                Titel *
              </label>
              <input
                id="problem-titel"
                name="titel"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="z.B. Bremsscheiben verschlissen"
              />
            </div>
            <div>
              <label htmlFor="problem-datum" className="block text-xs font-medium text-gray-600 mb-1">
                Datum
              </label>
              <input
                id="problem-datum"
                name="datum"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>
          <div>
            <label htmlFor="problem-beschreibung" className="block text-xs font-medium text-gray-600 mb-1">
              Beschreibung
            </label>
            <textarea
              id="problem-beschreibung"
              name="beschreibung"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="problem-status" className="block text-xs font-medium text-gray-600 mb-1">
                Status
              </label>
              <select
                id="problem-status"
                name="status"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="offen">Offen</option>
                <option value="in_bearbeitung">In Bearbeitung</option>
                <option value="geloest">Gelöst</option>
              </select>
            </div>
            <div>
              <label htmlFor="problem-kosten" className="block text-xs font-medium text-gray-600 mb-1">
                Kosten (€)
              </label>
              <input
                id="problem-kosten"
                name="kosten"
                type="number"
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <span className="block text-xs font-medium text-gray-600 mb-1">Foto</span>
            <UploadButton onUploaded={setFotoPfad} accept="image/*" />
            {fotoPfad && (
              <img
                src={fotoPfad}
                alt="Vorschau des hochgeladenen Fotos"
                className="mt-2 h-24 w-auto max-w-full rounded-lg object-cover border border-gray-200"
              />
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
                setFotoPfad(null);
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 min-h-11"
            >
              Abbrechen
            </button>
          </div>
        </form>
      )}

      {probleme.length === 0 ? (
        <EmptyState
          icon="🔧"
          title="Noch keine Probleme erfasst"
          description="Melde das erste Problem für dieses Fahrzeug."
          action={{ label: "Problem melden", onClick: () => setShowForm(true) }}
        />
      ) : (
        <div className="space-y-3">
          {probleme.map((p) => {
            const variant = statusBadgeForProblemStatus(p.status);
            return (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <StatusBadge variant={variant} />
                      <span className="text-xs text-gray-400">
                        {new Date(p.datum).toLocaleDateString("de-DE")}
                      </span>
                      {p.kosten > 0 && (
                        <span className="text-xs font-medium text-gray-700">{formatEuro(p.kosten)}</span>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900">{p.titel}</h3>
                    {p.beschreibung && <p className="text-sm text-gray-500 mt-1">{p.beschreibung}</p>}
                    {p.foto_pfad && (
                      <a href={p.foto_pfad} target="_blank" rel="noopener noreferrer" className="inline-block mt-2">
                        <img
                          src={p.foto_pfad}
                          alt={`Foto zu: ${p.titel}`}
                          className="h-20 w-auto max-w-full rounded-lg object-cover border border-gray-200 hover:opacity-80 transition-opacity"
                        />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {p.status !== "geloest" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(p, p.status === "offen" ? "in_bearbeitung" : "geloest")
                        }
                        className="text-xs text-green-700 border border-green-200 bg-green-50 px-2 py-2 rounded-lg hover:bg-green-100 min-h-11"
                        aria-label={
                          p.status === "offen"
                            ? "Status auf In Bearbeitung setzen"
                            : "Status auf Gelöst setzen"
                        }
                      >
                        {p.status === "offen" ? "→ In Bearb." : "→ Gelöst"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setPendingDeleteId(p.id)}
                      className="p-2.5 rounded-lg text-red-600 hover:bg-red-50 min-h-11 min-w-11 flex items-center justify-center"
                      aria-label="Problem löschen"
                    >
                      ✕
                    </button>
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
