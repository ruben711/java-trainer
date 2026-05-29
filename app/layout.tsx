import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Press_Start_2P } from "next/font/google";
import "@/styles/globals.css";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import ModeProvider from "@/components/ModeProvider";
import SiteHeader from "@/components/SiteHeader";
import ActivityRail from "@/components/ActivityRail";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Java Trainer — oefen Java, kopje per kopje",
  description:
    "Interactief oefenplatform voor Java: een mini-IDE in je browser, XP, badges en een leaderboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="nl"
      className={`${sans.variable} ${mono.variable} ${pixel.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex h-screen flex-col overflow-hidden bg-bg">
        <ModeProvider>
          <SiteHeader />
          <div className="flex min-h-0 flex-1">
            <ActivityRail />
            <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
          </div>
          <Footer />
          <CommandPalette />
        </ModeProvider>
      </body>
    </html>
  );
}
