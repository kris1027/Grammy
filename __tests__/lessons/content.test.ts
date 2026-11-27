import { getLesson, listDraftLessons, parseInline, type Block } from '@/features/lessons';
import { categories, topics } from '@/features/lessons/content/catalog';
import { lessonsById } from '@/features/lessons/content/lessons';
import { collectLessonStrings } from '@/features/lessons/model/collect-strings';
import { validateContent } from '@/features/lessons/model/validate-content';

// The content test: runs every rule against the real, shipped content.

const ALL_BLOCK_TYPES: readonly Block['type'][] = [
  'text',
  'table',
  'examples',
  'tip',
  'formula',
  'mistake',
  'list',
];

test('the real content has no problems (covers: AC-1, AC-5)', () => {
  expect(validateContent(categories, topics, lessonsById)).toEqual([]);
});

test('Present Simple and Articles are both written (covers: AC-1)', () => {
  expect(getLesson('present-simple').kind).toBe('ok');
  expect(getLesson('articles').kind).toBe('ok');
});

test('the two sample lessons use all 7 block types, a link and a related entry (covers: AC-1)', () => {
  const samples = (['present-simple', 'articles'] as const).map((id) => {
    const found = getLesson(id);
    if (found.kind !== 'ok') throw new Error(`${id} is not written`);
    return [id, found.lesson] as const;
  });

  const blockTypes = new Set(
    samples.flatMap(([, lesson]) => lesson.sections.flatMap((s) => s.blocks.map((b) => b.type))),
  );
  expect([...blockTypes].sort()).toEqual([...ALL_BLOCK_TYPES].sort());

  const links = samples.flatMap(([id, lesson]) =>
    collectLessonStrings(id, lesson).flatMap(({ text }) =>
      parseInline(text).filter((span) => span.kind === 'link'),
    ),
  );
  expect(links.length).toBeGreaterThan(0);

  expect(samples.some(([, lesson]) => (lesson.related ?? []).length > 0)).toBe(true);
});

test('both sample lessons ship as drafts (covers: AC-7)', () => {
  expect(listDraftLessons().map((t) => t.id)).toEqual(['present-simple', 'articles']);
});
