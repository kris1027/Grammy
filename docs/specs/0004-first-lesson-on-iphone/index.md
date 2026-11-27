# 0004. First lesson on your iPhone: one lesson route for every topic

**Date**: 2026-11-27
**Status**: Accepted

## Summary

This feature makes the first real screen in Grammy: the full Present Simple lesson, opened from a temporary card on the home screen and read on your iPhone with no internet. It uses one route, `/lesson/<topic id>`, that handles three cases: a written lesson, a topic that is not written yet, and an id that does not exist. The lesson is rewritten as a full A1 to A2 lesson in 8 numbered sections, and that outline becomes the template for every later tense. The feature is done only when you have checked the grammar yourself and marked the lesson `checked`.

## Requirements

**User stories**:
- As the learner, I want to open the Present Simple lesson from the home screen and read all of it on my iPhone, offline, in light and dark, so that I can actually learn from the app.
- As the learner, I want the lesson to start with when to use the tense, then show how to build it, with clear numbered parts, so that I always know where I am.
- As the learner, I want links inside a lesson to take me to related topics, and to tell me clearly when a topic is not written yet, so that I never hit a dead end or a crash.
- As the learner, I want VoiceOver to read English sentences with an English voice, so that I hear the right pronunciation.
- As the author, I want a clear grammar checklist and a visible draft mark, so that I know which lessons I still have to check.
- As the builder of features 6 and 7, I want one lesson route and one topic card I can reuse, so that new lessons and the tense map need no new screens.

