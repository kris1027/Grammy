# 0003. Rationale: design system and UI foundation

Decision record for [index.md](index.md). `/develop` builds from `index.md` and skips this file.

## Context

Grammy is a personal, offline iPhone app in Polish for reading English grammar lessons. The scope says the look follows your sketch picture, a "Czasy angielskie" infographic with marker style capital headings, orange highlights, numbered circles, small icons, speech bubbles and thick hand drawn boxes. The scope also says the style must not copy artwork from that picture, which is someone else's work.

Lessons are long reading: Polish explanations, tables up to 4 or 5 columns, English examples with translations, tips and mistakes (spec 0002 defines 7 block types). On a phone in portrait, readability, Polish letters and Dynamic Type (the iPhone text size setting) matter more than decoration. The app must also look right in light and dark mode, meet WCAG AA contrast (the `AGENTS.md` accessibility baseline), and stay offline with everything bundled.

The stack is fixed by spec 0001: Expo SDK 58, React Native 0.88, `StyleSheet.create` with theme values from `src/ui/theme.ts`, iPhone only, a free personal install, and folders by feature with imports flowing `app → features → ui`. Today `theme.ts` holds two placeholder colours, and the app icon and splash are Expo's template.

Without a decision, feature 5 (the first lesson screen) would invent colours, fonts and block layouts on the spot, and features 6, 10 and 11 would each drift further. The pure orange of the picture also fails AA as text on a light page, so a naive copy would break the accessibility rule.

## Options considered

### Option 1: Sketch accents on a paper theme, system font for reading

A warm paper (light) and chalkboard (dark) theme from tokens; Patrick Hand for headings only; the system font for all reading; orange as a fill with a darker burnt orange for any orange text; drawn feel from thick outlines, rounded corners and a solid offset shadow in plain `View` styles; SF Symbols for icons.

**Pros**:
- Long text stays as readable as any iOS app, with perfect Polish letters and full Dynamic Type.
- Only two small Expo packages; no SVG or styling library.
- Contrast can be checked in Jest from plain token data.

**Cons**:
- Less hand drawn than the picture: straight lines and clean icons.
- One embedded font means a native rebuild whenever it changes.

### Option 2: Full sketch look with SVG

Wobbly SVG outlines on every box (`react-native-svg`), hand drawn SVG icons made for the app, and the handwriting font used for most text.

**Pros**:
- Closest to the feel of the picture; very personal.
- Icons can match the drawn style exactly.

**Cons**:
- Handwriting in tables and long paragraphs is slower to read, and worse at large text sizes.
- Every box needs measured SVG paths; more code, more layout bugs, slower lists.
- Every icon must be drawn by hand and checked so it is not traced from the picture.

### Option 3: Clean native iOS with an orange tint

System colours (`PlatformColor`), the system font everywhere, grouped list style screens, orange as the tint colour.

**Pros**:
- Fastest to build; light and dark and Increase Contrast come from iOS for free.
- Very little to maintain.

**Cons**:
- Loses the personality you asked for in the scope ("hand drawn feel").
- `PlatformColor` values cannot be checked for contrast in Jest, and our own block types (tip bubble, formula chips) still need custom design.

## Rationale

Option 1 is the only one that keeps both promises in the scope at once: the sketch personality and an app you will actually read every day. The feeling of the picture comes mostly from its headings, its orange and its boxes, not from its body text, so putting the handwriting only where it is short (titles, numbers, the header) and the system font where it is long keeps most of the charm and none of the reading cost. You chose this strength ("accents only") explicitly.

The accessibility baseline decides the orange: the bright orange is only 1.9 to 1 on paper, so it becomes a fill with dark text on it, and a darker burnt orange carries any orange text and links. Putting every value into one token file with a declared list of colour pairs turns AA into a Jest test instead of a hope. The same token file plus `createThemedStyles` keeps to the `StyleSheet.create` rule from spec 0001 without a context provider, since the app only follows the iPhone setting and needs no switch.

Option 2 fails on cost and reading: SVG outlines for every box and hand drawn icons are a big build for one person, and handwritten tables at large text sizes would hurt the core use. Option 3 is the cheapest but drops the look you asked for, and its native colours cannot be tested for contrast in Jest. SF Symbols (from Option 3) are still the right icon source in Option 1: free, offline, built into iOS and scaling with text, with hand drawn SVG icons left as a later, optional addition.

Patrick Hand won over Caveat and Kalam because its upright print letters are closest to marker capitals and easy to read at heading sizes, and it covers the Polish letters; it is embedded with the `expo-font` config plugin so it is there from the first frame with no loading state and no network. Tables wrap first and scroll sideways only as a last resort, because comparing rows (the tense forms) is the reason a table exists. A temporary showcase screen lets you judge the look on the real phone in release mode before feature 5 exists, which fits the Tracer Bullet approach and the Alpha `/check verify` step.

**Declined**: Agent Skill and MCP discovery for `expo-font` and `expo-symbols` (the installed `expo-native-ui` skill already covers both).
