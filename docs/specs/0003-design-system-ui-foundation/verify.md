# Verify: design system and UI foundation · spec 0003 · updated 2026-11-27
_Steps derived from spec 0003 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

Build first: `pnpm expo prebuild -p ios --clean`, then `pnpm expo run:ios --device --configuration Release` on the iPhone (the font and icon are embedded at build time).

## UI / manual
- [ ] Turn on airplane mode, open the app → home shows `Gramatyka angielska` in Patrick Hand and the underlined orange `Zobacz wzornik` link, nothing waits on the network → AC-3, AC-11
- [ ] Tap `Zobacz wzornik` → `Wzornik` opens under a paper header, title in Patrick Hand ink, back button burnt orange and labelled `Wstecz` (if iOS shows its own label, note it in `docs/design.md`) → AC-8
- [ ] In `Polskie litery`, read `Zażółć gęślą jaźń ĄĆĘŁŃÓŚŹŻ` in both lines → every letter is hand written in the first line (no system font letter mixed in) and system font in the second → AC-3
- [ ] Scroll the whole showcase in light mode → 12 named swatches, type scale, every part (cards, bubble with tail and stripe, badges, chips, labelled icons, both tables) and every Present Simple section render cleanly → AC-5, AC-6, AC-8
- [ ] Switch the iPhone to dark mode with the showcase open → chalkboard background, chalk outlines, all text readable, nothing stays light → AC-1, AC-8
- [ ] Settings, Accessibility, larger text, largest size → body text grows fully, headings stop at about 1.5 times, nothing clipped or overlapping, no sideways page scroll; the 4 column Present Simple table scrolls sideways and shows `Przesuń w bok, aby zobaczyć więcej →` → AC-4
- [ ] Back at normal text size → the 4 column Present Simple table fits without the scroll hint; the 6 column sample table scrolls → AC-4 (minColumn 80)
- [ ] Turn VoiceOver on, swipe through the Present Simple lesson → the tip reads `Wskazówka: …` with `Present Continuous` and no asterisks, each formula reads `Wzór, <label>: … plus …`, mistakes read `Błędnie: He work every day.` and `Poprawnie: He works every day.`, the inline topic link is announced as a link (if not, note it in `docs/design.md`) → AC-6, AC-7
- [ ] Look at the mistake card in grayscale (Accessibility, Display, Colour Filters) → wrong and right lines are still clear from the icon shapes, labels and strike through → AC-7
- [ ] Home screen icon → orange speech bubble with a dark outline and a hand drawn `G` on paper, no Expo template art → AC-9
- [ ] Cold start in light, then dark mode → splash is the bubble on paper, then the chalk outlined bubble on the chalkboard colour → AC-9

## Value sourcing
- [ ] Theme follows only the iPhone setting: toggle light/dark in Control Centre with the app open → colours switch live, there is no in app switch → useTheme source
- [ ] Table scroll depends on width and text size: rotate nothing (portrait only), change text size one step at a time → the 4 column table switches to scrolling as soon as `4 × 80 × fontScale` exceeds the available width → SketchTable source
- [ ] Icons, badges and dots grow with text size up to 2 times and then stop → `useWindowDimensions().fontScale` source
- [ ] An unwritten topic link (present continuous) is muted, a written one would be burnt orange; neither opens anything in the showcase yet → InlineText link sources

## Commands
- [ ] `pnpm test` → all suites pass, including contrast, hex scan, parts, block views and showcase → AC-1, AC-2, AC-5, AC-6, AC-7, AC-8
- [ ] `pnpm typecheck` → passes (adding an eighth block type to `Block` would fail `BlockView`) → AC-6
- [ ] `pnpm lint` and `pnpm format:check` → clean
- [ ] `grep -rnE '#[0-9a-fA-F]{3,8}\b' src --include='*.ts*' | grep -v src/ui/theme.ts` → no output → AC-1
- [ ] `ls assets/fonts` → `PatrickHand-Regular.ttf` and `OFL.txt` → AC-3
- [ ] `ls assets/expo.icon/Assets` → only `grammy-bubble.svg` → AC-9

## Acceptance-criteria coverage
- AC-1 tokens and fallback: Jest theme and hex scan, dark mode step · AC-2 contrast: Jest · AC-3 font: Polish letters step, airplane step · AC-4 Dynamic Type and tables: largest text step, normal size step · AC-5 parts: showcase scroll, Jest · AC-6 block views: showcase scroll, VoiceOver, Jest · AC-7 mistake and tip: VoiceOver, grayscale, Jest · AC-8 showcase: header step, light and dark steps, Jest · AC-9 icon and splash: icon and splash steps · AC-10 `docs/design.md`: written, values match `theme.ts` (minColumn 80 recorded) · AC-11 offline: airplane step
