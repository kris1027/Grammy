import type { Block, Category, Example, Lesson, Topic } from './types';

/** One text field and the path that leads to it, for example `topic:articles/summary`. */
export type LocatedString = {
  readonly where: string;
  readonly text: string;
};

const at = (where: string, text: string | undefined): readonly LocatedString[] =>
  text === undefined ? [] : [{ where, text }];

const each = <T>(
  where: string,
  items: readonly T[],
  collect: (path: string, item: T) => readonly LocatedString[],
): readonly LocatedString[] => items.flatMap((item, i) => collect(`${where}[${i}]`, item));

const fromExample = (where: string, example: Example): readonly LocatedString[] => [
  ...at(`${where}/en`, example.en),
  ...at(`${where}/pl`, example.pl),
  ...at(`${where}/note`, example.note),
];

const fromBlock = (where: string, block: Block): readonly LocatedString[] => {
  switch (block.type) {
    case 'text':
    case 'tip':
      return at(`${where}/text`, block.text);
    case 'table':
      return [
        ...at(`${where}/caption`, block.caption),
        ...each(`${where}/header`, block.header ?? [], at),
        ...each(`${where}/rows`, block.rows, (row, cells) => each(row, cells, at)),
      ];
    case 'examples':
      return each(`${where}/items`, block.items, fromExample);
    case 'formula':
      return [...at(`${where}/label`, block.label), ...each(`${where}/parts`, block.parts, at)];
    case 'mistake':
      return [
        ...at(`${where}/wrong`, block.wrong),
        ...at(`${where}/right`, block.right),
        ...at(`${where}/note`, block.note),
      ];
    case 'list':
      return each(`${where}/items`, block.items, at);
  }
};

export const collectLessonStrings = (topicId: string, lesson: Lesson): readonly LocatedString[] =>
  each(`lesson:${topicId}/sections`, lesson.sections, (where, section) => [
    ...at(`${where}/title`, section.title),
    ...each(`${where}/blocks`, section.blocks, fromBlock),
  ]);

export const collectTopicStrings = (topic: Topic): readonly LocatedString[] => [
  ...at(`topic:${topic.id}/title`, topic.title),
  ...at(`topic:${topic.id}/subtitle`, topic.subtitle),
  ...at(`topic:${topic.id}/summary`, topic.summary),
];

export const collectCategoryStrings = (category: Category): readonly LocatedString[] => [
  ...at(`category:${category.id}/title`, category.title),
  ...at(`category:${category.id}/summary`, category.summary),
];
