"use client";
import { createContext, useContext } from "react";

type NavContextType = {
  activeRoute: string;
};

const NavContext = createContext<NavContextType>({ activeRoute: "/" });

export function NavProvider({
  activeRoute,
  children,
}: {
  activeRoute: string;
  children: React.ReactNode;
}) {
  return (
    <NavContext.Provider value={{ activeRoute }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  return useContext(NavContext);
}