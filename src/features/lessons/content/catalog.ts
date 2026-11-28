import type { Category, TenseTime, Topic } from '../model/types';

// Order here is the order on screen. Topic ids never change once a lesson ships,
// because saved progress and routes use them. Summaries are AI drafts, not yet checked.

/** Polish names of the three time frames, in the order of TENSE_TIMES (spec 0005). */
export const TENSE_TIME_LABELS: Readonly<Record<TenseTime, string>> = {
  present: 'Teraźniejszość',
  past: 'Przeszłość',
  future: 'Przyszłość',
};

export const categories = [
  { id: 'tenses', title: 'Czasy' },
  { id: 'nouns-and-articles', title: 'Rzeczowniki i przedimki' },
] as const satisfies readonly Category[];

export const topics = [
  {
    id: 'present-simple',
    categoryId: 'tenses',
    title: 'Present Simple',
    subtitle: 'czas teraźniejszy prosty',
    summary: 'Nawyki, fakty i rzeczy, które dzieją się regularnie.',
    tense: { time: 'present', aspect: 'simple' },
  },
  {
    id: 'present-continuous',
    categoryId: 'tenses',
    title: 'Present Continuous',
    subtitle: 'czas teraźniejszy ciągły',
    summary: 'Czynności, które trwają teraz, i sytuacje tymczasowe.',
    tense: { time: 'present', aspect: 'continuous' },
  },
  {
    id: 'present-perfect',
    categoryId: 'tenses',
    title: 'Present Perfect',
    subtitle: 'czas teraźniejszy dokonany',
    summary: 'Przeszłość połączona z teraźniejszością: doświadczenia i skutki widoczne teraz.',
    tense: { time: 'present', aspect: 'perfect' },
  },
  {
    id: 'present-perfect-continuous',
    categoryId: 'tenses',
    title: 'Present Perfect Continuous',
    subtitle: 'czas teraźniejszy dokonany ciągły',
    summary: 'Czynność, która zaczęła się w przeszłości i trwa do teraz.',
    tense: { time: 'present', aspect: 'perfectContinuous' },
  },
  {
    id: 'past-simple',
    categoryId: 'tenses',
    title: 'Past Simple',
    subtitle: 'czas przeszły prosty',
    summary: 'Zakończone wydarzenia w określonym czasie w przeszłości.',
    tense: { time: 'past', aspect: 'simple' },
  },
  {
    id: 'past-continuous',
    categoryId: 'tenses',
    title: 'Past Continuous',
    subtitle: 'czas przeszły ciągły',
    summary: 'Czynność, która była w trakcie w danym momencie w przeszłości.',
    tense: { time: 'past', aspect: 'continuous' },
  },
  {
    id: 'past-perfect',
    categoryId: 'tenses',
    title: 'Past Perfect',
    subtitle: 'czas zaprzeszły',
    summary: 'Wydarzenie, które stało się wcześniej niż inne wydarzenie w przeszłości.',
    tense: { time: 'past', aspect: 'perfect' },
  },
  {
    id: 'past-perfect-continuous',
    categoryId: 'tenses',
    title: 'Past Perfect Continuous',
    subtitle: 'czas zaprzeszły ciągły',
    summary: 'Czynność, która trwała przez jakiś czas przed innym momentem w przeszłości.',
    tense: { time: 'past', aspect: 'perfectContinuous' },
  },
  {
    id: 'future-simple',
    categoryId: 'tenses',
    title: 'Future Simple',
    subtitle: 'czas przyszły prosty',
    summary: 'Decyzje podjęte w chwili mówienia, obietnice i przewidywania.',
    tense: { time: 'future', aspect: 'simple' },
  },
  {
    id: 'future-continuous',
    categoryId: 'tenses',
    title: 'Future Continuous',
    subtitle: 'czas przyszły ciągły',
    summary: 'Czynność, która będzie w trakcie w danym momencie w przyszłości.',
    tense: { time: 'future', aspect: 'continuous' },
  },
  {
    id: 'future-perfect',
    categoryId: 'tenses',
    title: 'Future Perfect',
    subtitle: 'czas przyszły dokonany',
    summary: 'Coś, co będzie już zakończone przed danym momentem w przyszłości.',
    tense: { time: 'future', aspect: 'perfect' },
  },
  {
    id: 'future-perfect-continuous',
    categoryId: 'tenses',
    title: 'Future Perfect Continuous',
    subtitle: 'czas przyszły dokonany ciągły',
    summary: 'Jak długo coś będzie już trwało w danym momencie w przyszłości.',
    tense: { time: 'future', aspect: 'perfectContinuous' },
  },
  {
    id: 'articles',
    categoryId: 'nouns-and-articles',
    title: 'Przedimki a / an / the',
    summary: 'Kiedy mówimy a, an albo the, a kiedy nie używamy przedimka wcale.',
  },
] as const satisfies readonly Topic[];

export type TopicId = (typeof topics)[number]['id'];
