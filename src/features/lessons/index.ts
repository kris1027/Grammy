// The only door into lessons for other features. Content files and model internals
// (validateContent, findMarkupProblems, createQueries) stay private.

import { categories, topics } from './content/catalog';
import { lessonsById } from './content/lessons';
import { createQueries } from './model/catalog-queries';

export type {
  Block,
  Category,
  Example,
  InlineSpan,
  Lesson,
  LessonLookup,
  Section,
  TenseAspect,
  TenseGrid,
  TenseSlot,
  TenseTime,
  Topic,
  TopicStatus,
} from './model/types';
export type { TopicId } from './content/catalog';
export { TENSE_ASPECTS, TENSE_TIMES } from './model/types';
export { parseInline } from './model/markup';

export const { listCategories, listTopics, getTopic, getLesson, getTenseGrid, listDraftLessons } =
  createQueries(categories, topics, lessonsById);