**Acceptance criteria**:
- **AC-1**: The home screen shows a temporary Present Simple card (an `accent` `TopicCard`) above the existing `Zobacz wzornik` link. It shows the topic `title` (`Present Simple`) in Heading level 3, the `subtitle` (`czas teraźniejszy prosty`) in `muted`, the topic `summary` in `body`, and a `chevron.right` icon. The whole card is one element with `role="link"` and the label `Otwórz lekcję: Present Simple`. Pressing it pushes `/lesson/present-simple`.
- **AC-2**: For a written topic, `/lesson/[id]` shows, in this order: Heading level 1 with the topic `title`; the `subtitle` in `muted` when the topic has one; a `Chip` reading `Wersja robocza` only while the lesson's `review` is `'draft'`; the topic `summary` in an `accent` `SketchCard`; every section in content order, each heading preceded by a `NumberBadge` numbered 1, 2, 3 … by position; then, when the lesson has `related` entries, a `Zobacz też` Heading level 2 (no badge) followed by one `TopicCard` (`plain`) per related topic in the lesson's `related` order. The native header has the paper background and the `Wstecz` back button from spec 0003.
- **AC-3**: The native header title is empty while the page's Heading level 1 is visible. Once you scroll so that the bottom of that heading passes under the header, the header shows the topic `title`; scrolling back up hides it again. The show or hide decision is a pure function, `isHeaderTitleVisible(offsetY, headingBottom)`, which returns `true` exactly when `offsetY >= headingBottom`. Before the heading has been measured it returns `false`. The not written page behaves the same way; the not found page never shows a header title.
- **AC-4**: Pressing an inline `[[link]]` or a `Zobacz też` card pushes `/lesson/<that topic id>` onto the stack. Back (button or swipe) returns to the previous lesson at the same scroll position. Pressing a link whose target is the lesson you are on does nothing.
- **AC-5**: For a catalog topic with no lesson (for example `/lesson/past-simple`), the route shows Heading level 1 with the `title`, the `subtitle`, the `summary` in an `accent` `SketchCard`, and the text `Ta lekcja jeszcze nie powstała.` in `muted`. It has no draft chip, no sections and no `Zobacz też`. A `Zobacz też` card or inline link to such a topic is shown muted (spec 0003 link rule), stays pressable and opens this page. The card also shows the caption `Lekcja jeszcze niegotowa`, and its label ends with `, lekcja jeszcze niegotowa`.
- **AC-6**: For anything `getLesson` reports as `unknown` (an id not in the catalog, a missing param, or an array param), the route shows Heading level 1 `Nie znaleziono lekcji` and a `Wróć do strony głównej` link (`role="link"`) that returns to the home screen. The header title stays empty. The screen never throws.
- **AC-7**: The Present Simple lesson has exactly these 8 sections, in this order: `Kiedy używamy`, `Budowa`, `Pisownia -s / -es / -ies`, `Przeczenia`, `Pytania i krótkie odpowiedzi`, `Słowa sygnałowe`, `Typowe błędy`, `Present Simple czy Continuous?`. Each section covers its brief in *Present Simple content brief* below, at A1 to A2 level, with no B1 extras (no stative verb rules, no timetable future). Its `related` stays `['present-continuous', 'past-simple']`. It passes `validateContent` with no problems, and a content test asserts the 8 titles and their order.
- **AC-8**: `validateContent` gains the rule `example-count`: it is reported when an `examples` block has 1 or 2 items, or more than 5. An `examples` block with 0 items still reports only `empty-block`, not `example-count`. A fixture test checks that exactly `example-count` is reported for a 2 item block and a 6 item block, and nothing for 3 and 5. All real lessons (Present Simple and the Articles draft) pass.
- **AC-9**: VoiceOver reads English text with an English voice: every `Example.en`, `Mistake.wrong` and `Mistake.right` is rendered with `accessibilityLanguage="en-US"`. All other text keeps the default (the Polish system voice). Each mistake row becomes two accessible elements: the visible Polish label (`Błędnie` or `Poprawnie`) and then the English sentence; the icons stay hidden. Each numbered section heading reads as one heading, `<number>. <section title>` (the badge is hidden from VoiceOver). This revises spec 0003 AC-7 (the mistake rows were one Polish label each).
- **AC-10**: The lesson, not written and not found pages, and the home card look right in light and dark, with no text below the spec 0003 contrast pairs. At the largest accessibility text size nothing is clipped or overlapping and the page never scrolls sideways (only a too wide table may, with its hint). Every pressable element (home card, `Zobacz też` cards, `Wróć do strony głównej`, `Zobacz wzornik`) is at least `sizes.minTouch` (44) points tall. The home screen scrolls, so the card never clips. All visible text and labels added here are Polish.
- **AC-11**: On your iPhone, from a Release build, with airplane mode on, you can open the app, open the Present Simple lesson from the home card, and scroll through all 8 sections and `Zobacz też` without any loading state, error or network wait.
- **AC-12**: You check the lesson's grammar with the *Grammar checklist* below (copied into this spec's `verify.md` by `/check verify`), fix anything wrong in `content/lessons/present-simple.ts`, and then set `review: 'checked'`. After that the `Wersja robocza` chip no longer shows on the lesson and `listDraftLessons()` no longer returns `present-simple`. The feature is not `done` until this is true.

## Decision

**Chosen option**: Option 1: One dynamic lesson route, one scrolling page.

Build a single `/lesson/[id]` route that turns `getLesson(id)` into one of three screens (lesson, not written, not found), lays a written lesson out as one scrolling page of numbered sections, and reaches it from a temporary home card that feature 6 replaces.

**Implementation skills**: `expo-router` (`expo/skills`, `.claude/skills/expo-router/`) · `expo-native-ui` (`expo/skills`, `.claude/skills/expo-native-ui/`) · `react-native-testing` (`callstack/react-native-testing-library`, `.claude/skills/react-native-testing/`) · `react-native-best-practices` (`callstackincubator/agent-skills`, `.claude/skills/react-native-best-practices/`)

**This spec wins where a skill disagrees**: styles use `StyleSheet.create` with theme values (spec 0001), colours come from our tokens (spec 0003), and the page is a plain `ScrollView` (see below), not a virtualized list.

### Decisions settled here (made while writing the spec)

