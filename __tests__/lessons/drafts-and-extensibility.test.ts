import { categories, topics } from '@/features/lessons/content/catalog';
import { lessonsById } from '@/features/lessons/content/lessons';
import { createQueries } from '@/features/lessons/model/catalog-queries';
import type { Category, Lesson, Topic } from '@/features/lessons/model/types';
import { validateContent } from '@/features/lessons/model/validate-content';

const lesson = (review: Lesson['review']): Lesson => ({
  review,
  sections: [{ title: 'Sekcja', blocks: [{ type: 'text', text: 'Tekst.' }] }],
});

test('listDraftLessons returns only draft lessons, in catalog order (covers: AC-7)', () => {
  const fixtureCategories: readonly Category[] = [{ id: 'c', title: 'C' }];
  const fixtureTopics: readonly Topic[] = ['a', 'b', 'c', 'd'].map((id) => ({
    id,
    categoryId: 'c',
    title: id,
    summary: 'S',
  }));
  const queries = createQueries(fixtureCategories, fixtureTopics, {
    d: lesson('draft'),
    b: lesson('checked'),
    a: lesson('draft'),
  });

  expect(queries.listDraftLessons().map((t) => t.id)).toEqual(['a', 'd']);
});

test('a new category, topic and lesson work with no change under model/ (covers: AC-6)', () => {
  const newCategory: Category = { id: 'verbs', title: 'Czasowniki' };
  const newTopic: Topic = {
    id: 'modal-verbs',
    categoryId: 'verbs',
    title: 'Czasowniki modalne',
    summary: 'Can, must, should i inne.',
  };
  const newLesson: Lesson = {
    review: 'draft',
    related: ['present-simple'],
    sections: [
      {
        title: 'Budowa',
        blocks: [
          { type: 'formula', parts: ['podmiot', 'can', 'czasownik'] },
          { type: 'tip', text: 'Po **can** nie dodajemy ==-s==, zobacz [[present-simple]].' },
        ],
      },
    ],
  };

  const allCategories = [...categories, newCategory];
  const allTopics = [...topics, newTopic];
  const allLessons = { ...lessonsById, 'modal-verbs': newLesson };

  expect(validateContent(allCategories, allTopics, allLessons)).toEqual([]);

  const queries = createQueries(allCategories, allTopics, allLessons);
  expect(queries.getLesson('modal-verbs')).toEqual({
    kind: 'ok',
    topic: newTopic,
    lesson: newLesson,
  });
  expect(queries.listTopics('verbs').map((t) => [t.id, t.isWritten])).toEqual([
    ['modal-verbs', true],
  ]);
  expect(queries.listCategories().at(-1)).toBe(newCategory);
});
