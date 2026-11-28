import type { Lesson } from '../../model/types';
import type { TopicId } from '../catalog';

// A1 to A2 lesson in the 8 section template (spec 0004). Checked by you with the
// spec 0004 Grammar checklist.

export const futureSimple: Lesson<TopicId> = {
  review: 'checked',
  related: ['present-continuous', 'future-continuous'],
  sections: [
    {
      title: 'Kiedy używamy',
      blocks: [
        {
          type: 'text',
          text: 'Future Simple to czas z **will**. Używamy go, gdy coś **postanawiamy w tej chwili**, coś obiecujemy albo mówimy, co **naszym zdaniem** się stanie.',
        },
        {
          type: 'list',
          items: [
            '**Decyzje podjęte w chwili mówienia**, bez wcześniejszego planu.',
            '**Obietnice**.',
            '**Przewidywania** oparte na opinii, często z I think albo probably.',
            '**Propozycje i prośby**.',
          ],
        },
        {
          type: 'examples',
          items: [
            {
              en: "The phone is ringing. I'll answer it.",
              pl: 'Telefon dzwoni. Odbiorę.',
              note: 'Decyzja teraz.',
            },
            {
              en: "I'll call you tonight, I promise.",
              pl: 'Zadzwonię do ciebie wieczorem, obiecuję.',
              note: 'Obietnica.',
            },
            {
              en: 'I think it will be sunny tomorrow.',
              pl: 'Myślę, że jutro będzie słonecznie.',
              note: 'Przewidywanie.',
            },
            {
              en: 'Will you help me with this bag?',
              pl: 'Pomożesz mi z tą torbą?',
              note: 'Prośba.',
            },
          ],
        },
      ],
    },
    {
      title: 'Budowa',
      blocks: [
        {
          type: 'text',
          text: 'Po **will** stawiamy **formę podstawową** czasownika, bez to i bez końcówek. Will jest takie samo dla wszystkich osób.',
        },
        {
          type: 'formula',
          label: 'Twierdzenie',
          parts: ['podmiot', 'will', 'czasownik (forma podstawowa)'],
        },
        {
          type: 'table',
          caption: 'Czasownik work (pracować)',
          header: ['Osoba', 'Forma pełna', 'Forma skrócona'],
          rows: [
            ['I', 'I **will** work', "I'll work"],
            ['you', 'you **will** work', "you'll work"],
            ['we', 'we **will** work', "we'll work"],
            ['they', 'they **will** work', "they'll work"],
            ['he', 'he **will** work', "he'll work"],
            ['she', 'she **will** work', "she'll work"],
            ['it', 'it **will** work', "it'll work"],
          ],
        },
        {
          type: 'examples',
          items: [
            { en: "I'll have the soup, please.", pl: 'Poproszę zupę.' },
            { en: 'She will love this present.', pl: 'Ten prezent na pewno jej się spodoba.' },
            { en: "We'll see you on Friday.", pl: 'Zobaczymy się w piątek.' },
            { en: 'It will be fine.', pl: 'Będzie dobrze.' },
          ],
        },
      ],
    },
    {
      title: "Formy skrócone 'll i won't",
      blocks: [
        {
          type: 'text',
          text: 'W mowie will prawie zawsze skracamy do ==’ll==, a will not do ==won’t==.',
        },
        {
          type: 'table',
          header: ['Forma pełna', 'Forma skrócona'],
          rows: [
            ['I will', "I**'ll**"],
            ['she will', "she**'ll**"],
            ['it will', "it**'ll**"],
            ['will not', "**won't**"],
          ],
        },
        {
          type: 'tip',
          text: 'Won’t piszemy przez **o**, nie „willn’t”. Formy „willn’t” w angielskim nie ma.',
        },
        {
          type: 'mistake',
          wrong: 'He wills come later.',
          right: 'He will come later.',
          note: 'Will nigdy nie dostaje końcówki -s, nawet przy he, she, it.',
        },
      ],
    },
    {
      title: 'Przeczenia',
      blocks: [
        {
          type: 'text',
          text: "Przeczenie tworzymy z **won't** (will not) i formą podstawową czasownika.",
        },
        {
          type: 'formula',
          label: 'Przeczenie',
          parts: ['podmiot', "won't", 'czasownik (forma podstawowa)'],
        },
        {
          type: 'table',
          header: ['Osoba', 'Forma skrócona', 'Forma pełna'],
          rows: [
            ['I / you / we / they', "I **won't** work", 'I **will not** work'],
            ['he / she / it', "she **won't** work", 'she **will not** work'],
          ],
        },
        {
          type: 'examples',
          items: [
            { en: "I won't tell anyone.", pl: 'Nikomu nie powiem.' },
            { en: "She won't be late.", pl: 'Ona się nie spóźni.' },
            { en: "Don't worry, it won't hurt.", pl: 'Nie martw się, nie będzie bolało.' },
            { en: "They won't come to the party.", pl: 'Oni nie przyjdą na imprezę.' },
          ],
        },
      ],
    },
    {
      title: 'Pytania i krótkie odpowiedzi',
      blocks: [
        {
          type: 'text',
          text: 'W pytaniu **will** idzie na początek, przed podmiot. Żeby coś zaproponować, przy I i we często mówimy **Shall**.',
        },
        {
          type: 'formula',
          label: 'Pytanie',
          parts: ['Will', 'podmiot', 'czasownik (forma podstawowa)', '?'],
        },
        {
          type: 'formula',
          label: 'Pytanie z wh-',
          parts: ['słowo pytające', 'will', 'podmiot', 'czasownik', '?'],
        },
        {
          type: 'table',
          caption: 'Krótkie odpowiedzi',
          header: ['Pytanie', 'Tak', 'Nie'],
          rows: [
            ['Will you come?', 'Yes, I will.', "No, I won't."],
            ['Will she come?', 'Yes, she will.', "No, she won't."],
            ['Will they come?', 'Yes, they will.', "No, they won't."],
          ],
        },
        {
          type: 'examples',
          items: [
            { en: 'Will you be at home tomorrow?', pl: 'Będziesz jutro w domu?' },
            { en: 'When will they arrive?', pl: 'Kiedy oni przyjadą?' },
            { en: 'What will you do?', pl: 'Co zrobisz?' },
            { en: 'Shall I open the window?', pl: 'Otworzyć okno?' },
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
            'Czas: **tomorrow** (jutro), **next week** (w przyszłym tygodniu), **soon** (wkrótce), **in two days** (za dwa dni).',
            'Opinia: **I think** (myślę, że), **I’m sure** (jestem pewien), **probably** (prawdopodobnie), **maybe** (może).',
          ],
        },
        {
          type: 'text',
          text: 'Polskie „za dwa dni” to **in two days**. Probably stawiamy **po will**, ale **przed won’t**.',
        },
        {
          type: 'examples',
          items: [
            { en: "I'll finish it tomorrow.", pl: 'Skończę to jutro.' },
            { en: "She'll probably stay at home.", pl: 'Ona prawdopodobnie zostanie w domu.' },
            { en: "He probably won't come.", pl: 'On prawdopodobnie nie przyjdzie.' },
            { en: "I'm sure you'll like it.", pl: 'Jestem pewien, że ci się spodoba.' },
          ],
        },
      ],
    },
    {
      title: 'Typowe błędy',
      blocks: [
        {
          type: 'mistake',
          wrong: 'I will to call you.',
          right: 'I will call you.',
          note: 'Po will nie stawiamy to. Od razu idzie forma podstawowa.',
        },
        {
          type: 'mistake',
          wrong: 'She will comes tomorrow.',
          right: 'She will come tomorrow.',
          note: 'Po will czasownik nie ma końcówki -s.',
        },
        {
          type: 'mistake',
          wrong: 'I will going to the shop.',
          right: 'I will go to the shop.',
          note: 'Po will nie dodajemy -ing. Wystarczy forma podstawowa.',
        },
        {
          type: 'mistake',
          wrong: "Yes, I'll.",
          right: 'Yes, I will.',
          note: 'W krótkiej odpowiedzi na tak nie skracamy will.',
        },
        {
          type: 'mistake',
          wrong: "I'll see you after two hours.",
          right: "I'll see you in two hours.",
          note: 'Polskie „za dwie godziny” to ==in two hours==. After znaczy „po”.',
        },
      ],
    },
    {
      title: 'Future Simple czy going to?',
      blocks: [
        {
          type: 'text',
          text: 'Will używamy, gdy decydujemy **teraz** albo przewidujemy coś **na podstawie opinii**. Going to używamy, gdy coś **już wcześniej zaplanowaliśmy** albo **widzimy**, że coś się zaraz stanie.',
        },
        {
          type: 'table',
          header: ['will', 'going to'],
          rows: [
            [
              'decyzja teraz: I’m hungry. I**’ll make** a sandwich.',
              'plan: I**’m going to visit** my gran on Saturday.',
            ],
            [
              'opinia: I think it **will rain** tomorrow.',
              'widzimy znaki: Look at those clouds! It**’s going to rain**.',
            ],
          ],
        },
        {
          type: 'tip',
          text: 'Plany ustalone z kimś, z dniem albo godziną, często wyrażamy czasem [[present-continuous]]: ==I’m meeting Tom at six.==',
        },
      ],
    },
  ],
};
