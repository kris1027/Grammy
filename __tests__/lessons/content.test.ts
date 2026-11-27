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

test('Present Simple is checked and only Articles is still a draft (covers: AC-12)', () => {
  expect(listDraftLessons().map((t) => t.id)).toEqual(['articles']);
});

const PRESENT_SIMPLE_SECTIONS = [
  'Kiedy używamy',
  'Budowa',
  'Pisownia -s / -es / -ies',
  'Przeczenia',
  'Pytania i krótkie odpowiedzi',
  'Słowa sygnałowe',
  'Typowe błędy',
  'Present Simple czy Continuous?',
];

test('Present Simple follows the 8 section template (spec 0004, covers: AC-7)', () => {
  const found = getLesson('present-simple');
  if (found.kind !== 'ok') throw new Error('Present Simple is not written');

  expect(found.lesson.sections.map((section) => section.title)).toEqual(PRESENT_SIMPLE_SECTIONS);
  expect(found.lesson.related).toEqual(['present-continuous', 'past-simple']);
});

test('Typowe błędy has at least 4 mistakes (spec 0004, covers: AC-7)', () => {
  const found = getLesson('present-simple');
  if (found.kind !== 'ok') throw new Error('Present Simple is not written');

  const mistakes = found.lesson.sections
    .find((section) => section.title === 'Typowe błędy')
    ?.blocks.filter((block) => block.type === 'mistake');
  expect(mistakes?.length).toBeGreaterThanOrEqual(4);
});
