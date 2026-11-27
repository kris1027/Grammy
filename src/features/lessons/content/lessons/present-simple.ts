import type { Lesson } from '../../model/types';
import type { TopicId } from '../catalog';

// Short AI draft. Feature 5 turns it into the full checked lesson.

export const presentSimple: Lesson<TopicId> = {
  review: 'draft',
  related: ['present-continuous', 'past-simple'],
  sections: [
    {
      title: 'Budowa',
      blocks: [
        {
          type: 'text',
          text: 'Present Simple to podstawowy czas w angielskim. W twierdzeniu używamy formy podstawowej czasownika, a w 3. osobie liczby pojedynczej (he, she, it) dodajemy końcówkę ==-s== albo ==-es==.',
        },
        {
          type: 'formula',
          label: 'Twierdzenie',
          parts: ['podmiot', 'czasownik (+ -s / -es dla he, she, it)'],
        },
        {
          type: 'formula',
          label: 'Przeczenie',
          parts: ['podmiot', "don't / doesn't", 'czasownik'],
        },
        {
          type: 'formula',
          label: 'Pytanie',
          parts: ['Do / Does', 'podmiot', 'czasownik', '?'],
        },
        {
          type: 'table',
          caption: 'Czasownik work (pracować)',
          header: ['Osoba', 'Twierdzenie', 'Przeczenie', 'Pytanie'],
          rows: [
            ['I / you / we / they', 'I work', "I don't work", 'Do I work?'],
            ['he / she / it', 'She **works**', "She **doesn't** work", '**Does** she work?'],
          ],
        },
      ],
    },
    {
      title: 'Kiedy używamy',
      blocks: [
        {
          type: 'list',
          items: [
            'Nawyki i rutyny, czyli to, co robimy regularnie.',
            'Fakty i prawdy ogólne.',
            'Rozkłady jazdy i stałe plany.',
            'Stany, na przykład lubić, wiedzieć, mieć.',
          ],
        },
        {
          type: 'examples',
          items: [
            { en: 'She works in a bank.', pl: 'Ona pracuje w banku.' },
            { en: 'Water boils at 100 degrees.', pl: 'Woda wrze w temperaturze 100 stopni.' },
            {
              en: 'The train leaves at 8:15.',
              pl: 'Pociąg odjeżdża o 8:15.',
              note: 'Rozkład jazdy, choć mówimy o przyszłości.',
            },
          ],
        },
      ],
    },
    {
      title: 'Słowa sygnałowe',
      blocks: [
        {
          type: 'list',
          items: [
            'always, usually, often, sometimes, never',
            'every day, every week, on Mondays',
            'once a week, twice a year',
          ],
        },
        {
          type: 'tip',
          text: 'Jeśli coś dzieje się **teraz**, w tej chwili, użyj [[present-continuous]].',
        },
      ],
    },
    {
      title: 'Typowe błędy',
      blocks: [
        {
          type: 'mistake',
          wrong: 'He work every day.',
          right: 'He works every day.',
          note: 'Przy he, she, it dodajemy ==-s== do czasownika.',
        },
        {
          type: 'mistake',
          wrong: "She doesn't works here.",
          right: "She doesn't work here.",
          note: 'Końcówka -s jest już w does, więc czasownik wraca do formy podstawowej.',
        },
      ],
    },
  ],
};
