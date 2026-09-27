# ADHD Test Frontend

Independent Next.js application for the ADHD test funnel.

Backend repository: [CdUrna/adhd-test-backend](https://github.com/CdUrna/adhd-test-backend)

## Solution overview

The solution is split into two independent applications:

- this Next.js frontend renders the public quiz, authentication screens, and
  protected report;
- the NestJS backend owns authentication, scoring, quiz versions, attempts, and
  report snapshots in PostgreSQL.

The applications communicate over a versioned REST API under `/api/v1`.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Install dependencies with `pnpm install`.
3. Start the development server with `pnpm dev`.

Keep the backend project in the sibling `adhd-test-backend` directory and start
its PostgreSQL container. Run `pnpm quality` to execute ESLint, create a Next.js
production build, prepare the isolated backend E2E database, and verify the
complete browser funnel in Microsoft Edge. The test schema is cleared afterward;
development data is not modified. Audit screenshots are written to
`artifacts/funnel-audit`.

The browser runner owns ports `3000` and `4000`, records both process IDs, and
stops both applications during teardown. Stop manually running frontend and
backend processes before starting `pnpm quality`.

The app is available at `http://localhost:3000` and expects the API at the URL
configured through `NEXT_PUBLIC_API_URL`.

## Product rules

- Gender selection is required before the quiz starts.
- Questions and answer options come from the backend.
- Anonymous users never see the score or High/Low classification.
- The full report is available only after registration or sign-in.

## Current implementation

- Separate funnel routes: `/`, `/test`, `/auth`, and `/report`.
- Required Male/Female selection.
- Quiz loading from `GET /quiz/current`.
- Five-question navigation with required answers.
- Draft gender and answers persisted in browser storage.
- Anonymous attempt completion through the backend.
- One-time claim data stored in session storage until authentication succeeds.
- Result gate that reveals neither score nor High/Low before authentication.
- Account registration and existing-user sign-in forms.
- Claim-token forwarding and HTTP-only cookie authentication.
- Automatic authenticated-session restoration after refresh.
- Protected High/Low report with score gauge, report sections, FAQ, medical
  disclaimer, and sign out.
- Authenticated retake flow that creates a new attempt without another login.

## Source structure

- Shared UI lives in `src/components/<component-name>`.
- Repeated layout and interaction patterns use shared primitives (`PageShell`,
  `LoadingScreen`, `SurfaceCard`, and `Button`) instead of copying declarations
  into feature CSS modules.
- Feature UI lives in `src/features/<feature>/components/<component-name>`.
- Each component folder exposes its public API through `index.ts` and keeps its
  implementation, component-specific types, and scoped styles in separate
  `.tsx`, `.types.ts`, and `.module.css` files.
- Feature-level API clients and domain types remain at the feature root because
  they are shared by multiple components.
- Browser-only feature helpers live in the feature's `utils` directory.
- `src/app/globals.css` contains only theme tokens, document reset, and truly
  application-wide interaction defaults.
- Feature CSS modules contain only styles that are specific to that feature's
  markup and behavior.
