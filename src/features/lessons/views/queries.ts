// The bound catalog queries, built once from the bundled content. The lessons door
// (../index.ts) re-exports them, and views import them from here, so there is no
// import cycle. Tests that need a different lesson state mock this module.

import { categories, topics } from '../content/catalog';
import { lessonsById } from '../content/lessons';
import { createQueries } from '../model/catalog-queries';

export const { listCategories, listTopics, getTopic, getLesson, getTenseGrid, listDraftLessons } =
  createQueries(categories, topics, lessonsById);
