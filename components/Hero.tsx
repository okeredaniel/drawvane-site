import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero section-shell" id="home" aria-labelledby="hero-title">
      <p className="eyebrow"><span className="status-dot" /> Construction intelligence, in context</p>
      <h1 id="hero-title">Your project documents.<br /><span>Answers you can check.</span></h1>
      <p className="hero-description">Bring drawings, specifications and project questions into one workspace. Find the information you need and inspect the source before acting.</p>
      <div className="hero-actions">
        <a className="button button-primary" href="#demo">Explore the sample <span aria-hidden="true">↗</span></a>
        <a className="button button-secondary" href="#contact">Talk to Stratora <span aria-hidden="true">→</span></a>
      </div>
      <p className="hero-caption">For engineers, estimators and the teams delivering the project.</p>
      <div className="drawing-ribbon" aria-hidden="true">
        <div className="drawing-card drawing-one"><Image src="/blueprints/plan-1.avif" alt="" width={600} height={400} priority sizes="(max-width: 600px) 200px, 380px" /></div>
        <div className="drawing-card drawing-two"><Image src="/blueprints/plan-2.avif" alt="" width={600} height={400} sizes="(max-width: 600px) 200px, 380px" /></div>
        <div className="drawing-card drawing-three"><Image src="/blueprints/plan-6.avif" alt="" width={600} height={400} sizes="(max-width: 600px) 200px, 380px" /></div>
        <div className="drawing-label"><span className="status-dot" /> From a question to its source.</div>
      </div>
    </section>
  );
}
