import type { Lesson } from '../../model/types';
import type { TopicId } from '../catalog';

// A1 to A2 lesson in the 8 section template (spec 0004). AI draft: check the grammar
// and the Polish, then set review to 'checked'.

export const presentContinuous: Lesson<TopicId> = {
  review: 'draft',
  related: ['present-simple', 'past-continuous'],
  sections: [
    {
      title: 'Kiedy używamy',
      blocks: [
        {
          type: 'text',
          text: 'Present Continuous mówi o tym, co dzieje się **teraz** albo **w tym okresie**. Czynność trwa, jeszcze się nie skończyła.',
        },
        {
          type: 'list',
          items: [
            '**Teraz**, w chwili mówienia.',
            '**Sytuacje tymczasowe**, które trwają tylko przez jakiś czas.',
            '**Zmiany**, które właśnie zachodzą.',
            '**Ustalone plany** na najbliższą przyszłość, często z dniem albo godziną.',
          ],
        },
        {
          type: 'examples',
          items: [
            {
              en: 'I am reading a book now.',
              pl: 'Teraz czytam książkę.',
              note: 'Teraz.',
            },
            {
              en: 'She is staying with her aunt this week.',
              pl: 'W tym tygodniu ona mieszka u cioci.',
              note: 'Sytuacja tymczasowa.',
            },
            {
              en: 'It is getting cold.',
              pl: 'Robi się zimno.',
              note: 'Zmiana.',
            },
            {
              en: 'We are meeting Tom tomorrow.',
              pl: 'Jutro spotykamy się z Tomem.',
              note: 'Ustalony plan.',
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
          text: 'Present Continuous ma dwie części: odpowiednią formę **be** (am, is, are) i czasownik z końcówką ==-ing==.',
        },
        {
          type: 'formula',
          label: 'Twierdzenie',
          parts: ['podmiot', 'am / is / are', 'czasownik + -ing'],
        },
        {
          type: 'table',
          caption: 'Czasownik work (pracować)',
          header: ['Osoba', 'Forma pełna', 'Forma skrócona'],
          rows: [
            ['I', 'I **am** working', "I'm working"],
            ['you', 'you **are** working', "you're working"],
            ['we', 'we **are** working', "we're working"],
            ['they', 'they **are** working', "they're working"],
            ['he', 'he **is** working', "he's working"],
            ['she', 'she **is** working', "she's working"],
            ['it', 'it **is** working', "it's working"],
          ],
        },
        {
          type: 'examples',
          items: [
            { en: "I'm cooking dinner.", pl: 'Gotuję obiad.' },
            { en: "They're playing in the garden.", pl: 'Oni bawią się w ogrodzie.' },
            { en: "He's talking on the phone.", pl: 'On rozmawia przez telefon.' },
            { en: "It's raining.", pl: 'Pada deszcz.' },
          ],
        },
        {
          type: 'tip',
          text: 'W mowie prawie zawsze używamy form skróconych: ==I’m==, ==you’re==, ==she’s==.',
        },
      ],
    },
    {
      title: 'Pisownia -ing',
      blocks: [
        {
          type: 'text',
          text: 'Zwykle po prostu dodajemy -ing, ale kilka grup czasowników ma inną pisownię.',
        },
        {
          type: 'table',
          header: ['Reguła', 'Przykład'],
          rows: [
            ['większość czasowników: + **-ing**', 'work → working, read → reading'],
            ['nieme -e na końcu: e znika, + **-ing**', 'make → making, write → writing'],
            ['-ee na końcu: + **-ing**', 'see → seeing'],
            [
              'krótki czasownik, jedna samogłoska + jedna spółgłoska: **podwajamy** spółgłoskę',
              'sit → sitting, run → running, swim → swimming',
            ],
            ['-ie na końcu: ie → **-ying**', 'lie → lying, die → dying'],
            ['-w, -x, -y na końcu: bez podwajania', 'play → playing, fix → fixing'],
          ],
        },
        {
          type: 'mistake',
          wrong: "She's writeing an email.",
          right: "She's writing an email.",
          note: 'Write kończy się na nieme -e, więc e znika: ==writing==.',
        },
      ],
    },
    {
      title: 'Przeczenia',
      blocks: [
        {
          type: 'text',
          text: 'Przeczenie tworzymy, dodając **not** po am, is albo are. Czasownik nadal ma końcówkę -ing.',
        },
        {
          type: 'formula',
          label: 'Przeczenie',
          parts: ['podmiot', 'am not / isn’t / aren’t', 'czasownik + -ing'],
        },
        {
          type: 'table',
          header: ['Osoba', 'Forma skrócona', 'Forma pełna'],
          rows: [
            ['I', "I'**m not** working", 'I **am not** working'],
            ['you / we / they', "we **aren't** working", 'we **are not** working'],
            ['he / she / it', "she **isn't** working", 'she **is not** working'],
          ],
        },
        {
          type: 'examples',
          items: [
            { en: "I'm not watching TV.", pl: 'Nie oglądam telewizji.' },
            { en: "He isn't sleeping.", pl: 'On nie śpi.' },
            { en: "We aren't working today.", pl: 'Dziś nie pracujemy.' },
            { en: "It isn't raining now.", pl: 'Teraz nie pada.' },
          ],
        },
        {
          type: 'tip',
          text: 'Przy I skracamy tylko am: ==I’m not==. Formy „I amn’t” nie ma.',
        },
      ],
    },
    {
      title: 'Pytania i krótkie odpowiedzi',
      blocks: [
        {
          type: 'text',
          text: 'W pytaniu **zamieniamy miejscami** podmiot i am, is albo are. Nie potrzebujemy do ani does.',
        },
        {
          type: 'formula',
          label: 'Pytanie',
          parts: ['Am / Is / Are', 'podmiot', 'czasownik + -ing', '?'],
        },
        {
          type: 'formula',
          label: 'Pytanie z wh-',
          parts: ['słowo pytające', 'am / is / are', 'podmiot', 'czasownik + -ing', '?'],
        },
        {
          type: 'table',
          caption: 'Krótkie odpowiedzi',
          header: ['Pytanie', 'Tak', 'Nie'],
          rows: [
            ['Are you working?', 'Yes, I am.', "No, I'm not."],
            ['Is she working?', 'Yes, she is.', "No, she isn't."],
            ['Are they working?', 'Yes, they are.', "No, they aren't."],
          ],
        },
        {
          type: 'examples',
          items: [
            { en: 'Are you listening?', pl: 'Słuchasz?' },
            { en: 'Is it raining?', pl: 'Czy pada?' },
            { en: 'What are you doing?', pl: 'Co robisz?' },
            { en: 'Where is she going?', pl: 'Dokąd ona idzie?' },
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
            'Teraz: **now** (teraz), **right now** (właśnie teraz), **at the moment** (w tej chwili).',
            'Okres tymczasowy: **today** (dzisiaj), **this week** (w tym tygodniu), **these days** (ostatnio, w tych dniach).',
            'Zwroty, które każą spojrzeć albo posłuchać: **Look!** (Patrz!), **Listen!** (Posłuchaj!).',
          ],
        },
        {
          type: 'examples',
          items: [
            { en: "I'm studying at the moment.", pl: 'W tej chwili się uczę.' },
            { en: "Look! The baby's smiling.", pl: 'Patrz! Dziecko się uśmiecha.' },
            {
              en: "She's working from home this week.",
              pl: 'W tym tygodniu ona pracuje z domu.',
            },
            { en: "We're having lunch right now.", pl: 'Właśnie jemy obiad.' },
          ],
        },
      ],
    },
    {
      title: 'Typowe błędy',
      blocks: [
        {
          type: 'mistake',
          wrong: 'I working now.',
          right: "I'm working now.",
          note: 'Present Continuous zawsze potrzebuje am, is albo are przed czasownikiem z -ing.',
        },
        {
          type: 'mistake',
          wrong: 'Look! It snows.',
          right: "Look! It's snowing.",
          note: 'Coś dzieje się teraz, na naszych oczach, więc używamy Present Continuous.',
        },
        {
          type: 'mistake',
          wrong: 'Are you work today?',
          right: 'Are you working today?',
          note: 'W pytaniu czasownik też ma końcówkę ==-ing==.',
        },
        {
          type: 'mistake',
          wrong: "Yes, I'm.",
          right: 'Yes, I am.',
          note: 'W krótkiej odpowiedzi na tak nie skracamy am, is ani are.',
        },
        {
          type: 'mistake',
          wrong: "I'm knowing the answer.",
          right: 'I know the answer.',
          note: 'Know, like, want i need opisują stan, nie czynność. Zwykle nie mają formy z -ing.',
        },
      ],
    },
    {
      title: 'Present Continuous czy Simple?',
      blocks: [
        {
          type: 'text',
          text: 'Present Continuous mówi o tym, co dzieje się **teraz** albo **tymczasowo**. Present Simple mówi o tym, co dzieje się **zwykle** albo jest **stałe**.',
        },
        {
          type: 'table',
          header: ['Present Continuous', 'Present Simple'],
          rows: [
            ['teraz: I **am walking** to work.', 'zwykle: I **walk** to work every day.'],
            ['tymczasowo: He **is living** with friends.', 'na stałe: He **lives** in Poznań.'],
            ['teraz: She **is wearing** a hat.', 'zwykle: She **wears** jeans.'],
          ],
        },
        {
          type: 'tip',
          text: 'Jeśli coś dzieje się **zwykle**, regularnie albo zawsze, użyj [[present-simple]].',
        },
      ],
    },
  ],
};
