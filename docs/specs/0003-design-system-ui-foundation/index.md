# 0003. Design system and UI foundation: sketch accents on a paper theme

**Date**: 2026-11-27
**Status**: Accepted

## Summary

Grammy gets one shared look: a warm paper page in light mode and a warm chalkboard in dark mode, near black ink, and orange used as a fill (marker highlights, number circles, bubble edges), never as small text. Headings use the bundled Patrick Hand font for a hand drawn feel; everything you read for long (body text, tables, examples) uses the iPhone's own system font so it stays easy to read and grows with your text size setting. This feature builds the theme, a small set of shared parts in `src/ui`, a view for each of the 7 lesson block types, a new app icon and splash, `docs/design.md`, and a temporary "Wzornik" (sample book) screen so you can check it all on your iPhone before real screens exist.

## Requirements

**User stories**:
- As the learner, I want lessons to look warm and a little hand drawn, like my sketch picture, so that studying feels friendly, while the text stays as easy to read as any iPhone app.
- As the learner, I want light and dark mode to both look good and stay readable, following my iPhone setting.
- As the learner, I want text to grow with my iPhone text size without breaking the layout.
- As the builder of later features (5, 6, 10, 11), I want ready shared parts and block views so that a new screen only assembles them and never invents colours, fonts or spacing.

