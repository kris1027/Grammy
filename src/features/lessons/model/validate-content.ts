import {
  collectCategoryStrings,
  collectLessonStrings,
  collectTopicStrings,
  type LocatedString,
} from './collect-strings';
import { findMarkupProblems, parseInline } from './markup';
import type { Block, Category, Lesson, LessonsById, Topic } from './types';

export const CONTENT_RULES = [
  'duplicate-category-id',
  'duplicate-topic-id',
  'bad-id-format',
  'unknown-category',
  'empty-category',
  'lesson-without-topic',
  'duplicate-tense-slot',
  'dead-related',
  'self-related',
  'duplicate-related',
  'dead-link',
  'no-sections',
  'empty-section',
  'empty-block',
  'short-formula',
  'ragged-table',
  'empty-text',
  'bad-markup',
] as const;

export type ContentRule = (typeof CONTENT_RULES)[number];

export type ContentProblem = {
  readonly rule: ContentRule;
  readonly where: string;
  readonly detail: string;
};

const ID_FORMAT = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const problem = (rule: ContentRule, where: string, detail: string): ContentProblem => ({
  rule,
  where,
  detail,
});

/** Every value that already appeared earlier in the list, once per extra appearance. */
const repeats = (values: readonly string[]): readonly string[] =>
  values.filter((value, i) => values.indexOf(value) !== i);

const definedLessons = (lessonsById: LessonsById): readonly (readonly [string, Lesson])[] =>
  Object.entries<Lesson | undefined>(lessonsById).flatMap(([id, lesson]) =>
    lesson === undefined ? [] : [[id, lesson] as const],
  );

const checkIds = (
  categories: readonly Category[],
  topics: readonly Topic[],
  lessonIds: readonly string[],
): readonly ContentProblem[] => [
  ...repeats(categories.map((c) => c.id)).map((id) =>
    problem('duplicate-category-id', `category:${id}`, `category id "${id}" is used twice`),
  ),
  ...repeats(topics.map((t) => t.id)).map((id) =>
    problem('duplicate-topic-id', `topic:${id}`, `topic id "${id}" is used twice`),
  ),
  ...[
    ...categories.map((c) => ({ where: `category:${c.id}`, id: c.id })),
    ...topics.map((t) => ({ where: `topic:${t.id}`, id: t.id })),
    ...lessonIds.map((id) => ({ where: `lesson:${id}`, id })),
  ]
    .filter(({ id }) => !ID_FORMAT.test(id))
    .map(({ where, id }) => problem('bad-id-format', where, `"${id}" is not kebab case`)),
];

const checkCatalog = (
  categories: readonly Category[],
  topics: readonly Topic[],
): readonly ContentProblem[] => {
  const categoryIds = new Set(categories.map((c) => c.id));
  const usedCategoryIds = new Set(topics.map((t) => t.categoryId));
  const slots = topics.flatMap((t) =>
    t.tense === undefined ? [] : [{ id: t.id, slot: `${t.tense.time}/${t.tense.aspect}` }],
  );

  return [
    ...topics
      .filter((t) => !categoryIds.has(t.categoryId))
      .map((t) =>
        problem('unknown-category', `topic:${t.id}`, `category "${t.categoryId}" does not exist`),
      ),
    ...categories
      .filter((c) => !usedCategoryIds.has(c.id))
      .map((c) => problem('empty-category', `category:${c.id}`, 'category has no topics')),
    ...slots
      .filter(({ slot }, i) => slots.findIndex((other) => other.slot === slot) !== i)
      .map(({ id, slot }) =>
        problem('duplicate-tense-slot', `topic:${id}`, `tense slot ${slot} is already taken`),
      ),
  ];
};

