# 0002. Lesson content model: typed sections of blocks in a bundled catalog

**Date**: 2026-11-27
**Status**: In Progress

## Summary

Every lesson in Grammy is a TypeScript file that lists titled sections. Each section holds a few kinds of blocks: Polish text, tables, example sentences, tips, sentence formulas, common mistakes and lists. All topics, including ones not written yet, sit in one catalog grouped by category, and tenses also carry their place in the 3 by 4 tense grid. This gives every later feature (the first lesson screen, the tense map, progress, the grammar map) one shared, compiler checked shape, so adding a lesson means adding a data file and never touching a screen.

## Context

Grammy will hold many lessons: 12 tenses first, then the rest of English grammar (verb forms, articles, clauses, advanced structures). AI drafts each lesson in Polish and you check it as you learn. Lessons are reading only: short explanations, tables and examples, with no exercises. Everything ships inside the app and works offline (spec 0001).

The content differs a lot between topics. A tense has a sentence formula, uses, signal words and typical mistakes. Articles (a, an, the) have no formula at all, only rules, contrasts and examples. Later topics such as "common pairs" or "how to choose a tense" link lessons together. The shape has to fit all of them without a new screen per topic, or the app turns into dozens of one off screens.

Several features wait on this decision. Feature 5 renders the first lesson, feature 6 draws the 12 tense grid and marks unwritten tenses, feature 8 saves progress against lesson ids, and feature 12 grows the catalog into a full grammar map. If the shape is wrong, every lesson written on top of it has to be rewritten, and saved progress breaks if ids change.

The forces: one developer and one reader, content written mostly by AI (so mistakes must be caught automatically), Polish text with English examples, light and dark mode, Dynamic Type, and the project rules (functional style, plain immutable data, typed results, no network, folders by feature).

## Requirements

**User stories**:
- As the learner, I want every lesson to follow the same clear structure so that I always know where to find the formula, the uses and the examples.
- As the author (you plus AI), I want to add a lesson by writing one data file so that no screen or logic code changes.
- As the author, I want broken content (a dead link, a ragged table, unclosed markup) to fail a test so that I never find it on my phone.
- As the learner, I want the app to know which topics exist but are not written yet so that the home screen can mark them.

**Acceptance criteria**:
- **AC-1**: A lesson is a list of titled sections, each holding one or more blocks of exactly these 7 types: `text`, `table`, `examples`, `tip`, `formula`, `mistake`, `list`. A short Present Simple draft and a short Articles (a / an / the) draft are both written in this one shape, pass `pnpm typecheck`, and pass the content test. Between them they use all 7 block types, at least one `[[link]]` and at least one `related` entry, and a content test asserts this.
- **AC-2**: The catalog holds 2 categories in a fixed order (`tenses` "Czasy", then `nouns-and-articles` "Rzeczowniki i przedimki") and 13 topics: all 12 tenses plus `articles`. Every topic has an English kebab id, a `title`, a required Polish `summary`, and an optional Polish `subtitle`. Every tense topic carries a `tense` slot (time frame and aspect), and `getTenseGrid()` returns a 3 by 4 grid with all 12 cells filled, each by a different topic.
- **AC-3**: `getLesson(id)` returns `{ kind: 'ok', topic, lesson }` for a written topic, `{ kind: 'not-written', topic }` for a catalog topic with no lesson, and `{ kind: 'unknown' }` for anything else, including a string not in the catalog, `undefined`, an array (Expo Router can pass one), `'constructor'` and `'__proto__'`. It never throws.
- **AC-4**: `parseInline(text)` turns `**bold**`, `==highlight==`, `[[topic-id]]` and `[[topic-id|link text]]` into a list of spans (rules in *Markup rules* below). Any unmatched, empty, nested or malformed markup comes back as plain text with every character kept: joining the source text of all spans gives back the input exactly. It never throws. Polish letters (ą ć ę ł ń ó ś ź ż and capitals) pass through unchanged.
- **AC-5**: `validateContent(categories, topics, lessonsById)` returns a list of `ContentProblem`s, each with a named `rule`, and the content test fails when the list for the real content is not empty. The rules are listed in *Validation rules* below. Each rule has its own small failing fixture, and the test checks that exactly that `rule` is reported.
- **AC-6**: Adding a new lesson needs only a new file in `src/features/lessons/content/lessons/` plus one import and one entry in that folder's `index.ts`. Adding a new topic needs only an entry in `content/catalog.ts`. No file under `model/` changes in either case.
- **AC-7**: Every lesson has `review: 'draft' | 'checked'`, and `listDraftLessons()` returns the topics whose lesson is still a draft, in catalog order. Both sample lessons ship as `'draft'`.