**Acceptance criteria**:
- **AC-1**: `src/ui/theme.ts` exports `themes.light` and `themes.dark` with exactly the same colour keys (listed in *Feature design*, Tokens), plus one shared set of spacing, radius, border, shadow, `sizes` and type scale values. `useTheme()` returns the light theme for any colour scheme other than `'dark'` (including `null`) and the dark theme for `'dark'`. All theme objects are `as const`. Components take every colour, font size, spacing and fixed size from these tokens; a Jest scan finds no hex colour literal in `src/` outside `theme.ts`.
- **AC-2**: A Jest test computes the WCAG contrast ratio for every declared pair in `CONTRAST_PAIRS` (in `src/ui/theme.ts`) in both schemes: every text pair is at least 4.5:1 and every outline or icon pair at least 3:1. `theme.ts` also exports `TEXT_COLOR_KEYS` (the keys allowed as text colour), and the test fails if any of them has no `text` pair entry.
- **AC-3**: Patrick Hand ships inside the app: the `.ttf` and its `OFL.txt` licence sit in `assets/fonts/`, and the `expo-font` config plugin embeds it at build time. Headings use it; body text uses the system font (no `fontFamily`). On the iPhone, with no network, the showcase line `Zażółć gęślą jaźń ĄĆĘŁŃÓŚŹŻ` shows every letter in Patrick Hand (no letter falls back to the system font) and in the system font.
- **AC-4**: Body text, tables, examples and captions scale fully with Dynamic Type; Patrick Hand headings stop growing at 1.5 times (`maxFontSizeMultiplier`). At the largest accessibility text size the showcase has no clipped or overlapping text and no sideways page scroll; only a table that cannot fit may scroll sideways, and it then shows the hint `Przesuń w bok, aby zobaczyć więcej →`. A table never breaks a word in the middle: each column is at least as wide as its longest word, and the 4 column Present Simple table fits a 402 point iPhone at the default text size.
- **AC-5**: `src/ui` exports these shared parts, each themed for light and dark: `Screen`, `Heading` (levels 1 to 3, `role="heading"`), `AppText` (variants `body`, `muted`, `caption`, `strong`), `SketchCard` (dark outline, rounded, solid offset shadow, variants `plain` and `accent`), `SpeechBubble` (outline with a tail, optional leading icon), `NumberBadge` (orange circle with a dark number), `Chip` (outlined pill), `SketchTable` and `Icon` (an SF Symbol through `expo-symbols`, decorative unless given a label).
- **AC-6**: `src/features/lessons` exports `BlockView`, `SectionView` and `InlineText`, which render all 7 block types as described in *Block look*. `InlineText` shows `**bold**` as semibold, `==highlight==` as ink on the soft orange marker, and `[[topic]]` links as burnt orange underlined text with `role="link"` that call `onOpenTopic(id)` when pressed; a link to a topic with no written lesson shows muted and stays pressable. `BlockView` handles every block type through an exhaustive `switch` (adding an 8th type fails `pnpm typecheck`).
- **AC-7**: The mistake block never relies on colour alone: the wrong sentence is struck through with an `xmark` icon in the error colour and the label `Błędnie`, the right sentence has a `checkmark` icon in the success colour and the label `Poprawnie`; screen readers read `Błędnie: <wrong>` and `Poprawnie: <right>`. The tip bubble's bulb icon reads `Wskazówka`, then its text is read normally, so each topic link in a tip stays reachable as a link (not one grouped element, revised 2026-11-27 after `/check verify`).
- **AC-8**: A temporary route `/showcase` titled `Wzornik` opens from a `Zobacz wzornik` link on the home screen. It shows: colour swatches with their names, the type scale, the Polish letters line from AC-3, every shared part from AC-5, and every block of the Present Simple draft rendered through `SectionView`. Its native header uses the theme (paper background, ink title in Patrick Hand, back button labelled `Wstecz`; on iOS 26 and later the Liquid Glass back button keeps the system ink or chalk colour, because iOS ignores the tint, and that is accepted, revised 2026-11-27). It looks right in light and dark on the iPhone. If the Present Simple lesson cannot be loaded, the screen shows `Brak lekcji przykładowej` instead of crashing.
- **AC-9**: The app has its own icon and splash: an orange speech bubble with a dark outline and a hand drawn `G`, drawn as SVG paths for this app (nothing traced from the sketch picture or Expo's template), placed in `assets/expo.icon` and as a 1024 px `assets/images/icon.png`; the splash is the paper colour with the bubble in light mode and the chalkboard colour in dark mode. You approve the icon before it is kept. No Expo template artwork remains.
- **AC-10**: `docs/design.md` documents the tokens, the type scale, every shared part and block view, the rules in *Key invariants* (including orange as fill only and no copied artwork), and how to add a new part. Every value in it matches `src/ui/theme.ts`.
- **AC-11**: No network: the font and icons are bundled or built into iOS, and no part fetches anything at run time. All visible text and accessibility labels added by this feature are Polish.

## Decision

**Chosen option**: Option 1: Sketch accents on a paper theme, system font for reading.

Build one token based theme (paper and chalkboard), Patrick Hand for headings only, SF Symbols for icons, plain `View` styles for the drawn look, and render every lesson block through shared parts in `src/ui`.

**Implementation skills**: `expo-native-ui` (`expo/skills`, `.claude/skills/expo-native-ui/`) · `expo-router` (`expo/skills`, `.claude/skills/expo-router/`) · `react-native-testing` (`callstack/react-native-testing-library`, `.claude/skills/react-native-testing/`) · `react-native-best-practices` (`callstackincubator/agent-skills`, `.claude/skills/react-native-best-practices/`)

**This spec wins where a skill disagrees**: styles use `StyleSheet.create` with theme values (spec 0001 override), not inline styles; icons are SF Symbols through `expo-symbols` (matches `expo-native-ui`); colours come from our own tokens, not `PlatformColor`.

### Decisions settled here (made while writing the spec)

- **Exact colours**: the values in *Tokens* below, chosen and checked for AA before writing (runner up: a cooler grey paper, which made the orange look dull).
- **Offset shadow**: the `boxShadow` style (`3px 3px 0 <shadow>`), supported on the New Architecture (runner up: iOS `shadowOffset` with radius 0, more props for the same look).
- **Speech bubble tail**: a small square `View` rotated 45 degrees with outline on two sides, a sibling of the bubble body so clipping never cuts it (runner up: an SVG tail, which would add `react-native-svg` for one shape).
- **Table width rule** (revised 2026-11-27): each column needs at least the estimated width of its longest word (letter width classes in ems, calibrated against SF Pro semibold and rounded up) times `fontScale`, plus cell padding and the divider, and never less than `sizes.minColumn * fontScale`; if the columns do not fit the available width, the table goes into a horizontal `ScrollView`. When they fit, columns share the width in proportion to those minimums. The first rule (a flat `minColumn` per column) broke `Twierdzenie` mid word at 80 and made the core table scroll at 96. Runner up: measuring rendered text, slower and fragile.
- **PNG rendering for the icon and splash**: the `.icon` file takes the SVG layer directly; the PNGs are rendered once with a resvg command line tool run through `pnpm dlx` (nothing added to `package.json`), then checked for size and a transparent background (runner up: macOS `qlmanage`, which paints a white background and would show a white box on the splash).
- **Icons in Jest**: a mock of `expo-symbols` in a new `jest.setup.ts` (added to `jest.setupFiles` in `package.json`) renders a plain host `View` with `testID="icon"` and the `name` and `tintColor` props, so tests can assert which symbol shows (runner up: snapshot tests, which hide the meaning).
- **Showcase placement**: `src/features/showcase/` (it imports `ui` and the lessons door), deleted by feature 6 (runner up: inside `src/ui`, which would break the `ui` never imports features rule).

## Feature design

### Tokens (`src/ui/theme.ts`)

**Colours** (same keys in both schemes):

| Key | Use | Light | Dark |
|---|---|---|---|
| `paper` | Screen background | `#FBF6EC` | `#1F1C1A` |
| `surface` | Card, bubble, table fill | `#FFFDF8` | `#2A2623` |
| `ink` | Main text, headings | `#2B2622` | `#F3EDE4` |
| `inkMuted` | Polish translations, captions, unwritten links | `#6B6158` | `#B8AEA3` |
| `outline` | Card, bubble, chip and table borders | `#2B2622` | `#D9D0C4` |
| `shadow` | Solid offset shadow | `#2B2622` | `#0F0D0C` |
| `accent` | Orange fill: number circles, bullets, bubble edge accent, accent card | `#F5A524` | `#F0A83A` |
| `onAccent` | Text on `accent` | `#2B2622` | `#1F1C1A` |
| `accentSoft` | Highlight marker, table header fill, `accent` card fill | `#FFE1A8` | `#4A3311` |
| `accentText` | Links, header back button, any orange text | `#A34A00` | `#FFB866` |
| `error` | Mistake: wrong line icon | `#B3261E` | `#FF8A80` |
| `success` | Mistake: right line icon | `#2E7D32` | `#81C784` |

Measured ratios (light / dark): `ink` on `paper` 13.9 / 14.6, `inkMuted` on `paper` 5.6 / 7.8, `accentText` on `paper` 5.5 / 9.9, `ink` on `accentSoft` 11.8 / 10.2, `inkMuted` on `accentSoft` 4.8 / 5.4, `accentText` on `accentSoft` 4.7 / 6.9, `onAccent` on `accent` 7.3 / 8.4, `success` on `surface` 5.0 / 7.5, `error` on `surface` 6.4 / 6.6. `accent` on `paper` in light is only 1.9, so `accent` is never text and never the only edge of a shape (always with `outline`).

**`TEXT_COLOR_KEYS`**: `ink`, `inkMuted`, `accentText`, `onAccent`, `error`, `success`.

**`CONTRAST_PAIRS`**: an exported list of `{ fg, bg, kind: 'text' | 'graphic' }` covering every combination a part can render:
- text on `paper` and `surface`: `ink`, `inkMuted`, `accentText`, `error`, `success`
- text on `accentSoft` (highlight, table header, `accent` card): `ink`, `inkMuted`, `accentText`
- text on `accent`: `onAccent`
- graphic: `outline` on `paper` and `surface`; `error` and `success` icons on `surface`

`error` and `success` are never placed on `accentSoft` (light `success` on it is only 4.05), and `ink` is never placed on `accent` (fails in dark).

**Spacing**: `xs 4`, `sm 8`, `md 12`, `lg 16`, `xl 24`, `xxl 32`. **Radius**: `sm 8`, `md 14`, `lg 20`, `pill 999`. **Border**: `width 2`, `thin 1`. **Shadow offset**: 3.

**Sizes** (`sizes`): `badge 32` (number circle diameter), `dot 8` (bullet), `stripe 4` (bubble accent stripe width), `tail 14` (bubble tail square side), `tailInset 20` (tail distance from the bubble's left edge), `minColumn 64` (table column floor, before font scale; columns are otherwise sized by their longest word), `icon 20` (default icon size), `maxHeadingScale 1.5`, `maxGraphicScale 2` (cap for icons, badge and dot growth).

**Type scale** (points before Dynamic Type):

| Token | Font | Size / line height | Use |
|---|---|---|---|
| `display` | Patrick Hand | 34 / 40 | Screen title (Heading level 1) |
| `title` | Patrick Hand | 28 / 34 | Section title (level 2) |
| `heading` | Patrick Hand | 22 / 28 | Sub title, card title (level 3), header title |
| `body` | System | 17 / 24 | Lesson text, examples |
| `strong` | System semibold | 17 / 24 | English example line, bold spans |
| `callout` | System | 16 / 22 | Table cells, formula chips |
| `caption` | System | 13 / 18 | Table caption, scroll hint, notes |

Font family name for Patrick Hand lives once in `src/ui/fonts.ts` (`fonts.hand`), starting value `'PatrickHand-Regular'` (its PostScript name, which iOS uses for a font embedded by the `expo-font` plugin). Confirm the name from the file before step 3 (Font Book, Font Info panel, "PostScript name"); if iOS shows the system font on the device, try the family name `'Patrick Hand'`. Patrick Hand has only a regular weight, so a style using it never sets `fontWeight`.

**Font file source**: `PatrickHand-Regular.ttf` and `OFL.txt` from Google Fonts' official `google/fonts` repository, folder `ofl/patrickhand`, downloaded once by hand or by the builder at build time (a development step; the app itself never touches the network).

### Theme access

- `useTheme(): Theme` reads `useColorScheme()` imported from `'react-native'` (so the existing test mocks keep working); `'dark'` gives `themes.dark`, anything else `themes.light`.
- `createThemedStyles((theme) => StyleSheet.create({...}))` runs the builder once per scheme at module load and returns `{ light, dark }`; `useThemedStyles(themed)` picks one with the current scheme. Pure, no context, no state. (`src/ui/themed-styles.ts`)
- `contrastRatio(a: string, b: string): number` is a pure WCAG 2 function in `src/ui/contrast.ts` used by the test.
- `src/app/_layout.tsx` builds the navigation theme by spreading `DefaultTheme` (light) or `DarkTheme` (dark) and overriding only `colors` from the tokens (`primary accentText`, `background paper`, `card paper`, `text ink`, `border outline`, `notification accent`); `dark` and `fonts` come from the spread. `Stack` `screenOptions`: `headerShown true`, `headerStyle { backgroundColor: paper }`, `headerShadowVisible false`, `headerTintColor accentText`, `headerTitleStyle { fontFamily: fonts.hand, color: ink }`, `headerBackTitle 'Wstecz'`, `headerBackButtonDisplayMode 'default'`. Screens: `<Stack.Screen name="index" options={{ headerShown: false }} />` and `<Stack.Screen name="showcase" options={{ title: 'Wzornik' }} />`. Check on the iPhone that iOS 27 shows `Wstecz`; if the system back button ignores it, accept the system label and note it in `docs/design.md`.

### Shared parts (`src/ui`, one file each, named exports)

| Part | Props (key) | Look |
|---|---|---|
| `Screen` | `children`, `scroll?: boolean` (default true), `edges?: readonly Edge[]` (default all four; pass `['left', 'right', 'bottom']` under a native header) | `SafeAreaView` root carrying the `paper` background (the existing home test checks the root style), `lg` side padding, `xl` bottom padding |
| `Heading` | `level: 1 \| 2 \| 3`, `children` | Patrick Hand per type scale, `ink`, `role="heading"`, `maxFontSizeMultiplier sizes.maxHeadingScale` |
| `AppText` | `variant?: TextVariant`, `italic?: boolean`, standard `Text` props | System font. `TextVariant = 'body' \| 'muted' \| 'caption' \| 'strong' \| 'callout'`: `body` and `strong` in `ink`, `muted` in `inkMuted` at body size, `caption` in `inkMuted`, `callout` in `ink`; sizes per type scale |
| `SketchCard` | `variant?: 'plain' \| 'accent'`, `children` | `surface` (or `accentSoft` for accent) fill, `outline` border 2, radius `md`, offset shadow, `lg` padding. The `accent` variant only holds `ink`, `inkMuted` or `accentText` text |
| `SpeechBubble` | `icon?: SymbolName`, `accessibilityText?: string`, `children` | Outer `View` with no clipping holds three siblings: the bubble body (`surface` fill, `outline` border 2, radius `md`, offset shadow, `lg` padding, left padding plus `sizes.stripe`), an absolutely positioned `accent` stripe of width `sizes.stripe` inside the body's left edge (the body has `overflow: 'hidden'` only for this stripe), and the tail: a `sizes.tail` square rotated 45 degrees, `surface` fill, `outline` border on its right and bottom sides, centred `sizes.tailInset` from the left, half below the body's bottom edge, drawn after the body so it covers the border, no shadow. Optional leading icon in `accentText`. When `accessibilityText` is given, the whole bubble is one accessible element with that label |
| `NumberBadge` | `value: number` | `sizes.badge` circle times `min(fontScale, sizes.maxGraphicScale)`, `accent` fill, `outline` border, Patrick Hand number in `onAccent`, `maxFontSizeMultiplier sizes.maxGraphicScale` |
| `Chip` | `children` | Pill, `outline` border 2, `surface` fill, `callout` text |
| `SketchTable` | `caption?: ReactNode`, `header?: readonly ReactNode[]`, `rows: readonly (readonly ReactNode[])[]`, `plain?: { header?, rows }` (the plain words, for sizing when cells are not strings) | Outline border, radius `sm`, header row on `accentSoft`, thin inner lines, cells wrap. Column count = the longest of header and rows; a shorter row gets empty cells (spec 0002's validator already rejects ragged tables, so this is only a guard). Before the first `onLayout` it renders in the "fits" layout (columns share the width); once the width is known, if the sum of the column minimums (Table width rule) is wider, it switches to a horizontal `ScrollView` where every column is exactly its minimum width, and shows the hint `Przesuń w bok, aby zobaczyć więcej →` in `caption` under the table |
| `Icon` | `name: SymbolName`, `size?: number` (default `sizes.icon`), `color?: ColorKey`, `label?: string` | `SymbolView` with `tintColor` from the theme, size times `min(fontScale, sizes.maxGraphicScale)`. Without `label` it is hidden from screen readers (`accessibilityElementsHidden` and `importantForAccessibility="no-hide-descendants"`); with `label` it has `accessibilityLabel` and `role="image"`. `SymbolName` is `SymbolViewProps['name']` from `expo-symbols` |

### Block look (`src/features/lessons/views/`)

| Block | Rendered as |
|---|---|
| `text` | `InlineText` in `body` |
| `table` | `SketchTable`; caption in `caption`, header cells in `callout` semibold (so whole words fit), body cells in `callout`, all through `InlineText`, with `plain` set from `plainText` |
| `examples` | One row per item: `accent` dot (`sizes.dot`, `outline` border thin), English in `strong`, Polish below in `muted`, note below in `caption` italic; all through `InlineText` |
| `tip` | `SpeechBubble` with `lightbulb.fill` labelled `Wskazówka` (`iconLabel`), text through `InlineText`; not grouped, so links stay reachable |
| `formula` | Optional label in `caption`, then each part as a `Chip` (part text through `InlineText` in `callout`), joined by a `+` in `accentText`, wrapping onto new lines when needed (`flexWrap`). One accessible element labelled `Wzór, <plainText(label)>: <parts plain, joined by " plus ">`, or `Wzór: <parts…>` with no label |
| `mistake` | `SketchCard` plain with two rows: `xmark.circle.fill` (`error`) + wrong sentence struck through in `muted`; `checkmark.circle.fill` (`success`) + right sentence in `strong`; note below through `InlineText` in `body`. The rows are accessible elements labelled `Błędnie: <wrong>` and `Poprawnie: <right>` (the icons are hidden) |
| `list` | One row per item: `accent` dot bullet + `InlineText` in `body` |

`SectionView` renders `Heading level 2` for the section title, then its blocks with `lg` gaps. `BlockView` takes `block: Block` and `onOpenTopic?: (id: TopicId) => void` and passes it down. All block views live in `src/features/lessons/views/` and are exported from the lessons door (`index.ts`) next to the queries.

**Inline text rules**:
- `InlineText` props: `text: string`, `variant?: TextVariant` (default `body`), `italic?: boolean`, `onOpenTopic?`. It renders one parent `AppText` with the variant, and each span as a nested `Text`, so wrapping and Dynamic Type work across spans.
- `bold` spans are semibold in any variant (inside `strong` they stay semibold). `highlight` spans keep the parent text colour and get `backgroundColor: accentSoft`. `link` spans are `accentText` (or `inkMuted` when the topic has no written lesson), underlined, `role="link"`, `onPress` only when `onOpenTopic` is given.
- `plainText(text: string): string` (pure, `views/plain-text.ts`) turns markup into what a screen reader should say: bold and highlight become their inner text, a link becomes its label or the topic title. Every accessibility label built from lesson text uses it.
- Views never import from `../index`. They import the bound queries (`getTopic`, `getLesson`) from `views/queries.ts`, a tiny module that builds them with `createQueries` from the content (the same way `index.ts` does), so there is no import cycle. Tests that need a different lesson state mock `src/features/lessons/views/queries`.

### Interface surface (no server, these are the component and function contracts)

| Function / component | Kind | Key inputs | Key outputs | Access | Key errors |
|---|---|---|---|---|---|
| `useTheme()` | hook | (none) | `Theme` | any component | never throws |
| `createThemedStyles(builder)` / `useThemedStyles(themed)` | pure / hook | `(theme) => styles` | `{ light, dark }` / styles | any component | never throws |
| `contrastRatio(a, b)` | pure | two `#RRGGBB` | number 1 to 21 | tests | a malformed hex throws in tests only (dev error, not user facing) |
| `InlineText` | component | `text: string`, `variant?: TextVariant`, `italic?`, `onOpenTopic?` | nested `Text` | lessons door | malformed markup shows as plain text (spec 0002 AC-4) |
| `plainText(text)` | pure | `text: string` | spoken string without markup | lessons views | never throws |
| `BlockView` | component | `block: Block`, `onOpenTopic?` | the block view | lessons door | none (types are closed) |
| `SectionView` | component | `section: Section`, `onOpenTopic?` | heading plus blocks | lessons door | empty `blocks` renders only the heading |
| `/showcase` | route | (none) | the Wzornik screen | home link | lesson missing shows `Brak lekcji przykładowej` |

**Value sourcing**:

| Action | Value produced / displayed | Source |
|---|---|---|
| `useTheme` | Which scheme | `useColorScheme()` from React Native; `null` or `'unspecified'` treated as light |
| Any styled part | Colours, spacing, sizes | `themes` and shared scales in `src/ui/theme.ts` (decided here) |
| Text scaling | How big text renders | iOS Dynamic Type through React Native `Text` (`allowFontScaling` default); heading cap is the constant `1.5` in `Heading` |
| `Icon`, `NumberBadge`, `SketchTable` | Size multiplier, minimum column width | `useWindowDimensions().fontScale` |
| `SketchTable` | Whether to scroll sideways | Available width from `onLayout` of the table container compared with the sum of `columnMinWidths(plain cells, columns, fontScale)` |
| `InlineText` link | Link text | `span.label` if present, else `getTopic(span.topicId).title`, else the raw `topicId` (cannot happen after spec 0002's dead link check) |
| `InlineText` link | Muted or normal | `getLesson(span.topicId).kind === 'ok'` → normal, otherwise muted |
| `InlineText` link press | Target id | `span.topicId`, passed to the `onOpenTopic` prop; no prop means the link is not pressable (still styled) |
| Mistake, tip, formula | Screen reader prefixes | Fixed Polish strings in the view files: `Błędnie`, `Poprawnie`, `Wskazówka`, `Wzór` |
| Showcase | Lesson shown | `getLesson('present-simple')`; `kind !== 'ok'` shows the fallback text |
| Showcase | Polish letters line | Constant `Zażółć gęślą jaźń ĄĆĘŁŃÓŚŹŻ` in the showcase file |
| Showcase link press | Topic opened | Showcase passes no `onOpenTopic`, so links are styled but not pressable yet (feature 5 wires real navigation) |
| Home | `Zobacz wzornik` link | `expo-router` `Link href="/showcase" asChild` wrapping a `TextLink` (`src/ui/text-link.tsx`: a `Pressable` with `role="link"`, at least `minTouch` tall, around underlined `accentText`), placed under the title. Revised after spec 0004 verify: a lone `Text` with `role="link"` reads as static text on iOS |
| Accessibility labels | Spoken text of tips, formulas, mistakes | `plainText()` of the block strings plus the fixed prefixes |
| Header | Title font, colours, back label | `fonts.hand`, theme tokens, the constant `Wstecz` in `_layout.tsx` |
| App icon, splash | Artwork, background colours | New SVG written in this feature; splash colours `paper` light `#FBF6EC` and dark `#1F1C1A` in `app.json` |

**Key invariants**:
- Every colour, size and spacing value comes from `src/ui/theme.ts`; no hex literal outside it (a Jest test greps `src/` for `#[0-9a-fA-F]{3,8}` outside `theme.ts` and fails on a match).
- `accent` is a fill only, never text, and always sits next to an `outline` edge. Orange text uses `accentText`.
- Meaning never comes from colour alone: mistakes carry an icon and a spoken label; links are underlined.
- Patrick Hand is for headings, numbers in badges and the header title only; never for body, tables, examples or anything longer than one line of reading.
- `src/ui` imports nothing from `src/features`; lesson knowledge (markup, catalog) stays in `src/features/lessons/views`.
- Nothing is copied or traced from the sketch picture: no reused illustrations, icons or exact layout; the palette values above are our own.
- The theme follows the iPhone setting only; there is no in app switch and nothing is saved.

**Security model**: Nothing sensitive. No data is read or written, no network, no storage. The font is OFL licensed and its licence ships beside it.

**Configuration required**: no env vars or secrets. App config changes only:
- add the `expo-font` plugin with `{ "fonts": ["./assets/fonts/PatrickHand-Regular.ttf"] }`;
- set the `expo-splash-screen` plugin to `backgroundColor #FBF6EC`, `image ./assets/images/splash-icon.png` (the bubble with a dark outline), `imageWidth 120`, and `dark: { backgroundColor #1F1C1A, image ./assets/images/splash-icon-dark.png }` (the same bubble with a chalk `#D9D0C4` outline, so it stays visible);
- keep `ios.icon` pointing at `./assets/expo.icon`; replace its template layers (`expo-symbol 2.svg`, `grid.png`) with one new SVG layer and rewrite `icon.json` to a solid `paper` fill with that single layer; overwrite `assets/images/icon.png` (1024 px, opaque, for the fallback) and `splash-icon.png`, and add `splash-icon-dark.png` (both transparent, 1024 px wide). New dependencies, added with `pnpm expo install`: `expo-font`, `expo-symbols`. Run `pnpm expo prebuild -p ios --clean` (or `pnpm ios`) after the plugin change, since the font is embedded at build time.

**Critical test scenarios**:
- Happy path: the showcase renders every part and all Present Simple blocks in light, then dark (mock `useColorScheme`), with the expected text, roles and labels, verifies **AC-5**, **AC-6**, **AC-8**
- Contrast: every `CONTRAST_PAIRS` entry passes its threshold in both schemes, and a deliberately bad fixture pair fails, verifies **AC-2**
- Theme fallback: `useColorScheme` returning `null` gives the light theme; both schemes have identical keys, verifies **AC-1**
- Markup edge: an unclosed `**bold`, a link to an unwritten topic, and Polish letters render without a throw, with the link muted and still `role="link"`, verifies **AC-6**
- Mistake accessibility: the labels `Błędnie: He work every day.` and `Poprawnie: He works every day.` are found by label, and the mocked icons have `name` `xmark.circle.fill` and `checkmark.circle.fill`, verifies **AC-7**
- Tip label: a tip with `**teraz**` and `[[present-continuous]]` has an image labelled `Wskazówka` and a reachable, pressable `Present Continuous` link, and no grouped `Wskazówka: …` label, verifies **AC-7**
- Table width: with `fontScale` mocked to 3 and a layout event of 320 points, a 4 column table shows the scroll hint; at `fontScale` 1 it does not; word estimates are never narrower than measured SF Pro widths; the Present Simple table fits 370 points at `fontScale` 1 and scrolls at 1.24; six short columns scroll at the floor, verifies **AC-4**
- Exhaustive blocks: a type level test (`@ts-expect-error` on an unknown block type) keeps `BlockView` closed, verifies **AC-6**
- Missing lesson: with `getLesson` mocked to `not-written`, the showcase shows `Brak lekcji przykładowej`, verifies **AC-8**
- No stray values: the hex literal scan finds nothing outside `theme.ts`, verifies **AC-1**
- On device (verify, not Jest): Polish letters in both fonts, largest text size, light and dark, airplane mode, icon and splash, verifies **AC-3**, **AC-4**, **AC-9**, **AC-11**

## Build plan

Tracer Bullet: first one thin thread from token to a real block on the iPhone (font embedded, theme, one part, one block, showcase route), so the riskiest parts (font name on iOS, header theming, release build) are proven before the rest is widened.

1. Add `expo-font` and `expo-symbols` with `pnpm expo install`; download `PatrickHand-Regular.ttf` and `OFL.txt` from `google/fonts` (`ofl/patrickhand`) into `assets/fonts/`; add the `expo-font` plugin to `app.json`; check the font has all 18 Polish letters and read its PostScript name (Font Book), satisfies **AC-3**, **AC-11**
2. Replace `src/ui/theme.ts` with the full tokens, `sizes`, `TEXT_COLOR_KEYS`, `CONTRAST_PAIRS` and type scale; add `fonts.ts`, `contrast.ts`, `use-theme.ts`, `themed-styles.ts`; move the home screen to `useTheme()` and rewrite `__tests__/theme.test.ts` and `__tests__/home-screen.test.tsx` for the new keys (`paper`, `ink` instead of `background`, `text`); add contrast, fallback and hex scan tests; add `jest.setup.ts` with the `expo-symbols` mock and list it in `jest.setupFiles`, satisfies **AC-1**, **AC-2**
3. Thin thread: `Screen`, `Heading`, `AppText`, `InlineText`, `plainText`, `views/queries.ts`, the `text` block in `BlockView`, the themed header and screen options in `_layout.tsx`, and a first `/showcase` route (home link, Polish letters line, the first Present Simple text block); regenerate typed routes (run `pnpm start` once, or `pnpm expo customize tsconfig.json` if needed) so `Link href="/showcase"` passes `pnpm typecheck`; release build on the iPhone to confirm Patrick Hand shows (fix `fonts.hand` if iOS names it differently) and the back label, satisfies **AC-3**, **AC-6**, **AC-8**
4. Remaining shared parts: `SketchCard`, `SpeechBubble`, `NumberBadge`, `Chip`, `SketchTable` (width rule, layout fallback and scroll hint), `Icon`; screen tests for each, satisfies **AC-4**, **AC-5**
5. Remaining block views (`table`, `examples`, `tip`, `formula`, `mistake`, `list`), `SectionView`, exhaustive `switch`, accessibility labels through `plainText`; export from the lessons door; tests, satisfies **AC-6**, **AC-7**
6. Complete the showcase: swatches, type scale, every part, the whole Present Simple draft, missing lesson fallback; tests in light and dark, satisfies **AC-8**
7. App icon and splash: write the SVG (bubble plus `G` as paths), show it to you for approval, put it in `assets/expo.icon` and rewrite `icon.json` (remove the Expo template layers), render `icon.png`, `splash-icon.png` and `splash-icon-dark.png` with a resvg CLI through `pnpm dlx`, check sizes and transparency, update the splash plugin for light and dark, satisfies **AC-9**
8. Write `docs/design.md` from the final tokens and parts; point to it from a short `src/ui` note for `/sync` to place, satisfies **AC-10**
9. Release build on the iPhone in airplane mode: light, dark, largest text size, every showcase section, icon and splash; with VoiceOver, check inline links are announced as links and the tip and mistake labels read as specified, satisfies **AC-3**, **AC-4**, **AC-7**, **AC-9**, **AC-11**

## Consequences

**Positive**:
- Every later screen picks parts and tokens instead of inventing a look; features 5, 6, 10 and 11 mostly assemble.
- Long reading stays in the system font, so it is crisp, fully Polish, and follows Dynamic Type for free.
- Contrast and stray colour checks run in Jest, so a bad colour change fails before it reaches the phone.
- No new heavy library: two small Expo packages, no SVG library, no styling library.

**Negative / tradeoffs**:
- The hand drawn feel is lighter than the picture: straight rounded borders, not wobbly marker lines, and clean SF Symbols, not sketched icons.
- Patrick Hand is embedded at build time, so changing the font needs a new native build, not just a reload.
- Whether the font name on iOS is right can only be seen on a device or simulator; a wrong name silently falls back to the system font (step 3 checks it early).
- The showcase screen is throwaway work that feature 6 must remove.
- Heading text stops growing at 1.5 times, a small limit on the text size setting for headings only.

**Neutral**:
- `src/ui/theme.ts` changes shape (`background` and `text` become `paper` and `ink`); the home screen, `theme.test.ts` and `home-screen.test.tsx` are rewritten for it.
- If VoiceOver does not announce nested `Text` links as links on iOS 27, links still work by touch; record it in `docs/design.md` and revisit in feature 5.
- The template blue splash and icon go away; `ios/` is regenerated from config as before.

## Follow-up

- [ ] Feature 6 (home and tense map): delete `/showcase`, `src/features/showcase/` and the `Zobacz wzornik` link once the real home screen exists.
- [ ] Feature 5 (first lesson): wire `onOpenTopic` to navigation and decide what a press on an unwritten topic shows.
- [ ] Feature 6: pick SF Symbols for the 3 time frames and 4 aspects (for example `calendar`, `hourglass`, `airplane`, and `checkmark.square`, `arrow.trianglehead.clockwise`, `puzzlepiece`, `clock`) and add any needed to `docs/design.md`.
- [ ] Later, if you miss them: a handful of hand drawn SVG icons (needs `react-native-svg`), drawn fresh, never traced.
- [x] `/sync`: add a `src/ui/AGENTS.md` (or a root `AGENTS.md` pointer) to `docs/design.md`, and record that Agent Skill discovery for `expo-font` and `expo-symbols` was declined (covered by `expo-native-ui`).

## Rationale

Reasoning and options: see [rationale.md](rationale.md).
