import { StatusBadge, tuevDaysUntil } from "@/components/StatusBadge";

export function TuevBanner({ tuev_datum }: { tuev_datum: string | null }) {
  if (!tuev_datum) return null;

  const days = tuevDaysUntil(tuev_datum);
  const formatted = new Date(tuev_datum).toLocaleDateString("de-DE");

  let containerClass =
    "rounded-xl p-4 mb-6 flex flex-wrap items-start gap-3 border bg-white border-gray-200";
  if (days < 0 || days < 30) {
    containerClass =
      "rounded-xl p-4 mb-6 flex flex-wrap items-start gap-3 border bg-red-50 border-red-200";
  } else if (days < 60) {
    containerClass =
      "rounded-xl p-4 mb-6 flex flex-wrap items-start gap-3 border bg-yellow-50 border-yellow-200";
  }

  const badge =
    days < 0 ? (
      <StatusBadge variant="tuev_abgelaufen" />
    ) : days < 30 ? (
      <StatusBadge variant="tuev_bald" label={`Noch ${Math.ceil(days)} Tage`} />
    ) : days < 60 ? (
      <StatusBadge variant="tuev_bald" label={`${Math.ceil(days)} Tage`} />
    ) : (
      <StatusBadge variant="tuev_ok" />
    );

  return (
    <div className={containerClass}>
      <span className="text-2xl" aria-hidden>
        🔧
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <div className="text-sm font-medium text-gray-700">TÜV / Pickerl</div>
          {badge}
        </div>
        <div className="text-sm text-gray-600">Fällig am {formatted}</div>
      </div>
    </div>
  );
}
