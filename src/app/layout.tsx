import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DatasetBanner } from "@/components/layout/dataset-banner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "NusaUrban Observatory — Urban Growth & Green-Space Monitoring for Indonesia",
    template: "%s | NusaUrban Observatory",
  },
  description:
    "Interactive WebGIS platform visualizing urban expansion and green-space deficits in Jakarta and Bandung (2017–2025) using Sentinel-2 satellite imagery, Random Forest classification, and Google Earth Engine.",
  keywords: [
    "urban growth", "green space", "RTH", "Jakarta", "Bandung", "Indonesia",
    "WebGIS", "Sentinel-2", "remote sensing", "land cover", "GEE",
  ],
  authors: [
    { name: "Zakiul Fahmi Jailani" },
    { name: "Shidiq Al-Hakim" },
    { name: "Ferrell Ananda Darmawan" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "NusaUrban Observatory",
    title: "NusaUrban Observatory — Urban Growth & Green-Space Monitoring",
    description:
      "Explore urban expansion and green-space trends in Indonesian cities through interactive maps and data.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NusaUrban Observatory",
    description: "Urban Growth & Green-Space Monitoring for Indonesia",
  },
  robots: process.env.NEXT_PUBLIC_DATASET_VALIDATED === "true"
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <DatasetBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