## Options considered

### Option 1: Typed sections of blocks in TypeScript files

Each lesson is a `.ts` file exporting a plain readonly object: titled sections, each with a list of blocks from a small fixed set (a discriminated union, meaning every block has a `type` field and TypeScript knows its fields from that). Text fields allow a tiny markup for bold, highlight and links. A catalog file lists categories and topics.

**Pros**:
- The compiler catches a missing field, a wrong block type or a link to a misspelled topic id while you write.
- No parser, loader or extra library. Lessons are plain imports, bundled with the app.
- One generic renderer can show any lesson, so new topics need no screen work.

**Cons**:
- Writing a lesson means writing code syntax (quotes, commas, brackets), which is noisier than prose.
- A typo fix still needs a new build and install (true for any bundled option).

### Option 2: JSON files checked by a schema library

The same block shape, stored as `.json` files and checked at load time by a schema library such as Zod.

**Pros**:
- Pure data, easy for AI to output and for other tools to read.
- The same file could later feed a website or an export.

**Cons**:
- Adds a library and a runtime check on every start. Mistakes show up when the app runs, not in the editor.
- Topic ids in links are plain strings with no editor help.

### Option 3: Markdown files with frontmatter

Each lesson is a Markdown file with a small header for metadata. Tables and lists are written as normal Markdown, and tips, formulas and mistakes use custom syntax.

**Pros**:
- The nicest format to write and read as a human.
- Close to how AI naturally writes explanations.

**Cons**:
- Needs a Markdown parser in the app plus custom syntax for 3 block types, which is more code and another dependency to keep working through Expo upgrades.
- Mistakes in custom syntax are found only by running it, and free prose drifts away from a consistent lesson structure.

### Option 4: Fixed tense shaped fields

Every lesson has the same named fields: `form`, `uses`, `signalWords`, `mistakes`, `examples`.

**Pros**:
- The simplest to render and the most consistent for tenses.
- The screen layout is fully predictable.

**Cons**:
- Does not fit articles, prepositions or "common pairs", which have no formula or signal words. It fails the scope's own "a different kind of topic fits the same shape" test.

## Decision

**Chosen option**: Option 1: Typed sections of blocks in TypeScript files.

Lessons are readonly TypeScript objects made of titled sections of 7 block types, listed in a bundled catalog of categories and topics, with a tiny inline markup and a pure content validator run by Jest.

**Implementation skills**: `react-native-testing` (`callstack/react-native-testing-library`, `.claude/skills/react-native-testing/`) for the test layout. This feature has no screens, so the UI skills apply from feature 5 onwards.

### Decisions settled here (made while writing the spec)

