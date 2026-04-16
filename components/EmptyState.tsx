import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/Icon";

const ICON_MAP: Record<string, string> = {
  build: "build",
  directions_car: "directions_car",
  payments: "payments",
  calendar_today: "calendar_today",
  inventory_2: "inventory_2",
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "default",
}: {
  icon: string;
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  variant?: "default" | "hero";
}) {
  const iconName = ICON_MAP[icon] || "build";
  const isHero = variant === "hero";
  return (
    <div className="bg-surface-container-lowest rounded-xl cloud-shadow ghost-border">
      <div className={`text-center ${isHero ? "py-20" : "py-10"} p-6`}>
        <Icon
          name={iconName}
          className={`text-on-surface-variant/30 ${isHero ? "text-5xl mb-4" : "text-4xl mb-3"} block`}
          weight={200}
        />
        <h3 className={`font-semibold text-on-surface font-geist ${isHero ? "text-xl mb-2" : "text-base mb-1"}`}>
          {title}
        </h3>
        {description && (
          <p className={`text-sm text-on-surface-variant max-w-sm mx-auto ${isHero ? "mb-6" : "mb-4"}`}>
            {description}
          </p>
        )}
        {action &&
          (action.href ? (
            <Link href={action.href}>
              <Button size={isHero ? "lg" : "default"} className="bg-gradient-to-b from-primary/90 to-primary shadow-sm">
                {action.label}
              </Button>
            </Link>
          ) : (
            <Button onClick={action.onClick} size={isHero ? "lg" : "default"} className="bg-gradient-to-b from-primary/90 to-primary shadow-sm">
              {action.label}
            </Button>
          ))}
      </div>
    </div>
  );
}
