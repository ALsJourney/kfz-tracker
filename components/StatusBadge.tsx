import { Badge } from "@/components/ui/badge";
import { formatTuevDatumDisplay } from "@/lib/car-data";

export type StatusBadgeVariant =
  | "offen"
  | "in_bearbeitung"
  | "geloest"
  | "tuev_ok"
  | "tuev_bald"
  | "tuev_abgelaufen";

const BADGE_STYLES: Record<StatusBadgeVariant, string> = {
  offen: "bg-[#FFEBEE] text-[#C62828]",
  in_bearbeitung: "bg-[#FFF3E0] text-[#EF6C00]",
  geloest: "bg-[#E8F5E9] text-[#2E7D32]",
  tuev_ok: "bg-[#10b981]/15 text-[#047857]",
  tuev_bald: "bg-[#f59e0b]/15 text-[#b45309]",
  tuev_abgelaufen: "bg-[#ef4444]/15 text-[#dc2626]",
};

const BADGE_LABELS: Record<StatusBadgeVariant, string> = {
  offen: "Offen",
  in_bearbeitung: "In Bearbeitung",
  geloest: "Gelöst",
  tuev_ok: "TÜV OK",
  tuev_bald: "TÜV fällig",
  tuev_abgelaufen: "Abgelaufen",
};

export function statusBadgeForProblemStatus(status: string): StatusBadgeVariant {
  if (status === "in_bearbeitung") return "in_bearbeitung";
  if (status === "geloest") return "geloest";
  return "offen";
}

export function tuevDaysUntil(datum: string): number {
  const [y, m] = datum.split("-").map(Number);
  const lastDay = new Date(y, m, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return (lastDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
}

export function tuevBadgeFromDatum(datum: string | null): { variant: StatusBadgeVariant; label: string } | null {
  if (!datum) return null;
  
  const country = typeof window !== "undefined" ? localStorage.getItem("app_country") : "DE";
  const diff = tuevDaysUntil(datum);
  
  // For Austria, the "Pickerl" is valid for 4 additional months (approx 120 days)
  const gracePeriod = country === "AT" ? 120 : 0;
  const effectiveDiff = diff + gracePeriod;

  if (effectiveDiff < 0) return { variant: "tuev_abgelaufen", label: "Abgelaufen" };
  if (diff < 60) {
    const label = country === "AT" && diff < 0 
      ? `Nachfrist (${Math.abs(Math.ceil(diff))} Tage)` 
      : `${Math.ceil(diff)} Tage`;
    return { variant: "tuev_bald", label };
  }
  return { variant: "tuev_ok", label: formatTuevDatumDisplay(datum) };
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
    <Badge
      variant="outline"
      className={`${BADGE_STYLES[variant]} border-0 rounded text-xs font-bold font-geist whitespace-nowrap px-3 py-1 ${className}`}
    >
      {label ?? BADGE_LABELS[variant]}
    </Badge>
  );
}