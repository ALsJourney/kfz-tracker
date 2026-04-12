"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function BearbeitenPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<Record<string, string | number | null>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetch(`/api/fahrzeuge/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = {
      marke: fd.get("marke"),
      modell: fd.get("modell"),
      baujahr: fd.get("baujahr") ? Number(fd.get("baujahr")) : null,
      kennzeichen: fd.get("kennzeichen") || null,
      farbe: fd.get("farbe") || null,
      kaufpreis: fd.get("kaufpreis") ? Number(fd.get("kaufpreis")) : 0,
      kilometerstand: fd.get("kilometerstand") ? Number(fd.get("kilometerstand")) : 0,
      tuev_datum: fd.get("tuev_datum") || null,
      notizen: fd.get("notizen") || null,
    };
    const res = await fetch(`/api/fahrzeuge/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      setError("Fehler beim Speichern");
      setSaving(false);
      return;
    }
    router.push(`/fahrzeuge/${id}`);
  }

  async function confirmVehicleDelete() {
    setShowDeleteDialog(false);
    setDeleting(true);
    await fetch(`/api/fahrzeuge/${id}`, { method: "DELETE" });
    router.push("/");
  }

  if (loading) return <div className="text-gray-500 py-10 text-center">Lädt…</div>;

  const titel =
    data.marke && data.modell
      ? `${data.marke} ${data.modell} bearbeiten`
      : "Fahrzeug bearbeiten";

  return (
    <div className="max-w-2xl mx-auto">
      <ConfirmDialog
        open={showDeleteDialog}
        title="Fahrzeug löschen?"
        message="Alle Probleme und Teile dieses Fahrzeugs werden unwiderruflich gelöscht."
        confirmLabel="Endgültig löschen"
        onConfirm={confirmVehicleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />

      <div className="mb-6">
        <Link href={`/fahrzeuge/${id}`} className="text-sm text-gray-500 hover:text-gray-700">
          ← Zurück
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">{titel}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-marke" className="block text-xs font-medium text-gray-600 mb-1">
              Marke *
            </label>
            <input
              id="edit-marke"
              name="marke"
              required
              defaultValue={String(data.marke ?? "")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="edit-modell" className="block text-xs font-medium text-gray-600 mb-1">
              Modell *
            </label>
            <input
              id="edit-modell"
              name="modell"
              required
              defaultValue={String(data.modell ?? "")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-baujahr" className="block text-xs font-medium text-gray-600 mb-1">
              Baujahr
            </label>
            <input
              id="edit-baujahr"
              name="baujahr"
              type="number"
              defaultValue={data.baujahr != null ? String(data.baujahr) : ""}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="edit-kennzeichen" className="block text-xs font-medium text-gray-600 mb-1">
              Kennzeichen
            </label>
            <input
              id="edit-kennzeichen"
              name="kennzeichen"
              defaultValue={String(data.kennzeichen ?? "")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-farbe" className="block text-xs font-medium text-gray-600 mb-1">
              Farbe
            </label>
            <input
              id="edit-farbe"
              name="farbe"
              defaultValue={String(data.farbe ?? "")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="edit-km" className="block text-xs font-medium text-gray-600 mb-1">
              Kilometerstand
            </label>
            <input
              id="edit-km"
              name="kilometerstand"
              type="number"
              defaultValue={String(data.kilometerstand ?? 0)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-kaufpreis" className="block text-xs font-medium text-gray-600 mb-1">
              Kaufpreis (€)
            </label>
            <input
              id="edit-kaufpreis"
              name="kaufpreis"
              type="number"
              step="0.01"
              defaultValue={String(data.kaufpreis ?? 0)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="edit-tuev" className="block text-xs font-medium text-gray-600 mb-1">
              TÜV / Pickerl bis
            </label>
            <input
              id="edit-tuev"
              name="tuev_datum"
              type="date"
              defaultValue={String(data.tuev_datum ?? "")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        <div>
          <label htmlFor="edit-notizen" className="block text-xs font-medium text-gray-600 mb-1">
            Notizen
          </label>
          <textarea
            id="edit-notizen"
            name="notizen"
            rows={3}
            defaultValue={String(data.notizen ?? "")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors min-h-11"
          >
            {saving ? "Wird gespeichert…" : "Änderungen speichern"}
          </button>
          <Link
            href={`/fahrzeuge/${id}`}
            className="px-6 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center min-h-11"
          >
            Abbrechen
          </Link>
        </div>
      </form>

      <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
        <h3 className="text-sm font-medium text-red-800 mb-2">Fahrzeug löschen</h3>
        <p className="text-xs text-red-600 mb-3">
          Dies löscht alle Probleme und Teile dieses Fahrzeugs unwiderruflich.
        </p>
        <button
          type="button"
          onClick={() => setShowDeleteDialog(true)}
          disabled={deleting}
          className="text-sm text-red-700 border border-red-300 bg-white px-4 py-2 rounded-lg hover:bg-red-50 disabled:opacity-50 min-h-11"
        >
          {deleting ? "Wird gelöscht…" : "Fahrzeug löschen"}
        </button>
      </div>
    </div>
  );
}
