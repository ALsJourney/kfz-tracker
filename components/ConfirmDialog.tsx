"use client";

import { useEffect, useRef } from "react";

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Löschen",
  cancelLabel = "Abbrechen",
  variant = "danger",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      queueMicrotask(() => cancelRef.current?.focus());
    } else if (previouslyFocused.current?.isConnected) {
      previouslyFocused.current.focus();
      previouslyFocused.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const confirmClass =
    variant === "danger"
      ? "text-sm text-white bg-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-700 min-h-11"
      : "text-sm text-yellow-900 bg-yellow-100 px-4 py-2 rounded-lg font-medium hover:bg-yellow-200 border border-yellow-300 min-h-11";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Dialog schließen"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className="relative bg-white rounded-xl border border-gray-200 shadow-lg max-w-md w-full p-5"
      >
        <h2 id="confirm-dialog-title" className="text-lg font-bold text-gray-900 mb-2">
          {title}
        </h2>
        <p id="confirm-dialog-desc" className="text-sm text-gray-600 mb-6">
          {message}
        </p>
        <div className="flex justify-end gap-2 flex-wrap">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 min-h-11 min-w-[5.5rem]"
          >
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className={confirmClass}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