- **Topic id type**: model types are generic over the id, with a plain default: `Topic<Id extends string = string>`, `Lesson<Id extends string = string>`. `model/types.ts` imports nothing. The catalog is written `as const satisfies readonly Topic[]`, and `TopicId = (typeof topics)[number]['id']` is exported from `content/catalog.ts`. Real lesson files are typed `Lesson<TopicId>`, so a misspelled `related` id fails `pnpm typecheck`. `validateContent` and `createQueries` take the plain `string` versions, so broken test fixtures still compile (the real data fits them too). `content/` may only `import type` from `model/`, and `model/` never imports `content/`, so there is no import loop. Inline `[[links]]` are plain strings, so the content test checks those. Runner up: plain `string` ids everywhere, checked only by the test.
- **Lesson registry**: `content/lessons/index.ts` exports `lessonsById: Partial<Record<TopicId, Lesson<TopicId>>>`. The key is the topic id, so a `Lesson` has no `topicId` field and two lessons for one topic cannot exist. Runner up: an array of lessons with `topicId`, which needs a duplicate rule.
- **Queries are built from data**: `model/catalog-queries.ts` exports `createQueries(categories, topics, lessonsById)`, which returns all lookup functions closed over those arrays. `index.ts` exports one set already bound to the real content. Tests build their own set from fixtures. Runner up: functions that import the content directly, which can't be tested with fixtures.
- **One tokenizer**: `parseInline` and `findMarkupProblems` share one internal tokenizer in `model/markup.ts`, so the parser and the checker can never disagree.
- **Tests**: in the root `__tests__/lessons/` folder (per `test-preferences.json`). Tests import the public `@/features/lessons` for the real content, and `@/features/lessons/model/...` for internal functions such as `validateContent`. That is allowed for tests only.
- **Link text**: `[[present-simple]]` shows the topic's `title`. `[[present-simple|tu]]` shows "tu". The parser only returns `{ kind: 'link', topicId, label? }`. The screen (feature 5) resolves the title through `getTopic`. Runner up: the parser takes the catalog as an argument, which mixes two jobs.
- **No nesting in markup**: bold, highlight and links do not nest inside each other. Inside a span, other markup characters show as literal text, and the checker reports them. This keeps the parser a small pure function. Runner up: nested markup, which AI rarely needs and makes balancing errors harder to explain.
- **Escaping**: there is no escape syntax. Grammar text never needs literal `**`, `==` or `[[`. If it ever does, add an escape then.
- **Order**: category and topic order is the array order in `catalog.ts`, and lesson order inside the registry does not matter. Runner up: an `order` number field, which drifts and duplicates.
- **Text language**: `Example.en`, `Mistake.wrong` and `Mistake.right` are English. All other text fields are Polish. Feature 5 uses this to set the reading language for VoiceOver (the iPhone screen reader). Table cells and formula parts are treated as Polish, even though they may hold English words.
- **Loading**: all lessons are static imports, read synchronously. About 100 short lessons are a few hundred kilobytes of text, small enough that lazy loading would only add complexity.
- **Public surface**: other features import only from `src/features/lessons/index.ts`, never from `content/` or `model/` directly. It exports: the types (`Category`, `Topic`, `TopicStatus`, `TenseTime`, `TenseAspect`, `TenseSlot`, `TenseGrid`, `Lesson`, `Section`, `Block`, `Example`, `InlineSpan`, `LessonLookup`), `TopicId`, `TENSE_TIMES`, `TENSE_ASPECTS`, the bound queries (`listCategories`, `listTopics`, `getTopic`, `getLesson`, `getTenseGrid`, `listDraftLessons`) and `parseInline`. `validateContent`, `findMarkupProblems`, `createQueries` and the raw content stay internal.

## Rationale

The content is mostly AI written and only you check it, so the most valuable property is catching mistakes before they reach the phone. TypeScript objects give the editor and `pnpm typecheck` that job for free, and a pure validator in Jest covers what types cannot express (balanced markup, table widths, dead links). JSON plus a schema library would catch the same errors later and add a dependency. Markdown would read nicer but needs a parser and custom syntax, which works against the "boring, few moving parts" rule from spec 0001.

Sections of blocks fit both a tense and articles, which is the scope's own test for this feature. Fixed fields (Option 4) are tidier for tenses but break on the very first non tense topic. Section titles give each lesson a clear outline. A small fixed set of 7 block types keeps the future renderer small and the look consistent, and a new type can be added through `/architect` when a topic truly needs one.

Keeping unwritten topics in the catalog, with tense grid slots on the topics themselves, means the home grid, the "not written yet" marks and the grammar map all come from one list that cannot drift. Stable English ids keep routes free of Polish letters and protect saved progress when a Polish title changes.

## Feature design

**Data model sketch** (all `readonly`, plain objects, no classes; `Id` defaults to `string`, real content uses `TopicId`):

