# Verify: Stack and architecture · spec 0001 · updated 2026-11-27
_Spec 0001 has no numbered acceptance criteria. AC-1 to AC-4 below are the four points under "What the first build must prove", in order. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual
- [x] Follow "Putting it on your iPhone" in the spec (Apple ID in Xcode, Developer Mode, cable, `ios.appleTeamId` in `app.json`), then run `pnpm expo run:ios --device --configuration Release` → the app installs on your iPhone        → AC-1
- [x] Unplug the cable, stop any development server, turn on airplane mode, close the app fully, open it again → it opens and shows `Gramatyka angielska`        → AC-2
- [x] Turn the phone sideways → the app stays in portrait        → AC-3
- [x] Switch the iPhone between light and dark mode (with the app open, and again after reopening it) → background, title and status bar follow, and the title stays readable        → AC-3

## Commands
- [x] `pnpm test` → the sample screen test passes        → AC-4
- [x] `pnpm typecheck` → no errors        → AC-4

## Acceptance-criteria coverage
- AC-1 covered by the install step · AC-2 by the airplane mode step · AC-3 by the portrait and light or dark steps · AC-4 by both commands