- **Where the screen lives**: `src/features/lessons/screens/lesson-screen.tsx`, re-exported by a thin `src/app/lesson/[id].tsx`. The lessons feature already owns the data, the queries and the block views, so the screen sits beside them (runner up: a new `src/features/lesson-reader/`, which would split one feature into two doors).
- **One scrolling page, not a list**: the lesson renders inside the existing `Screen` (a `ScrollView`). Eight sections of short text are small; a virtualized list (`FlatList`, FlashList) would add item measuring and break the table width rule for no measured gain (runner up: `FlatList` of sections, worth it only past a few hundred blocks).
- **Header title on scroll**: `Screen` gains two optional props, `onScroll` and `scrollEventThrottle` (default 16), passed straight to its `ScrollView`. The page's top group (Heading level 1, subtitle, draft chip) sits in one wrapper `View` that is a direct child of the scroll content; that wrapper's `onLayout` gives `headingBottom = layout.y + layout.height` (the wrapper, not the `Heading`, so `y` is measured against the scroll content). The screen keeps one boolean in state from `isHeaderTitleVisible`, set from the scroll handler only when it changes, and renders `<Stack.Screen options={{ title: visible ? topic.title : '' }} />` inside the screen, so the title follows that boolean on render and never from inside the scroll handler. The rule assumes the header stays opaque (spec 0003: paper background), where `contentOffset.y` starts at 0; a transparent or large title header would shift it by the inset. The title appears and hides without a custom animation (runner up: an `Animated` header title component, more code for a small polish). The not written page uses the same logic; the not found page always has an empty title.
- **Numbered headings**: `SectionView` gains an optional `number?: number`. With it, the heading is a row (`flexDirection: 'row'`, `alignItems: 'center'`, `gap: spacing.md`): first the `NumberBadge` (hidden from VoiceOver; it already scales with `fontScale`), then the Heading level 2 inside a `flex: 1` wrapper so long titles wrap. The heading gets `accessibilityLabel` `<number>. <plainText(title)>` through a new optional `accessibilityLabel` prop on `Heading`. Without `number`, `SectionView` renders exactly as today, so the Wzornik keeps working (runner up: a separate `NumberedSectionView`, which duplicates the block loop).
- **`TopicCard` (new, shared by home, `Zobacz też` and later feature 6)**: `src/features/lessons/views/topic-card.tsx`, props `topicId: TopicId`, `variant: 'accent' | 'plain'`, `showSummary?: boolean` (default `false`; home passes `true`), `onPress: () => void`. It reads the topic and its written state through `views/queries.ts`. Layout: a `Pressable` wrapping a `SketchCard` of the variant, a row with the text column (Heading level 3 `title`, `muted` `subtitle`, optional `body` `summary`) and a `chevron.right` `Icon` in `accentText`. An unwritten topic shows its title in `inkMuted` (through a new optional `tone` prop on `Heading`, same `TextTone` values as `AppText`), its subtitle in `muted`, a `caption` line `Lekcja jeszcze niegotowa` (so the state never relies on colour alone), and the chevron in `inkMuted`. Pressed state lowers opacity to 0.6. Accessibility: one element, `role="link"`, label `<title>` plus `, <subtitle>` when present plus `, lekcja jeszcze niegotowa` when unwritten; the home card uses the fixed label `Otwórz lekcję: <title>` through an optional `accessibilityLabel` prop (runner up: two card components, one per screen).
- **Navigation calls**: the screen and cards use `router.push({ pathname: '/lesson/[id]', params: { id } })` from `expo-router` (typed routes). The not found link is `<Link href="/" dismissTo>` so it pops back to home instead of stacking a second home (runner up: `router.replace('/')`, which loses the back stack).
- **Self link guard**: `onOpenTopic(id)` on the lesson screen ignores a press when `id === lookup.topic.id` (a plain string comparison; no cast). Spec 0002 forbids `related` self links but not inline ones, so the guard lives in the screen, not the validator.
- **Home screen layout**: home switches to `Screen` with `scroll` (the default) and stacks from the top (title, card, Wzornik link, `spacing.xl` apart) instead of centring, so the card never clips at large text sizes. Feature 6 replaces this screen anyway.
- **Touch target token**: `sizes.minTouch = 44` is added to `src/ui/theme.ts` and `docs/design.md`. Text links (`Wróć do strony głównej`, and the existing `Zobacz wzornik`) get `minHeight: sizes.minTouch` and vertical centring; `TopicCard` is taller than that by its padding.
- **Draft chip width**: the chip is wrapped with `alignSelf: 'flex-start'` so it hugs its text instead of stretching across the column.
- **Route registration**: `src/app/_layout.tsx` adds `<Stack.Screen name="lesson/[id]" options={{ title: '' }} />`; the shared `screenOptions` already give the paper header and `Wstecz`. The lesson screen uses `Screen` with `edges={['left', 'right', 'bottom']}` because it sits under a native header.
- **Reading language**: `InlineText` gains an optional `language?: 'en'`; when set, its outer `AppText` gets `accessibilityLanguage="en-US"` (`AppText` already spreads extra `Text` props). Because it sits on the outer text, it also covers bold spans and links nested inside. The examples view passes it for `Example.en`, and the mistake view passes it for `wrong` and `right`. Tables and formulas stay Polish (spec 0002 decision).
- **Mistake row markup**: the row `View` loses `accessible` and its combined `accessibilityLabel`. The visible label `Text` (`Błędnie` or `Poprawnie`) and the sentence `InlineText` become two separate VoiceOver elements (iOS makes each `Text` its own element), the icon stays hidden, and the wrong sentence keeps its strike through. Update the old combined label assertions in `__tests__/showcase-screen.test.tsx` (around line 60) and `__tests__/lessons/block-views.test.tsx` (around lines 152 to 153).
- **Test ownership**: route and navigation tests (the home card push, links, cards, not written, not found) live in a new `__tests__/lessons/lesson-route.test.tsx` using `renderRouter` from `expo-router/testing-library` with the real `lesson/[id]` route. `__tests__/home-screen.test.tsx` only checks what home renders (card label, Wzornik link). Tests find headings by their accessibility label, because the `Heading` inside a card is not its own element.
- **Articles top up**: step 7 runs the validator on the real content before writing the rule's fixtures. If an Articles `examples` block has fewer than 3 items, add A1 level English and Polish pairs about the same article use until it has 3, keeping `review: 'draft'`.
- **Example count rule placement**: a new `ContentRule` id `example-count` in `model/validate-content.ts`, next to `empty-block`, with the range as named constants `MIN_EXAMPLES = 3` and `MAX_EXAMPLES = 5` in the same file (runner up: a Present Simple only test, which lets later lessons drift).
- **Draft chip text and place**: `Wersja robocza` in a `Chip`, directly under the subtitle, before the summary card. It is a plain text element (no role), read by VoiceOver as written.
- **Showcase stays**: the Wzornik route and its home link stay until feature 6 deletes them (spec 0003 follow up). The home card is added above the link, and `home-screen.test.tsx` checks both.

