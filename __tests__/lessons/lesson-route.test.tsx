import { fireEvent } from '@testing-library/react-native';
import { renderRouter, screen } from 'expo-router/testing-library';
import { useColorScheme } from 'react-native';

import RootLayout from '@/app/_layout';
import HomeScreen from '@/app/index';
import LessonRoute from '@/app/lesson/[id]';
import { getLesson } from '@/features/lessons';
import {
  BACK_HOME,
  DRAFT_CHIP,
  NOT_FOUND_TITLE,
  NOT_WRITTEN_TEXT,
  SEE_ALSO,
} from '@/features/lessons/screens/lesson-screen';
import { sizes, themes } from '@/ui/theme';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// The lessons door and the views read the queries from this module, so mocking it here
// lets one test pretend the lesson has been checked.
jest.mock('@/features/lessons/views/queries', () => {
  const actual = jest.requireActual('@/features/lessons/views/queries');
  return { ...actual, getLesson: jest.fn(actual.getLesson) };
});

const mockGetLesson = jest.mocked(getLesson);
const realGetLesson = jest.requireActual<typeof import('@/features/lessons/views/queries')>(
  '@/features/lessons/views/queries',
).getLesson;

const SECTION_LABELS = [
  '1. Kiedy używamy',
  '2. Budowa',
  '3. Pisownia -s / -es / -ies',
  '4. Przeczenia',
  '5. Pytania i krótkie odpowiedzi',
  '6. Słowa sygnałowe',
  '7. Typowe błędy',
  '8. Present Simple czy Continuous?',
];

const routes = {
  _layout: RootLayout,
  index: HomeScreen,
  'lesson/[id]': LessonRoute,
};

const open = (path: string) => renderRouter(routes, { initialUrl: path });

/** The header the iPhone shows: the last screen's native header config. */
const topHeader = () => {
  const headers = screen.container.queryAll(
    (node) => node.type === 'RNSScreenStackHeaderConfig' && node.props.hidden !== true,
  );
  return headers[headers.length - 1];
};

const scrollView = () => {
  const views = screen.container.queryAll(
    (node) => node.type === 'RCTScrollView' && typeof node.props.onScroll === 'function',
  );
  const last = views[views.length - 1];
  if (last === undefined) throw new Error('no scroll view');
  return last;
};

beforeEach(() => {
  jest.mocked(useColorScheme).mockReturnValue('light');
  mockGetLesson.mockImplementation(realGetLesson);
});

afterEach(() => {
  // renderRouter switches fake timers on.
  jest.useRealTimers();
});

test('the home card opens the Present Simple lesson (covers: AC-1)', async () => {
  await open('/');

  await fireEvent.press(screen.getByRole('link', { name: 'Otwórz lekcję: Present Simple' }));

  expect(screen).toHavePathname('/lesson/present-simple');
  expect(screen.getByRole('heading', { name: 'Present Simple' })).toBeOnTheScreen();
});

test('shows the whole lesson in order, with numbered sections (covers: AC-2, AC-7, AC-12)', async () => {
  await open('/lesson/present-simple');

  expect(screen.getByRole('heading', { name: 'Present Simple' })).toBeOnTheScreen();
  expect(screen.getByText('czas teraźniejszy prosty')).toBeOnTheScreen();
  expect(screen.queryByText(DRAFT_CHIP)).toBeNull();

  const headings = screen.getAllByRole('heading').map((node) => node.props.accessibilityLabel);
  expect(headings.filter((label) => /^\d+\. /.test(label ?? ''))).toEqual(SECTION_LABELS);
  expect(screen.getAllByTestId('number-badge', { includeHiddenElements: true })).toHaveLength(8);

  expect(screen.getByRole('heading', { name: SEE_ALSO })).toBeOnTheScreen();
  expect(
    screen.getByRole('link', {
      name: 'Present Continuous, czas teraźniejszy ciągły',
    }),
  ).toBeOnTheScreen();
  expect(
    screen.getByRole('link', {
      name: 'Past Simple, czas przeszły prosty',
    }),
  ).toBeOnTheScreen();
});

