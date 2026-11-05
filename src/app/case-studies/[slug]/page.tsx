import { notFound, redirect } from "next/navigation";
import JournalArticle from "@/components/sections/JournalArticle";
import { WORKFLOWS } from "@/lib/workflows";

const LEGACY: Record<string, string> = {
  "how-northway-aligned-three-product-teams": "drawing-review",
  "how-neurova-reduced-planning-revisions": "quantity-takeoff",
  "how-menlo-streamlined-regional-triage": "project-answers",
};
export function generateStaticParams() {
  return [...Object.keys(WORKFLOWS), ...Object.keys(LEGACY)].map(slug => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const workflow = Object.prototype.hasOwnProperty.call(WORKFLOWS, slug) ? WORKFLOWS[slug] : null;
  return { title: workflow ? `${workflow.title} | Stratora` : "Use cases | Stratora" };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (Object.prototype.hasOwnProperty.call(LEGACY, slug)) redirect(`/case-studies/${LEGACY[slug]}`);
  if (!Object.prototype.hasOwnProperty.call(WORKFLOWS, slug)) notFound();
  return <JournalArticle article={WORKFLOWS[slug]} />;
}
