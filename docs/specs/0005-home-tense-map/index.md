# 0005. Home and tense map: three time frame blocks of 2×2 tiles

**Date**: 2026-11-27
**Status**: In Progress

## Summary

The home screen becomes the real front door of Grammy. From top to bottom it shows the title, a `Zacznij tutaj` card that opens Present Simple, a short speech bubble that explains how the 12 tenses fit together, the tense map, and an `Inne tematy` list for lessons outside the tenses (today only articles). The map is three blocks (present, past, future), and each block holds its four tenses as a 2×2 grid of tiles in the same aspect order. The grid drops to one column at large text sizes. This feature also removes the temporary `Wzornik` sample book screen.

## Requirements

**User stories**:
- As the learner, I want to see all 12 tenses on one screen, grouped by time, so that I understand how the system fits together before I open a lesson.
- As the learner, I want an obvious place to start, so that I don't have to choose on my first day.
- As the learner, I want to see which lessons exist yet, so that I don't tap into an empty page by surprise.
- As the learner, I want to still reach lessons outside the tenses (articles), so that a written lesson is never hidden.

**Acceptance criteria** (the contract):
- **AC-1**: The home screen (route `/`, no native header) stacks, top to bottom and `spacing.xl` apart: Heading level 1 `Gramatyka angielska`; the start block; the intro bubble; the tense map; the `Inne tematy` section. The page scrolls.
- **AC-2**: The start block is Heading level 2 `Zacznij tutaj` followed by an `accent` `TopicCard` for `present-simple` with its summary (`showSummary`), labelled `Otwórz lekcję: Present Simple`. Pressing it pushes `/lesson/present-simple`. If the start topic is missing from the catalog, the whole start block (heading and card) is left out and nothing crashes.
- **AC-3**: The intro is one `SpeechBubble` with the decorative `map` icon, holding the Polish intro text from *Copy* below. `**bold**` spans render semibold through `InlineText`. VoiceOver reads the bubble as one element whose label is `plainText` of the intro (no asterisks).
- **AC-4**: The tense map is Heading level 2 `Mapa czasów`, then three time frame blocks in the order `Teraźniejszość`, `Przeszłość`, `Przyszłość`. Each block is a Heading level 3 row: a decorative SF Symbol in `accentText` (present `smallcircle.filled.circle`, past `arrow.left.circle`, future `arrow.right.circle`), then the Polish label. Below it come that time frame's four tenses from `getTenseGrid()`, in the order Simple, Continuous, Perfect, Perfect Continuous, laid out as two rows of two (`Simple | Continuous`, `Perfect | Perfect Continuous`), `spacing.md` apart both ways. All 12 catalog tenses appear exactly once.
- **AC-5**: Each tile is a `TopicCard` in the new `tile` layout (plain variant, no chevron). It shows the English `title` in Heading level 3 and the Polish `subtitle` in `muted`. The two tiles in a row are the same height. A written tense opens `/lesson/<id>`. An unwritten tense shows its title in `inkMuted` and the caption `Lekcja jeszcze niegotowa`, has the label `<title>, <subtitle>, lekcja jeszcze niegotowa`, and still opens `/lesson/<id>`, which shows the existing not written page. Tiles show no draft marker.
- **AC-6**: When `fontScale` is at or above `sizes.gridMaxFontScale` (1.2), each block lays its four tiles out in one column, in the same order. At every text size, on your iPhone and on a 375 point wide simulator, up to the largest accessibility size, nothing on the home screen is clipped or overlapping, no word breaks in the middle, the page never scrolls sideways, and every pressable element is at least `sizes.minTouch` (44) points tall.
- **AC-7**: The `Inne tematy` section is Heading level 2 `Inne tematy`, then, for each catalog category other than `tenses` that has at least one topic, in catalog order: Heading level 3 with the category title, then one plain `TopicCard` (`row` layout, no summary) per topic in catalog order, `spacing.md` apart. Today that is `Rzeczowniki i przedimki` with `Przedimki a / an / the`, which opens `/lesson/articles`. A category with no topics is skipped. If no category qualifies, the whole section (heading included) is left out.
- **AC-8**: The temporary sample book is gone: no `/showcase` route, no `src/features/showcase/`, no `Zobacz wzornik` link, no `Stack.Screen name="showcase"`, and no test that imports it. `docs/design.md` no longer points at the `Wzornik` screen. `pnpm typecheck`, `pnpm lint` and `pnpm test` pass.
- **AC-9**: A tense slot that `getTenseGrid()` reports as `undefined` renders as an empty space of tile width in two column mode (the grid keeps its shape), renders nothing in one column mode, and never throws. The home screen never throws for any catalog content that passes `validateContent`.
- **AC-10**: In light and dark the home screen uses only theme colours and existing `CONTRAST_PAIRS`. All visible text and labels are Polish (tense names stay English as content). VoiceOver reads in visual order: title, `Zacznij tutaj`, start card, intro, `Mapa czasów`, then each time frame heading followed by its four tiles, then `Inne tematy`. On your iPhone, from a Release build with airplane mode on, the home screen opens without any loading state, and every tile and card opens the right page.
- **AC-11**: You have read and approved the Polish copy added here (intro text, `Zacznij tutaj`, `Mapa czasów`, the three time frame labels, `Inne tematy`). Fix anything you change in the copy constants before the feature is `done`.

