# 0001. Expo stack and architecture for an offline iPhone app

**Date**: 2026-11-27
**Status**: Accepted

## Summary

Grammy will be built with Expo SDK 58 (a toolkit on top of React Native) and TypeScript. You build the finished app on your Mac and install it on your iPhone with your free Apple ID, so there is no server and no paid account. Lessons ship inside the app, and your progress stays on the phone. The catch is that you need to reinstall about every 7 days.

## Decision

**Chosen option**: Option 1: Expo with a local release build.

Build one Expo app for iPhone only, with lessons bundled inside it, and install it as a release build from your Mac. (basis: your scope, no server and a free install; Expo's free versus paid guide)

**Implementation skills**: `expo-router` (`expo/skills`, `.claude/skills/expo-router/`) · `expo-native-ui` (`expo/skills`, `.claude/skills/expo-native-ui/`) · `expo-upgrade` (`expo/skills`, `.claude/skills/expo-upgrade/`) · `react-native-testing` (`callstack/react-native-testing-library`, `.claude/skills/react-native-testing/`) · `react-native-best-practices` (`callstackincubator/agent-skills`, `.claude/skills/react-native-best-practices/`) · `pnpm` (`antfu/skills`, `.claude/skills/pnpm/`)

**This spec wins where a skill disagrees** (see Build rules, "Skill overrides").

## Proposed stack

| Layer | Choice | Reason |
|---|---|---|
| App type | One iPhone app, one codebase, feature folders | One learner and one developer need nothing bigger. |
| Framework | Expo SDK 58 with React Native 0.88 | Current stable line at the time of the web check, with little iOS setup. (basis: Expo SDK 58 notes) |
| Language | TypeScript, `strict` and `noUncheckedIndexedAccess` (warns when a list item may be missing) | Catches broken lesson data while you code. |
| Runtime on your Mac | Node 24.3 or newer in the 24 line (you have 24.18) | Meets the SDK 58 requirement. (basis: Expo SDK 58 notes) |
| Package manager | pnpm 12 with `nodeLinker: hoisted` in `pnpm-workspace.yaml` (a flat library layout) | You already have pnpm, and the flat layout avoids known tool trouble. (basis: Expo monorepo guide, seen in search only) |
| iOS project | Continuous Native Generation (Expo rebuilds `ios/` from app settings), `ios/` and `android/` ignored by git | Upgrades stay simple. |
| Install | Release build from your Mac, signed with your free Personal Team | Cloud builds can't sign for a real iPhone without the paid program. (basis: Expo's free versus paid guide) |
| Daily coding | iPhone simulator with the Expo development server | Changes show up quickly. Your phone is for checking finished work. |
| Navigation | Expo Router (each file is a screen) | Expo's own tool, with native screen movement. (basis: `expo-router` skill) |
| App state | React state and context, one provider for progress | There is very little shared data. |
| Local storage | `expo-sqlite/kv-store` (save and read a value by name) | Part of Expo, with no tables to design. (basis: Expo SQLite docs) |
| Styling | React Native `StyleSheet` with your own theme values for light and dark | No styling library to break during upgrades. |
| Appearance | `userInterfaceStyle: automatic` (follows the iPhone setting) | Gives dark mode from day one. A manual switch is for the design system spec. |
| Lesson content | Bundled inside the app, no download | Your scope requires offline use. The exact shape belongs to feature 3. |
| Testing | `jest-expo` and React Native Testing Library | Checks logic and screens on your Mac. |
| React Compiler | On (`experiments.reactCompiler: true`) | Less manual speed tuning. (basis: `expo-upgrade` skill) |
| Screen | Portrait, iPhone only (`orientation: portrait`, `ios.supportsTablet: false`) | One layout to design and check. |
| Target phone | iOS 27 | Your phone. Keep the SDK's default minimum iOS version. |
| Version control | Git with a private GitHub repository | History and a backup. |
| Backend, database server, accounts, hosting, background jobs | None | Ruled out by your scope. |
| Updates and observability (error and usage reports) | None. No over the air updates, analytics or crash service | Each needs a server. You are the only user, so errors reach you directly. |

