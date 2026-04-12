"use client";
import { useRef, useState } from "react";

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

  return (
    <div>
      <input ref={ref} type="file" accept={accept} onChange={handleChange} className="hidden" />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className="text-sm text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors"
      >
        {uploading ? "Lädt hoch..." : "📎 Datei hochladen"}
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