## Feature design

**Data model sketch**: no new stored data and no new types for content. Everything uses spec 0002's `Topic`, `Lesson`, `Section`, `Block` and `LessonLookup` unchanged. New code level types only:

| Type | Where | Fields | Notes |
|---|---|---|---|
| `LessonScreenState` | `screens/lesson-screen.tsx` (internal) | the `LessonLookup` from `getLesson(id)` | `ok` → lesson page, `not-written` → not written page, `unknown` → not found page. No other state. |
| `ContentRule` | `model/validate-content.ts` | adds `'example-count'` to the union | One new fixture in the validator test. |
| `TopicCardProps` | `views/topic-card.tsx` | `topicId: TopicId`, `variant: 'accent' \| 'plain'`, `showSummary?: boolean`, `accessibilityLabel?: string`, `onPress: () => void` | Exported from the lessons door for feature 6. |
| `SectionViewProps` | `views/block-view.tsx` | adds `number?: number` | Optional, no change for existing callers. |
| `InlineTextProps` | `views/inline-text.tsx` | adds `language?: 'en'` | Optional. |
| `ScreenProps` | `src/ui/screen.tsx` | adds `onScroll?`, `scrollEventThrottle?` | Passed to the `ScrollView`; ignored when `scroll` is false. |
| `HeadingProps` | `src/ui/heading.tsx` | adds `tone?: TextTone`, `accessibilityLabel?: string` | Default `ink`; `TopicCard` uses `inkMuted` for unwritten topics. The label is used by numbered section headings. |
| `sizes.minTouch` | `src/ui/theme.ts` | `44` | Minimum height of a pressable text link. |

