# 0005. Home and tense map: rationale

Decision record for [index.md](index.md). `/develop` builds from `index.md`; this file explains why.

## Context

Grammy's home screen is still a placeholder: a title, one temporary Present Simple card and a link to the `Wzornik` sample book. Scope feature 6 asks for the real home screen: the 12 tenses shown as 3 time frames by 4 aspects, a short intro to the system, and a clear place to start. Available lessons have to open, unwritten ones have to be clearly marked, and all text has to be Polish.

Earlier specs left this feature some work. Spec 0002 built `getTenseGrid()` but left the Polish row and column labels here. Spec 0003 asked feature 6 to delete the sample book and pick icons for the time frames and aspects. Spec 0004 built `TopicCard` with its unwritten state and a not written page, and expects feature 6 to replace the temporary card.

The hard constraint is the screen. An iPhone is about 400 points wide, the side padding is 16 points, and the tense names are long (`Present Perfect Continuous`). Headings use Patrick Hand, which grows up to 1.5 times with Dynamic Type, and body text grows fully. The design system forbids clipped text, sideways page scrolling and words broken in the middle. A map of 12 items also has to stay readable with VoiceOver, where the visual grid means nothing.

The catalog will grow. Features 7 and 9 add lessons, and feature 12 adds many non tense topics. The articles lesson already exists outside the tenses. Whatever the home screen does has to keep up with the catalog without hand edits.

## Options considered

### Option 1: Time frame blocks of 2×2 tiles

Three headed blocks (present, past, future). Each holds its four tenses as two rows of two tiles in the fixed aspect order, and they fall back to one column at large text.

**Pros**:
- Still reads as a map: the same aspect always sits in the same corner of every block.
- Tiles are about 179 points wide, so full tense names and their Polish glosses fit without abbreviations.
- VoiceOver order (heading, then four tiles) matches how you read it.

**Cons**:
- You can't read one aspect down a column across all three time frames at once.
- Needs a new tile layout and a font scale switch.

### Option 2: One 3×4 table

Rows are time frames and columns are aspects, as in a grammar book.

**Pros**:
- The most faithful picture of the system; columns compare aspects directly.

**Cons**:
- Cells are about 80 points wide, so names have to be cut short (`Perf. Cont.`), which loses the Polish gloss and hurts reading.
- Breaks at large text sizes: it has to scroll sideways or fall back to another layout anyway.

### Option 3: Grouped list of full width cards

Three headed sections, each with 4 full width `TopicCard`s.

**Pros**:
- No new layout code, and the easiest to read at any text size.

**Cons**:
- Looks like a list, not a map, so the 3 × 4 structure the scope asks for is only in the headings.
- Twelve tall cards make a long scroll.

### Option 4: Full table that scrolls sideways

A readable 3×4 table inside a horizontal scroller.

**Pros**:
- Keeps the table shape with readable cells.

**Cons**:
- Half the map is always off screen, which defeats the point of a map, and sideways scrolling inside a vertical page is awkward.

## Rationale

Option 1 is the only layout that keeps the map shape, shows full names with their Polish glosses, and survives Dynamic Type without sideways scrolling. Of the forces in Context, width and text size rule out Options 2 and 4. The map shape requirement makes Option 3 weaker than its simplicity suggests. Option 1's cost is small: one `layout` prop on an existing card, one `fill` prop and one size token. At the largest sizes it degrades into Option 3, so the fallback is a layout we already know works.

The rest follows from the same forces. The tiles reuse `TopicCard` so written and unwritten logic and labels stay in one place. The chevron goes in tiles because the width it frees is what keeps `Continuous` whole at larger text. `TENSE_TIME_LABELS` sits in the catalog because it is grammar vocabulary that feature 10 will need too. `Inne tematy` is driven by the data so the articles lesson stays reachable and feature 12 can extend it instead of replacing it. A fixed `Zacznij tutaj` card answers "where do I start" today without guessing at feature 8's resume design. The intro sits in a speech bubble because the part exists, and a short text you always see beats a collapsible you have to discover.

You chose every load bearing option here (design source, layout, start card, intro, unwritten taps, other topics, icons, tile content, order, labels, no draft mark, copy check), each time picking the recommended option.
