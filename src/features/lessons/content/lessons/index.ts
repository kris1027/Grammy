import type { LessonsById } from '../../model/types';
import type { TopicId } from '../catalog';
import { articles } from './articles';
import { presentSimple } from './present-simple';

// To add a lesson: write its file in this folder, then import it and add one entry here.
// The key is the topic id from ../catalog.ts.

export const lessonsById: LessonsById<TopicId> = {
  'present-simple': presentSimple,
  articles,
};
