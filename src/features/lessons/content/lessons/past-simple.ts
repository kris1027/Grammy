import type { Lesson } from '../../model/types';
import type { TopicId } from '../catalog';

// A1 to A2 lesson in the 8 section template (spec 0004). Checked by you with the
// spec 0004 Grammar checklist.

export const pastSimple: Lesson<TopicId> = {
  review: 'checked',
  related: ['present-perfect', 'past-continuous'],
  sections: [
    {
      title: 'Kiedy używamy',
      blocks: [
        {
          type: 'text',
          text: 'Past Simple mówi o tym, co **wydarzyło się i skończyło** w przeszłości. Zwykle wiemy albo mówimy, **kiedy** to było.',
        },
        {
          type: 'list',
          items: [
            '**Zakończone wydarzenia**, gdy wiemy, kiedy się stały (wczoraj, w 2020 roku).',
            '**Kolejne wydarzenia**, jedno po drugim, na przykład w opowiadaniu.',
            '**Stany i nawyki z przeszłości**, które już minęły.',
          ],
        },
        {
          type: 'examples',
          items: [
            {
              en: 'I visited my grandparents last weekend.',
              pl: 'W zeszły weekend odwiedziłem dziadków.',
              note: 'Zakończone wydarzenie.',
            },
            {
              en: 'She opened the door and went inside.',
              pl: 'Ona otworzyła drzwi i weszła do środka.',
              note: 'Kolejne wydarzenia.',
            },
            {
              en: 'We lived in Lublin when I was a child.',
              pl: 'Kiedy byłem dzieckiem, mieszkaliśmy w Lublinie.',
              note: 'Stan z przeszłości.',
            },
            {
              en: 'He walked to school every day.',
              pl: 'Codziennie chodził do szkoły pieszo.',
              note: 'Nawyk z przeszłości.',
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
          text: 'W twierdzeniu czasownik ma **formę przeszłą**. Czasowniki regularne dostają końcówkę ==-ed==, a nieregularne mają własną formę. Forma jest **taka sama dla wszystkich osób**.',
        },
        {
          type: 'formula',
          label: 'Twierdzenie',
          parts: ['podmiot', 'czasownik + -ed / forma nieregularna'],
        },
        {
          type: 'table',
          caption: 'Czasownik regularny i nieregularny',
          header: ['Osoba', 'work (pracować)', 'go (iść, jechać)'],
          rows: [
            ['I / you / we / they', 'I **worked**', 'they **went**'],
            ['he / she / it', 'she **worked**', 'he **went**'],
          ],
        },
        {
          type: 'text',
          text: 'Czasownik **be** ma dwie formy: **was** dla I, he, she, it oraz **were** dla you, we, they.',
        },
        {
          type: 'table',
          caption: 'Czasownik be (być)',
          header: ['Osoba', 'Twierdzenie'],
          rows: [
            ['I / he / she / it', 'I **was** tired'],
            ['you / we / they', 'we **were** tired'],
          ],
        },
        {
          type: 'examples',
          items: [
            { en: 'I watched a film yesterday.', pl: 'Wczoraj obejrzałem film.' },
            { en: 'They went to Gdańsk in July.', pl: 'W lipcu pojechali do Gdańska.' },
            { en: 'She was at home on Sunday.', pl: 'W niedzielę ona była w domu.' },
            { en: 'We were very happy.', pl: 'Byliśmy bardzo szczęśliwi.' },
          ],
        },
      ],
    },
    {
      title: 'Pisownia -ed i formy nieregularne',
      blocks: [
        {
          type: 'text',
          text: 'Czasowniki regularne mają kilka reguł pisowni końcówki -ed.',
        },
        {
          type: 'table',
          header: ['Reguła', 'Przykład'],
          rows: [
            ['większość czasowników: + **-ed**', 'work → worked, watch → watched'],
            ['-e na końcu: + **-d**', 'live → lived, like → liked'],
            ['spółgłoska + y: y → **-ied**', 'study → studied, cry → cried'],
            ['samogłoska + y: + **-ed**', 'play → played, stay → stayed'],
            [
              'krótki czasownik, jedna samogłoska + jedna spółgłoska: **podwajamy** spółgłoskę',
              'stop → stopped, plan → planned',
            ],
          ],
        },
        {
          type: 'text',
          text: 'Formy nieregularnej nie da się wywnioskować z reguły. Trzeba się jej **nauczyć na pamięć**. Oto najczęstsze:',
        },
        {
          type: 'table',
          caption: 'Częste czasowniki nieregularne',
          header: ['Forma podstawowa', 'Past Simple'],
          rows: [
            ['go (iść, jechać)', 'went'],
            ['have (mieć)', 'had'],
            ['do (robić)', 'did'],
            ['see (widzieć)', 'saw'],
            ['make (robić, tworzyć)', 'made'],
            ['get (dostać)', 'got'],
            ['come (przyjść)', 'came'],
            ['buy (kupić)', 'bought'],
            ['eat (jeść)', 'ate'],
            ['take (wziąć)', 'took'],
          ],
        },
        {
          type: 'mistake',
          wrong: 'We goed to the cinema.',
          right: 'We went to the cinema.',
          note: 'Go jest nieregularny, więc nie dodajemy -ed. Forma przeszła to ==went==.',
        },
      ],
    },
    {
      title: 'Przeczenia',
      blocks: [
        {
          type: 'text',
          text: "Przeczenie tworzymy z **didn't** i **formą podstawową** czasownika. Didn't jest takie samo dla wszystkich osób. Przy be mówimy **wasn't** albo **weren't**.",
        },
        {
          type: 'formula',
          label: 'Przeczenie',
          parts: ['podmiot', "didn't", 'czasownik (forma podstawowa)'],
        },
        {
          type: 'table',
          header: ['Czasownik', 'Forma skrócona', 'Forma pełna'],
          rows: [
            ['zwykły czasownik', "I **didn't** work", 'I **did not** work'],
            ['be: I / he / she / it', "he **wasn't** tired", 'he **was not** tired'],
            ['be: you / we / they', "we **weren't** tired", 'we **were not** tired'],
          ],
        },
        {
          type: 'examples',
          items: [
            { en: "I didn't see him yesterday.", pl: 'Nie widziałem go wczoraj.' },
            { en: "She didn't like the film.", pl: 'Jej nie podobał się ten film.' },
            { en: "We didn't go out last night.", pl: 'Wczoraj wieczorem nie wychodziliśmy.' },
            { en: "It wasn't cold.", pl: 'Nie było zimno.' },
          ],
        },
        {
          type: 'mistake',
          wrong: "She didn't went home.",
          right: "She didn't go home.",
          note: 'Przeszłość jest już w didn’t, więc czasownik zostaje w formie podstawowej.',
        },
      ],
    },
    {
      title: 'Pytania i krótkie odpowiedzi',
      blocks: [
        {
          type: 'text',
          text: 'Pytanie zaczynamy od **Did**, potem idzie podmiot i forma podstawowa czasownika. Przy be zamieniamy miejscami podmiot i was albo were.',
        },
        {
          type: 'formula',
          label: 'Pytanie',
          parts: ['Did', 'podmiot', 'czasownik (forma podstawowa)', '?'],
        },
        {
          type: 'formula',
          label: 'Pytanie z wh-',
          parts: ['słowo pytające', 'did', 'podmiot', 'czasownik', '?'],
        },
        {
          type: 'table',
          caption: 'Krótkie odpowiedzi',
          header: ['Pytanie', 'Tak', 'Nie'],
          rows: [
            ['Did you work?', 'Yes, I did.', "No, I didn't."],
            ['Did she work?', 'Yes, she did.', "No, she didn't."],
            ['Was he tired?', 'Yes, he was.', "No, he wasn't."],
            ['Were they tired?', 'Yes, they were.', "No, they weren't."],
          ],
        },
        {
          type: 'examples',
          items: [
            { en: 'Did you sleep well?', pl: 'Dobrze spałeś?' },
            { en: 'Did they call you?', pl: 'Czy oni do ciebie dzwonili?' },
            { en: 'Where did you go on holiday?', pl: 'Gdzie pojechałeś na wakacje?' },
            { en: 'Were you at home last night?', pl: 'Byłeś wczoraj wieczorem w domu?' },
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
            '**yesterday** (wczoraj), **yesterday morning** (wczoraj rano).',
            '**last** + czas: **last night** (wczoraj wieczorem), **last week** (w zeszłym tygodniu), **last year** (w zeszłym roku).',
            'czas + **ago**: **two days ago** (dwa dni temu), **a long time ago** (dawno temu).',
            '**in** + rok: **in 2019** (w 2019 roku), oraz **when I was a child** (kiedy byłem dzieckiem).',
          ],
        },
        {
          type: 'text',
          text: 'Ago stoi **po** określeniu czasu, tak jak polskie „temu”. Przed last nie stawiamy in ani the.',
        },
        {
          type: 'examples',
          items: [
            { en: 'I met her two years ago.', pl: 'Poznałem ją dwa lata temu.' },
            { en: 'We moved here last year.', pl: 'Przeprowadziliśmy się tu w zeszłym roku.' },
            { en: 'He called me yesterday morning.', pl: 'Zadzwonił do mnie wczoraj rano.' },
          ],
        },
      ],
    },
    {
      title: 'Typowe błędy',
      blocks: [
        {
          type: 'mistake',
          wrong: 'I go to Paris last year.',
          right: 'I went to Paris last year.',
          note: 'Last year to zakończona przeszłość, więc czasownik musi być w formie przeszłej.',
        },
        {
          type: 'mistake',
          wrong: 'Did you saw my keys?',
          right: 'Did you see my keys?',
          note: 'Przeszłość jest już w did, więc czasownik zostaje w formie podstawowej.',
        },
        {
          type: 'mistake',
          wrong: 'He buyed a new phone.',
          right: 'He bought a new phone.',
          note: 'Buy jest nieregularny. Forma przeszła to ==bought==.',
        },
        {
          type: 'mistake',
          wrong: 'I was go to work.',
          right: 'I went to work.',
          note: 'Nie łączymy was ze zwykłym czasownikiem. Wystarczy sama forma przeszła.',
        },
        {
          type: 'mistake',
          wrong: 'I saw him before two days.',
          right: 'I saw him two days ago.',
          note: 'Polskie „dwa dni temu” to po angielsku ==two days ago==.',
        },
      ],
    },
    {
      title: 'Past Simple czy Present Perfect?',
      blocks: [
        {
          type: 'text',
          text: 'Past Simple mówi o przeszłości, która **się skończyła**, często z konkretnym czasem. Present Perfect łączy przeszłość z **teraz**: liczy się doświadczenie albo skutek, a nie to, kiedy coś się stało.',
        },
        {
          type: 'table',
          header: ['Past Simple', 'Present Perfect'],
          rows: [
            ['kiedy: I **saw** that film last week.', 'doświadczenie: I **have seen** that film.'],
            ['kiedy: She **lost** her keys yesterday.', 'skutek teraz: She **has lost** her keys.'],
            [
              'skończony okres: I **lived** in Kraków for two years.',
              'do teraz: I **have lived** here for two years.',
            ],
          ],
        },
        {
          type: 'tip',
          text: 'Z yesterday, last, ago i konkretną datą zawsze używamy Past Simple. Więcej o drugim czasie w lekcji [[present-perfect]].',
        },
      ],
    },
  ],
};
