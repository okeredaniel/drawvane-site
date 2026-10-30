import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Adapt from "@/components/Adapt";

export const metadata: Metadata = {
  title: "ADAPT · Guided adoption | Stratora",
  description:
    "ADAPT is Stratora's adoption program for introducing AI into drawing, document and project-review workflows, starting with one project and one practical workflow.",
};

export default function AdaptPage() {
  return (
    <main className="pt-[66px]">
      <Adapt />
      <Footer />
    </main>
  );
}