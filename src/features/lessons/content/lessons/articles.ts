import type { Lesson } from '../../model/types';
import type { TopicId } from '../catalog';

// Short AI draft. Stays a draft until its own feature (15).

export const articles: Lesson<TopicId> = {
  review: 'draft',
  related: ['present-simple'],
  sections: [
    {
      title: 'Podstawy',
      blocks: [
        {
          type: 'text',
          text: 'W języku polskim nie ma przedimków, dlatego to jeden z trudniejszych tematów. Przedimek stoi przed rzeczownikiem i mówi, czy chodzi o coś **dowolnego**, czy o coś **konkretnego**.',
        },
        {
          type: 'table',
          header: ['Przedimek', 'Kiedy', 'Przykład'],
          rows: [
            ['a', 'przed dźwiękiem spółgłoskowym', 'a book, a university'],
            ['an', 'przed dźwiękiem samogłoskowym', 'an apple, an hour'],
            ['the', 'gdy wiadomo, o którą rzecz chodzi', 'the book on the table'],
          ],
        },
      ],
    },
    {
      title: 'A czy an?',
      blocks: [
        {
          type: 'tip',
          text: 'Liczy się **dźwięk**, a nie litera: ==an hour== (h jest nieme), ale ==a university== (wymawiamy „ju”).',
        },
        {
          type: 'examples',
          items: [
            { en: 'I have an idea.', pl: 'Mam pomysł.' },
            {
              en: 'She is a teacher.',
              pl: 'Ona jest nauczycielką.',
              note: 'Przed zawodem zawsze stoi a albo an.',
            },
            { en: 'He eats an orange every day.', pl: 'On je pomarańczę codziennie.' },
          ],
        },
      ],
    },
    {
      title: 'Kiedy the',
      blocks: [
        {
          type: 'list',
          items: [
            'Rzecz, o której już była mowa.',
            'Rzecz jedyna w swoim rodzaju: the sun, the moon.',
            'Rzecz, o którą chodzi, wiadomo z kontekstu.',
          ],
        },
        {
          type: 'examples',
          items: [
            {
              en: 'I bought a car. The car is red.',
              pl: 'Kupiłem samochód. Ten samochód jest czerwony.',
            },
            { en: 'The sun is hot.', pl: 'Słońce jest gorące.' },
            { en: 'Please close the door.', pl: 'Proszę, zamknij drzwi.' },
          ],
        },
      ],
    },
    {
      title: 'Typowe błędy',
      blocks: [
        {
          type: 'mistake',
          wrong: 'I am student.',
          right: 'I am a student.',
          note: 'Przed policzalnym rzeczownikiem w liczbie pojedynczej musi stać przedimek.',
        },
        {
          type: 'mistake',
          wrong: 'She plays the tennis.',
          right: 'She plays tennis.',
          note: 'Przed nazwami sportów nie używamy przedimka.',
        },
      ],
    },
  ],
};
