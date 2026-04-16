"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import VehicleForm from "@/components/VehicleForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function BearbeitenPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  async function handleSubmit(body: Record<string, unknown>): Promise<{ id?: string }> {
    setSaving(true);
    setError("");
    const res = await fetch(`/api/fahrzeuge/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      setError("Fehler beim Speichern");
      setSaving(false);
      return {};
    }
    router.push(`/fahrzeuge/${id}`);
    return {};
  }

  async function confirmVehicleDelete() {
    setShowDeleteDialog(false);
    await fetch(`/api/fahrzeuge/${id}`, { method: "DELETE" });
    router.push("/");
  }

  if (loading) return <div className="text-on-surface-variant py-10 text-center">Lädt…</div>;

  return (
    <>
      <VehicleForm
        initialData={data}
        onSubmit={handleSubmit}
        loading={saving}
        error={error}
        submitLabel="Änderungen speichern"
        cancelHref={`/fahrzeuge/${id}`}
        showDelete
        onDelete={() => setShowDeleteDialog(true)}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fahrzeug löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Alle Probleme und Teile dieses Fahrzeugs werden unwiderruflich gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={confirmVehicleDelete}>Endgültig löschen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}