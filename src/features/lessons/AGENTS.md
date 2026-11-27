# Lessons

The lesson content model: the shape every lesson follows, the catalog of categories and topics, and the queries other features read. Governing spec: [docs/specs/0002-lesson-content-model/index.md](../../../docs/specs/0002-lesson-content-model/index.md).

## Layout

- `index.ts`: the only door. Other features import from here, never from `content/` or `model/`. It exports the types, `TopicId`, `TENSE_TIMES`, `TENSE_ASPECTS`, the bound queries (`listCategories`, `listTopics`, `getTopic`, `getLesson`, `getTenseGrid`, `listDraftLessons`) and `parseInline`. `validateContent`, `findMarkupProblems`, `createQueries` and the raw content stay internal.
- `model/`: generic, content agnostic code (types, queries, markup parser, validator, `collectStrings`). Ids are plain `string` here.
- `content/catalog.ts`: categories and topics, in screen order. `TopicId` comes from here.
- `content/lessons/`: one file per written lesson, plus `index.ts` mapping topic id to lesson (`lessonsById`).

## Adding content

- A new lesson: write `content/lessons/<topic-id>.ts`, then add one import and one entry in `content/lessons/index.ts`. A topic with no entry counts as "not written".
- A new topic or category: add an entry in `content/catalog.ts`.
- Neither should ever need a change under `model/`. If it does, the model is wrong; revisit spec 0002.
- Topic ids are English kebab case and never change once a lesson ships (saved progress and routes use them).
- Every lesson has `review: 'draft' | 'checked'`. Flip it to `'checked'` by hand once you have checked the Polish text.
- All learner facing text is Polish. Inline markup is `**bold**`, `==highlight==`, `[[topic-id]]` and `[[topic-id|label]]`, with no nesting and no escapes.

## Checks

- `pnpm typecheck` catches a misspelled topic id in `related` or `lessonsById`.
- `__tests__/lessons/content.test.ts` runs `validateContent` on the real content and fails on any problem (dead link, ragged table, bad markup, empty text and so on). The "every tense has a grid slot" rule lives in `catalog.test.ts`, not in the validator.
- Lookups by id use a `Map` or `Object.hasOwn`, never a bare property read, so `'constructor'` and `'__proto__'` come back `unknown`.

_Drafted by /sync from the introducing change, worth a quick human pass._