Section numbers are derived from position (index plus 1), never stored. The route param is the `TopicId`. Nothing is saved on the phone (learned marks and resume belong to feature 8).

**State transitions**: `Lesson.review` goes `draft` → `checked` when you finish the *Grammar checklist* (AC-12), by hand in the content file, as spec 0002 defines. On screen, the header title toggles between hidden and shown by scroll position (AC-3). Nothing else changes at runtime.

**Screens and routes**:

| Route | Shown when | Content (top to bottom) |
|---|---|---|
| `/` (home) | always | existing title `Gramatyka angielska`, then the Present Simple `TopicCard` (`accent`, `showSummary`, label `Otwórz lekcję: Present Simple`), then `Zobacz wzornik` |
| `/lesson/[id]` lesson | `getLesson(id).kind === 'ok'` | Heading 1 title · subtitle (`muted`) · `Wersja robocza` chip if draft · summary in `accent` `SketchCard` · numbered `SectionView`s · `Zobacz też` + plain `TopicCard`s if `related` is not empty |
| `/lesson/[id]` not written | `kind === 'not-written'` | Heading 1 title · subtitle · summary card · `Ta lekcja jeszcze nie powstała.` |
| `/lesson/[id]` not found | `kind === 'unknown'` | Heading 1 `Nie znaleziono lekcji` · `Wróć do strony głównej` link |

Spacing between page blocks is `spacing.xl`; inside the top group (title, subtitle, chip) it is `spacing.sm`; between sections it is `spacing.xxl`; `TopicCard`s in `Zobacz też` are `spacing.md` apart.

**Present Simple content brief** (AI drafts the Polish text in `/develop`; you check it with the *Grammar checklist*; every `examples` block has 3 to 5 items; English only in `Example.en` and `Mistake` fields, plus English words inside tables and formulas):

| # | Section title | Must cover | Blocks (at least) |
|---|---|---|---|
| 1 | `Kiedy używamy` | habits and routines; facts and general truths; permanent situations (where you live, work); likes and dislikes (`like`, `love`, `hate`) | `list` of the 4 uses, `examples` (one per use) |
| 2 | `Budowa` | the affirmative: base verb, `-s` for he, she, it; one line that he, she, it means 3rd person singular | `formula` `Twierdzenie`, `table` (`work` for I, you, we, they and he, she, it), `examples`, `tip` on the 3rd person |
| 3 | `Pisownia -s / -es / -ies` | most verbs `+s` (`works`); after `-s`, `-ss`, `-sh`, `-ch`, `-x`, `-o` → `+es` (`watches`, `goes`); consonant + `y` → `-ies` (`studies`); vowel + `y` → `+s` (`plays`); `have` → `has` | `table` (rule · example), `mistake` (`He studys` → `He studies`) |
| 4 | `Przeczenia` | `don't` / `doesn't` + base verb; full forms `do not`, `does not`; no `-s` after `doesn't` | `formula` `Przeczenie`, `table`, `examples`, `mistake` (`She doesn't works here.`) |
| 5 | `Pytania i krótkie odpowiedzi` | `Do` / `Does` + subject + base verb; short answers (`Yes, I do.`, `No, she doesn't.`); question words before `do` / `does` (`Where do you live?`) | `formula` `Pytanie`, `formula` `Pytanie z wh-`, `table` of short answers, `examples` |
| 6 | `Słowa sygnałowe` | frequency adverbs (`always`, `usually`, `often`, `sometimes`, `never`); time phrases (`every day`, `on Mondays`, `once a week`); where a frequency adverb goes (before the main verb, after `am`, `is`, `are`) | `list`, `text` on word order, `examples` |
| 7 | `Typowe błędy` | at least 4 mistakes Polish speakers make: missing `-s` (`He work`), `-s` after `doesn't`, `-s` after `Does` (`Does he likes`), `be` plus a verb (`I am work`) | 4 or more `mistake` blocks with Polish `note`s |
| 8 | `Present Simple czy Continuous?` | habits and facts versus what is happening now; a pointer to the Present Continuous lesson | `table` (Present Simple · Present Continuous, with one example pair per row), `tip` with `[[present-continuous]]` |

