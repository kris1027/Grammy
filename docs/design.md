# Grammy design system

source: spec [0003](specs/0003-design-system-ui-foundation/index.md) · tokens live in [`src/ui/theme.ts`](../src/ui/theme.ts)

## Character

A warm notebook. Light mode is paper, dark mode is a warm chalkboard. Ink is near black (or chalk in dark mode), and orange is a marker: it fills number circles, bullets, the bubble stripe and the soft highlight, but it is never small text. Headings are hand written (Patrick Hand); everything you read for long is the iPhone's own system font, so it stays crisp, fully Polish and grows with your text size.

The look is our own. Nothing is copied or traced from the sketch picture: no reused illustrations, icons or exact layouts, and the palette values are ours.

## Build mandate

- Every screen assembles the shared parts in `src/ui` and the lesson views in `src/features/lessons`. A screen never invents a colour, font size, spacing or fixed size.
- Styles use `StyleSheet.create` with theme values. For colours that change with light and dark, build styles with `createThemedStyles((theme) => StyleSheet.create({...}))` at module level and pick them with `useThemedStyles(themed)` inside the component. For a one off value, `useTheme()` returns the whole theme.
- Both schemes are first class. Check every new part in light and dark on the iPhone (the `Wzornik` screen is the place for it until feature 6 removes it).
- All visible text and accessibility labels are Polish.

## Tokens

The values below match `src/ui/theme.ts`. If you change one there, change it here too.

### Colours

Same keys in both schemes.

| Key | Use | Light | Dark |
|---|---|---|---|
| `paper` | Screen background | `#FBF6EC` | `#1F1C1A` |
| `surface` | Card, bubble, table fill | `#FFFDF8` | `#2A2623` |
| `ink` | Main text, headings | `#2B2622` | `#F3EDE4` |
| `inkMuted` | Polish translations, captions, unwritten links | `#6B6158` | `#B8AEA3` |
| `outline` | Card, bubble, chip and table borders | `#2B2622` | `#D9D0C4` |
| `shadow` | Solid offset shadow | `#2B2622` | `#0F0D0C` |
| `accent` | Orange fill: number circles, bullets, bubble stripe | `#F5A524` | `#F0A83A` |
| `onAccent` | Text on `accent` | `#2B2622` | `#1F1C1A` |
| `accentSoft` | Highlight marker, table header, `accent` card fill | `#FFE1A8` | `#4A3311` |
| `accentText` | Links, header back button, any orange text | `#A34A00` | `#FFB866` |
| `error` | Mistake: wrong line icon and label | `#B3261E` | `#FF8A80` |
| `success` | Mistake: right line icon and label | `#2E7D32` | `#81C784` |

Text colours (`TEXT_COLOR_KEYS`): `ink`, `inkMuted`, `accentText`, `onAccent`, `error`, `success`. Every pair a part can draw is listed in `CONTRAST_PAIRS`, and Jest checks each one in both schemes (text at least 4.5:1, outlines and icons at least 3:1). A new colour pair means a new `CONTRAST_PAIRS` entry.

### Spacing, radius, border, shadow

- Spacing: `xs 4`, `sm 8`, `md 12`, `lg 16`, `xl 24`, `xxl 32`
- Radius: `sm 8`, `md 14`, `lg 20`, `pill 999`
- Border: `width 2`, `thin 1`
- Shadow offset: `3` (a solid `boxShadow`, no blur)

### Sizes

