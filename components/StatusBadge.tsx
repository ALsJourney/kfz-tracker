export type StatusBadgeVariant =
  | "offen"
  | "in_bearbeitung"
  | "geloest"
  | "tuev_ok"
  | "tuev_bald"
  | "tuev_abgelaufen";

const BADGE_STYLES: Record<StatusBadgeVariant, string> = {
  offen: "bg-red-100 text-red-700",
  in_bearbeitung: "bg-yellow-100 text-yellow-700",
  geloest: "bg-green-100 text-green-700",
  tuev_ok: "bg-green-100 text-green-700",
  tuev_bald: "bg-yellow-100 text-yellow-700",
  tuev_abgelaufen: "bg-red-100 text-red-700",
};

const BADGE_LABELS: Record<StatusBadgeVariant, string> = {
  offen: "Offen",
  in_bearbeitung: "In Bearbeitung",
  geloest: "Gelöst",
  tuev_ok: "TÜV OK",
  tuev_bald: "TÜV bald",
  tuev_abgelaufen: "Abgelaufen",
};

export function statusBadgeForProblemStatus(status: string): StatusBadgeVariant {
  if (status === "in_bearbeitung") return "in_bearbeitung";
  if (status === "geloest") return "geloest";
  return "offen";
}

/** Days until TÜV due (negative = overdue). */
export function tuevDaysUntil(datum: string): number {
  const d = new Date(datum);
  const now = new Date();
  return (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
}

export function tuevBadgeFromDatum(datum: string | null): { variant: StatusBadgeVariant; label: string } | null {
  if (!datum) return null;
  const diff = tuevDaysUntil(datum);
  const d = new Date(datum);
  if (diff < 0) return { variant: "tuev_abgelaufen", label: "Abgelaufen" };
  if (diff < 60) return { variant: "tuev_bald", label: `${Math.ceil(diff)} Tage` };
  return { variant: "tuev_ok", label: d.toLocaleDateString("de-DE") };
}

export function StatusBadge({
  variant,
  label,
  className = "",
}: {
  variant: StatusBadgeVariant;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${BADGE_STYLES[variant]} ${className}`}
    >
      {label ?? BADGE_LABELS[variant]}
    </span>
  );
}
