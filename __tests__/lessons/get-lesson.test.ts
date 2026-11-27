import { createQueries } from '@/features/lessons/model/catalog-queries';
import type { Category, Lesson, Topic } from '@/features/lessons/model/types';

const categories: readonly Category[] = [{ id: 'tenses', title: 'Czasy' }];

const topics: readonly Topic[] = [
  { id: 'written', categoryId: 'tenses', title: 'Napisany', summary: 'Ma lekcję.' },
  { id: 'unwritten', categoryId: 'tenses', title: 'Nienapisany', summary: 'Nie ma lekcji.' },
];

const lesson: Lesson = {
  review: 'draft',
  sections: [{ title: 'Budowa', blocks: [{ type: 'text', text: 'Tekst.' }] }],
};

const { getLesson, getTopic } = createQueries(categories, topics, { written: lesson });

test('returns ok with the topic and lesson for a written topic (covers: AC-3)', () => {
  expect(getLesson('written')).toEqual({ kind: 'ok', topic: topics[0], lesson });
});

test('returns not-written with the topic for a catalog topic with no lesson (covers: AC-3)', () => {
  expect(getLesson('unwritten')).toEqual({ kind: 'not-written', topic: topics[1] });
});

test.each([
  ['an id not in the catalog', 'nope'],
  ['an empty string', ''],
  ['undefined', undefined],
  ['an array, as Expo Router can pass', ['written']],
  ['"constructor"', 'constructor'],
  ['"__proto__"', '__proto__'],
  ['"toString"', 'toString'],
  ['a number', 42],
  ['null', null],
])('returns unknown for %s and never throws (covers: AC-3)', (_name, id) => {
  expect(getLesson(id)).toEqual({ kind: 'unknown' });
  expect(getTopic(id)).toBeUndefined();
});

test('finds topics by id', () => {
  expect(getTopic('unwritten')).toBe(topics[1]);
});

test('ignores a lessons map entry that is explicitly undefined', () => {
  const queries = createQueries(categories, topics, { written: undefined });
  expect(queries.getLesson('written')).toEqual({ kind: 'not-written', topic: topics[0] });
});
