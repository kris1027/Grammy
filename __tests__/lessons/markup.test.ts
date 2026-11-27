import { findMarkupProblems, parseInline } from '@/features/lessons/model/markup';
import type { InlineSpan } from '@/features/lessons/model/types';

const roundTrip = (spans: readonly InlineSpan[]): string => spans.map((s) => s.source).join('');

const plain = (text: string): readonly InlineSpan[] => [{ kind: 'text', text, source: text }];

test('parses bold, highlight and a labelled link in one sentence (covers: AC-4)', () => {
  const input = 'He ==works== **every** day, see [[present-continuous|tu]].';
  expect(parseInline(input)).toEqual([
    { kind: 'text', text: 'He ', source: 'He ' },
    { kind: 'highlight', text: 'works', source: '==works==' },
    { kind: 'text', text: ' ', source: ' ' },
    { kind: 'bold', text: 'every', source: '**every**' },
    { kind: 'text', text: ' day, see ', source: ' day, see ' },
    {
      kind: 'link',
      topicId: 'present-continuous',
      label: 'tu',
      source: '[[present-continuous|tu]]',
    },
    { kind: 'text', text: '.', source: '.' },
  ]);
  expect(findMarkupProblems(input)).toEqual([]);
});

test('a link without a label has no label field (covers: AC-4)', () => {
  expect(parseInline('[[past-simple]]')).toEqual([
    { kind: 'link', topicId: 'past-simple', source: '[[past-simple]]' },
  ]);
});

test('everything after the first bar is the label, including more bars (covers: AC-4)', () => {
  expect(parseInline('[[articles|a | an]]')).toEqual([
    { kind: 'link', topicId: 'articles', label: 'a | an', source: '[[articles|a | an]]' },
  ]);
});

test('text with no markup is one text span, and empty text gives no spans (covers: AC-4)', () => {
  expect(parseInline('Zwykły tekst.')).toEqual(plain('Zwykły tekst.'));
  expect(parseInline('')).toEqual([]);
});

test('single stars and equals signs are just text', () => {
  expect(parseInline('2 * 3 = 6')).toEqual(plain('2 * 3 = 6'));
  expect(findMarkupProblems('2 * 3 = 6')).toEqual([]);
});

test.each([
  ['an unclosed bold', 'a **b'],
  ['an unclosed highlight', 'a ==b'],
  ['an unclosed link', 'see [[articles'],
  ['an empty bold', '****'],
  ['an empty highlight', '===='],
  ['a blank bold', '** **'],
  ['nested highlight inside bold', '**a ==b== c**'],
  ['nested link inside bold', '**see [[articles]]**'],
  ['a link target with capitals and a space', '[[Foo Bar]]'],
  ['a link target with Polish letters', '[[czas-teraźniejszy]]'],
  ['an empty link label', '[[x|]]'],
  ['a blank link target', '[[ ]]'],
  ['an empty link', '[[]]'],
  ['a stray link closer', 'see ]] here'],
])('%s stays plain text and is reported (covers: AC-4)', (_name, input) => {
  expect(parseInline(input)).toEqual(plain(input));
  expect(findMarkupProblems(input).length).toBeGreaterThan(0);
});

test('an unclosed marker does not swallow valid markup after it (covers: AC-4)', () => {
  expect(parseInline('**a ==b==')).toEqual([
    { kind: 'text', text: '**a ', source: '**a ' },
    { kind: 'highlight', text: 'b', source: '==b==' },
  ]);
  expect(findMarkupProblems('**a ==b==')).toEqual(['unclosed "**"']);
});

test('keeps all 18 Polish letters unchanged (covers: AC-4)', () => {
  const polish = 'ą ć ę ł ń ó ś ź ż Ą Ć Ę Ł Ń Ó Ś Ź Ż';
  expect(parseInline(polish)).toEqual(plain(polish));
  expect(parseInline(`**${polish}**`)).toEqual([
    { kind: 'bold', text: polish, source: `**${polish}**` },
  ]);
});

test.each([
  'He ==works== **every** day, see [[present-continuous|tu]].',
  'a **b',
  '****',
  '**a ==b== c**',
  '[[Foo Bar]]',
  '[[x|]]',
  '***bold***',
  '== ** [[ ]] |',
  ']]]][[[[',
  'Zażółć **gęślą** ==jaźń== [[articles|przedimki]].',
])('the round trip gives back the input exactly: %s (covers: AC-4)', (input) => {
  expect(roundTrip(parseInline(input))).toBe(input);
});
