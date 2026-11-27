import {
  TENSE_ASPECTS,
  TENSE_TIMES,
  type Category,
  type Lesson,
  type LessonLookup,
  type LessonsById,
  type TenseAspect,
  type TenseGrid,
  type TenseTime,
  type Topic,
  type TopicStatus,
} from './types';

export type CatalogQueries<Id extends string = string> = {
  readonly listCategories: () => readonly Category[];
  readonly listTopics: (categoryId: string) => readonly TopicStatus<Id>[];
  readonly getTopic: (id: unknown) => Topic<Id> | undefined;
  readonly getLesson: (id: unknown) => LessonLookup<Id>;
  readonly getTenseGrid: () => TenseGrid<Id>;
  readonly listDraftLessons: () => readonly Topic<Id>[];
};

/**
 * Builds every catalog lookup from plain data, so tests can pass fixtures.
 * Lookups go through a Map, so ids like "constructor" or "__proto__" find nothing.
 */
export const createQueries = <Id extends string>(
  categories: readonly Category[],
  topics: readonly Topic<Id>[],
  lessonsById: LessonsById<NoInfer<Id>>,
): CatalogQueries<Id> => {
  const topicById = new Map<string, Topic<Id>>(
    [...topics].reverse().map((topic) => [topic.id, topic]),
  );
  const lessonByTopicId = new Map<string, Lesson<Id>>(
    Object.entries<Lesson<Id> | undefined>(lessonsById).flatMap(([id, lesson]) =>
      lesson === undefined ? [] : [[id, lesson] as const],
    ),
  );

  const withStatus = (topic: Topic<Id>): TopicStatus<Id> => ({
    ...topic,
    isWritten: lessonByTopicId.has(topic.id),
  });

  const getTopic = (id: unknown): Topic<Id> | undefined =>
    typeof id === 'string' ? topicById.get(id) : undefined;

  const getLesson = (id: unknown): LessonLookup<Id> => {
    const topic = getTopic(id);
    if (topic === undefined) return { kind: 'unknown' };

    const lesson = lessonByTopicId.get(topic.id);
    return lesson === undefined ? { kind: 'not-written', topic } : { kind: 'ok', topic, lesson };
  };

  const cellTopic = (time: TenseTime, aspect: TenseAspect): TopicStatus<Id> | undefined => {
    const topic = topics.find((t) => t.tense?.time === time && t.tense.aspect === aspect);
    return topic === undefined ? undefined : withStatus(topic);
  };

  const getTenseGrid = (): TenseGrid<Id> =>
    Object.fromEntries(
      TENSE_TIMES.map((time) => [
        time,
        Object.fromEntries(TENSE_ASPECTS.map((aspect) => [aspect, cellTopic(time, aspect)])),
      ]),
    ) as TenseGrid<Id>;

  return {
    listCategories: () => categories,
    listTopics: (categoryId) =>
      topics.filter((topic) => topic.categoryId === categoryId).map(withStatus),
    getTopic,
    getLesson,
    getTenseGrid,
    listDraftLessons: () =>
      topics.filter((topic) => lessonByTopicId.get(topic.id)?.review === 'draft'),
  };
};
