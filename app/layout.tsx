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
      suppressHydrationWarning
      className={`${inter.variable} ${interTight.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme") === "light") document.documentElement.dataset.theme = "light";}catch(e){}`,
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
