import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });
const description = "Bring project documents, cited answers and drawing review into one workspace. Explore Stratora through a guided sample and inspect the source behind each answer.";

export const metadata: Metadata = {
  metadataBase: new URL("https://startorav2.vercel.app"),
  title: "Stratora | Construction intelligence, in context",
  description,
  alternates: { canonical: "/" },
  icons: { icon: "/icon.svg" },
  openGraph: { title: "Stratora | Your project documents. Answers you can check.", description, url: "/", siteName: "Stratora", type: "website", locale: "en_GB" },
  twitter: { card: "summary_large_image", title: "Stratora | Construction intelligence", description },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning className={`${inter.variable} ${interTight.variable}`}><head><script dangerouslySetInnerHTML={{__html:'try{document.documentElement.dataset.theme=localStorage.getItem("theme")==="dark"?"dark":"light"}catch(e){}'}}/></head><body><a className="skip-link" href="#main-content">Skip to content</a><Navbar />{children}</body></html>;
}
