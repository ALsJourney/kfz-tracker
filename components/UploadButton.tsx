"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

function acceptHint(accept: string) {
  if (accept.includes("pdf")) return "Erlaubt: Bilder (JPG, PNG, …) und PDF.";
  if (accept.includes("image")) return "Erlaubt: Bilder (JPG, PNG, …).";
  return "";
}

export default function UploadButton({
  onUploaded,
  accept = "image/*",
}: {
  onUploaded: (pfad: string) => void;
  accept?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const data = await res.json();
      onUploaded(data.pfad);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Upload fehlgeschlagen");
    }
    setUploading(false);
    if (ref.current) ref.current.value = "";
  }

  const hint = acceptHint(accept);

  return (
    <div>
      <input ref={ref} type="file" accept={accept} onChange={handleChange} className="hidden" />
      <Button
        type="button"
        variant="outline"
        onClick={() => ref.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Wird hochgeladen…" : "Datei auswählen"}
      </Button>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}