**Grammar checklist** (`/check verify` copies this into `verify.md` under `## Grammar check`; you tick each line while reading the lesson on your iPhone):
- [ ] Every English sentence is grammatical and natural (examples, mistake `right` lines, tables, formulas).
- [ ] Every mistake `wrong` line shows exactly one real learner error, and its `note` explains it correctly.
- [ ] Every Polish translation matches the English meaning and reads naturally.
- [ ] Spelling rules in section 3 are correct and complete for A1 to A2 (including `has`, `goes`, `does`).
- [ ] Negative and question forms in sections 4 and 5 never put `-s` on the main verb after `does` / `doesn't`.
- [ ] Frequency adverb position in section 6 is correct (before the main verb, after `be`).
- [ ] The Simple versus Continuous comparison in section 8 is correct and stays at A1 to A2.
- [ ] Polish text has correct spelling, letters and grammar.
- [ ] Then set `review: 'checked'` in `present-simple.ts`.

**Interface surface** (no server; these are the component, route and function contracts):

| Function / component | Kind | Key inputs | Key outputs | Access | Key errors |
|---|---|---|---|---|---|
| `/lesson/[id]` | route | `id` from `useLocalSearchParams()` (string, array or missing) | one of the three screens | home card, links, cards | never throws; non string ids give not found |
| `LessonScreen` | component | none (reads the route param) | the screen for `getLesson(id)` | `src/app/lesson/[id].tsx` | none |
| `isHeaderTitleVisible(offsetY, headingBottom)` | pure | `offsetY: number`, `headingBottom: number \| undefined` | `boolean` | lesson screen, tests | `undefined` gives `false` |
| `TopicCard` | component | `TopicCardProps` | a pressable card | home, lesson, feature 6 | an id not in the catalog renders nothing (`null`) |
| `SectionView` | component | `section`, `onOpenTopic?`, `number?` | heading (numbered or not) plus blocks | lessons door | as today |
| `InlineText` | component | adds `language?: 'en'` | nested `Text`, `accessibilityLanguage` when set | lessons views | as today |
| `Screen` | component | adds `onScroll?`, `scrollEventThrottle?` | as today | any screen | ignored when `scroll` is false |
| `validateContent` | pure | as spec 0002 | adds `example-count` problems | content test | as spec 0002 |

**Value sourcing**:

| Action | Value produced / displayed | Source |
|---|---|---|
| Home card | topic, title, subtitle, summary | `getTopic('present-simple')` from the catalog |
| Home card | the card label | fixed text `Otwórz lekcję: ` plus `topic.title` |
| `/lesson/[id]` | which screen shows | `getLesson(id).kind` (spec 0002) |
| Lesson page | title, subtitle, summary | `lookup.topic` |
| Lesson page | draft chip shown | `lookup.lesson.review === 'draft'` |
| Lesson page | section numbers | derived: section index plus 1 |
| Lesson page | `Zobacz też` cards and order | `lookup.lesson.related`, in its order |
| `TopicCard` | written or not (muted) | `getLesson(topicId).kind === 'ok'`, through `views/queries.ts` |
| Inline link text and muted state | label and written state | spec 0003 `InlineText` rules (`getTopic(id).title`, `getLesson`) |
| Header title | shown or hidden | `isHeaderTitleVisible(contentOffset.y, headingBottom)`; `contentOffset.y` from the `ScrollView` scroll event, `headingBottom` from the top group wrapper's `onLayout` (`y + height`) |
| Pressable link height | minimum touch size | `sizes.minTouch` in `theme.ts` |
| Header title | its text | `lookup.topic.title` (empty for not found) |
| Self link guard | the current topic id | the route `id` when `lookup.kind` is `ok` |
| Reading language | which strings are English | the field (`Example.en`, `Mistake.wrong`, `Mistake.right`, spec 0002) |
| `example-count` | allowed range | `MIN_EXAMPLES = 3`, `MAX_EXAMPLES = 5` in `validate-content.ts` |
| Present Simple text | every Polish and English string | AI draft in `/develop`, checked by you (AC-12) |
| Draft state after check | `review` | edited by hand in `present-simple.ts` |

