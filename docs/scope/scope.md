# Scope: Grammy

A personal iPhone app, written in Polish, for learning English grammar and nothing else. It is for one learner (you), starting from simple A1 to A2 explanations. It is built with React Native and has no accounts, database, server or serverless functions. All lessons live inside the app and work offline.

**Build approach:** Tracer Bullet (build one small piece fully working, then add the next).
**Workflow:** Alpha (after `/develop`, run `/check verify` on the real app). This is the default level of care. `/architect` is the recommended first stop for a feature with a real decision, but you can skip it when you already know the build. A feature with its own tag (such as `· Beta`) gets more checking.

**Decisions so far**
- Lessons only: short explanations, tables and examples. No exercises or quizzes.
- The 12 tenses come first, then the rest of English grammar.
- AI drafts the lessons in Polish, and you check them as you learn.
- The look follows your sketch picture (hand drawn feel, orange highlights, icons, speech bubbles), with dark mode too.
- Progress is saved on your phone only.
- iPhone only, with a free install for now. A free install stops working after about 7 days until you install it again.

_These are recommendations to keep your build orderly, not requirements. Skip anything that does not fit. You decide when a feature is `done`._

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| 1 | Stack and architecture | Foundation | done |
| 2 | Coding standards and tooling | Foundation | done |
| 3 | Lesson content model | Foundation | done |
| 4 | Design system and UI foundation | Foundation | done |
| 5 | First lesson on your iPhone | Skeleton | in-progress |
| 6 | Home and tense map | Slice 1 | planned |
| 7 | Starter tense lessons | Slice 1 | planned |
| 8 | Learned marks and resume | Slice 1 | planned |
| 9 | Remaining tense lessons | Slice 2 | planned |
| 10 | How to choose a tense | Slice 2 | planned |
| 11 | Common pairs compared | Slice 2 | planned |
| 12 | Full grammar map | Slice 3 | planned |
| 13 | Verb forms | Slice 4 | planned |
| 14 | Conditionals, passive and reported speech | Slice 4 | planned |
| 15 | Nouns, articles and quantifiers | Slice 5 | planned |
| 16 | Pronouns, adjectives, adverbs and prepositions | Slice 5 | planned |
| 17 | Sentences and clauses | Slice 5 | planned |
| 18 | Advanced structures | Slice 6 | planned |

## Foundations

### 1. Stack and architecture · Beta · done
Settle how the React Native app is set up, then create an empty project that runs. The free iPhone install is a limit the decision has to respect.
**Done when:** the setup is recorded in a spec, and the empty app builds and opens on your iPhone with no server.
**Spec:** [0001](../specs/0001-expo-offline-iphone-stack/index.md)
**Code:** code in `src/` (config in `app.json`, sample test in `__tests__/`)
- [x] Decide the stack (spec): `/architect stack and architecture`
- [x] Scaffold from the decision: `/develop stack and architecture`
- [x] Verify it: `/check verify stack and architecture`
- [x] Test it: `/test stack and architecture`

### 2. Coding standards and tooling · done
Write down the project rules and set up automatic code checks, based on the real project.
**Done when:** root `AGENTS.md` matches the real project, and all code checks run clean.
**Code:** config in `eslint.config.js`, `.prettierrc.json`, `package.json` (scripts, hook, lint-staged), `.github/workflows/ci.yml`
- [x] Capture rules and tool choices: `/audit`
- [x] Install the tooling: `/develop tooling`
- [x] Check it runs clean: `/check verify tooling`

### 3. Lesson content model · done
Define the shape every lesson follows (headings, explanations in Polish, tables, examples, tips) and how lessons are grouped. It matters because all content depends on it.
**Done when:** a tense lesson and a different kind of grammar topic both fit the same shape, and adding a lesson needs no screen changes. All content ships inside the app.
**Spec:** [0002](../specs/0002-lesson-content-model/index.md)
**Code:** code in `src/features/lessons/` (tests in `__tests__/lessons/`)
- [x] Design it (spec): `/architect lesson content model`
- [x] Build it: `/develop lesson content model`
  - [x] Types, lookups and a thin Present Simple thread, with odd input tests (AC-3)
  - [x] Inline markup parser and checker (AC-4)
  - [x] Full catalog of 12 tenses plus articles, and the tense grid (AC-2)
  - [x] Content validator and the two short sample lessons (AC-1, AC-5)
  - [x] Draft list and extensibility test (AC-6, AC-7)
