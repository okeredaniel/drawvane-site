import Link from "next/link";

export type LegalSection = {
  id: string;
  title: string;
  body: (string | string[])[];
};

type Props = {
  title: string;
  updated: string;
  intro: string;
  summary: string[];
  sections: LegalSection[];
  other: { href: string; label: string };
};

function Contents({ sections }: { sections: LegalSection[] }) {
  return (
    <ol className="space-y-2.5 text-[15px]">
      {sections.map((s, i) => (
        <li key={s.id} className="flex gap-3">
          <span className="w-5 shrink-0 text-neutral-400 tabular-nums">{i + 1}</span>
          <a
            href={`#${s.id}`}
            className="text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:text-neutral-900 focus-visible:outline-none focus-visible:underline"
          >
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function LegalPage({ title, updated, intro, summary, sections, other }: Props) {
  return (
    <main className="bg-background px-6 pb-[120px] pt-32 md:px-24 md:pb-[160px] md:pt-44">
      <div className="mx-auto max-w-[1100px]">
        <Link
          href="/"
          className="text-[15px] text-neutral-500 transition-colors hover:text-neutral-900"
        >
          Back to home
        </Link>

        <header className="mt-8 max-w-[760px]">
          <h1 className="text-[clamp(2.5rem,4.5vw,3.75rem)] font-medium leading-[1.03] tracking-[-0.04em] text-neutral-900">
            {title}
          </h1>
          <p className="mt-4 text-[15px] text-neutral-500">Last updated {updated}</p>
          <p className="mt-8 text-lg leading-relaxed text-neutral-600">{intro}</p>
        </header>

        <div className="mt-8 max-w-[760px] rounded-[22px] border border-neutral-200 bg-neutral-50 p-6 md:p-7">
          <p className="flex items-center gap-2 text-sm font-medium text-neutral-900">
            <span className="size-1.5 rounded-full bg-accent" />
            In short
          </p>
          <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-neutral-600">
            {summary.map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-[9px] size-1 shrink-0 rounded-full bg-neutral-400" />
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-neutral-500">
            This summary is for convenience. The full text below is what applies.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20">
          <aside>
            <details className="rounded-2xl border border-neutral-200 bg-white px-5 py-4 lg:hidden">
              <summary className="cursor-pointer text-[15px] font-medium text-neutral-900">
                On this page
              </summary>
              <div className="mt-4">
                <Contents sections={sections} />
              </div>
            </details>
            <nav aria-label="On this page" className="sticky top-28 hidden lg:block">
              <p className="mb-4 text-sm font-medium text-neutral-900">On this page</p>
              <Contents sections={sections} />
            </nav>
          </aside>

          <div className="max-w-[720px]">
            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                aria-labelledby={`${s.id}-h`}
                className="scroll-mt-28 border-t border-neutral-200 py-10 first:border-t-0 first:pt-0"
              >
                <h2
                  id={`${s.id}-h`}
                  className="text-[26px] font-medium leading-tight tracking-[-0.03em] text-neutral-900"
                >
                  <span className="mr-3 text-neutral-400 tabular-nums">{i + 1}.</span>
                  {s.title}
                </h2>
                <div className="mt-5 space-y-4 text-base leading-[1.75] text-neutral-600">
                  {s.body.map((block, bi) =>
                    typeof block === "string" ? (
                      <p key={bi}>{block}</p>
                    ) : (
                      <ul key={bi} className="space-y-2 pl-5">
                        {block.map((item) => (
                          <li key={item} className="list-disc marker:text-neutral-400">
                            {item}
                          </li>
                        ))}
                      </ul>
                    ),
                  )}
                </div>
              </section>
            ))}

            <div className="mt-6 border-t border-neutral-200 pt-8">
              <Link
                href={other.href}
                className="text-[15px] font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-accent"
              >
                {other.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