**Key invariants**:
- One route renders every topic; adding a lesson (feature 7) never adds a route or a screen.
- The lesson screen never throws for any route param, and `getLesson` stays the only way it reads content.
- `src/app/lesson/[id].tsx` is a one line re-export; `src/app` → `src/features/lessons` → `src/ui`, never back. `src/ui` gains only the two `Screen` props and still imports no feature.
- Every `examples` block in shipped content has 3 to 5 items.
- Section numbers come from position only.
- No network, no storage: this feature imports nothing from `expo-sqlite`.
- All new visible text and accessibility labels are Polish; English appears only in the English content fields and inside tables and formulas.

**Security model**: none needed. One local reader, no accounts, no personal data, no network. The only input is the route param, which `getLesson` already treats as untrusted (arrays, `__proto__`, unknown strings give `unknown`).

**Critical test scenarios** (Jest with React Native Testing Library, files in `__tests__/`; expo-router's `renderRouter` from `expo-router/testing-library` for route tests):
- Happy path: render `/lesson/present-simple`; the Heading 1 `Present Simple`, the subtitle, the `Wersja robocza` chip (while draft), the summary, 8 headings labelled `1. Kiedy używamy` … `8. Present Simple czy Continuous?`, and `Zobacz też` with 2 cards appear, verifies **AC-2**, **AC-7**
- Home: the card has `role="link"` and label `Otwórz lekcję: Present Simple`; pressing it lands on `/lesson/present-simple`; `Zobacz wzornik` still shows, verifies **AC-1**
- Header title: `isHeaderTitleVisible` returns `false` for `undefined`, `false` below the bottom, `true` at and past it, verifies **AC-3**
- Navigation: pressing the `Past Simple` card pushes `/lesson/past-simple`, which shows `Ta lekcja jeszcze nie powstała.`; a self link press keeps the path unchanged, verifies **AC-4**, **AC-5**
- Unwritten card: its label ends with `, lekcja jeszcze niegotowa`, verifies **AC-5**
- Failure case: `/lesson/nie-ma-takiej` and a mocked array param show `Nie znaleziono lekcji` and the home link; nothing throws, verifies **AC-6**
- Validator: fixtures with 2 and 6 examples report exactly `example-count`; 0 reports only `empty-block`; 3 and 5 report nothing; real content has no problems, verifies **AC-8**
- Reading language: example English lines and both mistake sentences carry `accessibilityLanguage="en-US"`; the Polish line does not; the mistake rows expose `Błędnie` and `Poprawnie` as their own elements, verifies **AC-9**
- Drafts: with a mocked `checked` lesson the chip is gone, verifies **AC-12** (the real switch is manual)
- Auth/permission: not applicable (no accounts); the only untrusted input is the route param, covered by the failure case.
- Manual on the iPhone (`/check verify`): offline Release run, light and dark, largest text size, VoiceOver, scroll title, back position, grammar checklist, verifies **AC-3**, **AC-4**, **AC-9**, **AC-10**, **AC-11**, **AC-12**

## Build plan

Tracer Bullet: first a thin thread from the home card through the route to the existing draft lesson on the iPhone, then thicken it with the extra states, the reading polish and the full content, and finish with your grammar check.

1. Thin thread: add `src/app/lesson/[id].tsx` first (so typed routes know `/lesson/[id]` before anything pushes it, then run `pnpm typecheck`), register it in `_layout.tsx`, make home scroll from the top, build `LessonScreen` for the `ok` case only (Heading 1, subtitle, summary card, plain `SectionView`s), add `TopicCard` and put the Present Simple card on home. Run it on the simulator with the current draft lesson. Satisfies **AC-1**, **AC-2** (partly)
2. Lesson top and end: the `Wersja robocza` chip, numbered section headings (`SectionView` `number`), `Zobacz też` with plain `TopicCard`s including the muted unwritten state and label. Satisfies **AC-2**, **AC-5** (cards)
3. Other route states: not written page, not found page with the `dismissTo` home link, and the safe handling of array and missing params. Satisfies **AC-5**, **AC-6**
4. Navigation: wire `onOpenTopic` to `router.push`, add the self link guard, and wire the cards. Satisfies **AC-4**
5. Header title on scroll: `Screen` `onScroll` props, `isHeaderTitleVisible`, heading measurement and `setOptions`. Satisfies **AC-3**
6. Reading language: `InlineText` `language`, English voice on examples and mistakes, mistake rows split into label and sentence elements, numbered heading labels. Satisfies **AC-9**
7. Validator rule `example-count`: run it on the real content first, top up the Articles draft per *Articles top up*, then add its fixtures. Satisfies **AC-8**
8. Rewrite `content/lessons/present-simple.ts` to the 8 section brief (still `review: 'draft'`), and add the content test for the titles and order. Satisfies **AC-7**, **AC-8**
9. Tests for steps 1 to 8 (screen, navigation, validator, language), then `pnpm test`, `pnpm typecheck`, `pnpm lint`. Satisfies **AC-1** to **AC-9**
10. Update `docs/design.md` with `sizes.minTouch`, `TopicCard`, the numbered section heading and the lesson page layout, and `src/features/lessons/AGENTS.md` with the 8 section template, the 3 to 5 examples rule and the lesson route. Satisfies **AC-7**, **AC-8**, **AC-10**
11. Release build on your iPhone: airplane mode, light and dark, largest text, VoiceOver, scroll title, back position (`/check verify`). Satisfies **AC-10**, **AC-11**
12. Your grammar check with the checklist, content fixes, then `review: 'checked'`. Satisfies **AC-12**

## Consequences

**Positive**:
- Features 6 and 7 need no new screen: a new lesson is a data file, and the tense map reuses `TopicCard` and the not written page.
- The 8 section outline and the 3 to 5 examples rule give every later tense the same shape, and the validator keeps it honest.
- Bad links and future unwritten topics can never crash the app.
- VoiceOver users hear English in an English voice.

**Negative / tradeoffs**:
- The home card is throwaway: feature 6 deletes it (and its home test lines).
- A long single page means no jump to a section; at 8 sections that is fine, but a much longer lesson might want a table of contents later.
- The header title has no custom fade; it simply appears.
- Splitting the mistake rows changes spec 0003 AC-7 and its Wzornik VoiceOver behaviour; its tests need updating.
- The new validator rule may force small edits to the Articles draft now and to every future lesson.

**Neutral**:
- `Screen` gets two optional props, `Heading` gets `tone` and `accessibilityLabel`, and the theme gets `sizes.minTouch`, all used only by this feature for now.
- The grammar check is manual by design; tests cannot judge grammar.

## Follow-up

- [ ] Feature 6 (home and tense map): delete the temporary Present Simple home card and its tests; reuse `TopicCard` for grid cells and `/lesson/[id]` for unwritten tenses.
- [ ] Spec 0002: add the `example-count` row to its *Validation rules* table (`/architect` update in place, or `/sync` flags it).
- [ ] Spec 0003: note under AC-7 that feature 5 split each mistake row into a Polish label and an English sentence for the English voice.
- [ ] Later, if you want them: B1 extras for Present Simple (stative verbs, timetable future) as a separate section or lesson.
- [ ] Later, if lessons grow long: a section list at the top that jumps to each numbered section.
- [ ] `/check verify` for this feature copies the *Grammar checklist* into `verify.md` under `## Grammar check`.

## Rationale

Reasoning and options: see [rationale.md](rationale.md).