| Entity | Key | Fields | Relationships and constraints |
|---|---|---|---|
| `Category` | `id: string`, kebab case, unique | `title: string` (PL, required), `summary?: string` (PL) | 1 to many `Topic`. Must have at least one topic. Order is the array order. |
| `Topic<Id>` | `id: Id`, kebab case, unique, never changes once a lesson ships | `categoryId: string` (required, points to a `Category`), `title: string` (required), `subtitle?: string` (PL gloss), `summary: string` (PL, required), `tense?: TenseSlot` | Many to 1 `Category`. 0 or 1 `Lesson`. Order is the array order. |
| `TenseSlot` | (time, aspect) unique across topics | `time: TenseTime`, `aspect: TenseAspect`. `TENSE_TIMES = ['present', 'past', 'future'] as const` and `TENSE_ASPECTS = ['simple', 'continuous', 'perfect', 'perfectContinuous'] as const` are runtime arrays in `model/types.ts`, and the two unions are derived from them. Their order is the grid order. | Only on tense topics. |
| `Lesson<Id>` | the key in `lessonsById` (a topic id) | `review: 'draft' \| 'checked'` (required), `sections: readonly Section[]` (at least 1), `related?: readonly Id[]` (no self link, no repeats) | 0 or 1 to 1 `Topic`. |
| `Section` | position | `title: string` (PL, required), `blocks: readonly Block[]` (at least 1) | 1 to many `Block`. |
| `Block` | position | One of: `{ type: 'text', text }` · `{ type: 'table', caption?, header?: readonly string[], rows: readonly (readonly string[])[] }` · `{ type: 'examples', items: readonly Example[] }` · `{ type: 'tip', text }` · `{ type: 'formula', label?, parts: readonly string[] }` · `{ type: 'mistake', wrong, right, note? }` · `{ type: 'list', items: readonly string[] }` | Every string allows inline markup. |
| `Example` | position | `en: string` (required), `pl: string` (required), `note?: string` (PL) | |
| `TopicStatus<Id>` | (query output) | `Topic<Id> & { isWritten: boolean }` | |
| `TenseGrid<Id>` | (query output) | `Record<TenseTime, Record<TenseAspect, TopicStatus<Id> \| undefined>>` | Polish row and column labels belong to feature 6. |
| `LessonLookup<Id>` | (query output) | `{ kind: 'ok', topic: Topic<Id>, lesson: Lesson<Id> }` · `{ kind: 'not-written', topic: Topic<Id> }` · `{ kind: 'unknown' }` | |
| `InlineSpan` | (parser output) | `{ kind: 'text', text }` · `{ kind: 'bold', text }` · `{ kind: 'highlight', text }` · `{ kind: 'link', topicId: string, label?: string }`, each also carrying `source: string` (the exact original characters, for the round trip check) | |
| `ContentProblem` | (validator output) | `{ rule: ContentRule, where: string, detail: string }`. `where` is a path such as `lesson:present-simple/sections[1]/blocks[2]/items[0]` or `topic:articles/summary`. `detail` is free text that tests do not check. | |

**Files**:

```
src/features/lessons/
  index.ts                     public surface (see Decision)
  model/types.ts               all types, TENSE_TIMES, TENSE_ASPECTS (imports nothing)
  model/markup.ts              tokenizer (internal), parseInline, findMarkupProblems
  model/collect-strings.ts     collectStrings: every text field of a lesson or topic, with its where path
  model/validate-content.ts    validateContent, ContentRule, ContentProblem
  model/catalog-queries.ts     createQueries
  content/catalog.ts           categories and topics (as const), TopicId
  content/lessons/index.ts     lessonsById
  content/lessons/present-simple.ts
  content/lessons/articles.ts
__tests__/lessons/             all tests for this feature
```

**Seed catalog** (titles and subtitles are fixed. Polish `summary` text for all 13 topics is drafted by AI in this build and checked by you later. Categories get no `summary` for now):

| Category | Topic id | Title | Subtitle | Tense slot |
|---|---|---|---|---|
| `tenses` "Czasy" | `present-simple` | Present Simple | czas teraźniejszy prosty | present, simple |
| | `present-continuous` | Present Continuous | czas teraźniejszy ciągły | present, continuous |
| | `present-perfect` | Present Perfect | czas teraźniejszy dokonany | present, perfect |
| | `present-perfect-continuous` | Present Perfect Continuous | czas teraźniejszy dokonany ciągły | present, perfectContinuous |
| | `past-simple` | Past Simple | czas przeszły prosty | past, simple |
| | `past-continuous` | Past Continuous | czas przeszły ciągły | past, continuous |
| | `past-perfect` | Past Perfect | czas zaprzeszły | past, perfect |
| | `past-perfect-continuous` | Past Perfect Continuous | czas zaprzeszły ciągły | past, perfectContinuous |
| | `future-simple` | Future Simple | czas przyszły prosty | future, simple |
| | `future-continuous` | Future Continuous | czas przyszły ciągły | future, continuous |
| | `future-perfect` | Future Perfect | czas przyszły dokonany | future, perfect |
| | `future-perfect-continuous` | Future Perfect Continuous | czas przyszły dokonany ciągły | future, perfectContinuous |
| `nouns-and-articles` "Rzeczowniki i przedimki" | `articles` | Przedimki a / an / the | (none, the title is already Polish) | (none) |

