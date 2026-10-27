"use client";

import { useRef, useState } from "react";

const EXAMPLES = [
  {
    id: "rating", label: "Check a requirement", question: "What is the corridor wall fire rating?",
    answer: "The sample specification calls for a 60-minute fire-resistance rating for corridor partitions. Check the referenced wall types and details before applying this requirement.",
    source: "Interior partitions", location: "Sample specification · Section 09 21 16 · §2.3", revision: "Rev B",
    excerpt: "2.3 CORRIDOR PARTITIONS\nProvide corridor partitions with a minimum fire-resistance rating of 60 minutes. Refer to the wall types and associated details on drawing A-102.",
    note: "This excerpt establishes a requirement. It does not verify that a design or installation complies.",
  },
  {
    id: "revision", label: "Find the revision", question: "Which revision of the floor plan is listed?",
    answer: "The sample drawing register lists A-102, Level 1 plan, at revision C. Confirm the current issue with the project document controller before using it for construction.",
    source: "Drawing register", location: "Sample register · Architectural drawings · A-102", revision: "Rev C",
    excerpt: "DRAWING REGISTER\nA-102 | Level 1 plan | Revision C\nIssue purpose: Coordination\nSupersedes: Revision B\n\nCoordination issue only. Not issued for construction.",
    note: "A register entry identifies a revision. It is not proof that the drawing is approved for construction.",
  },
  {
    id: "missing", label: "See a missing source", question: "What is the approved concrete mix?",
    answer: "The sample set does not include an approved concrete mix submission. There is not enough information here to confirm the mix. Request the approved submission from the project team.",
    source: "Sample document inventory", location: "Sample project · Available documents", revision: "Sample set",
    excerpt: "DOCUMENTS IN THIS SAMPLE\n• Interior partitions specification\n• Architectural drawing register\n\nNo concrete mix submission is included.",
    note: "Missing evidence should remain an open question. Do not substitute a typical value for project approval.",
  },
];

export default function SampleWorkspace() {
  const [selected, setSelected] = useState(0);
  const [query, setQuery] = useState("");
  const [sourceOpen, setSourceOpen] = useState(false);
  const sourceHeading = useRef<HTMLHeadingElement>(null);
  const example = EXAMPLES[selected];
  const matches = EXAMPLES.map((item,index) => ({item,index})).filter(({item}) => `${item.label} ${item.question}`.toLowerCase().includes(query.trim().toLowerCase()));

  function showSource() {
    setSourceOpen(true);
    requestAnimationFrame(() => sourceHeading.current?.focus({preventScroll: true}));
  }

  return (
    <section id="demo" className="section-shell demo-section" aria-labelledby="demo-title">
      <div className="section-intro demo-intro">
        <div><p className="eyebrow">See the connection</p><h2 id="demo-title" className="section-heading">An answer is a starting point.<br /><span>The source is how you check it.</span></h2></div>
        <p className="muted">Choose a question and open its reference. This guided example uses fictional documents and prepared answers, with no live analysis or uploads.</p>
      </div>
      <div className="workspace-demo">
        <div className="workspace-topbar"><span className="workspace-project"><span className="project-icon" aria-hidden="true">▧</span> Riverside House <span className="project-breadcrumb">/ Project knowledge</span></span><span className="sample-badge">Illustrative sample</span></div>
        <div className="workspace-search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg><label className="sr-only" htmlFor="sample-search">Search sample questions</label><input id="sample-search" type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search a sample question" aria-describedby="sample-help" autoComplete="off"/><span className="search-label" aria-hidden="true">Ask Stratora</span></div>
        <div className="workspace-grid">
          <aside className="question-sidebar" aria-label="Sample questions"><p id="sample-help" className="sidebar-label">Choose a question</p><div className="sample-options">{matches.map(({item,index})=><button type="button" key={item.id} className={`sample-option ${selected===index ? "selected" : ""}`} aria-pressed={selected===index} onClick={()=>{setSelected(index);setSourceOpen(false);}}><span className="option-number" aria-hidden="true">0{index+1}</span><span>{item.label}</span><span aria-hidden="true">↗</span></button>)}</div>{matches.length===0&&<p role="status" className="empty-search">No sample matches. Try “rating”, “revision” or “concrete”. <button type="button" onClick={()=>setQuery("")}>Show all questions</button></p>}<div className="sample-scope"><span className="status-dot"/><p>Small sample.<br />Visible evidence.<br />Your judgement.</p></div></aside>
          <div className="answer-panel" aria-live="polite" aria-atomic="true"><p className="panel-label">Project question</p><h3>{example.question}</h3><div className="answer-identity"><span className="mini-mark" aria-hidden="true">s</span><strong>Stratora</strong><span>Prepared example</span></div><p className="sample-answer">{example.answer}</p><button type="button" className="citation-button" onClick={showSource} aria-expanded={sourceOpen} aria-controls="sample-source"><span><span className="citation-index">1</span>{example.source}</span><span>View source ↗</span></button><p className="answer-footnote">Keep the reference attached to the answer.</p></div>
          <div id="sample-source" className={`source-panel ${sourceOpen ? "source-active" : ""}`}><div className="source-toolbar"><span>Source document</span><span className="revision-badge">{example.revision}</span></div>{sourceOpen?<><h3 tabIndex={-1} ref={sourceHeading}>{example.source}</h3><p className="source-location">{example.location}</p><blockquote className="source-excerpt">{example.excerpt}</blockquote><p className="source-note">{example.note}</p></>:<><div className="document-preview" aria-hidden="true"><div className="document-lines"><i/><i/><i/></div><div className="mini-plan"><span/><span/><span/><span/></div><div className="document-lines short"><i/><i/></div></div><h3>Inspect the reference</h3><p className="muted">Open the source beside the answer to read the exact sample excerpt and its context.</p><button type="button" className="text-link" onClick={showSource}>Open source <span aria-hidden="true">↗</span></button></>}</div>
        </div>
        <div className="workspace-footnote"><span>Fictional sample documents</span><span>Illustration only. Not construction guidance.</span></div>
      </div>
    </section>
  );
}