- [x] Verify it: `/check verify lesson content model`

### 4. Design system and UI foundation · done
Turn your sketch picture into a clean, reusable look: colours, fonts, icons, cards, tables and speech bubbles, in light and dark.
**Done when:** `design.md` and the base components cover light and dark mode, Polish letters display correctly, text and tables are easy to read on an iPhone, and the style does not copy artwork from the sample picture.
**Spec:** [0003](../specs/0003-design-system-ui-foundation/index.md) · code in `src/ui`, `src/features/lessons/views`, `src/features/showcase` · spec revised 2026-11-27 after `/check verify`: table columns sized by their longest word, tip links reachable by VoiceOver, back button keeps the iOS glass colour
- [x] Design it (spec): `/architect design system and UI foundation`
- [x] Build it: `/develop design system and UI foundation`
  - [x] Font, tokens, contrast checks and a thin showcase thread on the iPhone (AC-1, AC-2, AC-3, AC-11)
  - [x] Shared parts in `src/ui` (AC-4, AC-5)
  - [x] Views for the 7 lesson block types and the full showcase (AC-6, AC-7, AC-8)
  - [x] App icon, splash and `docs/design.md` (AC-9, AC-10)
- [x] Verify it: `/check verify design system and UI foundation`

## Skeleton

### 5. First lesson on your iPhone · Beta · in-progress
One complete Present Simple lesson, from stored content to the finished screen. It proves the content shape and design before more lessons are written.
**Done when:** you can open the app on your iPhone without internet and read the whole Present Simple lesson in Polish, in light and dark, and you have checked that its grammar is correct.
**Spec:** [0004](../specs/0004-first-lesson-on-iphone/index.md)
- [x] Design it (spec): `/architect first lesson on your iPhone`
- [ ] Build it: `/develop first lesson on your iPhone`
  - [ ] Thin thread: home card, `/lesson/[id]` route and the lesson page with numbered sections and `Zobacz też` (AC-1, AC-2)
  - [ ] Not written and not found pages, link and card navigation, header title on scroll (AC-3, AC-4, AC-5, AC-6)
  - [ ] English voice for English text, the `example-count` rule, and the full 8 section Present Simple lesson (AC-7, AC-8, AC-9)
  - [ ] Design notes, light and dark, large text and an offline Release run on the iPhone (AC-10, AC-11)
  - [ ] Your grammar check, then mark the lesson `checked` (AC-12)
- [ ] Verify it: `/check verify first lesson on your iPhone`
- [ ] Test it: `/test first lesson on your iPhone`

## Slice 1: Starter tenses

### 6. Home and tense map · needs a decision
The home screen shows the 12 tenses as 3 time frames by 4 aspects, with a short intro to the system and a clear place to start.
**Done when:** all 12 tenses appear in the grid, available lessons open, unwritten ones are clearly marked, and all app text is in Polish.
- [ ] Design it (spec): `/architect home and tense map`

### 7. Starter tense lessons
Add Present Continuous, Past Simple and Future Simple. With Present Simple, these are the four your picture suggests starting with.
**Done when:** all three lessons open from the home screen, follow the same layout, and you have checked them.
- [ ] Build it: `/develop starter tense lessons`

### 8. Learned marks and resume · needs a decision
Mark lessons as learned and return to where you stopped.
**Done when:** you can mark and unmark a lesson, see it on the home screen, and keep both the marks and your last lesson after restarting the app. It all stays on your phone.
- [ ] Design it (spec): `/architect learned marks and resume`

## Slice 2: All tenses

### 9. Remaining tense lessons
Write the other 8 tense lessons so all 12 are complete.
**Done when:** all 12 tenses open and read correctly, and you have checked the new ones.
- [ ] Build it: `/develop remaining tense lessons`

### 10. How to choose a tense · needs a decision
A quick guide based on two questions: when does it happen, and how do you see the action (fact, ongoing, result, or lasting up to a moment).
**Done when:** you can follow both questions to the matching tenses and open their lessons.
- [ ] Design it (spec): `/architect how to choose a tense`