**Markup rules** (one tokenizer, used by both `parseInline` and `findMarkupProblems`):
- `**text**` is bold and `==text==` is highlight. The text inside must not be empty and must not contain other markup. `****`, `====`, an unclosed marker and nested markup are all plain text in the parser and a problem in the checker.
- `[[target]]` and `[[target|label]]` are links. `target` must match `^[a-z0-9-]+$`, otherwise the whole thing is plain text (and a problem). Everything after the first `|` is the label, including any further `|`. An empty label (`[[id|]]`) or an empty target (`[[ ]]`, `[[]]`) is plain text and a problem.
- Neighbouring plain text pieces are merged into one `text` span.
- Joining `source` across all spans always equals the input exactly (the round trip check).

**Validation rules** (`ContentRule` is a string union of these ids; text counts as empty when it is blank after trimming):

| Rule id | Fails when |
|---|---|
| `duplicate-category-id` | two categories share an id |
| `duplicate-topic-id` | two topics share an id |
| `bad-id-format` | a category id, topic id or `lessonsById` key does not match `^[a-z0-9]+(-[a-z0-9]+)*$` |
| `unknown-category` | a topic's `categoryId` is not a category |
| `empty-category` | a category has no topics |
| `lesson-without-topic` | a `lessonsById` key is not a topic id |
| `duplicate-tense-slot` | two topics share the same (time, aspect) |
| `dead-related` | a `related` id is not a topic id |
| `self-related` | a lesson lists its own topic in `related` |
| `duplicate-related` | the same id appears twice in one `related` |
| `dead-link` | a `[[link]]` target is not a topic id |
| `no-sections` | a lesson has zero sections |
| `empty-section` | a section has zero blocks |
| `empty-block` | an `examples`, `list` or `table` has no items or rows, a table row has zero cells, or a `header` is an empty list |
| `short-formula` | a `formula` has fewer than 2 parts |
| `ragged-table` | a table row's cell count differs from the header's, or from the first row's when there is no header |
| `empty-text` | any string reached by `collectStrings` is empty (including optional fields when present, such as `caption`, `note`, `subtitle`) |
| `bad-markup` | `findMarkupProblems` reports anything for a string reached by `collectStrings` |

`collectStrings` covers, for a lesson: section titles, `text`, `tip`, every table caption, header and cell, every example's `en`, `pl` and `note`, every formula `label` and part, every mistake's `wrong`, `right` and `note`, and every list item. For a topic it covers `title`, `subtitle` and `summary`, and for a category `title` and `summary`. Markup and link checks run on all of these.

The rule "all 12 tenses have a grid slot" is not generic, so it lives in the catalog test, not in the validator.

**State transitions**: `Lesson.review` goes `draft` → `checked` when you finish checking a lesson. You make the change by hand in the content file. It may go back to `draft` if you rewrite a lesson. A topic is "not written" until `lessonsById` has an entry for it. Nothing changes at runtime.

**API surface** (pure TypeScript functions, no network, no storage, no auth):

| Function | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|
| `createQueries(categories, topics, lessonsById)` | the content arrays and map (plain `string` id types) | an object with the six functions below, closed over the inputs. Lookups by id use a `Map` or `Object.hasOwn`, never a bare property read. | none (local) | none |
| `listCategories()` | none | `readonly Category[]` in catalog order | none | none |
| `listTopics(categoryId)` | `categoryId: string` | `readonly TopicStatus[]` in catalog order | none | unknown category returns `[]` |
| `getTopic(id)` | `id: unknown` | `Topic \| undefined` | none | anything not a known id returns `undefined` |
| `getLesson(id)` | `id: unknown` | `LessonLookup` | none | never throws. Non strings and unknown ids give `unknown` |
| `getTenseGrid()` | none | `TenseGrid`. A cell with no topic is `undefined`. If two topics claim a cell (the validator forbids it), the first in catalog order wins | none | none |
| `listDraftLessons()` | none | `readonly Topic[]` whose lesson has `review: 'draft'`, in catalog order | none | none |
| `parseInline(text)` | `text: string` | `readonly InlineSpan[]` | none | never throws |
| `findMarkupProblems(text)` | `text: string` | `readonly string[]`, short English messages for tests | none | none |
| `validateContent(categories, topics, lessonsById)` | as `createQueries` | `readonly ContentProblem[]` | none | returns problems instead of throwing |

