# Verify: First lesson on your iPhone · spec 0004 · updated 2026-11-27
_Steps derived from spec 0004 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual
Run these on a Release build on your iPhone (`pnpm expo run:ios --device --configuration Release`).
- [ ] Airplane mode on, open the app → home shows the `Present Simple` card above `Zobacz wzornik`, no loading or error → AC-1, AC-11
- [ ] Tap the card → the lesson opens with the title, subtitle, `Wersja robocza` chip, summary card, sections 1 to 8, then `Zobacz też` → AC-2, AC-7, AC-11
- [ ] Scroll until the big title goes under the header → the header shows `Present Simple`; scroll back up → it hides → AC-3
- [ ] Tap `Present Continuous` in the section 8 tip → its not written page opens; go back (button and swipe) → same scroll position → AC-4, AC-5
- [ ] Tap the `Past Simple` card → muted card with `Lekcja jeszcze niegotowa`, then the not written page with `Ta lekcja jeszcze nie powstała.` → AC-5
- [ ] Open `grammy://lesson/nie-ma-takiej` → `Nie znaleziono lekcji`, empty header title, `Wróć do strony głównej` goes back home → AC-6
- [ ] VoiceOver: section headings read `1. Kiedy używamy` and so on, the badge is not read; an English example reads in an English voice; a mistake reads `Błędnie`, then the sentence in English; icons are silent → AC-9
- [ ] Light and dark, and the largest accessibility text size: nothing clipped or overlapping, no sideways scroll except a wide table with its hint, every pressable (home card, `Zobacz też` cards, `Wróć do strony głównej`, `Zobacz wzornik`) at least 44 points tall → AC-10
- [ ] Grammar check (below), fix anything in `content/lessons/present-simple.ts`, then set `review: 'checked'` → the chip is gone and `listDraftLessons()` no longer returns `present-simple` → AC-12

## Value sourcing
- [ ] Draft chip follows `lesson.review`: with `review: 'checked'` the chip disappears → AC-12
- [ ] `Zobacz też` order follows `related`: Present Continuous first, then Past Simple → AC-2
- [ ] Card muted state follows `getLesson`: both related cards are muted today, the Present Simple home card is not → AC-5
- [ ] Section numbers come from position: 1 to 8 in content order → AC-2, AC-7
- [ ] Header title text is `topic.title` on the lesson and not written pages, and always empty on the not found page → AC-3, AC-6

## Commands
- [ ] `pnpm test` → all pass (238 at build time) → AC-1 to AC-9, AC-12 (mocked)
- [ ] `pnpm typecheck` and `pnpm lint` → clean

## Acceptance-criteria coverage
- AC-1 home card · AC-2 lesson page · AC-3 header title · AC-4 navigation · AC-5 not written · AC-6 not found · AC-7 8 sections · AC-8 `example-count` (Jest only) · AC-9 VoiceOver · AC-10 look and large text · AC-11 offline Release run · AC-12 grammar check