test('the paper header has an empty title and the Polish back button (covers: AC-2, AC-3)', async () => {
  await open('/');
  await fireEvent.press(screen.getByRole('link', { name: 'Otwórz lekcję: Present Simple' }));

  expect(topHeader()?.props).toMatchObject({
    title: '',
    backTitle: 'Wstecz',
    backgroundColor: themes.light.colors.paper,
  });
});

test('the header title follows the scroll position (covers: AC-3)', async () => {
  await open('/lesson/present-simple');

  // Before the top group is measured, scrolling never shows the title.
  await fireEvent.scroll(scrollView(), { nativeEvent: { contentOffset: { x: 0, y: 500 } } });
  expect(topHeader()?.props.title).toBe('');

  await fireEvent(screen.getByTestId('page-top'), 'layout', {
    nativeEvent: { layout: { x: 0, y: 16, width: 360, height: 100 } },
  });

  await fireEvent.scroll(scrollView(), { nativeEvent: { contentOffset: { x: 0, y: 115 } } });
  expect(topHeader()?.props.title).toBe('');

  await fireEvent.scroll(scrollView(), { nativeEvent: { contentOffset: { x: 0, y: 116 } } });
  expect(topHeader()?.props.title).toBe('Present Simple');

  await fireEvent.scroll(scrollView(), { nativeEvent: { contentOffset: { x: 0, y: 0 } } });
  expect(topHeader()?.props.title).toBe('');
});

test('a Zobacz też card to an unwritten topic is muted, labelled and opens its page (covers: AC-4, AC-5)', async () => {
  await open('/lesson/past-simple');

  const card = screen.getByRole('link', {
    name: 'Past Continuous, czas przeszły ciągły, lekcja jeszcze niegotowa',
  });
  // One caption per unwritten card (Present Perfect and Past Continuous).
  expect(screen.getAllByText('Lekcja jeszcze niegotowa')).toHaveLength(2);
  expect(screen.getByRole('heading', { name: 'Past Continuous' })).toHaveStyle({
    color: themes.light.colors.inkMuted,
  });

  await fireEvent.press(card);

  expect(screen).toHavePathname('/lesson/past-continuous');
  expect(screen.getByRole('heading', { name: 'Past Continuous' })).toBeOnTheScreen();
  expect(screen.getByText(NOT_WRITTEN_TEXT)).toBeOnTheScreen();
});

test('an inline link pushes that lesson (covers: AC-4)', async () => {
  await open('/lesson/present-simple');

  await fireEvent.press(screen.getByRole('link', { name: 'Present Continuous' }));

  expect(screen).toHavePathname('/lesson/present-continuous');
});

test('a link to the lesson you are on does nothing (covers: AC-4)', async () => {
  mockGetLesson.mockImplementation((id) => {
    const found = realGetLesson(id);
    if (found.kind !== 'ok' || found.topic.id !== 'present-simple') return found;
    return {
      ...found,
      lesson: {
        ...found.lesson,
        sections: [
          { title: 'Sekcja', blocks: [{ type: 'text', text: 'Zobacz [[present-simple|tutaj]].' }] },
        ],
      },
    };
  });
  await open('/lesson/present-simple');

  await fireEvent.press(screen.getByRole('link', { name: 'tutaj' }));

  expect(screen).toHavePathname('/lesson/present-simple');
  expect(screen.getAllByRole('heading', { name: 'Present Simple' })).toHaveLength(1);
});

test('a not written topic has no chip, sections or Zobacz też (covers: AC-5)', async () => {
  await open('/lesson/past-continuous');

  expect(screen.getByText('czas przeszły ciągły')).toBeOnTheScreen();
  expect(screen.getByText(NOT_WRITTEN_TEXT)).toHaveStyle({
    color: themes.light.colors.inkMuted,
  });
  expect(screen.queryByText(DRAFT_CHIP)).toBeNull();
  expect(screen.queryByRole('heading', { name: SEE_ALSO })).toBeNull();
  expect(screen.queryAllByTestId('number-badge', { includeHiddenElements: true })).toHaveLength(0);
});