**Value sourcing**:

| Action | Value produced / displayed | Source |
|---|---|---|
| `listCategories` | category order, `title`, `summary` | array order and fields in `content/catalog.ts` |
| `listTopics`, `getTenseGrid` | `isWritten` | derived: `Object.hasOwn(lessonsById, topic.id)` |
| `getTenseGrid` | which topic sits in each cell | derived from `Topic.tense`. Row and column order come from `TENSE_TIMES` and `TENSE_ASPECTS` |
| `getTenseGrid` | Polish row and column labels | not produced here, decided in feature 6 |
| `getLesson` | `kind` | derived: id is a string, is a catalog topic, and has an entry in `lessonsById` |
| `getLesson` | lesson sections and blocks | the lesson file |
| `listDraftLessons` | which lessons are drafts | `Lesson.review` |
| `parseInline` | link label when none is given | not produced here. The screen uses `getTopic(topicId).title` (feature 5) |
| `validateContent` | the list of real topic ids for link checks | derived from the `topics` argument |
| `validateContent` | `where` path | built by `collectStrings` while walking |
| Feature 5 reading language | which strings are English | the field: `Example.en`, `Mistake.wrong`, `Mistake.right` (decided above) |
| Feature 8 progress key | lesson identity | `Topic.id` (stable `TopicId`) |

**Key invariants**:
- Category ids and topic ids are unique and kebab case. A topic id never changes or disappears once a lesson for it has shipped, because progress (feature 8) and routes use it. A snapshot test of the shipped topic ids makes any rename or removal a deliberate, visible change.
- Every reference points to something real: `categoryId`, `lessonsById` keys, `related`, `[[links]]`.
- At most one lesson per topic (guaranteed by the map) and at most one topic per tense grid cell.
- No blank strings, no empty sections, lists, examples or tables, and table rows are all the same width.
- Markup is valid in all shipped content (the parser still survives when it is not).
- `model/` never imports `content/`. `content/` only uses `import type` from `model/`. `src/features/lessons` imports nothing from `src/app`, `expo-sqlite` or any network API. Content is plain data with no functions inside.

**Security model**: none needed. One local reader, no accounts, no personal data, no network. Content is public grammar text bundled in the app.

