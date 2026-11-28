# Grammy

A personal, offline iPhone app (in Polish) for learning English grammar. One learner, no server, no accounts.

## Stack

- **Language / Runtime**: TypeScript (`strict`, `noUncheckedIndexedAccess`), Node 24.3+ (24 line)
- **Framework**: Expo SDK 58, React Native 0.88, React 19, Expo Router (typed routes), React Compiler on
- **Key dependencies**: `expo-router`, `react-native-safe-area-context`, `expo-sqlite/kv-store` (progress, when feature 8 lands), `jest-expo` + React Native Testing Library
- **Package manager**: pnpm 12 with `nodeLinker: hoisted` (keep it, and keep the delay on brand new releases)
- **Platform**: iPhone only, portrait, light and dark (`userInterfaceStyle: automatic`). `ios/` is generated (never edit by hand, never commit)
- Full decision: [docs/specs/0001-expo-offline-iphone-stack/index.md](docs/specs/0001-expo-offline-iphone-stack/index.md)

## Build approach

**Tracer Bullet**: build one small piece fully working end to end, then add the next.

## Commands

```bash
pnpm install                                         # install
pnpm start                                           # dev server (press i for the simulator)
pnpm ios                                             # debug build in the simulator
pnpm expo run:ios --device --configuration Release   # install on the iPhone (free Personal Team)
pnpm test                                            # Jest
pnpm typecheck                                       # tsc --noEmit
pnpm lint                                            # ESLint (expo lint)
pnpm format                                          # Prettier, fix files (format:check only checks)
pnpm expo install <name>                             # add a library at the SDK matched version
```

## Specs

Stored in `docs/specs/`, one folder each: `docs/specs/NNNN-title/index.md`. Scope lives in `docs/scope/scope.md`.

## Rules

- **Functional style**: pure functions and plain, immutable data (`const`, `readonly`, `as const`). No classes where a function works, no shared mutable state, side effects only at the edges.
- **Folders by feature**: `src/app` holds thin route files only; `src/features/<name>` holds data, logic and views; `src/ui` holds shared parts (theme, cards, tables). Imports flow `app → features → ui`, never back.
- **File names** use `kebab-case` (`lesson-table.tsx`). **Named exports only**, except the default export Expo Router needs in `src/app`.
- **Storage has one door**: only `src/features/progress` imports `expo-sqlite/kv-store`. Expected failures return a typed result or a safe empty default; a missing or unreadable saved value never crashes the app.
- **Offline and free account safe**: no network requests; fonts, icons and lessons are bundled. No push, iCloud, Sign in with Apple, Apple Pay, NFC or in app purchases. No env vars or secrets.
- **Styling**: `StyleSheet.create` plus theme values from `src/ui/theme.ts` (overrides the inline style default in `expo-native-ui`).
- **Accessibility baseline**: WCAG AA contrast in light and dark, `role`/labels on interactive and heading elements, text that scales with Dynamic Type, Polish letters render correctly. All app text is Polish.
- **Testing gate**: every feature ships Jest unit and screen tests in `__tests__/` (`*.test.ts(x)`), plus `/check verify` on the real app. Prefs in `test-preferences.json`.
- **Commits** follow Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `test:`).
- **Expo tooling**: use the simulator and local release builds, not Expo Go or EAS cloud builds. Ask before running `@expo/agent-cli@latest`.

## Tooling

Chosen here, installed by `/develop tooling`:
- Lint and format: ESLint 9 via `expo lint` (`eslint-config-expo`, flat config in `eslint.config.js`) plus Prettier (`.prettierrc.json`; Markdown is skipped). ESLint enforces named exports outside `src/app`. Stay on ESLint 9 until the import and react plugins support 10.
- Before commit: `simple-git-hooks` plus `lint-staged` lint and format staged files, then run `pnpm typecheck`. `pnpm install` sets up the hook through `prepare`; if the hook goes missing, run `pnpm prepare`.
- CI: `.github/workflows/ci.yml` runs lint, format check, typecheck and tests on pull requests and pushes to `main`.
- Jest: `jest.setup.ts` mocks `expo-symbols` as a plain `View` (testID `icon`, keeps `name` and `tintColor`), so tests can check which icon shows.

## Git

- integration: on
- branch prefix: feat/
- commit: per-milestone

## Agent skills

- [expo-router](.claude/skills/expo-router/): `expo/skills`, routes, stacks, headers, modals
- [expo-native-ui](.claude/skills/expo-native-ui/): `expo/skills`, native feeling screens, controls, SF Symbols (spec overrides apply)
- [expo-upgrade](.claude/skills/expo-upgrade/): `expo/skills`, SDK upgrades, dependency fixes, React Compiler
- [react-native-testing](.claude/skills/react-native-testing/): `callstack/react-native-testing-library`, RNTL v14 queries and async render
- [react-native-best-practices](.claude/skills/react-native-best-practices/): `callstackincubator/agent-skills`, performance, lists, bundle size
- [pnpm](.claude/skills/pnpm/): `antfu/skills`, pnpm config, workspace file, install scripts

MCP servers: Expo MCP (chosen, connection pending; confirm the address on Expo's docs)

Declined: `expo-font`, `expo-symbols` Agent Skills (covered by `expo-native-ui`)

## Context files

- Design system: build all UI to [docs/design.md](docs/design.md) (paper and chalkboard look, shared parts, rules); token values live in `src/ui/theme.ts`.
<!-- Nested AGENTS.md files are listed here as they are created -->
- [src/features/lessons/AGENTS.md](src/features/lessons/AGENTS.md): lesson content model, catalog, how to add a lesson or topic
- [src/features/home/AGENTS.md](src/features/home/AGENTS.md): the home screen, start card, tense map and `Inne tematy`, where its Polish copy lives

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
