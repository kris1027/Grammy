// The only door into lessons for other features. Content files and model internals
// (validateContent, findMarkupProblems, createQueries) stay private.

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
export { TENSE_TIME_LABELS } from './content/catalog';
export { TENSE_ASPECTS, TENSE_TIMES } from './model/types';
export { parseInline } from './model/markup';

export {
  listCategories,
  listTopics,
  getTopic,
  getLesson,
  getTenseGrid,
  listDraftLessons,
} from './views/queries';

// Views that render lesson content with the shared parts from src/ui (spec 0003).
export { BlockView, SectionView } from './views/block-view';
export type { BlockViewProps, SectionViewProps } from './views/block-view';
export { InlineText } from './views/inline-text';
export type { InlineTextProps } from './views/inline-text';
export { plainText } from './views/plain-text';
export { TopicCard } from './views/topic-card';
export type { TopicCardProps } from './views/topic-card';
