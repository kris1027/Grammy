import {
  CONTENT_RULES,
  validateContent,
  type ContentRule,
} from '@/features/lessons/model/validate-content';
import type { Block, Category, Lesson, LessonsById, Topic } from '@/features/lessons/model/types';

type Content = {
  readonly categories: readonly Category[];
  readonly topics: readonly Topic[];
  readonly lessonsById: LessonsById;
};

const lessonWith = (blocks: readonly Block[], extra: Partial<Lesson> = {}): Lesson => ({
  review: 'draft',
  sections: [{ title: 'Sekcja', blocks }],
  ...extra,
});

// A small valid set. Each failing fixture below changes one thing.
const base: Content = {
  categories: [{ id: 'tenses', title: 'Czasy' }],
  topics: [
    {
      id: 'present-simple',
      categoryId: 'tenses',
      title: 'Present Simple',
      summary: 'Nawyki i fakty.',
      tense: { time: 'present', aspect: 'simple' },
    },
    {
      id: 'past-simple',
      categoryId: 'tenses',
      title: 'Past Simple',
      summary: 'Zakończone wydarzenia.',
      tense: { time: 'past', aspect: 'simple' },
    },
  ],
  lessonsById: {
    'present-simple': lessonWith([{ type: 'text', text: 'Zobacz [[past-simple]].' }], {
      related: ['past-simple'],
    }),
  },
};

const example = (n: number) => ({ en: `I work ${n}.`, pl: `Pracuję ${n}.` });
const examples = (count: number): Block => ({
  type: 'examples',
  items: Array.from({ length: count }, (_, i) => example(i + 1)),
});

const withLesson = (lesson: Lesson): Content => ({
  ...base,
  lessonsById: { 'present-simple': lesson },
});

const run = ({ categories, topics, lessonsById }: Content) =>
  validateContent(categories, topics, lessonsById);

test('the valid base fixture has no problems', () => {
  expect(run(base)).toEqual([]);
});

const failing: Readonly<Record<ContentRule, Content>> = {
  'duplicate-category-id': {
    ...base,
    categories: [...base.categories, { id: 'tenses', title: 'Znowu' }],
  },
  'duplicate-topic-id': {
    ...base,
    topics: [...base.topics, { id: 'past-simple', categoryId: 'tenses', title: 'X', summary: 'Y' }],
  },
  'bad-id-format': {
    ...base,
    categories: [{ id: 'Tenses', title: 'Czasy' }],
    topics: base.topics.map((t) => ({ ...t, categoryId: 'Tenses' })),
  },
  'unknown-category': {
    ...base,
    topics: [...base.topics, { id: 'articles', categoryId: 'nouns', title: 'X', summary: 'Y' }],
  },
  'empty-category': {
    ...base,
    categories: [...base.categories, { id: 'verbs', title: 'Czasowniki' }],
  },
  'lesson-without-topic': {
    ...base,
    lessonsById: { ...base.lessonsById, articles: lessonWith([{ type: 'text', text: 'x' }]) },
  },
  'duplicate-tense-slot': {
    ...base,
    topics: [
      ...base.topics,
      {
        id: 'present-simple-2',
        categoryId: 'tenses',
        title: 'X',
        summary: 'Y',
        tense: { time: 'past', aspect: 'simple' },
      },
    ],
  },
  'dead-related': withLesson(lessonWith([{ type: 'text', text: 'x' }], { related: ['nope'] })),
  'self-related': withLesson(
    lessonWith([{ type: 'text', text: 'x' }], { related: ['present-simple'] }),
  ),
  'duplicate-related': withLesson(
    lessonWith([{ type: 'text', text: 'x' }], { related: ['past-simple', 'past-simple'] }),
  ),
  'dead-link': withLesson(lessonWith([{ type: 'tip', text: 'Zobacz [[future-simple]].' }])),
  'no-sections': withLesson({ review: 'draft', sections: [] }),
  'empty-section': withLesson(lessonWith([])),
  'empty-block': withLesson(lessonWith([{ type: 'examples', items: [] }])),
  'example-count': withLesson(lessonWith([examples(2)])),
  'short-formula': withLesson(lessonWith([{ type: 'formula', parts: ['podmiot'] }])),
  'ragged-table': withLesson(
    lessonWith([{ type: 'table', header: ['a', 'b'], rows: [['1', '2'], ['3']] }]),
  ),
  'empty-text': withLesson(
    lessonWith([
      {
        type: 'examples',
        items: [{ en: 'I work.', pl: 'Pracuję.', note: '  ' }, example(2), example(3)],
      },
    ]),
  ),
  'bad-markup': withLesson(lessonWith([{ type: 'mistake', wrong: '**x', right: 'x' }])),
};

