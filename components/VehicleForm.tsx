"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/Icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MARKEN, MODELLE, FARBEN, BAUJAHR_RANGE, MONATE, TUEV_JAHRE, composeTuevDatum, parseTuevDatum } from "@/lib/car-data";

const ANTRIEBSARTEN = [
  { value: "benzin", label: "Benzin" },
  { value: "diesel", label: "Diesel" },
  { value: "elektro", label: "Elektro" },
  { value: "hybrid", label: "Hybrid" },
] as const;

type VehicleFormProps = {
  initialData?: Record<string, string | number | null>;
  onSubmit: (body: Record<string, unknown>) => Promise<{ id?: string }>;
  loading: boolean;
  error: string;
  submitLabel: string;
  cancelHref: string;
  showDelete?: boolean;
  onDelete?: () => void;
};

export default function VehicleForm({
  initialData,
  onSubmit,
  loading,
  error,
  submitLabel,
  cancelHref,
  showDelete,
  onDelete,
}: VehicleFormProps) {
  const [marke, setMarke] = useState(String(initialData?.marke ?? ""));
  const [modell, setModell] = useState(String(initialData?.modell ?? ""));
  const [baujahr, setBaujahr] = useState(
    initialData?.baujahr != null ? String(initialData.baujahr) : ""
  );
  const [farbe, setFarbe] = useState(String(initialData?.farbe ?? ""));
  const [antriebsart, setAntriebsart] = useState(String(initialData?.antriebsart ?? ""));
  const [tuevMonat, setTuevMonat] = useState(() => {
    if (initialData?.tuev_datum) {
      return parseTuevDatum(String(initialData.tuev_datum)).monat;
    }
    return "";
  });
  const [tuevJahr, setTuevJahr] = useState(() => {
    if (initialData?.tuev_datum) {
      return parseTuevDatum(String(initialData.tuev_datum)).jahr;
    }
    return "";
  });

  const availableModelle = marke && MODELLE[marke] ? MODELLE[marke] : [];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const tuevDatum = tuevMonat && tuevJahr ? composeTuevDatum(tuevMonat, tuevJahr) : null;
    const body: Record<string, unknown> = {
      marke: marke || fd.get("marke_custom") || null,
      modell: modell || fd.get("modell_custom") || null,
      baujahr: baujahr ? Number(baujahr) : null,
      kennzeichen: fd.get("kennzeichen") || null,
      farbe: farbe || null,
      kaufpreis: fd.get("kaufpreis") ? Number(fd.get("kaufpreis")) : 0,
      kilometerstand: fd.get("kilometerstand") ? Number(fd.get("kilometerstand")) : 0,
      tuev_datum: tuevDatum,
      notizen: fd.get("notizen") || null,
      fin: fd.get("fin") || null,
      antriebsart: antriebsart || null,
      versicherung_name: fd.get("versicherung_name") || null,
      versicherung_nummer: fd.get("versicherung_nummer") || null,
      letzter_service: fd.get("letzter_service") || null,
      naechster_service: fd.get("naechster_service") || null,
    };
    await onSubmit(body);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href={cancelHref} className="text-sm text-on-surface-variant hover:text-primary flex items-center gap-1 mb-2 font-medium">
          <Icon name="arrow_back" className="text-[1rem]" />
          Zurück zur Übersicht
        </Link>
        <h1 className="text-[2.75rem] font-bold text-on-surface font-geist leading-tight tracking-tight">
          {initialData ? "Fahrzeug bearbeiten" : "Neues Fahrzeug"}
        </h1>
        {!initialData && (
          <p className="text-on-surface-variant text-base mt-2">
            Fügen Sie ein neues Fahrzeug zu Ihrem Fuhrpark hinzu.
          </p>
        )}
      </div>

      <div className="bg-surface-container-lowest rounded-xl cloud-shadow ghost-border p-8">
        {error && (
          <div className="bg-error-container/50 text-on-error-container px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-[1.125rem] font-medium text-on-surface border-b border-surface-variant pb-2 font-geist">Basisdaten</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant block">Marke *</Label>
                <Select value={marke} onValueChange={(v) => { setMarke(v ?? ""); setModell(""); }}>
                  <SelectTrigger className="w-full bg-surface-container-high border-none">
                    <SelectValue placeholder="Marke wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {MARKEN.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {marke && !MARKEN.includes(marke as typeof MARKEN[number]) && (
                  <Input name="marke_custom" placeholder="Eigenen Markenname eingeben" className="bg-surface-container-high border-none" />
                )}
              </div>
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant block">Modell *</Label>
                {availableModelle.length > 0 ? (
                  <Select value={modell} onValueChange={(v) => setModell(v ?? "")}>
                    <SelectTrigger className="w-full bg-surface-container-high border-none">
                      <SelectValue placeholder="Modell wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModelle.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    name="modell_custom"
                    value={modell}
                    onChange={(e) => setModell(e.target.value)}
                    placeholder="z.B. Golf"
                    required
                    className="bg-surface-container-high border-none"
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant block">Baujahr</Label>
                <Select value={baujahr} onValueChange={(v) => setBaujahr(v ?? "")}>
                  <SelectTrigger className="w-full bg-surface-container-high border-none">
                    <SelectValue placeholder="Jahr wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {BAUJAHR_RANGE.map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant block">Farbe</Label>
                <Select value={farbe} onValueChange={(v) => setFarbe(v ?? "")}>
                  <SelectTrigger className="w-full bg-surface-container-high border-none">
                    <SelectValue placeholder="Farbe wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {FARBEN.map((f) => (
                      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <h2 className="text-[1.125rem] font-medium text-on-surface border-b border-surface-variant pb-2 font-geist">Identifikation &amp; Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant block">Kennzeichen</Label>
                <Input name="kennzeichen" placeholder="M-AB 1234" defaultValue={String(initialData?.kennzeichen ?? "")} className="bg-surface-container-high border-none uppercase" />
              </div>
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant block">FIN / Chassis</Label>
                <Input name="fin" placeholder="z.B. WVWZZZ1JZ12345678" defaultValue={String(initialData?.fin ?? "")} className="bg-surface-container-high border-none font-mono" />
              </div>
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant block">TÜV fällig</Label>
                <div className="flex gap-2">
                  <Select value={tuevMonat} onValueChange={(v) => setTuevMonat(v ?? "")}>
                    <SelectTrigger className="w-1/2 bg-surface-container-high border-none">
                      <SelectValue placeholder="Monat" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONATE.map((m) => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={tuevJahr} onValueChange={(v) => setTuevJahr(v ?? "")}>
                    <SelectTrigger className="w-1/2 bg-surface-container-high border-none">
                      <SelectValue placeholder="Jahr" />
                    </SelectTrigger>
                    <SelectContent>
                      {TUEV_JAHRE.map((y) => (
                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant block">Antriebsart</Label>
                <Select value={antriebsart} onValueChange={(v) => setAntriebsart(v ?? "")}>
                  <SelectTrigger className="w-full bg-surface-container-high border-none">
                    <SelectValue placeholder="Wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {ANTRIEBSARTEN.map((a) => (
                      <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <h2 className="text-[1.125rem] font-medium text-on-surface border-b border-surface-variant pb-2 font-geist">Finanzen &amp; Nutzung</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant block">Kaufpreis (&amp;euro;)</Label>
                <Input name="kaufpreis" type="number" min="0" step="0.01" placeholder="0,00" defaultValue={String(initialData?.kaufpreis ?? 0)} className="bg-surface-container-high border-none" style={{ fontVariantNumeric: "tabular-nums" }} />
              </div>
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant block">Kilometerstand (km)</Label>
                <Input name="kilometerstand" type="number" min="0" placeholder="0" defaultValue={String(initialData?.kilometerstand ?? 0)} className="bg-surface-container-high border-none" style={{ fontVariantNumeric: "tabular-nums" }} />
              </div>
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant block">Versicherung</Label>
                <Input name="versicherung_name" placeholder="z.B. Allianz Vollkasko" defaultValue={String(initialData?.versicherung_name ?? "")} className="bg-surface-container-high border-none" />
              </div>
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant block">Versicherungsnummer</Label>
                <Input name="versicherung_nummer" placeholder="z.B. #ALZ-9982-DE" defaultValue={String(initialData?.versicherung_nummer ?? "")} className="bg-surface-container-high border-none" />
              </div>
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant block">Letzter Service</Label>
                <Input name="letzter_service" type="date" defaultValue={String(initialData?.letzter_service ?? "")} className="bg-surface-container-high border-none" />
              </div>
              <div className="space-y-2">
                <Label className="label-md text-on-surface-variant block">Nächster Service</Label>
                <Input name="naechster_service" type="date" defaultValue={String(initialData?.naechster_service ?? "")} className="bg-surface-container-high border-none" />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <h2 className="text-[1.125rem] font-medium text-on-surface border-b border-surface-variant pb-2 font-geist">Sonstiges</h2>
            <div className="space-y-2">
              <Label className="label-md text-on-surface-variant block">Notizen</Label>
              <Textarea name="notizen" rows={4} placeholder="Zusätzliche Informationen zum Fahrzeug..." defaultValue={String(initialData?.notizen ?? "")} className="bg-surface-container-high border-none resize-y" />
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between gap-4 border-t border-surface-variant">
            <div>
              {showDelete && onDelete && (
                 <button
                   type="button"
                   onClick={onDelete}
                   className="text-error bg-error-container/50 hover:bg-error-container px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                 >
                   <Icon name="delete" className="text-[1.125rem]" />
                   Löschen
                 </button>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Link href={cancelHref}>
                <Button variant="outline" type="button" className="ghost-border px-6 py-2.5 rounded-xl font-medium text-sm text-on-surface-variant">
                  Abbrechen
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl font-medium text-sm text-on-primary bg-primary bg-gradient-to-b from-primary/90 to-primary hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors shadow-[0_4px_10px_-2px_rgba(0,63,177,0.3)]"
              >
                {loading ? "Wird gespeichert…" : submitLabel}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
