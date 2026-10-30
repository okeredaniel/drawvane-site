import Link from "next/link";
export default function Contact() {
  return (
    <section className="site-section">
      <p className="eyebrow">Start with your workflow</p>
      <h2 className="section-title">Have a project in mind?</h2>
      <Link href="/contact?topic=pilot" className="button-primary mt-6">
        Discuss a pilot
      </Link>
    </section>
  );
}