test('there is one failing fixture for every rule', () => {
  expect(Object.keys(failing).sort()).toEqual([...CONTENT_RULES].sort());
});

test.each(CONTENT_RULES)('reports exactly the "%s" rule (covers: AC-5)', (rule) => {
  const problems = run(failing[rule]);
  expect(problems.length).toBeGreaterThan(0);
  expect(new Set(problems.map((p) => p.rule))).toEqual(new Set([rule]));
});

test.each<[string, Block]>([
  ['an empty list', { type: 'list', items: [] }],
  ['a table with no rows', { type: 'table', rows: [] }],
  ['a table row with no cells', { type: 'table', rows: [['a'], []] }],
  ['an empty table header', { type: 'table', header: [], rows: [['a']] }],
])('reports %s as empty-block only (covers: AC-5)', (_name, block) => {
  expect(new Set(run(withLesson(lessonWith([block]))).map((p) => p.rule))).toEqual(
    new Set(['empty-block']),
  );
});

test('compares rows with the first row when a table has no header (covers: AC-5)', () => {
  const problems = run(withLesson(lessonWith([{ type: 'table', rows: [['a', 'b'], ['c']] }])));
  expect(problems.map((p) => p.rule)).toEqual(['ragged-table']);
});

test('points at the exact place of a problem', () => {
  const problems = run(
    withLesson({
      review: 'draft',
      sections: [
        { title: 'Pierwsza', blocks: [{ type: 'text', text: 'ok' }] },
        {
          title: 'Druga',
          blocks: [
            { type: 'text', text: 'ok' },
            {
              type: 'examples',
              items: [{ en: 'He ==works.', pl: 'Pracuje.' }, example(2), example(3)],
            },
          ],
        },
      ],
    }),
  );
  expect(problems).toEqual([
    {
      rule: 'bad-markup',
      where: 'lesson:present-simple/sections[1]/blocks[1]/items[0]/en',
      detail: expect.any(String),
    },
  ]);
});

test('checks topic and category text too', () => {
  const problems = run({
    ...base,
    categories: [{ id: 'tenses', title: 'Czasy', summary: '' }],
    topics: base.topics.map((t, i) => (i === 0 ? { ...t, subtitle: '[[nope]]' } : t)),
  });
  expect(problems.map((p) => [p.rule, p.where])).toEqual([
    ['empty-text', 'category:tenses/summary'],
    ['dead-link', 'topic:present-simple/subtitle'],
  ]);
});

test.each([2, 6])('reports exactly example-count for %i examples (covers: AC-8)', (count) => {
  expect(run(withLesson(lessonWith([examples(count)]))).map((p) => p.rule)).toEqual([
    'example-count',
  ]);
});

test.each([3, 5])('accepts %i examples (covers: AC-8)', (count) => {
  expect(run(withLesson(lessonWith([examples(count)])))).toEqual([]);
});

test('an empty examples block reports only empty-block, not example-count (covers: AC-8)', () => {
  expect(run(withLesson(lessonWith([examples(0)]))).map((p) => p.rule)).toEqual(['empty-block']);
});
