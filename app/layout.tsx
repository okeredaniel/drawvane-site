import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";
import "./theme.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  title: "Drawvane | Document intelligence for AEC teams",
  description:
    "Ask the plan set. Get the sheet number. Cited answers from your drawings, specs and RFIs.",
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
      suppressHydrationWarning
      className={`${inter.variable} ${interTight.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if(location.hash.length>1){var d=document.documentElement;d.classList.add("hash-pending");setTimeout(function(){d.classList.remove("hash-pending")},3000)}`,
          }}
        />
      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
