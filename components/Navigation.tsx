"use client";

import Link from "next/link";
import { useNav } from "@/components/NavContext";
import { Icon } from "@/components/Icon";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/fahrzeuge", label: "Fahrzeuge", icon: "directions_car" },
  { href: "/kosten", label: "Kosten", icon: "payments" },
  { href: "/termine", label: "Termine", icon: "calendar_today" },
  { href: "/settings", label: "Einstellungen", icon: "settings" },
] as const;

function isActive(activeRoute: string, href: string) {
  if (href === "/") return activeRoute === "/";
  return activeRoute.startsWith(href);
}

export function SideNavBar() {
  const { activeRoute } = useNav();

  return (
    <nav className="bg-surface-container-low hidden md:flex flex-col h-screen w-64 p-4 shrink-0 z-40 fixed left-0 top-0 cloud-shadow">
      <div className="mb-8 px-2">
        <h1 className="text-lg font-bold text-primary font-geist tracking-tight">
          KFZ-Tracker
        </h1>
        <p className="font-geist text-xs font-medium text-on-surface-variant opacity-70">
          Präzisions-Navigator
        </p>
      </div>
      <div className="flex flex-col gap-2 flex-grow">
        {NAV_ITEMS.map((item) => {
          const active = isActive(activeRoute, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${
                active
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
              } rounded-lg p-3 flex items-center gap-3 font-geist text-sm font-medium transition-transform hover:translate-x-1`}
            >
              <Icon 
                name={item.icon} 
                className="text-[20px]"
                filled={active}
              />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function BottomNavBar() {
  const { activeRoute } = useNav();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest/90 backdrop-blur-md z-40 flex justify-around items-center p-3 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
      {NAV_ITEMS.map((item) => {
        const active = isActive(activeRoute, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${
              active ? "text-primary" : "text-on-surface-variant hover:text-primary"
            } active:scale-95 transition-transform p-2`}
          >
            <Icon 
              name={item.icon} 
              className="text-[24px]"
              filled={active}
            />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function TopNavBar() {
  return (
    <header className="md:hidden bg-surface-container-lowest/85 backdrop-blur-xl w-full z-30 sticky top-0 cloud-shadow">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="text-xl font-bold tracking-tight text-primary font-geist">
          <Icon name="directions_car" className="text-xl mr-2" />
          KFZ-Tracker
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-surface py-8 mt-auto">
      <div className="w-full flex flex-col items-center gap-4 text-center px-4">
        <div className="flex gap-6">
          <a className="text-on-surface-variant hover:text-primary text-[10px] uppercase tracking-wider font-semibold underline-offset-4 hover:underline transition-all opacity-80 hover:opacity-100">
            Impressum
          </a>
          <a className="text-on-surface-variant hover:text-primary text-[10px] uppercase tracking-wider font-semibold underline-offset-4 hover:underline transition-all opacity-80 hover:opacity-100">
            Datenschutz
          </a>
        </div>
        <p className="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant/60">
          KFZ-Tracker — Open Source für den deutschsprachigen Raum
        </p>
      </div>
    </footer>
  );
}
