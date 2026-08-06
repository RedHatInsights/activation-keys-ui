# CLAUDE.md

## Project Overview

Activation Keys UI is a Red Hat Insights micro-frontend for managing subscription activation keys, served on `console.redhat.com`. Built with React/JavaScript and loaded into the Insights Chrome shell via Webpack Module Federation (`fec` CLI).

## Common Commands

- `npm run start` — dev server with proxy (requires Red Hat VPN + proxy setup)
- `npm run build` — production build
- `npm run test` — run Jest tests
- `npm run lint` — ESLint + Stylelint
- `npm run verify` — build + lint + test (full CI check)

## Architecture & Conventions

- Functional components only, arrow functions
- PascalCase directories with `index.js` barrel exports for each component
- Types colocated with hooks/components (no central types directory)
- PatternFly v6 for UI components
- Plain JavaScript (`.js` files) — no TypeScript
- Native `fetch` + TanStack React Query v5 for data fetching; JWT auth via `useChrome()` from platform services
- React Router v6
- No Redux — React Query for server state, React Context for notifications, `useState` for UI state
- Feature flags via Unleash (`useFeatureFlag` hook wraps `@unleash/proxy-client-react`)
- Authorization via Kessel (`@project-kessel/react-kessel-access-check`) for relation-based access control
- Prefer code reuse over duplication — extract shared logic into hooks or utilities
- Prefer small, focused React components over large complex ones
- Stay in scope — do not refactor or "improve" unrelated code when working on a feature. Instead, note potential improvements for the developer as a follow-up for a future ticket

## Testing

- Jest 30 (with `jest-jasmine2` runner) + React Testing Library + jest-fetch-mock
- Tests colocated in `__tests__/` subdirectories
- BDD-style lazy vars (`def`/`get`) from `bdd-lazy-var` used in some test files
- `createQueryWrapper()` from `src/utils/testHelpers.js` for wrapping hook tests
- Global test setup in `config/setupTests.js` mocks `useChrome`, `useNavigate`, and `useInsightsNavigate`
- New features must include unit tests
- Do NOT use snapshot tests — test observable behavior and functionality (what the user sees and does), not implementation details (internal state, component structure, CSS classes). Legacy snapshot tests exist but should not be expanded
- Pre-existing test failures are a code smell — if existing tests break after your changes, investigate the unintended consequences rather than just updating the test to pass. The failing test may be revealing buggy behavior introduced by your changes

## Key Caveats

- App runs inside Red Hat Insights Chrome shell — `useChrome()` provides auth, navigation, and environment
- Local dev requires Red Hat VPN and proxy setup
- `fec.config.js` configures Webpack/Module Federation — app exposes `./RootApp` and `./CreateActivationKeyWizard`
