# Lessons

The lesson content model: the shape every lesson follows, the catalog of categories and topics, and the queries other features read. Governing spec: [docs/specs/0002-lesson-content-model/index.md](../../../docs/specs/0002-lesson-content-model/index.md).

## Layout

- `index.ts`: the only door. Other features import from here, never from `content/` or `model/`. It exports the types, `TopicId`, `TENSE_TIMES`, `TENSE_ASPECTS`, `TENSE_TIME_LABELS` (Polish time frame names, spec 0005), the bound queries (`listCategories`, `listTopics`, `getTopic`, `getLesson`, `getTenseGrid`, `listDraftLessons`) and `parseInline`, plus the views `BlockView`, `SectionView`, `InlineText` and `plainText` (spec 0003) and `TopicCard` (spec 0004; `layout="tile"` is the tense map tile, spec 0005). `validateContent`, `findMarkupProblems`, `createQueries` and the raw content stay internal.
- `model/`: generic, content agnostic code (types, queries, markup parser, validator, `collectStrings`). Ids are plain `string` here.
- `content/catalog.ts`: categories and topics, in screen order. `TopicId` comes from here.
- `content/lessons/`: one file per written lesson, plus `index.ts` mapping topic id to lesson (`lessonsById`).
- `screens/`: `lesson-screen.tsx`, the one screen for every topic, re-exported by the thin route `src/app/lesson/[id].tsx` (spec 0004). It turns `getLesson(id)` into a lesson page, a not written page or a not found page, and never throws. A new lesson never needs a new route or screen.
- `views/`: renders lesson content with the shared parts from `src/ui` (`block-views.tsx` holds one view per block type, `block-view.tsx` picks among them with an exhaustive `switch`). Look rules live in [docs/design.md](../../../docs/design.md). Screen reader labels go through `plainText()`, so markup never reaches VoiceOver.

## Adding content

- A new lesson: write `content/lessons/<topic-id>.ts`, then add one import and one entry in `content/lessons/index.ts`. A topic with no entry counts as "not written".
- A new topic or category: add an entry in `content/catalog.ts`.
- Neither should ever need a change under `model/`. If it does, the model is wrong; revisit spec 0002.
- A new block type also needs a view in `views/`: `pnpm typecheck` fails until `BlockView` handles it.
- A tense lesson follows the 8 section template from spec 0004, in this order: `Kiedy używamy`, `Budowa`, `Pisownia …` (or that tense's form rules), `Przeczenia`, `Pytania i krótkie odpowiedzi`, `Słowa sygnałowe`, `Typowe błędy`, `<tense> czy <neighbour>?`. Section numbers come from position, never stored.
- Every `examples` block has 3 to 5 items (`example-count` in the validator, `MIN_EXAMPLES` and `MAX_EXAMPLES` in `model/validate-content.ts`).
- Topic ids are English kebab case and never change once a lesson ships (saved progress and routes use them).
- Every lesson has `review: 'draft' | 'checked'`. Flip it to `'checked'` by hand once you have checked the Polish text.
- All learner facing text is Polish. Inline markup is `**bold**`, `==highlight==`, `[[topic-id]]` and `[[topic-id|label]]`, with no nesting and no escapes.

## Checks

- `pnpm typecheck` catches a misspelled topic id in `related` or `lessonsById`.
- `__tests__/lessons/content.test.ts` runs `validateContent` on the real content and fails on any problem (dead link, ragged table, bad markup, empty text and so on). The "every tense has a grid slot" rule lives in `catalog.test.ts`, not in the validator.
- Lookups by id use a `Map` or `Object.hasOwn`, never a bare property read, so `'constructor'` and `'__proto__'` come back `unknown`.

_Drafted by /sync from the introducing change, worth a quick human pass._
