"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NeuesFahrzeug() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
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
    const res = await fetch("/api/fahrzeuge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      setError("Fehler beim Speichern");
      setLoading(false);
      return;
    }
    const data = await res.json();
    router.push(`/fahrzeuge/${data.id}`);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">← Zurück</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Neues Fahrzeug</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marke *</label>
            <input name="marke" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="z.B. Volkswagen" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modell *</label>
            <input name="modell" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="z.B. Golf" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Baujahr</label>
            <input name="baujahr" type="number" min="1900" max="2099" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="z.B. 2018" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kennzeichen</label>
            <input name="kennzeichen" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="z.B. W 123 AB" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Farbe</label>
            <input name="farbe" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="z.B. Silber" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kilometerstand</label>
            <input name="kilometerstand" type="number" min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="z.B. 85000" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kaufpreis (€)</label>
            <input name="kaufpreis" type="number" min="0" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">TÜV / Pickerl bis</label>
            <input name="tuev_datum" type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notizen</label>
          <textarea name="notizen" rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Optionale Notizen..." />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Speichert..." : "Fahrzeug speichern"}
          </button>
          <Link href="/" className="px-6 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  );
}
