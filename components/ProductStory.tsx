const workflow = [
  {
    title: "Bring the project together",
    description:
      "Add your project documents to a workspace and give each question the context it needs.",
  },
  {
    title: "Ask in plain language",
    description:
      "Find information across your documents without starting another manual search through the plan set.",
  },
  {
    title: "Open the source and review",
    description:
      "Follow the supporting references, inspect the drawing and decide what your team should do next.",
  },
];

const capabilities = [
  {
    label: "Project questions",
    title: "Keep the answer connected to the evidence.",
    description:
      "Ask about your project documents and inspect the references behind document-supported answers. Keep project context close to the conversation.",
  },
  {
    label: "Drawing review",
    title: "Review directly on the drawing.",
    description:
      "Open a sheet, add notes and callouts, and use calibrated measurements to support your review in the same workspace.",
  },
  {
    label: "Takeoff",
    title: "Start with a known scale.",
    description:
      "Calibrate a sheet and measure lengths and areas against the drawing. Use the source to check the result before carrying it into an estimate.",
    note: "Advanced quantity schedules, cutouts and takeoff handoff are planned.",
  },
];

const roles = [
  {
    title: "Project engineers",
    description:
      "Find the relevant detail, inspect its source and leave a clear note on the drawing for the next review.",
  },
  {
    title: "Estimators and quantity surveyors",
    description:
      "Check drawing information and calibrated measurements while keeping the source close to your estimating decisions.",
  },
  {
    title: "Project managers",
    description:
      "Bring documents, project questions and team discussions into one workspace with shared project context.",
  },
];

const principles = [
  {
    title: "Inspect the source",
    description:
      "Use document references to check the evidence behind an answer, including the relevant sheet and revision.",
  },
  {
    title: "Control project access",
    description:
      "Organize work through project membership and owner/member access. Keep sensitive project information within the appropriate team.",
  },
  {
    title: "Keep professional judgment",
    description:
      "Review answers and measurements before relying on them. Stratora supports your team’s decisions alongside professional review.",
  },
];

export default function ProductStory() {
  return (
    <>
      <section id="how-it-works" className="section-shell" aria-labelledby="workflow-heading">
        <div className="section-intro">
          <p className="eyebrow">How it works</p>
          <h2 id="workflow-heading" className="section-heading">From a project question to the source.</h2>
          <p className="muted">A straightforward way to find information and review it in context.</p>
        </div>
        <ol className="workflow-list">
          {workflow.map((step, index) => (
            <li className="story-card" key={step.title}>
              <span className="eyebrow" aria-hidden="true">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p className="muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="features" className="section-shell" aria-labelledby="features-heading">
        <div className="section-intro">
          <p className="eyebrow">One project workspace</p>
          <h2 id="features-heading" className="section-heading">Documents, answers and drawings. Together.</h2>
          <p className="muted">Move between the question and the drawing without losing the project context.</p>
        </div>
        <div className="story-grid">
          {capabilities.map((capability) => (
            <article className="story-card" key={capability.label}>
              <p className="eyebrow">{capability.label}</p>
              <h3>{capability.title}</h3>
              <p className="muted">{capability.description}</p>
              {capability.note && <p className="capability-note">{capability.note}</p>}
            </article>
          ))}
        </div>
      </section>

      <section id="roles" className="section-shell" aria-labelledby="roles-heading">
        <div className="section-intro">
          <p className="eyebrow">Built around the work</p>
          <h2 id="roles-heading" className="section-heading">Different responsibilities. The same project context.</h2>
        </div>
        <div className="story-grid">
          {roles.map((role) => (
            <article className="story-card" key={role.title}>
              <h3>{role.title}</h3>
              <p className="muted">{role.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="security" className="section-shell" aria-labelledby="trust-heading">
        <div className="section-intro">
          <p className="eyebrow">Work with confidence</p>
          <h2 id="trust-heading" className="section-heading">Evidence first. Your team stays in control.</h2>
          <p className="muted">Clear references and considered access help your team review information responsibly.</p>
        </div>
        <div className="story-grid">
          {principles.map((principle) => (
            <article className="story-card" key={principle.title}>
              <h3>{principle.title}</h3>
              <p className="muted">{principle.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
