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

## Design decisions and trade-offs

The implementation intentionally favors explicit boundaries and a complete,
reviewable product flow over introducing infrastructure that is not required by
the test task.

| Decision | Why it was chosen | Advantages | Trade-offs |
| --- | --- | --- | --- |
| Fetch the quiz in the `/test` Server Component and pass it to the interactive `TestView` | The question set is server-owned, but answering and navigation require browser state. | The first render already contains quiz data, while the client boundary stays focused on interaction. | `TestView` still needs client-side JavaScript, and SSR does not remove the need to handle API failures. |
| Use separate routes for landing, quiz, authentication, and report | These are distinct funnel states with different access rules and layouts. | URLs are refreshable and understandable, and every step can evolve independently. | State that crosses routes must be persisted explicitly instead of remaining in one component tree. |
| Store the quiz draft in `localStorage` | An accidental refresh should not erase answers to a public quiz. | Simple recovery without creating an anonymous server session for every visitor. | The draft is device- and browser-specific, can become stale, and must never contain trusted scoring data. |
| Store the pending anonymous attempt in `sessionStorage` | Registration and sign-in need the short-lived claim result after route navigation, but it should not survive indefinitely. | The value is scoped to the current tab session and is cleared after a successful claim. | It is readable by client-side JavaScript, so XSS protection remains important; a production system could keep this transition in a server-side session. |
| Let the backend provide questions and answer options | Quiz versions and scoring rules must have one source of truth. | The UI can render a new published quiz without a frontend release, and the client cannot define scoring points. | The quiz depends on API availability and the frontend still needs a stable response contract. |
| Use an HTTP-only authentication cookie | The browser should send authentication automatically without exposing the JWT to application JavaScript. | Reduces token theft through client code and supports session restoration after refresh. | Cross-site deployment requires careful `SameSite`, HTTPS, CORS, and CSRF configuration. |
| Keep styles in component-scoped CSS Modules and extract repeated UI primitives | The design has reusable patterns, while feature components still need local ownership of their layout. | Avoids selector collisions, limits global CSS, and makes component changes easier to review. | Shared primitives require judgment: extracting every small variation would add indirection instead of reducing duplication. |
| Keep High/Low and the numeric score hidden until authentication | This is a product requirement and prevents deriving the gated result from the browser payload. | The access rule is enforced by the API rather than by hiding already-delivered UI data. | Anonymous users must complete an additional account step before receiving any result. |

Alternatives such as a global client state library, a monorepo orchestrator, and
a server-side anonymous session were considered unnecessary for this scope. They
would be reasonable when the funnel grows across more pages, teams, or devices.

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
