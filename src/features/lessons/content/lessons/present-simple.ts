import type { Lesson } from '../../model/types';
import type { TopicId } from '../catalog';

// Full A1 to A2 lesson in the 8 section template (spec 0004). AI draft: it stays
// `draft` until you check it with the spec's Grammar checklist.

export const presentSimple: Lesson<TopicId> = {
  review: 'draft',
  related: ['present-continuous', 'past-simple'],
  sections: [
    {
      title: 'Kiedy używamy',
      blocks: [
        {
          type: 'text',
          text: 'Present Simple to najczęściej używany czas w angielskim. Mówimy w nim o tym, co jest **stałe** albo **powtarza się**, a nie o tym, co dzieje się w tej chwili.',
        },
        {
          type: 'list',
          items: [
            '**Nawyki i rutyny**, czyli to, co robimy regularnie.',
            '**Fakty i prawdy ogólne**, które są zawsze prawdziwe.',
            '**Stałe sytuacje**, na przykład gdzie mieszkamy albo pracujemy.',
            '**Upodobania**, czyli co lubimy, kochamy albo czego nie znosimy (like, love, hate).',
          ],
        },
        {
          type: 'examples',
          items: [
            {
              en: 'I get up at seven every day.',
              pl: 'Codziennie wstaję o siódmej.',
              note: 'Nawyk.',
            },
            {
              en: 'Water boils at 100 degrees.',
              pl: 'Woda wrze w temperaturze 100 stopni.',
              note: 'Fakt.',
            },
            {
              en: 'My sister lives in Kraków.',
              pl: 'Moja siostra mieszka w Krakowie.',
              note: 'Stała sytuacja.',
            },
            { en: 'We love pizza.', pl: 'Uwielbiamy pizzę.', note: 'Upodobanie.' },
          ],
        },
      ],
    },
    {
      title: 'Budowa',
      blocks: [
        {
          type: 'text',
          text: 'W twierdzeniu używamy **formy podstawowej** czasownika, czyli takiej jak w słowniku. Tylko przy he, she i it dodajemy końcówkę ==-s==.',
        },
        {
          type: 'formula',
          label: 'Twierdzenie',
          parts: ['podmiot', 'czasownik (+ -s dla he, she, it)'],
        },
        {
          type: 'table',
          caption: 'Czasownik work (pracować)',
          header: ['Osoba', 'Twierdzenie'],
          rows: [
            ['I', 'I work'],
            ['you', 'you work'],
            ['we', 'we work'],
            ['they', 'they work'],
            ['he', 'he **works**'],
            ['she', 'she **works**'],
            ['it', 'it **works**'],
          ],
        },
        {
          type: 'examples',
          items: [
            { en: 'I drink coffee in the morning.', pl: 'Rano piję kawę.' },
            { en: 'They play football on Sundays.', pl: 'Oni grają w piłkę w niedziele.' },
            { en: 'He reads a lot.', pl: 'On dużo czyta.' },
            { en: 'The shop opens at nine.', pl: 'Sklep otwiera się o dziewiątej.' },
          ],
        },
        {
          type: 'tip',
          text: 'He, she i it to **3. osoba liczby pojedynczej**. Tak samo traktujemy jedną osobę lub rzecz, na przykład my mum, Tom albo the shop: ==my mum works==.',
        },
      ],
    },
    {
      title: 'Pisownia -s / -es / -ies',
      blocks: [
        {
          type: 'text',
          text: 'Końcówkę dla he, she i it zwykle piszemy jako -s, ale kilka grup czasowników ma inną pisownię.',
        },
        {
          type: 'table',
          header: ['Reguła', 'Przykład'],
          rows: [
            ['większość czasowników: + **-s**', 'work → works, read → reads'],
            [
              'po -s, -ss, -sh, -ch, -x, -o: + **-es**',
              'kiss → kisses, wash → washes, watch → watches, fix → fixes, go → goes, do → does',
            ],
            ['spółgłoska + y: y → **-ies**', 'study → studies, fly → flies'],
            ['samogłoska + y: + **-s**', 'play → plays, buy → buys'],
            ['wyjątek', 'have → **has**'],
          ],
        },
        {
          type: 'mistake',
          wrong: 'He studys English.',
          right: 'He studies English.',
          note: 'Przed y stoi spółgłoska (d), więc y zmienia się w ==-ies==.',
        },
      ],
    },
    {
      title: 'Przeczenia',
      blocks: [
        {
          type: 'text',
          text: "Przeczenie tworzymy z **don't** albo **doesn't** i formą podstawową czasownika. Doesn't stawiamy tylko przy he, she i it.",
        },
        {
          type: 'formula',
          label: 'Przeczenie',
          parts: ['podmiot', "don't / doesn't", 'czasownik (forma podstawowa)'],
        },
        {
          type: 'table',
          header: ['Osoba', 'Forma skrócona', 'Forma pełna'],
          rows: [
            ['I / you / we / they', "I **don't** work", 'I **do not** work'],
            ['he / she / it', "she **doesn't** work", 'she **does not** work'],
          ],
        },
        {
          type: 'examples',
          items: [
            { en: "I don't eat meat.", pl: 'Nie jem mięsa.' },
            { en: "We don't live in Warsaw.", pl: 'Nie mieszkamy w Warszawie.' },
            { en: "He doesn't like tea.", pl: 'On nie lubi herbaty.' },
            {
              en: "My cat doesn't sleep at night.",
              pl: 'Mój kot nie śpi w nocy.',
            },
          ],
        },
        {
          type: 'mistake',
          wrong: "She doesn't works here.",
          right: "She doesn't work here.",
          note: 'Końcówka -s jest już w doesn’t, więc czasownik zostaje w formie podstawowej.',
        },
      ],
    },
    {
      title: 'Pytania i krótkie odpowiedzi',
      blocks: [
        {
          type: 'text',
          text: 'Pytanie zaczynamy od **Do** albo **Does** (przy he, she, it). Potem idzie podmiot i forma podstawowa czasownika.',
        },
        {
          type: 'formula',
          label: 'Pytanie',
          parts: ['Do / Does', 'podmiot', 'czasownik (forma podstawowa)', '?'],
        },
        {
          type: 'formula',
          label: 'Pytanie z wh-',
          parts: ['słowo pytające', 'do / does', 'podmiot', 'czasownik', '?'],
        },
        {
          type: 'table',
          caption: 'Krótkie odpowiedzi',
          header: ['Pytanie', 'Tak', 'Nie'],
          rows: [
            ['Do you work?', 'Yes, I do.', "No, I don't."],
            ['Do they work?', 'Yes, they do.', "No, they don't."],
            ['Does she work?', 'Yes, she does.', "No, she doesn't."],
          ],
        },
        {
          type: 'examples',
          items: [
            { en: 'Do you speak English?', pl: 'Czy mówisz po angielsku?' },
            { en: 'Does he work on Saturdays?', pl: 'Czy on pracuje w soboty?' },
            { en: 'Where do you live?', pl: 'Gdzie mieszkasz?' },
            {
              en: 'What time does the film start?',
              pl: 'O której zaczyna się film?',
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
            'Jak często: **always** (zawsze), **usually** (zwykle), **often** (często), **sometimes** (czasami), **never** (nigdy).',
            'Określenia czasu: **every day** (codziennie), **on Mondays** (w poniedziałki), **once a week** (raz w tygodniu).',
          ],
        },
        {
          type: 'text',
          text: 'Słowa takie jak always czy never stawiamy **przed głównym czasownikiem**, ale **po** am, is, are. Określenia czasu, na przykład every day, zwykle stoją na końcu zdania.',
        },
        {
          type: 'examples',
          items: [
            { en: 'I always drink tea at breakfast.', pl: 'Zawsze piję herbatę przy śniadaniu.' },
            { en: 'She never eats fast food.', pl: 'Ona nigdy nie je fast foodów.' },
            { en: 'He is usually tired after work.', pl: 'On jest zwykle zmęczony po pracy.' },
            { en: 'We go to the gym once a week.', pl: 'Chodzimy na siłownię raz w tygodniu.' },
          ],
        },
      ],
    },
    {
      title: 'Typowe błędy',
      blocks: [
        {
          type: 'mistake',
          wrong: 'He work in an office.',
          right: 'He works in an office.',
          note: 'Przy he, she, it dodajemy ==-s== do czasownika.',
        },
        {
          type: 'mistake',
          wrong: "My brother doesn't plays tennis.",
          right: "My brother doesn't play tennis.",
          note: 'Po doesn’t czasownik nie ma końcówki -s.',
        },
        {
          type: 'mistake',
          wrong: 'Does he likes music?',
          right: 'Does he like music?',
          note: 'Końcówka -s jest już w does, więc czasownik zostaje w formie podstawowej.',
        },
        {
          type: 'mistake',
          wrong: 'I am work in a shop.',
          right: 'I work in a shop.',
          note: 'Nie łączymy am, is, are ze zwykłym czasownikiem. W Present Simple wystarczy sam czasownik.',
        },
      ],
    },
    {
      title: 'Present Simple czy Continuous?',
      blocks: [
        {
          type: 'text',
          text: 'Present Simple mówi o tym, co dzieje się **zwykle** albo **zawsze**. Present Continuous mówi o tym, co dzieje się **teraz**, w tej chwili.',
        },
        {
          type: 'table',
          header: ['Present Simple', 'Present Continuous'],
          rows: [
            ['nawyk: I **drink** coffee every day.', 'teraz: I **am drinking** coffee now.'],
            ['fakt: She **speaks** French.', 'teraz: She **is speaking** to her boss.'],
            ['stała sytuacja: They **live** in Gdańsk.', 'teraz: They **are watching** TV.'],
          ],
        },
        {
          type: 'tip',
          text: 'Jeśli coś dzieje się **teraz**, w tej chwili, użyj [[present-continuous]].',
        },
      ],
    },
  ],
};
