import { EmptyState } from "@/components/EmptyState";

export default function TerminePage() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h2 className="text-[2.75rem] font-bold text-on-surface font-geist tracking-tight leading-none mb-2">
            Termine
          </h2>
          <p className="text-on-surface-variant text-base font-geist">
            Terminverwaltung und Erinnerungen.
          </p>
        </div>
      </div>
      <EmptyState
        icon="calendar_today"
        title="Termine — Coming Soon"
        description="Die Terminverwaltung wird in einem kommenden Update verfügbar sein. Prüfen Sie actualmente die TÜV-Hinweise auf der Fahrzeugdetailseite."
      />
    </div>
  );
}