## Decision

**Chosen option**: Option 1: Time frame blocks of 2×2 tiles, built in a new `home` feature on the existing parts.

Build the home screen as `src/features/home/home-screen.tsx` (the route `src/app/index.tsx` only re-exports it), assembled from `Heading`, `SpeechBubble`, `InlineText`, `Icon` and `TopicCard`. `TopicCard` gains a `tile` layout. The Polish time frame labels live in the lessons catalog next to the tense constants.

**Implementation skills**: `expo-native-ui` (`expo/skills`, `.claude/skills/expo-native-ui/`) · `expo-router` (`expo/skills`, `.claude/skills/expo-router/`) · `react-native-testing` (`callstack/react-native-testing-library`, `.claude/skills/react-native-testing/`)

### Decisions settled here (made while writing the spec)

- **Feature folder**: a new `src/features/home/` holds `home-screen.tsx`, `views/tense-map.tsx` (the map with its three blocks), `views/other-topics.tsx` (`Inne tematy`) and `home-copy.ts` (the Polish strings and the start topic id). It imports only the lessons door and `src/ui`. The route file becomes `export { HomeScreen as default } from '@/features/home/home-screen';`, the same pattern `src/app/lesson/[id].tsx` already uses. The title `Gramatyka angielska` moves into `HOME_TITLE` in `home-copy.ts`. Runner up: put the home screen in `src/features/lessons/screens/`, which mixes a page about the whole app into the lessons feature and gets crowded once feature 12 adds categories.
- **Time frame labels**: `TENSE_TIME_LABELS: Readonly<Record<TenseTime, string>>` = `{ present: 'Teraźniejszość', past: 'Przeszłość', future: 'Przyszłość' }` in `src/features/lessons/content/catalog.ts` (it imports the `TenseTime` type from `../model/types`), added explicitly to the exports in `src/features/lessons/index.ts`. Spec 0002 left these labels to this feature. They are grammar vocabulary that feature 10 (how to choose a tense) will reuse, so they belong with the catalog, not in the home feature. Runner up: keep them in `home-copy.ts`, which feature 10 would then have to import across features. Aspect labels are not added; tiles show full tense names, so nothing reads them yet.
- **Time frame icons**: `TIME_FRAME_ICONS: Record<TenseTime, SymbolName>` in `src/features/home/views/tense-map.tsx`: present `smallcircle.filled.circle`, past `arrow.left.circle`, future `arrow.right.circle`. Together they read as a timeline (back, now, forward). They are decorative (no `label`), because the heading text says the same thing. The heading row is a `View` (`flexDirection: 'row'`, `alignItems: 'center'`, `gap: spacing.sm`) holding the `Icon` and a `View` with `flex: 1` that wraps the `Heading` (which takes no style prop), so the label wraps beside the icon. Presentation only, so they stay in `home`. Runner up: `clock` / `clock.arrow.circlepath` / `calendar`, which are less consistent as a set.
- **Tile layout**: `TopicCard` gets `layout?: 'row' | 'tile'` (default `'row'`, today's look). `tile` drops the chevron (it costs about 32 points in a tile only about 179 points wide, and that is what keeps `Continuous` from breaking a word at larger text) and makes the card fill its cell's height. Each grid row is a `View` with `flexDirection: 'row'`, `gap: spacing.md`, `alignItems: 'stretch'`; each cell is a `View` with `flex: 1`. In `tile` layout the `Pressable` gets `flexGrow: 1` (its style becomes an array: `[styles.fill, pressed && styles.pressed]`), and the `SketchCard` gets the new `fill?: boolean` prop (default false; sets `flexGrow: 1` on the card's root `View`). The tile renders the text column (title, subtitle, caption) directly, with no inner row wrapper and no `Icon`. The `row` layout stays exactly as today. Runner up: a separate `TenseTile` component, which would duplicate the written and unwritten logic, the label building and the tests.
- **Column switch**: a new token `sizes.gridMaxFontScale: 1.2` in `src/ui/theme.ts`. `TenseMap` reads `fontScale` from `useWindowDimensions()`. Below the token it lays tiles out two per row; at or above it, it lays them out in one column (each tile full width, still `layout="tile"`). iOS text sizes come in steps (`fontScale` 1.12 at xLarge, about 1.24 at xxLarge, 1.35 at xxxLarge), so 1.2 keeps two columns up to xLarge. At 1.12, Patrick Hand's `Continuous` (about 100 points at 22 pt) is about 112 points, and the Polish gloss word `teraźniejszy` (17 pt body text, no cap) is about 115 points. Both fit the text width of a tile with no chevron: about 143 points on a 402 point iPhone (179 point tile minus 16 point padding and 2 point border on each side) and about 129 points on a 375 point one. At xxLarge the gloss gets too tight, which is why the switch sits below 1.24. If the device check shows a word breaking, lower the token and record the new value in `docs/design.md`. `useWindowDimensions` normally updates when you change the text size while the app is open; if it doesn't, the layout catches up on the next launch, and that is an accepted limit. Runner up: measure the longest word the way `SketchTable` does, which is more exact but a lot of code for 12 fixed names.
- **Start topic**: `START_TOPIC_ID: TopicId = 'present-simple'` in `home-copy.ts`. Feature 8 (learned marks and resume) is expected to turn this block into `Kontynuuj` for your last lesson; nothing here prepares for that beyond keeping the block self contained.
- **Unwritten tiles**: they reuse `TopicCard`'s existing muted look and the existing not written page from spec 0004. No new state.
- **Missing data**: in two column mode a slot that is `undefined` renders an empty `View` with `flex: 1` so the row keeps its shape; in one column mode it renders nothing; `catalog.test.ts` already guarantees every slot is filled, so this only guards against crashes. `TopicCard` already renders nothing for an unknown id; the start block checks `getTopic(START_TOPIC_ID)` itself so its heading never sits alone.
- **Other topics**: built from `listCategories()` and `listTopics(categoryId)`, skipping `tenses`, so feature 12 can extend it without starting over.
- **Showcase removal**: as spec 0003 required. The contrast pairs stay covered by `theme.test.ts`; the visual check of new parts moves to the real screens. Specs 0003 and 0004 keep their mentions as history.
- **Intro bubble props**: `<SpeechBubble icon="map" accessibilityText={plainText(INTRO)}><InlineText text={INTRO} /></SpeechBubble>`, with no `iconLabel` (decorative). `map` is a standard SF Symbol. The bubble tail adds about 14 points below the bubble, on top of the `xl` page gap, which is fine.
- **Test setup**: mock `fontScale` with the `mockDimensions` pattern already in `__tests__/ui-parts.test.tsx`. Mock catalog data with `jest.mock('@/features/lessons', () => ({ ...jest.requireActual('@/features/lessons'), getTenseGrid: jest.fn(...) }))` (ES exports can't be spied on). `TopicCard` reads `./queries` directly, so mocking the door's `getTopic` affects only the start block check, which is the point of that test. The same title (for example `Present Simple`) now shows on the start card and on a tile, so tests find cards by their accessibility label or `within(...)`, and find headings by name (`getByRole('heading', { name: 'Przeszłość' })`), since tile titles and time frame headings are both level 3.

## Feature design

**Data model sketch**:
Nothing is stored, and there is no new entity. The screen reads the bundled catalog only:

| Data | Shape | Where | New? |
|---|---|---|---|
| Tense grid | `TenseGrid<TopicId>` (`Record<TenseTime, Record<TenseAspect, TopicStatus \| undefined>>`) | `getTenseGrid()` (spec 0002) | no |
| Categories, topics | `Category[]`, `TopicStatus[]` | `listCategories()`, `listTopics()` | no |
| Time frame labels | `Readonly<Record<TenseTime, string>>` | `TENSE_TIME_LABELS` in `content/catalog.ts` | yes |
| Home copy | `string` constants | `src/features/home/home-copy.ts` | yes |
| Start topic | `TopicId` | `START_TOPIC_ID` in `home-copy.ts` | yes |
| Column switch | `number` | `sizes.gridMaxFontScale` in `src/ui/theme.ts` | yes |

**Copy** (Polish, AI draft; you check it, AC-11). In `home-copy.ts`:
- `HOME_TITLE`: `Gramatyka angielska` (unchanged)
- `START_HEADING`: `Zacznij tutaj`
- `START_CARD_LABEL_PREFIX`: `Otwórz lekcję: ` (label = prefix plus the topic title)
- `INTRO`: `Angielski ma **12 czasów**. Każdy łączy dwie rzeczy: **kiedy** coś się dzieje (teraźniejszość, przeszłość albo przyszłość) i **jak** na to patrzysz: jako fakt (Simple), jako coś w trakcie (Continuous), jako coś już zrobionego (Perfect) albo jako coś, co trwa aż do jakiegoś momentu (Perfect Continuous). Na mapie poniżej każdy blok to jeden okres, a jego cztery kafelki zawsze stoją w tej samej kolejności.`
- `MAP_HEADING`: `Mapa czasów`
- `OTHER_TOPICS_HEADING`: `Inne tematy`
- Time frame labels: see `TENSE_TIME_LABELS` above.

**Page composition**:

```
Gramatyka angielska                (H1)
Zacznij tutaj                      (H2)
[accent card: Present Simple, gloss, summary  >]
( speech bubble, map icon: intro )
Mapa czasów                        (H2)
◉ Teraźniejszość                   (H3, icon)
[Present Simple   ] [Present Continuous      ]
[Present Perfect  ] [Present Perfect Contin. ]
← Przeszłość                       (H3, icon)
  (same 2×2)
→ Przyszłość                       (H3, icon)
  (same 2×2)
Inne tematy                        (H2)
Rzeczowniki i przedimki            (H3)
[Przedimki a / an / the                      >]
```

Spacing: page blocks `xl` apart; inside the map, `Mapa czasów` to the first block `lg`, blocks `xl` apart, heading to tiles `md`; tiles `md` apart. The time frame heading row has the icon and the heading `sm` apart, centred vertically, and the heading wraps.

**State transitions**: none.

**API surface** (components and functions; no network):

| Name | Kind | Key inputs | Output | Key errors |
|---|---|---|---|---|
| `HomeScreen` | screen (`src/features/home/home-screen.tsx`, default export via `src/app/index.tsx`) | none | the page from AC-1 | none; missing data is skipped (AC-2, AC-9) |
| `TenseMap` | view | none (reads `getTenseGrid()`, `TENSE_TIMES`, `TENSE_ASPECTS`, `TENSE_TIME_LABELS`) | `Mapa czasów` plus three blocks | an `undefined` slot leaves an empty cell |
| `OtherTopics` | view | none (reads `listCategories()`, `listTopics()`) | `Inne tematy` section or nothing | no qualifying category renders nothing |
| `TopicCard` (changed) | view | adds `layout?: 'row' \| 'tile'` | `tile`: no chevron, fills the cell height | unknown id renders nothing (as today) |
| `SketchCard` (changed) | ui part | adds `fill?: boolean` | `flexGrow: 1` when true | none |
| `openTopic(id)` | function in `home-screen.tsx` | `id: TopicId` | `router.push({ pathname: '/lesson/[id]', params: { id } })` | none |

**Value sourcing**:

| Action | Value produced / displayed | Source |
|---|---|---|
| Home render | Title `Gramatyka angielska` | `HOME_TITLE` in `home-copy.ts` (text from spec 0001) |
| Start block | Start topic, its title, subtitle, summary | `START_TOPIC_ID` → `getTopic()` (catalog) |
| Start block | Card label | `START_CARD_LABEL_PREFIX` + `topic.title` |
| Intro | Text and its VoiceOver label | `INTRO`; label = `plainText(INTRO)` |
| Map | Order of time frames | `TENSE_TIMES` (spec 0002) |
| Map | Order of tiles in a block | `TENSE_ASPECTS` (spec 0002) |
| Map | Time frame heading text | `TENSE_TIME_LABELS[time]` (decided here) |
| Map | Time frame icon | `TIME_FRAME_ICONS[time]` (decided here) |
| Map | Tile title, subtitle, written state | `getTenseGrid()[time][aspect]` (`title`, `subtitle`, `isWritten`) |
| Map | Tile label | `TopicCard` default label (spec 0004) |
| Map | One or two columns | `useWindowDimensions().fontScale` compared with `sizes.gridMaxFontScale` |
| Tile, card press | Route | `/lesson/[id]` with the topic `id` |
| Unwritten | Caption | `NOT_WRITTEN_CAPTION` (spec 0004) |
| Other topics | Categories, their titles and order | `listCategories()`, skipping `id === 'tenses'` |
| Other topics | Topics per category | `listTopics(category.id)` |

**Key invariants**:
- The home screen renders only what the catalog holds; adding a tense lesson or a topic never needs a home screen change.
- Every tense appears once, in the slot `getTenseGrid()` gives it, in the fixed `TENSE_TIMES` × `TENSE_ASPECTS` order.
- `src/features/home` imports from `@/features/lessons` (the door) and `@/ui` only; nothing imports from `home`.
- No hex colours, sizes or spacing outside `src/ui/theme.ts` (the existing Jest scan).
- The home screen never throws (AC-9).

**Security model**: none. One local learner, no accounts, no network, nothing stored.

**Critical test scenarios** (Jest and RNTL in `__tests__/home/`):
- Happy path: renders the title, `Zacznij tutaj`, the start card with its label, the intro (bold spans, bubble label without asterisks), `Mapa czasów`, the three time frame headings in order and 12 tiles in grid order; pressing a tile and the start card pushes the right `/lesson/<id>`, verifies **AC-1**, **AC-2**, **AC-3**, **AC-4**
- Unwritten tile: `present-continuous` shows `Lekcja jeszcze niegotowa`, has the `, lekcja jeszcze niegotowa` label and still navigates, verifies **AC-5**
- Two columns versus one: with `fontScale` mocked to 1 and 1.12 the rows hold two cells; at 1.2, 1.35 and 3.1 each tile sits in its own row, verifies **AC-6**
- Other topics: shows `Rzeczowniki i przedimki` and the articles card; with `listCategories` mocked to tenses only, the section and its heading are absent, verifies **AC-7**
- Missing data: with `getTenseGrid` mocked to leave one slot `undefined` and `getTopic` mocked to miss the start topic, the screen renders without throwing, keeps 11 tiles (in both column modes) and drops the start block, verifies **AC-9**
- Routing: `renderRouter` with `_layout`, `index` and `lesson/[id]` (no `showcase`) opens a lesson from a tile, and the themed header test passes on `/lesson/present-simple`, verifies **AC-8**
- Dark scheme: with `useColorScheme` mocked to dark, the root uses `paper` and headings use `ink` from the dark theme, verifies **AC-10**
- `TopicCard` `tile` layout: no chevron icon (no `icon` testID), the card root `toHaveStyle({ flexGrow: 1 })`; the `row` layout is unchanged (existing tests keep passing). The intro bubble's `accessibilityLabel` contains no `*`, verifies **AC-3**, **AC-5**

## Build plan

Tracer Bullet: first one thin thread from catalog to a tappable tile on the real screen, then widen.

1. Thin thread: create `src/features/home/` with `home-copy.ts` and `home-screen.tsx` (title, start block, a `TenseMap` showing only the present block as a 2×2), point `src/app/index.tsx` at it, add `TENSE_TIME_LABELS` to the catalog and the lessons door, add `layout="tile"` to `TopicCard` and `fill` to `SketchCard`; move and rewrite `__tests__/home-screen.test.tsx` into `__tests__/home/`. Run it in the simulator, satisfies **AC-1**, **AC-2**, **AC-4**, **AC-5**
2. Full map: all three blocks with icons and the `Mapa czasów` heading, `sizes.gridMaxFontScale` in `theme.ts`, and the one column switch, with tests, satisfies **AC-4**, **AC-5**, **AC-6**
3. Intro bubble and `Inne tematy`, plus the missing data guards, with tests, satisfies **AC-3**, **AC-7**, **AC-9**
4. Remove the sample book: delete `src/app/showcase.tsx`, `src/features/showcase/`, `__tests__/showcase-screen.test.tsx` and the `showcase` `Stack.Screen`. In `__tests__/root-layout.test.tsx` and `__tests__/lessons/lesson-route.test.tsx`, drop the `ShowcaseRoute` import and the `showcase` key from every `renderRouter` map; delete the "home link opens the sample book" test; rewrite the themed header test to open `/lesson/present-simple` and assert the empty title, `Wstecz` back title and theme colours there. The `Zobacz wzornik` sample text in `ui-parts.test.tsx` is only a `TextLink` label and can stay or be renamed. Update `docs/design.md`: reword the Build mandate line that says to check new parts on the `Wzornik` (check them on the real screens in light and dark instead), drop the other `Wzornik` references, and add the home screen, the `tile` layout, `SketchCard` `fill`, `gridMaxFontScale` and the time frame icons. Regenerate typed routes, then run `pnpm typecheck`, `pnpm lint`, `pnpm test`, satisfies **AC-8**
5. On the iPhone, Release build, airplane mode: light, dark, default, xLarge, xxLarge and the largest accessibility size, plus a quick look on a 375 point wide simulator at xLarge, VoiceOver order, every tile and card opens the right page; lower `gridMaxFontScale` if a word breaks, satisfies **AC-6**, **AC-10**
6. Your copy check: read the intro and headings in the app, change `home-copy.ts` or `TENSE_TIME_LABELS` as you like, satisfies **AC-11**

## Consequences

**Positive**:
- One screen shows the whole tense system, and the catalog drives it, so features 7 and 9 add lessons with no home screen work.
- Almost everything reuses existing parts; the only new UI surface is the `tile` layout, the `fill` prop and one size token.
- `Inne tematy` and `TENSE_TIME_LABELS` give features 10 and 12 something to build on.

**Negative / tradeoffs**:
- The 2×2 block is a map of each time frame, not one 3×4 table, so you compare one aspect across time frames by scrolling, not by reading down a column.
- Dropping the chevron in tiles removes one visual hint that a tile is tappable; the card outline and shadow have to carry it.
- With the `Wzornik` gone, there is no one page that shows every part side by side; new parts get checked on the real screens.
- `gridMaxFontScale` (1.2) is a judgement from estimated word widths, so from xxLarge up you get one column. It needs the device check and may need tuning.
- The intro is 3 sentences of AI drafted Polish, so it is one more piece of copy for you to check.

**Neutral**:
- `src/app/index.tsx` becomes a thin re-export like `lesson/[id].tsx`.
- `docs/design.md` gains a home screen section, and the `Wzornik` mentions go.

## Follow-up

- [ ] Feature 8: turn the `Zacznij tutaj` block into `Kontynuuj` for your last lesson, and add learned marks to the tiles.
- [ ] Feature 10 may want Polish aspect labels (`prosty`, `ciągły`, `dokonany`, `dokonany ciągły`) next to `TENSE_TIME_LABELS`; add them there when it needs them.
- [ ] Feature 12 extends `Inne tematy` into the full grammar map.
- [ ] Spec 0003 follow-up "pick SF Symbols for the time frames and aspects" is settled here for time frames; aspects stay without icons by your choice.

## Rationale

Reasoning and options: see [rationale.md](rationale.md).
