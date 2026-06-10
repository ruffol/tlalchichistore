import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProgressBar } from "@/components/ProgressBar";
import { AmbientSound } from "@/components/AmbientSound";
import { ScrollFallback } from "@/components/ScrollFallback";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tlalchichi777 — Artesanías colimenses auténticas",
  description:
    "Artesanías colimenses auténticas. Descubre la historia detrás de cada pieza.",
  openGraph: {
    title: "Tlalchichi777 — Artesanías colimenses auténticas",
    description:
      "Artesanías colimenses auténticas. Descubre la historia detrás de cada pieza.",
    type: "website",
    locale: "es_MX",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-[var(--color-parchment)] text-[var(--color-ink)] antialiased">
        <ProgressBar />
        <Nav />
        <main><Providers>{children}</Providers></main>
        <Footer />
        <AmbientSound />
        <ScrollFallback />
      </body>
    </html>
  );
}
