"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function BearbeitenPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<Record<string, string | number | null>>({});

  useEffect(() => {
    fetch(`/api/fahrzeuge/${id}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
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
    if (!res.ok) { setError("Fehler beim Speichern"); setSaving(false); return; }
    router.push(`/fahrzeuge/${id}`);
  }

  async function handleDelete() {
    if (!confirm("Fahrzeug wirklich löschen? Alle Probleme und Teile werden ebenfalls gelöscht.")) return;
    setDeleting(true);
    await fetch(`/api/fahrzeuge/${id}`, { method: "DELETE" });
    router.push("/");
  }

  if (loading) return <div className="text-gray-500 py-10 text-center">Lädt...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href={`/fahrzeuge/${id}`} className="text-sm text-gray-500 hover:text-gray-700">← Zurück</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Fahrzeug bearbeiten</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marke *</label>
            <input name="marke" required defaultValue={String(data.marke ?? "")} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modell *</label>
            <input name="modell" required defaultValue={String(data.modell ?? "")} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Baujahr</label>
            <input name="baujahr" type="number" defaultValue={data.baujahr != null ? String(data.baujahr) : ""} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kennzeichen</label>
            <input name="kennzeichen" defaultValue={String(data.kennzeichen ?? "")} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Farbe</label>
            <input name="farbe" defaultValue={String(data.farbe ?? "")} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kilometerstand</label>
            <input name="kilometerstand" type="number" defaultValue={String(data.kilometerstand ?? 0)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kaufpreis (€)</label>
            <input name="kaufpreis" type="number" step="0.01" defaultValue={String(data.kaufpreis ?? 0)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">TÜV / Pickerl bis</label>
            <input name="tuev_datum" type="date" defaultValue={String(data.tuev_datum ?? "")} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notizen</label>
          <textarea name="notizen" rows={3} defaultValue={String(data.notizen ?? "")} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {saving ? "Speichert..." : "Änderungen speichern"}
          </button>
          <Link href={`/fahrzeuge/${id}`} className="px-6 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Abbrechen
          </Link>
        </div>
      </form>

      <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
        <h3 className="text-sm font-medium text-red-800 mb-2">Fahrzeug löschen</h3>
        <p className="text-xs text-red-600 mb-3">Dies löscht alle Probleme und Teile dieses Fahrzeugs unwiderruflich.</p>
        <button onClick={handleDelete} disabled={deleting} className="text-sm text-red-700 border border-red-300 bg-white px-4 py-2 rounded-lg hover:bg-red-50 disabled:opacity-50">
          {deleting ? "Löscht..." : "Fahrzeug löschen"}
        </button>
      </div>
    </div>
  );
}
