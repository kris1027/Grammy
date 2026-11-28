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

test('Present Simple is checked; the new tense lessons and Articles are drafts (covers: AC-12)', () => {
  expect(listDraftLessons().map((t) => t.id)).toEqual([
    'present-continuous',
    'past-simple',
    'future-simple',
    'articles',
  ]);
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

// Feature 7: the starter tense lessons follow the same 8 section template (spec 0004).
const STARTER_LESSONS = [
  {
    id: 'present-continuous',
    third: 'Pisownia -ing',
    last: 'Present Continuous czy Simple?',
    related: ['present-simple', 'past-continuous'],
  },
  {
    id: 'past-simple',
    third: 'Pisownia -ed i formy nieregularne',
    last: 'Past Simple czy Present Perfect?',
    related: ['present-perfect', 'past-continuous'],
  },
  {
    id: 'future-simple',
    third: "Formy skrócone 'll i won't",
    last: 'Future Simple czy going to?',
    related: ['present-continuous', 'future-continuous'],
  },
] as const;

describe.each(STARTER_LESSONS)('starter lesson $id', ({ id, third, last, related }) => {
  const found = getLesson(id);
  if (found.kind !== 'ok') throw new Error(`${id} is not written`);
  const { lesson } = found;

  test('follows the 8 section template in order', () => {
    expect(lesson.sections.map((section) => section.title)).toEqual([
      'Kiedy używamy',
      'Budowa',
      third,
      'Przeczenia',
      'Pytania i krótkie odpowiedzi',
      'Słowa sygnałowe',
      'Typowe błędy',
      last,
    ]);
    expect(lesson.related).toEqual(related);
  });

  test('Typowe błędy has at least 4 mistakes', () => {
    const mistakes = lesson.sections
      .find((section) => section.title === 'Typowe błędy')
      ?.blocks.filter((block) => block.type === 'mistake');
    expect(mistakes?.length).toBeGreaterThanOrEqual(4);
  });

  test('stays a draft until you check it', () => {
    expect(lesson.review).toBe('draft');
  });
});
