# Verify: Lesson content model · spec 0002 · updated 2026-11-27
_Steps derived from spec 0002 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones. This feature has no screen, so the checks are commands; the real app check of this shape happens in feature 5._

## UI / manual
- (none: no screen in this feature)

## Commands
- [ ] `pnpm typecheck` passes, and changing `related: ['present-simple']` to `['present-simpel']` in `src/features/lessons/content/lessons/articles.ts` makes it fail (undo afterwards) → AC-1, AC-6
- [ ] `pnpm test -- __tests__/lessons/content.test.ts` → the validator finds 0 problems in the real content; Present Simple and Articles together use all 7 block types, at least one `[[link]]` and one `related` entry → AC-1, AC-5
- [ ] `pnpm test -- __tests__/lessons/catalog.test.ts` → 2 categories in order (`tenses`, `nouns-and-articles`), the 13 topic ids match the shipped list, every tense has a slot, and the grid has 12 different topics → AC-2
- [ ] `pnpm test -- __tests__/lessons/get-lesson.test.ts` → `ok` for a written topic, `not-written` for an unwritten one, `unknown` for `'nope'`, `''`, `undefined`, `['present-simple']`, `'constructor'`, `'__proto__'`, never a throw → AC-3
- [ ] `pnpm test -- __tests__/lessons/markup.test.ts` → every markup rule has a case, the round trip gives back each input exactly, all 18 Polish letters pass through → AC-4
- [ ] `pnpm test -- __tests__/lessons/validate-content.test.ts` → each of the 18 rules has a failing fixture that reports exactly that rule → AC-5
- [ ] `pnpm test -- __tests__/lessons/drafts-and-extensibility.test.ts` → a new category, topic and lesson pass `validateContent` and `createQueries` with no change under `model/`; `listDraftLessons` keeps catalog order and skips `checked` lessons → AC-6, AC-7
- [ ] `pnpm lint` and `pnpm format:check` → clean

## Value sourcing
- [ ] `isWritten` comes from `lessonsById`: in `getTenseGrid()`, Present Simple is `true` and Past Simple is `false` → AC-2
- [ ] Grid cells come from `Topic.tense`; row order follows `TENSE_TIMES` and column order follows `TENSE_ASPECTS` (fixture test checks the key order) → AC-2
- [ ] `getLesson` kind follows the id type, the catalog and `lessonsById` (a `lessonsById` entry set to `undefined` gives `not-written`) → AC-3
- [ ] The draft list follows `Lesson.review`: set one sample lesson to `'checked'` and it leaves `listDraftLessons()` (undo afterwards) → AC-7
- [ ] Dead links are checked against the `topics` argument: `[[future-simple]]` in a fixture without that topic gives `dead-link` → AC-5
- [ ] The `where` path points at the exact field, for example `lesson:present-simple/sections[1]/blocks[1]/items[0]/en` → AC-5

## Acceptance-criteria coverage
- AC-1: typecheck step, content test · AC-2: catalog test, `isWritten` and grid steps · AC-3: get-lesson test, kind step · AC-4: markup test · AC-5: validate-content test, content test, dead link and `where` steps · AC-6: typecheck step, extensibility test · AC-7: drafts test, draft list step