**Critical test scenarios** (exact counts run against fixtures built with `createQueries`, so adding real lessons later doesn't break them; only the content test and the id snapshot run on real content):
- Happy path (fixtures): `getLesson` returns `ok` for a written fixture topic and `not-written` for an unwritten one, verifies **AC-3**.
- Real content: `getLesson('present-simple')` and `getLesson('articles')` return `ok`, the two lessons together use all 7 block types, at least one `[[link]]` and one `related`, and `validateContent` returns no problems, verifies **AC-1**, **AC-5**.
- Catalog (real content): 2 categories in order, 13 topics, every tense topic has a slot, and `getTenseGrid()` has 12 distinct filled cells. A snapshot of the topic ids, verifies **AC-2**.
- Odd input: `getLesson` with `'nope'`, `''`, `undefined`, `['present-simple']`, `'constructor'` and `'__proto__'` all return `unknown` and never throw, verifies **AC-3**.
- Markup: each rule in *Markup rules* has a case. For example `'He ==works== **every** day, see [[present-continuous|tu]].'` gives the expected spans, and `'a **b'`, `'****'`, `'**a ==b== c**'`, `'[[Foo Bar]]'`, `'[[x|]]'` come back as plain text. The round trip holds for every case, and a sentence with all 18 Polish letters comes back unchanged, verifies **AC-4**.
- Validation: one small broken fixture per rule id, each producing exactly that `rule`, verifies **AC-5**.
- Extensibility: an extra fixture topic and lesson passed to `createQueries` and `validateContent` work with no change under `model/`, verifies **AC-6**.
- Drafts (fixtures): `listDraftLessons()` returns only the draft fixture lessons, in catalog order, verifies **AC-7**.

## Build plan

Ordered by Tracer Bullet: first one thin thread from a content file through a lookup to a passing test, then thicken it.

1. Create `model/types.ts` with every type in the data model (all 7 block types, `TENSE_TIMES`, `TENSE_ASPECTS`). Create `content/catalog.ts` with the `tenses` category and two topics (`present-simple`, `present-continuous`), a minimal `content/lessons/present-simple.ts` (one section, one `text` block, `review: 'draft'`), and `content/lessons/index.ts` with `lessonsById`. Add `createQueries` with `getTopic` and `getLesson`, and the public `index.ts`. Write tests for `ok`, `not-written` and every odd input. Satisfies **AC-3**, starts **AC-1**.
2. Write `model/markup.ts` (tokenizer, `parseInline`, `findMarkupProblems`) with a test for every markup rule, the round trip and Polish letters. Satisfies **AC-4**.
3. Fill `content/catalog.ts` with both categories and all 13 topics from the seed table, with AI drafted Polish summaries. Add `listCategories`, `listTopics` and `getTenseGrid`, with fixture tests and the real catalog test (including the topic id snapshot). Satisfies **AC-2**.
4. Write `model/collect-strings.ts` and `model/validate-content.ts` with every rule in *Validation rules*, one failing fixture test per rule id, and the content test that expects no problems on real content. Satisfies **AC-5**.
5. Grow `present-simple.ts` into a short real draft (for example sections "Budowa", "Kiedy używamy", "Słowa sygnałowe", "Typowe błędy") and write `articles.ts` as a short real draft. Between them, use all 7 block types, at least one `[[link]]` and one `related`, and add that assertion to the content test. Both stay `review: 'draft'`. Satisfies **AC-1**.
6. Add `listDraftLessons` and its fixture test. Satisfies **AC-7**.
7. Add the extensibility test (an extra fixture topic and lesson through `createQueries` and `validateContent`). Satisfies **AC-6**.
8. Run `pnpm typecheck`, `pnpm lint`, `pnpm test`. For `/check verify` (Alpha), this feature has no screen, so verifying means these checks pass and the content test lists zero problems. The real app check of this shape happens in feature 5. Satisfies **AC-1** to **AC-7**.

## Consequences

**Positive**:
- One shape for every lesson. Feature 5 builds one renderer for 7 block types, and every later lesson is data only.
- AI written content is checked by the compiler and one test before it ever reaches your phone.
- The tense grid, the "not written yet" marks and the grammar map all read the same catalog, so they cannot disagree.
- Stable English ids keep routes simple and protect saved progress.

**Negative / tradeoffs**:
- Lessons are written in TypeScript syntax, which is noisier to read than prose. Reviewing a lesson is easier on the phone than in the file.
- 7 block types may not cover everything. "Common pairs" (feature 11) may want a side by side comparison block, which means a new type, a validator rule and a renderer change, through `/architect`.
- No nesting or escaping in markup. Rare text that needs it must be reworded until an escape is added.
- Table cells and formula parts are read by VoiceOver as Polish, even when they hold English words.
- Changing a topic id after its lesson ships breaks saved progress for it, so ids are effectively permanent.

**Neutral**:
- No new libraries, no environment variables, no storage.
- The two sample lessons are short drafts. Feature 5 turns Present Simple into the full checked lesson, and Articles stays a draft until its own feature (15).
- Feature 12 extends the catalog with more categories and topics; the shape stays the same.

## Follow-up

- [ ] Feature 4 (design system): define the look of each of the 7 block types (tip as a speech bubble, highlight in orange, formula pieces, mistake crossed out) in light and dark.
- [ ] Feature 5: build the generic lesson renderer from `Block` and `InlineSpan`, set the reading language from the English fields, resolve link labels with `getTopic`, show a "wersja robocza" badge for `review: 'draft'`, and handle `not-written` and `unknown` with a Polish message.
- [ ] Feature 6: build the home grid from `getTenseGrid()` and mark topics where `isWritten` is false.
- [ ] Feature 8: key saved progress by `TopicId`, and ignore saved ids that are no longer in the catalog.
- [ ] Feature 11: decide in `/architect common pairs compared` whether the existing blocks are enough or a comparison block is needed.
- [ ] Feature 12: extend `content/catalog.ts` with the agreed full topic list.
