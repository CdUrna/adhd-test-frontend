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

## Prerequisites

- Node.js 24+
- pnpm 11+
- Docker
- the backend cloned as the sibling directory `../adhd-test-backend`

## Local setup

Prepare and start the backend first:

```powershell
cd ../adhd-test-backend
Copy-Item .env.example .env
pnpm install --frozen-lockfile
docker compose up -d
pnpm prisma:generate
pnpm prisma:deploy
pnpm prisma:seed
pnpm start:dev
```

Then open a second terminal and start the frontend:

```powershell
cd ../adhd-test-frontend
Copy-Item .env.example .env.local
pnpm install --frozen-lockfile
pnpm dev
```

The frontend is available at `http://localhost:3000` and expects the API at the
URL configured through `NEXT_PUBLIC_API_URL`. The default backend URL is
`http://localhost:4000/api/v1`.

## Quality checks

Install the Playwright-managed browser once:

```powershell
pnpm exec playwright install chromium
```

With the backend PostgreSQL container running, stop manually started frontend
and backend processes and run:

```powershell
pnpm quality
```

The command executes ESLint, creates a frontend production build, generates the
backend Prisma Client, creates a fresh backend production build, prepares the
isolated E2E database, and verifies the complete browser funnel in Chromium. The
test schema is cleared afterward; development data is not modified. Audit
screenshots are written to `artifacts/funnel-audit`.

The browser runner owns ports `3000` and `4000`, records both process IDs, and
stops both applications during teardown. The sibling backend must have its
dependencies installed, but it does not need to be built or started beforehand.

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
