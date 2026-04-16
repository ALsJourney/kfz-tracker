"use client";
import { useState } from "react";
import type { Problem } from "@/lib/db";
import UploadButton from "@/components/UploadButton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge, statusBadgeForProblemStatus } from "@/components/StatusBadge";
import { formatEuro } from "@/lib/formatEuro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@/components/Icon";

const STATUS_ICONS: Record<string, { iconName: string; bg: string; text: string }> = {
  offen: { iconName: "warning", bg: "bg-[#FFEBEE]", text: "text-[#C62828]" },
  in_bearbeitung: { iconName: "build", bg: "bg-[#FFF3E0]", text: "text-[#EF6C00]" },
  geloest: { iconName: "check_circle", bg: "bg-[#E8F5E9]", text: "text-[#2E7D32]" },
};


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
  const [status, setStatus] = useState("offen");

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      titel: fd.get("titel"),
      beschreibung: fd.get("beschreibung") || null,
      datum: fd.get("datum"),
      status,
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
      setStatus("offen");
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
    <section className="flex flex-col gap-4">
      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Problem löschen?"
        message="Dieses Problem und das zugehörige Foto werden unwiderruflich entfernt."
        confirmLabel="Löschen"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-on-surface font-geist">Gemeldete Probleme</h3>
         <button
           onClick={() => setShowForm(!showForm)}
           className="text-sm font-medium text-primary hover:text-primary-container transition-colors flex items-center gap-1"
         >
           <Icon name="add" className="text-[18px]" />
           Problem hinzufügen
         </button>
      </div>

      {showForm && (
        <div className="bg-surface-container-lowest rounded-xl p-5 cloud-shadow ghost-border">
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant">Titel *</Label>
                <Input name="titel" required placeholder="z.B. Bremsscheiben verschlissen" className="bg-surface-container-high border-none" />
              </div>
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant">Datum</Label>
                <Input name="datum" type="date" defaultValue={new Date().toISOString().split("T")[0]} className="bg-surface-container-high border-none" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="label-md text-on-surface-variant">Beschreibung</Label>
              <Textarea name="beschreibung" rows={3} className="bg-surface-container-high border-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v ?? "offen")}>
                  <SelectTrigger className="w-full bg-surface-container-high border-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offen">Offen</SelectItem>
                    <SelectItem value="in_bearbeitung">In Bearbeitung</SelectItem>
                    <SelectItem value="geloest">Gelöst</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant">Kosten (&euro;)</Label>
                <Input name="kosten" type="number" min="0" step="0.01" placeholder="0.00" className="bg-surface-container-high border-none" />
              </div>
            </div>
            <div>
              <Label className="label-md text-on-surface-variant">Foto</Label>
              <UploadButton onUploaded={setFotoPfad} accept="image/*" />
              {fotoPfad && (
                <img src={fotoPfad} alt="Vorschau" className="mt-2 h-24 w-auto max-w-full rounded-lg object-cover ring-1 ring-outline-variant/10" />
              )}
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="submit" disabled={loading} className="bg-gradient-to-b from-primary/90 to-primary shadow-sm">
                {loading ? "Wird gespeichert…" : "Speichern"}
              </Button>
              <Button variant="outline" type="button" onClick={() => { setShowForm(false); setFotoPfad(null); }} className="ghost-border">
                Abbrechen
              </Button>
            </div>
          </form>
        </div>
      )}

      {probleme.length === 0 ? (
        <EmptyState
          icon="build"
          title="Noch keine Probleme erfasst"
          description="Melde das erste Problem für dieses Fahrzeug."
          action={{ label: "Problem melden", onClick: () => setShowForm(true) }}
        />
      ) : (
        <div className="bg-surface-container-lowest rounded-xl cloud-shadow ghost-border overflow-hidden">
          {probleme.map((p, i) => {
            const variant = statusBadgeForProblemStatus(p.status);
            const iconConfig = STATUS_ICONS[p.status] || STATUS_ICONS.offen;
            return (
              <div
                key={p.id}
                className={`p-5 hover:bg-surface-container-low transition-colors flex items-start gap-4 ${p.status === "geloest" ? "opacity-75" : ""} ${i > 0 ? "border-t border-surface-container-low" : ""}`}
              >
                 <div className={`p-2 ${iconConfig.bg} rounded-sm ${iconConfig.text} mt-1 shrink-0`}>
                   <Icon name={iconConfig.iconName} className="text-[20px]" />
                 </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-base font-medium text-on-surface ${p.status === "geloest" ? "line-through" : ""}`}>
                      {p.titel}
                    </h4>
                    <StatusBadge variant={variant} />
                  </div>
                  {p.beschreibung && <p className="text-sm text-on-surface-variant mb-2">{p.beschreibung}</p>}
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                    <span>{new Date(p.datum).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}</span>
                    {p.kosten > 0 && <span className="font-medium text-on-surface">{formatEuro(p.kosten)}</span>}
                  </div>
                  {p.foto_pfad && (
                    <a href={p.foto_pfad} target="_blank" rel="noopener noreferrer" className="inline-block mt-2">
                      <img src={p.foto_pfad} alt={`Foto zu: ${p.titel}`} className="h-20 w-auto max-w-full rounded-lg object-cover ring-1 ring-outline-variant/10 hover:opacity-80 transition-opacity" />
                    </a>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    {p.status !== "geloest" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(p, p.status === "offen" ? "in_bearbeitung" : "geloest")}
                        className="ghost-border text-xs"
                      >
                        {p.status === "offen" ? "→ In Bearb." : "→ Gelöst"}
                      </Button>
                    )}
                     <Button
                       variant="destructive"
                       size="icon-sm"
                       onClick={() => setPendingDeleteId(p.id)}
                       aria-label="Problem löschen"
                     >
                       <Icon name="delete" className="text-[14px]" />
                     </Button>
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
