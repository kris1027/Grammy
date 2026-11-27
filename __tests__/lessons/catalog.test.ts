import {
  getTenseGrid,
  listCategories,
  listTopics,
  TENSE_ASPECTS,
  TENSE_TIMES,
} from '@/features/lessons';
import { createQueries } from '@/features/lessons/model/catalog-queries';
import type { Category, Lesson, Topic } from '@/features/lessons/model/types';

describe('real catalog', () => {
  test('holds 2 categories in a fixed order (covers: AC-2)', () => {
    expect(listCategories().map((c) => [c.id, c.title])).toEqual([
      ['tenses', 'Czasy'],
      ['nouns-and-articles', 'Rzeczowniki i przedimki'],
    ]);
  });

  // The shipped topic ids. Saved progress and routes use them, so renaming or removing
  // one must be a deliberate change to this list.
  test('topic ids match the shipped list (covers: AC-2)', () => {
    const ids = listCategories().flatMap((c) => listTopics(c.id).map((t) => t.id));
    expect(ids).toEqual([
      'present-simple',
      'present-continuous',
      'present-perfect',
      'present-perfect-continuous',
      'past-simple',
      'past-continuous',
      'past-perfect',
      'past-perfect-continuous',
      'future-simple',
      'future-continuous',
      'future-perfect',
      'future-perfect-continuous',
      'articles',
    ]);
  });

  test('every topic has a title and a Polish summary (covers: AC-2)', () => {
    const all = listCategories().flatMap((c) => listTopics(c.id));
    all.forEach((topic) => {
      expect(topic.title.trim()).not.toBe('');
      expect(topic.summary.trim()).not.toBe('');
    });
  });

  test('every tense topic has a slot and the grid has 12 different topics (covers: AC-2)', () => {
    const tenses = listTopics('tenses');
    expect(tenses).toHaveLength(12);
    tenses.forEach((topic) => expect(topic.tense).toBeDefined());

    const grid = getTenseGrid();
    const cells = TENSE_TIMES.flatMap((time) => TENSE_ASPECTS.map((aspect) => grid[time][aspect]));
    expect(cells).toHaveLength(12);
    cells.forEach((cell) => expect(cell).toBeDefined());
    expect(new Set(cells.map((cell) => cell?.id)).size).toBe(12);
    expect(grid.present.simple?.id).toBe('present-simple');
    expect(grid.future.perfectContinuous?.id).toBe('future-perfect-continuous');
  });

  test('marks written and unwritten topics (covers: AC-2)', () => {
    const grid = getTenseGrid();
    expect(grid.present.simple?.isWritten).toBe(true);
    expect(grid.past.simple?.isWritten).toBe(false);
  });
});

describe('queries over fixtures', () => {
  const categories: readonly Category[] = [
    { id: 'a', title: 'A' },
    { id: 'b', title: 'B' },
  ];
  const topics: readonly Topic[] = [
    {
      id: 'one',
      categoryId: 'a',
      title: 'One',
      summary: 'S',
      tense: { time: 'past', aspect: 'simple' },
    },
    { id: 'two', categoryId: 'b', title: 'Two', summary: 'S' },
    {
      id: 'three',
      categoryId: 'a',
      title: 'Three',
      summary: 'S',
      tense: { time: 'past', aspect: 'simple' },
    },
  ];
  const lesson: Lesson = {
    review: 'checked',
    sections: [{ title: 'T', blocks: [{ type: 'text', text: 'x' }] }],
  };
  const queries = createQueries(categories, topics, { three: lesson });

  test('listTopics keeps catalog order and adds isWritten', () => {
    expect(queries.listTopics('a').map((t) => [t.id, t.isWritten])).toEqual([
      ['one', false],
      ['three', true],
    ]);
  });

  test('listTopics returns an empty list for an unknown category', () => {
    expect(queries.listTopics('nope')).toEqual([]);
  });

  test('getTenseGrid leaves empty cells undefined and lets the first topic win a shared cell', () => {
    const grid = queries.getTenseGrid();
    expect(grid.past.simple?.id).toBe('one');
    expect(grid.present.simple).toBeUndefined();
    expect(Object.keys(grid)).toEqual([...TENSE_TIMES]);
    expect(Object.keys(grid.past)).toEqual([...TENSE_ASPECTS]);
  });
});