### 11. Common pairs compared · needs a decision
Side by side explanations of forms that are easy to mix up: Present Simple and Present Continuous, Present Perfect and Past Simple, will and be going to.
**Done when:** all three pairs show the differences with examples, are easy to read on a phone, and link to related lessons.
- [ ] Design it (spec): `/architect common pairs compared`

## Slice 3: Growing beyond tenses

### 12. Full grammar map · needs a decision
Agree the complete list of topics (including how advanced it goes) and extend the home screen so you can browse them all. This is how you will know when "all English grammar" is covered.
**Done when:** there is an agreed topic list assigned to features 13 to 18 (or new rows for gaps), and you can browse it by category with tenses still easy to find.
- [ ] Design it (spec): `/architect full grammar map`

## Slice 4: Verbs and key structures

The topics in features 13 to 18 are a first draft. The full grammar map confirms them. If a topic needs a new kind of layout, run `/architect` for it first. Each feature may be split into smaller ones.

### 13. Verb forms
Modal verbs, gerunds and infinitives, imperatives, and phrasal verbs.
**Done when:** every topic assigned here on the grammar map has a lesson you have checked.
- [ ] Build it: `/develop verb forms`

### 14. Conditionals, passive and reported speech
Conditionals and wishes, the passive voice, "have something done", and reported speech.
**Done when:** every topic assigned here on the grammar map has a lesson you have checked.
- [ ] Build it: `/develop conditionals, passive and reported speech`

## Slice 5: Words and sentences

### 15. Nouns, articles and quantifiers
Singular and plural, countable and uncountable nouns, possessives, a, an, the, and quantity words.
**Done when:** every topic assigned here on the grammar map has a lesson you have checked.
- [ ] Build it: `/develop nouns, articles and quantifiers`

### 16. Pronouns, adjectives, adverbs and prepositions
Pronouns and determiners, comparing things, word position for adverbs, and prepositions.
**Done when:** every topic assigned here on the grammar map has a lesson you have checked.
- [ ] Build it: `/develop pronouns, adjectives, adverbs and prepositions`

### 17. Sentences and clauses
Word order, questions and negatives, question tags, relative clauses and linking words.
**Done when:** every topic assigned here on the grammar map has a lesson you have checked.
- [ ] Build it: `/develop sentences and clauses`

## Slice 6: Advanced grammar

### 18. Advanced structures
Inversion, cleft sentences, the subjunctive, participle clauses and other advanced topics, explained simply.
**Done when:** every topic assigned here on the grammar map has a lesson you have checked.
- [ ] Build it: `/develop advanced structures`

## Deferred
Left out for now, kept so the plan stays honest.
- **Exercises and quizzes**: you chose lessons only
- **Review reminders**: bringing back older topics
- **Search**: worth another look once the app grows beyond tenses
- **Favourites**: bookmark topics
- **Pronunciation audio**: hear the examples
- **Android**: iPhone only for now
- **Longer lasting install**: a paid Apple developer account, if the weekly reinstall annoys you
- **Hand drawn icons**: a few sketched SVG icons in place of SF Symbols, drawn fresh (from spec 0003)
- **Present Simple B1 extras**: stative verbs and timetable future (from spec 0004)
- **Jump to section**: a list at the top of a lesson that jumps to each numbered section, if lessons grow long (from spec 0004)

## Legend

**The decision box** is the box whose label ends with `(spec)`. `/architect` ticks it. Every other box is a build or check step.

- **Next step** = the first unticked box.
- **needs a decision** = run `/architect` first. Otherwise go to `/develop` (or `/audit` for standards and tooling). The tag drops once the spec exists.
- **After a spec is written**, `/architect` adds the build, milestone and check boxes. The detailed build tasks stay in the spec.
- **Status** goes `planned` → `in-progress` → `done`. `existing` means built before this workflow. `dropped` means removed from the plan but kept for history.
- **Workflow:** Prototype = nothing after `/develop`. Alpha = `/check verify`. Beta = `/check verify`, then `/test`. GA = also `/check review` and `/document`.
- **Approach tag** beside a heading changes the build approach for that feature only.
- **Spec and code pointers** appear under a feature once they exist.
