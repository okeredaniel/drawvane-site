// Contact details and account entry are published on stratora.ai/contact-us.html.
// Keep this a direct email action until an owned submission service is available.
const CONTACT_EMAIL = "info@stratora.ai";
const WORKSPACE_URL = "https://app.stratora.ai/auth/login";

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="section-shell contact-section"
    >
      <div className="contact-layout">
        <div>
          <p className="eyebrow">Your next project</p>
          <h2 id="contact-heading" className="section-heading">
            Let’s talk about how your team works.
          </h2>
          <p className="muted mt-6 max-w-xl text-lg leading-relaxed">
            Tell us what slows your project down, from finding the right drawing
            to keeping decisions connected. We can discuss where Stratora fits.
          </p>
        </div>

        <div className="contact-card">
          <h3 className="text-2xl font-semibold tracking-tight">Talk to Stratora</h3>
          <p className="muted mt-4 leading-relaxed">
            Share your role, the kind of projects you work on, and the workflow
            you want to improve.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Stratora%20project%20enquiry`}
            className="button button-primary mt-7"
          >
            Email Stratora
            <span aria-hidden="true">↗</span>
          </a>
          <p className="muted mt-4 text-sm leading-relaxed">
            Opens your email app. You choose what to send.
          </p>
          <p className="muted mt-2 text-sm leading-relaxed">
            Or write to{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>

          <div className="mt-8 border-t border-white/15 pt-6">
            <p className="muted mb-4 text-sm">Already have an account?</p>
            <a href={WORKSPACE_URL} className="button button-secondary">
              Open your workspace
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
