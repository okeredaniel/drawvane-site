import { notFound, redirect } from "next/navigation";

const KNOWN_SLUGS = new Set([
  "how-northway-aligned-three-product-teams",
  "northway",
  "how-neurova-reduced-planning-revisions",
  "neurova",
  "how-menlo-streamlined-regional-triage",
  "menlo",
]);

export function generateStaticParams() {
  return [
    { slug: "how-northway-aligned-three-product-teams" },
    { slug: "northway" },
    { slug: "how-neurova-reduced-planning-revisions" },
    { slug: "neurova" },
    { slug: "how-menlo-streamlined-regional-triage" },
    { slug: "menlo" },
  ];
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!KNOWN_SLUGS.has(slug)) {
    notFound();
  }

  if (slug === "northway" || slug === "how-northway-aligned-three-product-teams") {
    redirect("/case-studies/northway");
  }

  if (slug === "neurova" || slug === "how-neurova-reduced-planning-revisions") {
    redirect("/case-studies/neurova");
  }

  if (slug === "menlo" || slug === "how-menlo-streamlined-regional-triage") {
    redirect("/case-studies/menlo");
  }

  return null;
}
