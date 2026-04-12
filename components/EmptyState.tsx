import Link from "next/link";

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
  const isHero = variant === "hero";
  return (
    <div
      className={`text-center bg-white rounded-xl border border-gray-200 px-4 ${isHero ? "py-20" : "py-10"}`}
    >
      <div className={`${isHero ? "text-5xl mb-4" : "text-4xl mb-3"}`} aria-hidden>
        {icon}
      </div>
      <h3
        className={`font-semibold text-gray-700 ${isHero ? "text-xl mb-2" : "text-base mb-1"}`}
      >
        {title}
      </h3>
      {description && (
        <p
          className={`text-sm text-gray-500 max-w-sm mx-auto ${isHero ? "mb-6" : "mb-4"}`}
        >
          {description}
        </p>
      )}
      {action &&
        (action.href ? (
          <Link
            href={action.href}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block text-sm"
          >
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            {action.label}
          </button>
        ))}
    </div>
  );
}
