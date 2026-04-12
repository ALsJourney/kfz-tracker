import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KFZ-Tracker",
  description: "Fahrzeugprobleme, Teile und Kosten tracken",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 font-[var(--font-geist)]">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-700 hover:text-blue-800">
              <span>🚗</span>
              <span>KFZ-Tracker</span>
            </Link>
            <Link
              href="/fahrzeuge/neu"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + Fahrzeug hinzufügen
            </Link>
          </div>
        </header>
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="text-center text-sm text-gray-400 py-6 mt-8 border-t border-gray-100">
          KFZ-Tracker — Open Source für den deutschsprachigen Raum
        </footer>
      </body>
    </html>
  );
}