`badge 32` (number circle), `dot 8` (bullet), `stripe 4` (bubble stripe), `tail 14` (bubble tail square), `tailInset 20` (tail distance from the bubble's left edge), `minColumn 64` (table column floor before font scale), `icon 20`, `maxHeadingScale 1.5`, `maxGraphicScale 2`, `minTouch 44` (minimum height of anything you can press; a text link reaches it with vertical padding, since a `Text` cannot centre itself).

Table columns are sized by their longest word, not a flat minimum. `columnMinWidths` in `sketch-table.tsx` estimates each word from letter width classes (narrow `0.3`, regular `0.56`, capitals `0.7`, round capitals `0.78`, `m w` `0.86`, `M W` `0.98` em, calibrated against SF Pro semibold and rounded up), adds cell padding and the divider, and never goes below `minColumn × fontScale`. The estimate leans wide on purpose: when unsure, a table scrolls instead of breaking a word. Pass `plain` when the cells are not plain strings.

### Type scale

Points before Dynamic Type. The font name lives once in `src/ui/fonts.ts` (`fonts.hand`, `'PatrickHand-Regular'`).

| Token | Font | Size / line height | Use |
|---|---|---|---|
| `display` | Patrick Hand | 34 / 40 | Screen title (`Heading` level 1) |
| `title` | Patrick Hand | 28 / 34 | Section title (level 2) |
| `heading` | Patrick Hand | 22 / 28 | Sub title, card title (level 3), header title, badge number |
| `body` | System | 17 / 24 | Lesson text, examples |
| `strong` | System semibold | 17 / 24 | English example line, bold spans |
| `callout` | System | 16 / 22 | Table cells, formula chips |
| `caption` | System | 13 / 18 | Table caption, scroll hint, notes |

Patrick Hand has one weight, so a style using it never sets `fontWeight`. It is for headings, badge numbers and the header title only, never for body text, tables or examples. Headings stop growing at 1.5 times; icons, badges and dots at 2 times; everything else scales fully.

## Shared parts (`src/ui`)

One file each, named exports.

| Part | What it is |
|---|---|
| `Screen` | Safe area root on `paper`, `lg` side padding, `xl` bottom padding, scrolls by default. Under a native header pass `edges={['left', 'right', 'bottom']}`. `onScroll` and `scrollEventThrottle` (default 16) go straight to the `ScrollView` |
| `Heading` | Patrick Hand, levels 1 to 3, `role="heading"`, capped at 1.5 times. Optional `tone` (a text colour key) and `accessibilityLabel` |
| `AppText` | System font text. Variants `body`, `muted`, `caption`, `strong`, `callout`; `italic`; `tone` picks one of the text colour keys |
| `SketchCard` | `surface` fill, 2 pt outline, radius `md`, offset shadow. Variant `accent` fills `accentSoft` and only holds `ink`, `inkMuted` or `accentText` text |
| `SpeechBubble` | Outlined bubble with an orange stripe on the left edge and a small rotated square tail; optional leading icon in `accentText`; `accessibilityText` makes it one screen reader element |
| `NumberBadge` | Orange circle with an outline and a dark Patrick Hand number |
| `Chip` | Outlined pill on `surface`, `callout` text. Corners use `radius.lg`, not `pill`, so a chip that wraps at large text sizes keeps its text inside the outline |
| `SketchTable` | Outlined table, header row on `accentSoft`, thin inner lines. Columns are at least as wide as their longest word (see Sizes). When those minimums are wider than the space, it scrolls sideways and shows `Przesuń w bok, aby zobaczyć więcej →` |
| `Icon` | An SF Symbol (`expo-symbols`), tinted from the theme, decorative unless given a Polish `label` |

The speech bubble stripe has rounded left corners instead of the body clipping it, because clipping would also cut the offset shadow.

## Lesson views (`src/features/lessons/views`)

Exported from the lessons door: `BlockView`, `SectionView`, `InlineText`, `plainText`, `TopicCard`.

| Block | Look |
|---|---|
| `text` | `InlineText` in `body` |
| `table` | `SketchTable`; caption in `caption`, header in `callout` semibold, cells in `callout` |
| `examples` | Orange dot, English in `strong`, Polish below in `muted`, note in italic `caption` |
| `tip` | `SpeechBubble` with `lightbulb.fill` labelled `Wskazówka`; the text is not grouped, so VoiceOver reaches each topic link in it |
| `formula` | Optional label in `caption`, parts as `Chip`s joined by an orange `+`, wrapping; read as `Wzór, <label>: a plus b` |
| `mistake` | Card with `xmark.circle.fill` and `Błędnie` over the struck through wrong line, `checkmark.circle.fill` and `Poprawnie` over the right line, note below. Each row is two VoiceOver elements: the Polish label, then the English sentence in an English voice; the icons are hidden (spec 0004) |
| `list` | Orange dot bullet plus `InlineText` |

English voice: `InlineText` takes `language="en"`, which sets `accessibilityLanguage="en-US"` on the whole paragraph (links inside included). Only `Example.en`, `Mistake.wrong` and `Mistake.right` use it; tables and formulas stay Polish.

Numbered section: `SectionView` with `number` puts a `NumberBadge` (hidden from VoiceOver) before the level 2 heading in a row (`md` gap, the title wraps), and the heading reads as `<number>. <title>`. Numbers come from the section's position.

`TopicCard`: a `Pressable` around a `SketchCard` (`accent` or `plain`), with a Heading level 3 title, the subtitle in `muted`, an optional `summary` in `body`, and a `chevron.right` in `accentText`. An unwritten topic shows its title and chevron in `inkMuted` and a `caption` line `Lekcja jeszcze niegotowa`. One element, `role="link"`, labelled `<title>, <subtitle>` (plus `, lekcja jeszcze niegotowa`). Pressed lowers opacity to 0.6. An id not in the catalog renders nothing.

Lesson page (`/lesson/[id]`, spec 0004): Heading level 1, subtitle in `muted` and the `Wersja robocza` chip while draft (`sm` apart, the chip hugs its text), the summary in an `accent` card, the numbered sections (`xxl` apart), then `Zobacz też` with plain `TopicCard`s (`md` apart). Page blocks are `xl` apart. The header title stays empty until the top heading scrolls under the header. A not written topic shows the top, the summary and `Ta lekcja jeszcze nie powstała.` in `muted`; an unknown id shows `Nie znaleziono lekcji` and a `Wróć do strony głównej` link.

Inline markup: `**bold**` is semibold, `==highlight==` keeps the text colour on `accentSoft`, `[[topic]]` links are underlined `accentText` (or `inkMuted` when the lesson is not written yet), have `role="link"` and call `onOpenTopic(id)` when given. Every accessibility label built from lesson text goes through `plainText()`.

## Key invariants

- Every colour, size and spacing value comes from `src/ui/theme.ts`. A Jest scan fails on any hex colour literal elsewhere in `src/`.
- `accent` is a fill only, never text, and always sits next to an `outline` edge. Orange text uses `accentText`.
- Meaning never comes from colour alone: mistakes carry an icon and a spoken label, and links are underlined.
- `src/ui` imports nothing from `src/features`. Lesson knowledge (markup, catalog) stays in `src/features/lessons/views`.
- The theme follows the iPhone setting only. There is no in app switch and nothing is saved.
- No network. The font is embedded at build time by the `expo-font` plugin and its `OFL.txt` licence sits beside it in `assets/fonts/`; SF Symbols are built into iOS.

## Navigation header

`src/app/_layout.tsx` gives the native header the paper background, no shadow line, an ink Patrick Hand title and a back button labelled `Wstecz`. It also sets `headerTintColor` to `accentText`. If iOS shows its own back label instead, accept it and note it here.

**Known iOS limit (iOS 26 and later):** the back button sits in a Liquid Glass capsule, and iOS draws its chevron and label in the system vibrant colour (ink in light mode, chalk in dark mode). It ignores the tint. The tint does reach the navigation bar (checked in the running app on iOS 27.2), but the glass button doesn't use it. We keep the native look on purpose. Don't opt out of glass or draw a custom back button just to make it orange. Spec 0003 AC-8 records this.

## App icon and splash

An orange speech bubble with a dark outline, a solid offset shadow and a hand drawn `G`, drawn as SVG paths for this app (`assets/expo.icon/Assets/grammy-bubble.svg`, on a solid paper fill). `assets/images/icon.png` is the 1024 px fallback. The splash shows the bubble on `paper` in light mode and, with a chalk outline, on the chalkboard colour in dark mode.

To redraw: edit the SVG, then render the PNGs with `pnpm dlx @resvg/resvg-js-cli --fit-width 1024 <in>.svg <out>.png` (not `qlmanage`, which paints a white background), and rebuild the app.

## Adding a new part

1. Check the parts above first; most screens only assemble them.
2. Add one `kebab-case` file in `src/ui` with a named export. Take every value from the theme through `createThemedStyles`.
3. If it draws a new colour pair, add it to `CONTRAST_PAIRS`; if it uses a new text colour, add it to `TEXT_COLOR_KEYS`.
4. Give interactive and heading elements a `role` and a Polish label, and let text scale (cap only hand written text and graphics).
5. Add a screen test in `__tests__/` for light and dark, and add the part to this file.
