import { tuevDaysUntil } from "@/components/StatusBadge";
import { formatTuevDatumDisplay } from "@/lib/car-data";
import { Icon } from "@/components/Icon";

export function TuevBanner({ tuev_datum }: { tuev_datum: string | null }) {
  if (!tuev_datum) return null;

  const country = typeof window !== "undefined" ? localStorage.getItem("app_country") : "DE";
  const days = tuevDaysUntil(tuev_datum);
  const formatted = formatTuevDatumDisplay(tuev_datum);
  
  const gracePeriod = country === "AT" ? 120 : 0;
  const effectiveDays = days + gracePeriod;

  const isWarning = effectiveDays >= 30 && effectiveDays < 60;
  const isDestructive = effectiveDays < 30;

  if (!isWarning && !isDestructive) return null;

  const containerClass = isDestructive
    ? "bg-red-50 ring-1 ring-red-200"
    : "bg-[#FFF8E1] ring-1 ring-[#FFC107]/20";

  const textClass = isDestructive
    ? "text-red-700"
    : "text-[#FF8F00]";

  const iconBgClass = isDestructive
    ? "bg-red-100"
    : "bg-[#FFECB3]";

  return (
    <div className={`${containerClass} rounded-xl p-4 flex items-start gap-4 shadow-sm`}>
      <div className={`p-2 ${iconBgClass} rounded-sm ${textClass} mt-0.5`}>
        <Icon name="warning" className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h3 className={`text-sm font-semibold ${textClass} uppercase tracking-wide`}>
          {country === "AT" && days < 0 ? "Pickerl Nachfrist" : "TÜV fällig"}
        </h3>
        <p className={`text-sm ${textClass}/80 mt-1`}>
          Fällig bis {formatted}
          {days >= 0 ? ` (in ${Math.ceil(days)} Tagen)` : 
           country === "AT" ? ` (abgelaufen vor ${Math.abs(Math.ceil(days))} Tagen)` : ""}
        </p>
      </div>
    </div>
  );
}