test('an unknown id shows the not found page and a way home (covers: AC-6)', async () => {
  await open('/lesson/nie-ma-takiej');

  expect(screen.getByRole('heading', { name: NOT_FOUND_TITLE })).toBeOnTheScreen();
  expect(topHeader()?.props.title).toBe('');

  await fireEvent.press(screen.getByRole('link', { name: BACK_HOME }));

  expect(screen).toHavePathname('/');
  expect(screen.getByRole('heading', { name: 'Gramatyka angielska' })).toBeOnTheScreen();
});

test('an id that is not in the catalog never throws (covers: AC-6)', async () => {
  await open('/lesson/__proto__');

  expect(screen.getByRole('heading', { name: NOT_FOUND_TITLE })).toBeOnTheScreen();
});

test('a draft lesson shows the draft chip (covers: AC-2, AC-12)', async () => {
  mockGetLesson.mockImplementation((id) => {
    const found = realGetLesson(id);
    return found.kind === 'ok' ? { ...found, lesson: { ...found.lesson, review: 'draft' } } : found;
  });
  await open('/lesson/present-simple');

  expect(screen.getByRole('heading', { name: 'Present Simple' })).toBeOnTheScreen();
  expect(screen.getByText(DRAFT_CHIP)).toBeOnTheScreen();
});

test('the summary card shows and Zobacz też follows the related order (covers: AC-2)', async () => {
  const found = realGetLesson('past-simple');
  if (found.kind !== 'ok') throw new Error('Past Simple should be written');
  await open('/lesson/past-simple');

  expect(screen.getByText(found.topic.summary)).toBeOnTheScreen();
  const cardTitles = screen
    .getAllByRole('link')
    .map((node) => node.props.accessibilityLabel as string | undefined)
    .filter((label) => label?.endsWith('lekcja jeszcze niegotowa'))
    .map((label) => label?.split(',')[0]);
  expect(cardTitles).toEqual(['Present Perfect', 'Past Continuous']);
});

test('a not written page shows its title in the header once you scroll past it (covers: AC-3, AC-5)', async () => {
  await open('/lesson/past-continuous');
  await fireEvent(screen.getByTestId('page-top'), 'layout', {
    nativeEvent: { layout: { x: 0, y: 16, width: 360, height: 100 } },
  });

  await fireEvent.scroll(scrollView(), { nativeEvent: { contentOffset: { x: 0, y: 115 } } });
  expect(topHeader()?.props.title).toBe('');

  await fireEvent.scroll(scrollView(), { nativeEvent: { contentOffset: { x: 0, y: 116 } } });
  expect(topHeader()?.props.title).toBe('Past Continuous');

  await fireEvent.scroll(scrollView(), { nativeEvent: { contentOffset: { x: 0, y: 0 } } });
  expect(topHeader()?.props.title).toBe('');
});

test('the way home on the not found page is tall enough to press (covers: AC-10)', async () => {
  await open('/lesson/nie-ma-takiej');

  expect(screen.getByRole('link', { name: BACK_HOME })).toHaveStyle({
    minHeight: sizes.minTouch,
  });
});

test.each([
  ['Present Continuous, czas teraźniejszy ciągły', 'Present Continuous'],
  ['Past Simple, czas przeszły prosty', 'Past Simple'],
  ['Future Simple, czas przyszły prosty', 'Future Simple'],
])('the %s tile on home opens its full lesson (feature 7)', async (tileName, title) => {
  await open('/');
  await fireEvent.press(screen.getByRole('link', { name: tileName }));

  expect(screen.getByRole('heading', { name: title })).toBeOnTheScreen();
  expect(screen.getByText(DRAFT_CHIP)).toBeOnTheScreen();
  expect(screen.getAllByTestId('number-badge', { includeHiddenElements: true })).toHaveLength(8);
  expect(screen.getByRole('heading', { name: SEE_ALSO })).toBeOnTheScreen();
});
