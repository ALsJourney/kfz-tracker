import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { SideNavBar, BottomNavBar, TopNavBar, Footer } from "@/components/Navigation";

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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface min-h-screen flex flex-col md:flex-row antialiased">
        <ClientLayout>
          <SideNavBar />
          <div className="flex-grow flex flex-col min-w-0 md:ml-64 overflow-x-hidden">
            <TopNavBar />
            <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full pb-24 md:pb-8">
              {children}
            </main>
            <Footer />
          </div>
          <BottomNavBar />
        </ClientLayout>
      </body>
    </html>
  );
}