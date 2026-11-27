# 0004. First lesson on your iPhone: rationale

The decision record behind [index.md](index.md). `/develop` reads `index.md`; this file explains why.

## Context

Grammy has its foundations: the stack (spec 0001), the lesson content model and catalog (spec 0002), and the design system with a view for every block type (spec 0003). What it does not have is a real screen. The only place a lesson appears is the temporary Wzornik sample book, and the Present Simple file is a short draft of 4 sections. The scope's feature 5 asks for one complete lesson, read on the iPhone offline, in light and dark, with its grammar checked, to prove the content shape and the design before more lessons are written.

The forces at play: there is one learner and no server, so there is no real load or security pressure, but there is a strong reuse pressure. Feature 6 (the tense map) and feature 7 (three more tenses) follow straight after, and whatever this feature sets up (the route, the page layout, the lesson outline) gets copied 11 more times for the tenses and about 100 times for the whole grammar. A choice that only fits Present Simple would be rebuilt almost at once.

Two edge cases are already live. The Present Simple draft links to Present Continuous and Past Simple, which are in the catalog but not written, and spec 0003 left open what a press on such a link should do. A route that takes an id from outside (a link, later a deep link) can also receive an id that does not exist. Spec 0002's `getLesson` already reports all three cases (`ok`, `not-written`, `unknown`) without throwing; the screen has to show each of them well.

Finally, the content itself is the product. The lessons are AI drafted and checked by you as you learn, so the feature has to make the draft state visible and the check concrete, or unchecked grammar ships quietly. If nothing is decided here, the first screen gets built ad hoc, the outline drifts lesson to lesson, and dead end links reach the phone.

## Options considered

### Option 1: One dynamic lesson route, one scrolling page

A single `/lesson/[id]` route reads `getLesson(id)` and shows the lesson, a not written page, or a not found page. A written lesson is one scrolling page: title, summary card, numbered sections, related cards. A temporary home card opens it.

**Pros**:
- Every future lesson works with no new route or screen.
- All three lookup results have a home, so no link is a dead end.
- Fits the existing `Screen`, `SectionView` and table width rule unchanged.

**Cons**:
- More states to build and test now than one lesson strictly needs.
- A long page has no jump to section; you scroll.

### Option 2: One static Present Simple screen

A route `/present-simple` that renders that one lesson directly, the thinnest way to get it onto the phone.

**Pros**:
- Smallest build; fewest states.
- Nothing to decide about unknown ids.

**Cons**:
- Feature 7 needs three more routes or a rewrite into Option 1 straight away.
- Links to other topics still have nowhere to go.
- Proves the content, but not the path feature 6 depends on.

### Option 3: Dynamic route with one section per page

The same `/lesson/[id]` route, but each section is its own page that you swipe through, with a page indicator.

**Pros**:
- Short, focused pages; clear sense of progress through a lesson.
- A natural place for a future "part 4 of 8" resume point.

**Cons**:
- Paging fights Dynamic Type: at large text sizes one section is taller than the screen, so you scroll inside a swipe.
- Wide tables that scroll sideways clash with a sideways swipe gesture.
- More navigation code (pager, indicator, VoiceOver page announcements) for a lesson of 8 short parts.

## Rationale

Option 1 wins because of the reuse pressure in Context: the next two features both need a route that works for any topic and a way to show unwritten ones. Building that once now costs a few extra states, and those states are exactly the edge cases (unwritten links, bad ids) that already exist in the draft content. Option 2 is cheaper today but is thrown away in feature 7, and it leaves the spec 0003 question about unwritten links unanswered.

Option 3 was the strongest alternative, because a section by section reader does feel like a course. It loses on this project's own rules: the accessibility baseline requires text that scales with Dynamic Type, and spec 0003 already lets wide tables scroll sideways. Both work naturally on a vertical page and badly inside a horizontal pager. The numbered section badges give most of the "where am I" benefit of paging without the gesture conflicts, and a jump list can be added later if lessons grow.

The other calls follow the same reasoning. Use before form, because a beginner needs to know why a tense exists before its parts make sense. The 3 to 5 examples rule lives in the validator because every later lesson copies this one, and a rule only in a guideline drifts. The visible draft chip and the written grammar checklist exist because the content is AI drafted: they turn "you check it as you learn" into a concrete, visible step that gates `done`. The English voice for example sentences follows spec 0002's field language decision; splitting the mistake rows into a Polish label and an English sentence is the only way to give each part its correct voice, since one accessibility label cannot mix languages.
