const faqs = [
  {
    question: "What can I use Stratora for today?",
    answer:
      "Use Stratora to organize project documents, ask questions with project context, inspect supporting references and review drawings with notes, callouts and calibrated measurements. Advanced takeoff schedules and additional workflows are planned.",
  },
  {
    question: "Does it replace our design software?",
    answer:
      "Stratora is a project information and drawing-review workspace. Continue using your design and authoring tools to create the original files, then upload the documents you want to review in Stratora. A live integration with your existing document-control system must be confirmed separately.",
  },
  {
    question: "Can I try it with a real project?",
    answer:
      "Request a project walkthrough. Bring a representative drawing or document set and the questions your team needs to answer. We can agree the supported files and scope before you start; onboarding time depends on that scope.",
  },
  {
    question: "How should I check an answer or measurement?",
    answer:
      "Open the supporting reference and compare it with the relevant sheet, revision or specification. Confirm the drawing scale before measuring. If the evidence is incomplete or unclear, verify it with your project team before making a decision.",
  },
  {
    question: "Where do uploaded documents go?",
    answer:
      "Uploaded documents are added to your Stratora project workspace. Discuss storage location, retention and any contractual data requirements with the team before sharing confidential project files.",
  },
  {
    question: "Can my project team use the workspace?",
    answer:
      "Projects support members and owner/member access, alongside project discussions. Live simultaneous editing of the same drawing is not currently offered. We can walk through the collaboration workflow your team needs.",
  },
  {
    question: "How do I find the right plan?",
    answer:
      "Contact the team for current plan details and the scope of a pilot. Describe your team size, project documents and intended workflows so you can confirm the offer before committing.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="section-shell" aria-labelledby="faq-heading">
      <div className="section-intro">
        <p className="eyebrow">Questions, answered</p>
        <h2 id="faq-heading" className="section-heading">Before you bring your first project.</h2>
        <p className="muted">What Stratora does, how to review the results and where to start.</p>
      </div>
      <div className="faq-list">
        {faqs.map((faq) => (
          <details className="faq-item" key={faq.question}>
            <summary>{faq.question}</summary>
            <p className="muted faq-answer">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
