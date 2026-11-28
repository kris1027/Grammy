# Verify: Home and tense map · spec 0005 · updated 2026-11-28
_Steps derived from spec 0005 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual
- [ ] Open the app → the home screen shows, with no header, top to bottom: `Gramatyka angielska`, `Zacznij tutaj`, the orange Present Simple card with its summary, the intro bubble, `Mapa czasów`, three time frame blocks, `Inne tematy`. The page scrolls → AC-1
- [ ] Tap the start card → `/lesson/present-simple` opens; back returns home → AC-2
- [ ] Intro bubble shows the map icon, and `12 czasów`, `kiedy`, `jak` in semibold with no asterisks → AC-3
- [ ] Blocks read `Teraźniejszość` (dot in circle icon), `Przeszłość` (left arrow), `Przyszłość` (right arrow), icons in orange text colour; each block has Simple and Continuous on top, Perfect and Perfect Continuous below → AC-4
- [ ] Each tile shows the English title and the Polish subtitle, no chevron; both tiles in a row are the same height → AC-5
- [ ] Unwritten tiles (all except Present Simple today) show a grey title and `Lekcja jeszcze niegotowa`; tapping one opens its not written page → AC-5
- [ ] Settings text size at default and xLarge → two tiles per row; at xxLarge and the largest accessibility size → one tile per row. At every size nothing is clipped or overlapping, no word breaks mid word (watch `Continuous` and `teraźniejszy`), no sideways scroll. Repeat at xLarge on a 375 point wide simulator. If a word breaks, lower `sizes.gridMaxFontScale` and record it in `docs/design.md` → AC-6
- [ ] `Inne tematy` shows `Rzeczowniki i przedimki` with the `Przedimki a / an / the` card, which opens `/lesson/articles` → AC-7
- [ ] No `Zobacz wzornik` link anywhere; `/showcase` does not exist → AC-8
- [ ] Light and dark: paper and chalkboard look, everything readable → AC-10
- [ ] VoiceOver: title, `Zacznij tutaj`, start card, intro (read once, no asterisks), `Mapa czasów`, each time frame heading then its four tiles, then `Inne tematy`. Icons are silent → AC-10
- [ ] Release build on the iPhone, airplane mode on: home opens with no loading state and every tile and card opens the right page → AC-10
- [ ] You read the intro, `Zacznij tutaj`, `Mapa czasów`, the three time frame labels and `Inne tematy`, and approve or edit them in `src/features/home/home-copy.ts` and `TENSE_TIME_LABELS` → AC-11

## Value sourcing
- [ ] Change `START_TOPIC_ID` to another tense (for a moment) → the start card follows it; the label reads `Otwórz lekcję: <title>` → start topic, card label
- [ ] Change one label in `TENSE_TIME_LABELS` (for a moment) → that block heading follows → time frame heading text
- [ ] Mark a second tense written (add a lesson entry, or check `getTenseGrid` in a test) → its tile loses the grey title and caption with no home code change → tile written state
- [ ] Add a topic to a non tense category in the catalog (for a moment) → it appears under `Inne tematy` in catalog order → other topics

## Commands
- [ ] `pnpm typecheck` → no errors → AC-8
- [ ] `pnpm lint` → no errors → AC-8
- [ ] `pnpm test` → all pass, including `__tests__/home/home-screen.test.tsx` → AC-1 to AC-10
- [ ] `grep -rni "showcase\|wzornik" src __tests__ docs/design.md` → only the `TextLink` sample label in `ui-parts.test.tsx` → AC-8

## Acceptance-criteria coverage
- AC-1 UI 1 · AC-2 UI 2 · AC-3 UI 3 · AC-4 UI 4 · AC-5 UI 5, 6 · AC-6 UI 7 · AC-7 UI 8 · AC-8 UI 9, commands · AC-9 Jest (missing data tests) · AC-10 UI 10, 11, 12 · AC-11 UI 13
