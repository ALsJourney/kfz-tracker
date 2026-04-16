"use client";

import { usePathname } from "next/navigation";
import { NavProvider } from "@/components/NavContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return <NavProvider activeRoute={pathname}>{children}</NavProvider>;
}