**App identity**: the name is `Grammy`. Use the bundle identifier (Apple's unique app ID) `com.personal.grammygrammar`. Change it only if Apple rejects it: add one short suffix before your first successful phone install. After that, **never change it**. Don't try many identifiers, since free accounts may limit new ones (about 10 a week, not confirmed).

### Project setup

* **Template**: start from the default `create-expo-app` template for SDK 58, then remove its demo code. Keep its typed routes setting.
* **First screens**: only `src/app/_layout.tsx` (a stack, meaning screens that open on top of each other) and `src/app/index.tsx`.
* **Home screen**: one screen with the Polish title `Gramatyka angielska`. It takes light and dark colours from `src/ui/theme.ts` and picks them with `useColorScheme`. These are temporary values until feature 4.
* **App config**: `name: Grammy`, `slug: grammy`, `scheme: grammy` (the app's link name), `version: 0.1.0`, `platforms: ["ios"]`, `ios.bundleIdentifier: com.personal.grammygrammar`. Keep the template icon and splash screen until feature 4.
* **Import shortcut**: in `tsconfig.json`, `@/*` points to `./src/*`. Change any template setting that points elsewhere.
* **`package.json`**: set `"packageManager": "pnpm@12.14.0"`. Add the scripts `test: jest`, `typecheck: tsc --noEmit` and `ios: expo run:ios`.
* **Tests**: use the Jest preset `jest-expo` and install Jest's TypeScript types (`@types/jest`). Use the React Native Testing Library version that matches the installed React, and check its rules in the `react-native-testing` skill. The sample test renders the home screen and finds the Polish title. Keep test files outside `src/app`.
* **pnpm**: keep `nodeLinker: hoisted`. It may also avoid Jest trouble with pnpm's default folder paths (not confirmed). If pnpm asks to approve install scripts, approve only the named packages that need it and record them in `pnpm-workspace.yaml`. Do not turn off its delay on brand new releases.
* **React Compiler**: follow the SDK 58 setup instructions. If a bug appears only in the release build, try turning the compiler off first.

### Folder layout

```
src/
  app/            routes only, thin screen files
  features/
    lessons/      lesson data, lesson logic and lesson views
    progress/     learned marks, last opened lesson, the only storage access
  ui/             shared parts (cards, tables, theme)
assets/           fonts, icons, images
```

Create `lessons` and `progress` when their first real code arrives. The empty app needs no placeholder code.

### Build rules

1. **Import direction**: `src/app` may use `features` and `ui`. `features` may use `ui`. `ui` never imports from `features` or `app`.
2. **Routes stay thin**: keep components, types and helpers out of `src/app`.
3. **File names** use `kebab-case`, for example `lesson-table.tsx`.
4. **Storage has one door**: only `src/features/progress` imports `expo-sqlite/kv-store`. A missing or unreadable saved value falls back to an empty default and never crashes the app. Feature 8 designs the saved data.
5. **No network**: the app makes no network requests for its content or features. Fonts, icons and lessons are bundled.
6. **Free account limits**: add no library or setting that needs push notifications, iCloud, Sign in with Apple, Apple Pay, NFC or in app purchases. (basis: Expo's free versus paid guide)
7. **Never edit `ios/` by hand.** Put native settings in the app config.
8. **Libraries**: add Expo supported packages with `pnpm expo install <name>`, so versions match the SDK.
9. **Secrets**: the app needs no environment variables or keys. Never commit Apple signing files.
10. **Existing files**: when creating the project in this folder, keep `docs/`, `.claude/` and `skills-lock.json`. If the project generator needs an empty folder, generate elsewhere and move the files in. Remove the template's demo screens.
11. **Git**: ignore `ios/`, `android/`, `node_modules/` and `.expo/`. Commit `pnpm-lock.yaml`. Ask before the first push to GitHub.
12. **Skill overrides**:
    * Use `StyleSheet.create`, not the inline style default in `expo-native-ui`.
    * Use `expo-sqlite/kv-store`, not the `localStorage` shim in `expo-native-ui`.
    * Do not start with Expo Go or EAS cloud builds. Use the simulator and a local release build.
    * Prefer the project's own `pnpm expo` commands over `npx --yes @expo/agent-cli@latest`, which downloads and runs whatever is newest. If a task truly needs that tool, ask first. Never send its feedback report without your approval.

### Putting it on your iPhone

First time only:
1. Add your Apple ID in Xcode (Settings, Accounts). It shows a Personal Team.
2. Turn on Developer Mode on the iPhone. (basis: Expo's iOS device build guide)
3. Connect the phone by cable. If iOS asks, trust the computer, then trust your developer profile in the phone's Settings.
4. Before the first install, set `ios.appleTeamId` in the app config, so signing survives when `ios/` is rebuilt. Read the Team ID in Xcode, in the project's Signing & Capabilities settings with your Personal Team selected. It is not a secret and can be committed. To see it the first time, you may need to generate `ios/` with `pnpm expo prebuild -p ios` and open the workspace.

Each install: `pnpm expo run:ios --device --configuration Release`

**If signing fails**: open the generated `ios/*.xcworkspace` in Xcode, select your Personal Team, set the build to Release and run once on your phone. Then try the command again. Choosing the team there is the one allowed change inside `ios/`. Keep the lasting value in the app config.

The command, the signing fallback and steps 1, 3 and 4 come from general knowledge. The web check did not confirm them, so the first install is their test.

### If the simulator won't start

Xcode 27 changes the simulator app. If `pnpm expo run:ios` can't launch it, open a simulator in Device Hub, run `pnpm expo start` and press `i`. This assumes a debug build of the app is already installed there. If that also fails, run a debug build on your phone.

## Consequences

**Positive**:
* No running costs, server or account, and nothing to operate.
* Expo handles most iOS setup and gives a known upgrade path.
* The app should read lessons anywhere with no connection.

**Negative / tradeoffs**:
* The app stops opening after about 7 days. You reconnect to your Mac and reinstall. A free account also allows only 3 such apps on one iPhone. (basis: Expo's free versus paid guide)
* Fixing a lesson typo means a new build and install.
* To keep your progress, reinstall **over** the old app with the same bundle identifier and team. Do not delete it first. Deleting it should be expected to erase progress. Feature 8 must test this.
* There is no backup of progress beyond whatever your iPhone's own backup covers (not checked).
* Without a crash service, you only learn about a crash by seeing it.
* You depend on Expo's release schedule. The installed skills also run with full agent permissions and can change when updated.

**Neutral**:
* SQLite runs underneath the key value store. It is a small file on the phone, not a database you design or host.
* SDK 58 notes mention an iOS 27 screen lifecycle change and that Xcode 27 replaces Simulator with Device Hub. Because Expo generates `ios/`, you should not need a manual migration. (basis: Expo SDK 58 notes)
* React Native 0.89 is listed for 2026-12-07. Stay on the Expo SDK's bundled version. (basis: React Native releases page)

**What the first build must prove** (feature 1 is `done` only when these hold):
* The empty app is installed on your iPhone as a release build.
* With the cable unplugged, the development server stopped and the phone in airplane mode, it opens again after being fully closed.
* It opens in portrait and follows light and dark mode.
* Tests, including one sample screen test, and the TypeScript check pass.

If the release build can't be signed or won't run without the Mac, stop and come back to `/architect` before building further.

## Follow-up

* [x] Run `/audit` to put these rules into root `AGENTS.md` (feature 2). Its `## Agent skills` section should list all six skills above, since they apply across the project.
* [ ] Connect the Expo MCP server (a live helper for the AI), which you chose to add. Check the address and plan terms on Expo's own docs first. The search reported `https://mcp.expo.dev/mcp`, not confirmed. In `AGENTS.md`, list it under `MCP servers:` as chosen, connection pending.
* [x] Choose lint and format tools in feature 2. (ESLint via `expo lint` plus Prettier, see `AGENTS.md`)
* [ ] Feature 8: `expo-sqlite/kv-store` may not work inside Jest. If tests need it, add a fake in memory version in a Jest setup file, used only through `src/features/progress`.
* [ ] Feature 8: check whether the saved progress file is included in your iPhone backup.
* [ ] Design the lesson shape in feature 3, and fonts, icons and theme in feature 4.
* [ ] Optional: install Watchman (a file watching tool) if the development server misses changes.
* [ ] If weekly reinstalls become annoying, revisit the paid Apple Developer Program (already in the scope's Deferred list).

## Rationale

Reasoning, options and sources: see [rationale.md](rationale.md).
