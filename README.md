# Stratora landing page

Next.js landing page for Stratora, adapted from the Drawvane template.

## Run and verify

```sh
npm ci
npm run dev
npm run build
```

The site uses the Next.js App Router. Read `AGENTS.md` and the installed Next.js documentation before changing framework code.

## Content and interactions

- The homepage presents Stratora's document and drawing-review workspace.
- The interactive sample uses fictional documents and prepared answers. It is not connected to live project data or an analysis service. The search filters sample questions; source buttons reveal their supporting excerpts.
- Contact opens an email to the existing published address, `info@stratora.ai`. There is no lead-submission API or claim that a message has been delivered. The visible address is a fallback for visitors without a configured email app.
- Workspace links point to `https://app.stratora.ai/auth/login`.
- Privacy links to the existing `https://www.stratora.ai/privacy-policy.html`.
- Advanced takeoff work is described as planned. Do not publish unverified customer, benchmark, security-audit or integration claims.
- The original large presentation video and placeholder customer/results sections are no longer imported by the homepage. Original media remain in repository history.

## Original-version backup

Before this update, the original repository revision was preserved remotely:

- Branch: `backup/pre-stratora-update-2026-10-27`
- Commit: `42b7c052a29be04713ec551552583fdec5d12428`

Restore through a reviewed revert or a new commit based on the backup. Do not force-push over newer work.

## Release checks

Verify both themes and desktop/mobile layouts, all three sample answers, each source excerpt, no-match search and recovery, mobile navigation and Escape, FAQ keyboard interaction, and contact/workspace/privacy destinations. Check that no placeholder claims or missing media are rendered. A successful build alone does not establish these interactions or email delivery.

The current canonical URL is `https://startorav2.vercel.app`. Update metadata when a production custom domain is assigned.
