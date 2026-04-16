"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import VehicleForm from "@/components/VehicleForm";

export default function NeuesFahrzeug() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(body: Record<string, unknown>): Promise<{ id?: string }> {
    setLoading(true);
    setError("");
    const res = await fetch("/api/fahrzeuge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      setError("Fehler beim Speichern");
      setLoading(false);
      return {};
    }
    const data = await res.json();
    router.push(`/fahrzeuge/${data.id}`);
    return data;
  }

  return (
    <VehicleForm
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      submitLabel="Speichern"
      cancelHref="/fahrzeuge"
    />
  );
}