import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";

import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stratora",
  description: "The Construction Intelligence Layer. Connect drawings, documents, quantities and project conversations with Stratora.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased">
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}