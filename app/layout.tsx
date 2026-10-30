import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import Navbar from "@/components/Navbar";
import SiteMotion from "@/components/SiteMotion";
import { SITE_URL, DESCRIPTION, pageMetadata } from "@/lib/site";
import "./globals.css";
import "./theme.css";
import "./site.css";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});
export const metadata: Metadata = {
  ...pageMetadata("Construction intelligence", DESCRIPTION, "/"),
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Stratora | Construction intelligence",
    template: "%s | Stratora",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${inter.variable} ${interTight.variable}`}
    >
      <body>
        <SiteMotion>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <Navbar />
          {children}
        </SiteMotion>
      </body>
    </html>
  );
}
