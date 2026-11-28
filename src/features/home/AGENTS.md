# Home

The home screen at route `/`: title, the start card, the intro bubble, the tense map (3 time frames × 4 aspects) and `Inne tematy`. Governing spec: [docs/specs/0005-home-tense-map/index.md](../../../docs/specs/0005-home-tense-map/index.md).

## Layout

- `home-screen.tsx`: `HomeScreen`, re-exported by the thin route `src/app/index.tsx`. Also exports `openTopic`, the one place that pushes `/lesson/[id]`.
- `home-copy.ts`: every Polish string on the screen plus `START_TOPIC_ID` (the lesson the start card opens). Change copy here, not in the views.
- `views/tense-map.tsx`: `TenseMap`, built from `getTenseGrid()`. `TIME_FRAME_ICONS` holds the SF Symbol per time frame. The time frame names come from `TENSE_TIME_LABELS` in `src/features/lessons`, not from this folder.
- `views/other-topics.tsx`: `OtherTopics`, every non tense category with at least one topic, in catalog order.

## Rules

- All content comes from `@/features/lessons` (the only door). Home never hardcodes a topic list: a new tense lesson or a new category shows up with no home code change.
- Missing data never crashes: a missing start topic drops the whole start block, a missing tense slot keeps the grid shape (empty space in two columns, nothing in one column), and an empty `Inne tematy` drops the section.
- Tiles use `TopicCard` with `layout="tile"`. At or above `sizes.gridMaxFontScale` (in `src/ui/theme.ts`) each block shows one tile per row. If a word ever breaks mid word on a narrow screen, lower that value and record it in `docs/design.md`.
- Tests: `__tests__/home/home-screen.test.tsx`.

_Drafted by /sync from the introducing change, worth a quick human pass._
