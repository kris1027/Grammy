import { render, screen } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';

import { getLesson } from '@/features/lessons';
import {
  MISSING_LESSON,
  POLISH_LETTERS,
  ShowcaseScreen,
} from '@/features/showcase/showcase-screen';
import { themes } from '@/ui/theme';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// The lessons door re-exports the queries from this module, so mocking it here changes
// what the showcase sees.
jest.mock('@/features/lessons/views/queries', () => {
  const actual = jest.requireActual('@/features/lessons/views/queries');
  return { ...actual, getLesson: jest.fn(actual.getLesson) };
});

const mockGetLesson = jest.mocked(getLesson);
const realGetLesson = jest.requireActual<typeof import('@/features/lessons/views/queries')>(
  '@/features/lessons/views/queries',
).getLesson;

beforeEach(() => {
  mockGetLesson.mockImplementation(realGetLesson);
});

describe.each(['light', 'dark'] as const)('in %s mode (covers: AC-8)', (mode) => {
  beforeEach(() => jest.mocked(useColorScheme).mockReturnValue(mode));

  test('shows swatches, type scale, Polish letters and every part', async () => {
    await render(<ShowcaseScreen />);

    expect(screen.root).toHaveStyle({ backgroundColor: themes[mode].colors.paper });
    Object.keys(themes[mode].colors).forEach((key) =>
      expect(screen.getByText(key)).toBeOnTheScreen(),
    );
    expect(screen.getAllByText(themes[mode].colors.paper).length).toBeGreaterThan(0);
    ['Kolory', 'Pismo', 'Polskie litery', 'Części', 'Lekcja przykładowa'].forEach((name) =>
      expect(screen.getByRole('heading', { name })).toBeOnTheScreen(),
    );
    expect(screen.getAllByText(POLISH_LETTERS)).toHaveLength(2);
    expect(screen.getAllByTestId('number-badge')).toHaveLength(3);
    expect(screen.getByRole('image', { name: 'Gwiazdka' })).toBeOnTheScreen();
  });

  test('renders every Present Simple section and block', async () => {
    await render(<ShowcaseScreen />);

    const lookup = realGetLesson('present-simple');
    if (lookup.kind !== 'ok') throw new Error('Present Simple draft is missing');
    lookup.lesson.sections.forEach((section) =>
      expect(screen.getByRole('heading', { name: section.title })).toBeOnTheScreen(),
    );
    expect(screen.getByLabelText('Błędnie: He work every day.')).toBeOnTheScreen();
    expect(screen.getByLabelText(/^Wskazówka: .*Present Continuous/)).toBeOnTheScreen();
    expect(screen.getByLabelText(/^Wzór, Twierdzenie: /)).toBeOnTheScreen();
    expect(screen.getByText('Czasownik work (pracować)')).toBeOnTheScreen();
  });
});

test('shows a fallback when the sample lesson cannot be loaded (covers: AC-8)', async () => {
  jest.mocked(useColorScheme).mockReturnValue('light');
  mockGetLesson.mockReturnValue({ kind: 'unknown' });

  await render(<ShowcaseScreen />);

  expect(screen.getByText(MISSING_LESSON)).toBeOnTheScreen();
});
