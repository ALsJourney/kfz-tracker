"use client";
import { useState } from "react";
import type { Teil } from "@/lib/db";
import UploadButton from "@/components/UploadButton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { formatEuro } from "@/lib/formatEuro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/Icon";

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

  return (
    <section className="flex flex-col gap-4">
      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Teil löschen?"
        message="Dieser Ersatzteil-Eintrag wird unwiderruflich entfernt."
        confirmLabel="Löschen"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-on-surface font-geist">Ersatzteile & Wartung</h3>
         <button
           onClick={() => setShowForm(!showForm)}
           className="text-sm font-medium text-primary hover:text-primary-container transition-colors flex items-center gap-1"
         >
           <Icon name="add" className="text-[18px]" />
           Teil erfassen
         </button>
      </div>

      {showForm && (
        <div className="bg-surface-container-lowest rounded-xl p-5 cloud-shadow ghost-border">
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant">Name *</Label>
                <Input name="name" required placeholder="z.B. Ölfilter" className="bg-surface-container-high border-none" />
              </div>
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant">Kaufdatum</Label>
                <Input name="kaufdatum" type="date" defaultValue={heute} className="bg-surface-container-high border-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant">Teilenummer</Label>
                <Input name="teilenummer" placeholder="z.B. W 712/75" className="bg-surface-container-high border-none" />
              </div>
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant">Hersteller</Label>
                <Input name="hersteller" placeholder="z.B. MANN-Filter" className="bg-surface-container-high border-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant">Preis (&euro;)</Label>
                <Input name="preis" type="number" min="0" step="0.01" placeholder="0.00" className="bg-surface-container-high border-none" />
              </div>
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant">Menge</Label>
                <Input name="menge" type="number" min="1" defaultValue="1" className="bg-surface-container-high border-none" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="label-md text-on-surface-variant">Lieferant</Label>
              <Input name="lieferant" placeholder="z.B. Auto-Ersatzteile-Müller" className="bg-surface-container-high border-none" />
            </div>
            <div className="space-y-2">
              <Label className="label-md text-on-surface-variant">Notizen</Label>
              <Textarea name="notizen" rows={3} className="bg-surface-container-high border-none" />
            </div>
            <div>
              <Label className="label-md text-on-surface-variant">Rechnung</Label>
              <UploadButton onUploaded={setRechnungPfad} accept="image/*,application/pdf" />
              {rechnungPfad && (
                <a href={rechnungPfad} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-primary hover:underline">
                  Rechnung anzeigen
                </a>
              )}
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="submit" disabled={loading} className="bg-gradient-to-b from-primary/90 to-primary shadow-sm">
                {loading ? "Wird gespeichert…" : "Speichern"}
              </Button>
              <Button variant="outline" type="button" onClick={() => { setShowForm(false); setRechnungPfad(null); }} className="ghost-border">
                Abbrechen
              </Button>
            </div>
          </form>
        </div>
      )}

      {teile.length === 0 ? (
        <EmptyState
          icon="inventory_2"
          title="Noch keine Teile erfasst"
          description="Erfasse Ersatzteile mit Preis, Menge und optionaler Rechnung."
          action={{ label: "Teil erfassen", onClick: () => setShowForm(true) }}
        />
      ) : (
        <div className="bg-surface-container-lowest rounded-xl cloud-shadow ghost-border overflow-hidden">
          {teile.map((t, i) => {
            const meta = [t.hersteller, t.teilenummer].filter(Boolean).join(" · ");
            return (
              <div
                key={t.id}
                className={`p-4 hover:bg-surface-container-low transition-colors flex items-center justify-between ${i > 0 ? "border-t border-surface-container-low" : ""}`}
              >
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-sm bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0">
                     <Icon name="inventory_2" className="text-[20px]" />
                   </div>
                  <div>
                    <h4 className="text-sm font-medium text-on-surface">{t.name}</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {meta || "—"}
                      {t.kaufdatum && ` · ${new Date(t.kaufdatum).toLocaleDateString("de-DE")}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-semibold text-on-surface" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {formatEuro(t.preis * t.menge)}
                    </span>
                    {t.menge > 1 && (
                      <span className="text-xs text-on-surface-variant block text-right">
                        {formatEuro(t.preis)}/Stk.
                      </span>
                    )}
                  </div>
                   <Button
                     variant="destructive"
                     size="icon-sm"
                     onClick={() => setPendingDeleteId(t.id)}
                     aria-label="Teil löschen"
                   >
                     <Icon name="delete" className="text-[14px]" />
                   </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
