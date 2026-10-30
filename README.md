# Stratora marketing site

Next.js marketing website for Stratora. Prepared drawing examples are illustrative, not live product output or professional advice.

## Local verification

Use Node.js 22.12 or later (this candidate was checked with Node.js 24.22.1).

```sh
npm ci
npm run lint
npx tsc --noEmit
npm test
npm run test:components
npm run build
npm run dev
```

The API tests mock the delivery service. The component tests use jsdom. Neither proves inbox delivery, visual layout or real-browser accessibility.

## Contact delivery

The form retains the enquiry after success or failure. It reports acceptance only after the configured delivery service returns a receipt. Acceptance does not mean a booking is confirmed or an email reached the inbox.

Configure these server-side environment variables through the approved deployment controls:

- `RESEND_API_KEY`: scoped delivery-service credential.
- `CONTACT_FROM`: a verified plain sender email address.
- `CONTACT_TO`: the approved plain recipient email address.

No addresses or credentials are supplied by this repository. Do not put these values in public environment variables or source control. The contact page checks configuration during its build, so rebuild after configuring or changing delivery availability. Missing configuration disables Send and leaves Copy enquiry available; the API also refuses unconfigured requests.

The endpoint validates input, checks the browser Origin, bounds the request body, uses a honeypot, and supplies a deterministic provider idempotency key for identical retries. These measures are not a distributed anti-abuse system. Confirm suitable hosting rate controls and delivery quotas before enabling a public endpoint. Confirm recipient ownership, provider terms, and a real end-to-end delivery test before launch. Do not send test email without authorization.

## Public domain and metadata

`NEXT_PUBLIC_SITE_URL` controls canonical URLs, sitemap URLs and metadata base. Its default is the currently identified deployment, `https://startorav2.vercel.app`. A GitHub repository rename does not itself establish a new production domain. Change this value only after the destination is verified.

## Content and design

The site includes Home, ADAPT, Contact, Pricing, Privacy and Terms. Pricing requires a written proposal. Security statements request supporting evidence rather than asserting unverified certifications. Website notices cover this website only and require the business owner's factual review before publication; they do not establish product data or contractual terms.

Motion follows the operating-system preference and has a shared pause control. Drawing illustrations live in `public/illustrations`. ADAPT introduces the scoped adoption program. Its dedicated enquiry topic does not establish pilot availability or an agreed engagement.

See `docs/audit-fixes-2026-10-30.md` for this candidate's scope, validation and remaining release gates.