const checkRelated = (
  topicId: string,
  lesson: Lesson,
  topicIds: ReadonlySet<string>,
): readonly ContentProblem[] => {
  const related = lesson.related ?? [];
  const where = `lesson:${topicId}/related`;
  return [
    ...related
      .filter((id) => !topicIds.has(id))
      .map((id) => problem('dead-related', where, `"${id}" is not a topic`)),
    ...related
      .filter((id) => id === topicId)
      .map(() => problem('self-related', where, 'a lesson lists itself as related')),
    ...repeats(related).map((id) => problem('duplicate-related', where, `"${id}" is listed twice`)),
  ];
};

const checkBlock = (where: string, block: Block): readonly ContentProblem[] => {
  switch (block.type) {
    case 'examples':
    case 'list':
      return block.items.length === 0 ? [problem('empty-block', where, `empty ${block.type}`)] : [];
    case 'formula':
      return block.parts.length < 2
        ? [problem('short-formula', where, 'a formula needs at least 2 parts')]
        : [];
    case 'table': {
      const header = block.header;
      const width =
        header !== undefined && header.length > 0 ? header.length : block.rows[0]?.length;
      return [
        ...(header !== undefined && header.length === 0
          ? [problem('empty-block', `${where}/header`, 'empty table header')]
          : []),
        ...(block.rows.length === 0 ? [problem('empty-block', where, 'table has no rows')] : []),
        ...block.rows.flatMap((row, i) => {
          if (row.length === 0) {
            return [problem('empty-block', `${where}/rows[${i}]`, 'table row has no cells')];
          }
          return width !== undefined && width > 0 && row.length !== width
            ? [
                problem(
                  'ragged-table',
                  `${where}/rows[${i}]`,
                  `${row.length} cells, expected ${width}`,
                ),
              ]
            : [];
        }),
      ];
    }
    case 'text':
    case 'tip':
    case 'mistake':
      return [];
  }
};

const checkStructure = (topicId: string, lesson: Lesson): readonly ContentProblem[] => {
  const where = `lesson:${topicId}`;
  if (lesson.sections.length === 0)
    return [problem('no-sections', where, 'lesson has no sections')];

  return lesson.sections.flatMap((section, s) => {
    const sectionWhere = `${where}/sections[${s}]`;
    if (section.blocks.length === 0) {
      return [problem('empty-section', sectionWhere, 'section has no blocks')];
    }
    return section.blocks.flatMap((block, b) => checkBlock(`${sectionWhere}/blocks[${b}]`, block));
  });
};

const checkText = (
  strings: readonly LocatedString[],
  topicIds: ReadonlySet<string>,
): readonly ContentProblem[] =>
  strings.flatMap(({ where, text }) => [
    ...(text.trim() === '' ? [problem('empty-text', where, 'text is blank')] : []),
    ...findMarkupProblems(text).map((detail) => problem('bad-markup', where, detail)),
    ...parseInline(text).flatMap((span) =>
      span.kind === 'link' && !topicIds.has(span.topicId)
        ? [problem('dead-link', where, `link to "${span.topicId}" goes nowhere`)]
        : [],
    ),
  ]);

/** Every rule from spec 0002 (Validation rules). Returns problems; never throws. */
export const validateContent = (
  categories: readonly Category[],
  topics: readonly Topic[],
  lessonsById: LessonsById,
): readonly ContentProblem[] => {
  const topicIds = new Set(topics.map((t) => t.id));
  const lessons = definedLessons(lessonsById);

  return [
    ...checkIds(
      categories,
      topics,
      lessons.map(([id]) => id),
    ),
    ...checkCatalog(categories, topics),
    ...lessons
      .filter(([id]) => !topicIds.has(id))
      .map(([id]) => problem('lesson-without-topic', `lesson:${id}`, `no topic "${id}"`)),
    ...lessons.flatMap(([id, lesson]) => [
      ...checkRelated(id, lesson, topicIds),
      ...checkStructure(id, lesson),
    ]),
    ...checkText(
      [
        ...categories.flatMap(collectCategoryStrings),
        ...topics.flatMap(collectTopicStrings),
        ...lessons.flatMap(([id, lesson]) => collectLessonStrings(id, lesson)),
      ],
      topicIds,
    ),
  ];
};
