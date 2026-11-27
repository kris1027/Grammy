# 0002. Rationale

## Context

Grammy will hold many lessons: 12 tenses first, then the rest of English grammar (verb forms, articles, clauses, advanced structures). AI drafts each lesson in Polish and you check it as you learn. Lessons are reading only: short explanations, tables and examples, with no exercises. Everything ships inside the app and works offline (spec 0001).

The content differs a lot between topics. A tense has a sentence formula, uses, signal words and typical mistakes. Articles (a, an, the) have no formula at all, only rules, contrasts and examples. Later topics such as "common pairs" or "how to choose a tense" link lessons together. The shape has to fit all of them without a new screen per topic, or the app turns into dozens of one off screens.

Several features wait on this decision. Feature 5 renders the first lesson, feature 6 draws the 12 tense grid and marks unwritten tenses, feature 8 saves progress against lesson ids, and feature 12 grows the catalog into a full grammar map. If the shape is wrong, every lesson written on top of it has to be rewritten, and saved progress breaks if ids change.

The forces: one developer and one reader, content written mostly by AI (so mistakes must be caught automatically), Polish text with English examples, light and dark mode, Dynamic Type, and the project rules (functional style, plain immutable data, typed results, no network, folders by feature).

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

## Rationale

The content is mostly AI written and only you check it, so the most valuable property is catching mistakes before they reach the phone. TypeScript objects give the editor and `pnpm typecheck` that job for free, and a pure validator in Jest covers what types cannot express (balanced markup, table widths, dead links). JSON plus a schema library would catch the same errors later and add a dependency. Markdown would read nicer but needs a parser and custom syntax, which works against the "boring, few moving parts" rule from spec 0001.

Sections of blocks fit both a tense and articles, which is the scope's own test for this feature. Fixed fields (Option 4) are tidier for tenses but break on the very first non tense topic. Section titles give each lesson a clear outline. A small fixed set of 7 block types keeps the future renderer small and the look consistent, and a new type can be added through `/architect` when a topic truly needs one.

Keeping unwritten topics in the catalog, with tense grid slots on the topics themselves, means the home grid, the "not written yet" marks and the grammar map all come from one list that cannot drift. Stable English ids keep routes free of Polish letters and protect saved progress when a Polish title changes.
