import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { router } from 'expo-router';
import { useColorScheme, useWindowDimensions } from 'react-native';

import HomeScreen from '@/app/index';
import { INTRO, START_CARD_LABEL_PREFIX } from '@/features/home/home-copy';
import {
  getTenseGrid,
  getTopic,
  listCategories,
  plainText,
  TENSE_ASPECTS,
  TENSE_TIMES,
} from '@/features/lessons';
import { sizes, themes } from '@/ui/theme';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  router: { push: jest.fn() },
}));
// Home reads the catalog through the lessons door, so these mocks reach only home.
jest.mock('@/features/lessons', () => {
  const actual = jest.requireActual('@/features/lessons');
  return {
    ...actual,
    getTenseGrid: jest.fn(actual.getTenseGrid),
    getTopic: jest.fn(actual.getTopic),
    listCategories: jest.fn(actual.listCategories),
  };
});

const actual = jest.requireActual<typeof import('@/features/lessons')>('@/features/lessons');
const mockPush = jest.mocked(router.push);

const setFontScale = (fontScale: number) =>
  jest
    .mocked(useWindowDimensions)
    .mockReturnValue({ width: 390, height: 844, scale: 3, fontScale });

const START_LABEL = `${START_CARD_LABEL_PREFIX}Present Simple`;

/** Every tense in grid order: present simple, present continuous, ... future perfect continuous. */
const GRID_TITLES = TENSE_TIMES.flatMap((time) =>
  TENSE_ASPECTS.map((aspect) => actual.getTenseGrid()[time][aspect]?.title),
);

const tileLabels = () =>
  screen
    .getAllByRole('link')
    .map((node) => String(node.props.accessibilityLabel))
    .filter((label) => label !== START_LABEL && !label.startsWith('Przedimki'));

const headings = () => screen.getAllByRole('heading').map((node) => String(node.props.children));

beforeEach(() => {
  jest.mocked(useColorScheme).mockReturnValue('light');
  setFontScale(1);
  mockPush.mockClear();
  jest.mocked(getTenseGrid).mockImplementation(actual.getTenseGrid);
  jest.mocked(getTopic).mockImplementation(actual.getTopic);
  jest.mocked(listCategories).mockImplementation(actual.listCategories);
});

test('stacks title, start block, intro, map and other topics in order (covers: AC-1, AC-4, AC-10)', async () => {
  await render(<HomeScreen />);

  const order = headings().filter((text) =>
    [
      'Gramatyka angielska',
      'Zacznij tutaj',
      'Mapa czasów',
      'Teraźniejszość',
      'Przeszłość',
      'Przyszłość',
      'Inne tematy',
      'Rzeczowniki i przedimki',
    ].includes(text),
  );
  expect(order).toEqual([
    'Gramatyka angielska',
    'Zacznij tutaj',
    'Mapa czasów',
    'Teraźniejszość',
    'Przeszłość',
    'Przyszłość',
    'Inne tematy',
    'Rzeczowniki i przedimki',
  ]);
  expect(screen.getByRole('heading', { name: 'Gramatyka angielska' }).props.children).toBe(
    'Gramatyka angielska',
  );
});

test('the start card shows the summary and opens Present Simple (covers: AC-2)', async () => {
  await render(<HomeScreen />);

  const card = screen.getByRole('link', { name: START_LABEL });
  expect(within(card).getByText(actual.getTopic('present-simple')?.summary ?? '')).toBeTruthy();

  await fireEvent.press(card);
  expect(mockPush).toHaveBeenCalledWith({
    pathname: '/lesson/[id]',
    params: { id: 'present-simple' },
  });
});

test('the intro bubble is one element read without asterisks (covers: AC-3)', async () => {
  await render(<HomeScreen />);

  const bubble = screen.getByLabelText(plainText(INTRO));
  expect(bubble.props.accessibilityLabel).not.toContain('*');
  expect(within(bubble).getByText('12 czasów')).toHaveStyle({ fontWeight: '600' });
});

test('the map shows all 12 tenses once, in grid order, as tiles (covers: AC-4, AC-5)', async () => {
  await render(<HomeScreen />);

  const titles = tileLabels().map((label) => label.split(', ')[0]);
  expect(titles).toEqual(GRID_TITLES);
  expect(new Set(titles).size).toBe(12);

  // Tiles have no chevron; the only icons are the intro map and the three time frames.
  const icons = screen
    .getAllByTestId('icon', { includeHiddenElements: true })
    .map((node) => node.props.name);
  expect(icons.filter((name) => name === 'chevron.right')).toHaveLength(2);
  expect(icons).toEqual(
    expect.arrayContaining([
      'map',
      'smallcircle.filled.circle',
      'arrow.left.circle',
      'arrow.right.circle',
    ]),
  );
});

test('a tile fills its cell and opens its lesson (covers: AC-5)', async () => {
  await render(<HomeScreen />);

  const tile = screen.getByRole('link', {
    name: 'Past Simple, czas przeszły prosty',
  });
  expect(tile).toHaveStyle({ flexGrow: 1 });

  await fireEvent.press(tile);
  expect(mockPush).toHaveBeenCalledWith({
    pathname: '/lesson/[id]',
    params: { id: 'past-simple' },
  });
});

test('an unwritten tile is muted, captioned, labelled and still opens (covers: AC-5)', async () => {
  await render(<HomeScreen />);

  const tile = screen.getByRole('link', {
    name: 'Present Perfect, czas teraźniejszy dokonany, lekcja jeszcze niegotowa',
  });
  expect(within(tile).getByText('Lekcja jeszcze niegotowa')).toBeTruthy();
  expect(within(tile).getByText('Present Perfect')).toHaveStyle({
    color: themes.light.colors.inkMuted,
  });

  await fireEvent.press(tile);
  expect(mockPush).toHaveBeenCalledWith({
    pathname: '/lesson/[id]',
    params: { id: 'present-perfect' },
  });
});

test.each([1, 1.12])('two tiles per row at font scale %s (covers: AC-6)', async (scale) => {
  setFontScale(scale);
  await render(<HomeScreen />);

  const rows = screen.getAllByTestId('tense-row');
  expect(rows).toHaveLength(6);
  rows.forEach((row) => expect(within(row).getAllByRole('link')).toHaveLength(2));
});

test.each([sizes.gridMaxFontScale, 1.35, 3.1])(
  'one tile per row at font scale %s (covers: AC-6)',
  async (scale) => {
    setFontScale(scale);
    await render(<HomeScreen />);

    const rows = screen.getAllByTestId('tense-row');
    expect(rows).toHaveLength(12);
    rows.forEach((row) => expect(within(row).getAllByRole('link')).toHaveLength(1));
    expect(tileLabels().map((label) => label.split(', ')[0])).toEqual(GRID_TITLES);
  },
);

test('other topics lists articles, which open their lesson (covers: AC-7)', async () => {
  await render(<HomeScreen />);

  const card = screen.getByRole('link', { name: /^Przedimki a \/ an \/ the/ });
  await fireEvent.press(card);
  expect(mockPush).toHaveBeenCalledWith({ pathname: '/lesson/[id]', params: { id: 'articles' } });
});

test('with only the tenses category, the other topics section is gone (covers: AC-7)', async () => {
  jest
    .mocked(listCategories)
    .mockImplementation(() => actual.listCategories().filter((c) => c.id === 'tenses'));
  await render(<HomeScreen />);

  expect(screen.queryByRole('heading', { name: 'Inne tematy' })).toBeNull();
  expect(screen.queryByRole('link', { name: /^Przedimki/ })).toBeNull();
});

describe.each([1, 1.35])('missing data at font scale %s (covers: AC-2, AC-9)', (scale) => {
  beforeEach(() => {
    setFontScale(scale);
    jest.mocked(getTenseGrid).mockImplementation(() => {
      const grid = actual.getTenseGrid();
      return { ...grid, past: { ...grid.past, perfect: undefined } };
    });
    jest
      .mocked(getTopic)
      .mockImplementation((id) => (id === 'present-simple' ? undefined : actual.getTopic(id)));
  });

  test('keeps 11 tiles and drops the start block without throwing', async () => {
    await render(<HomeScreen />);

    expect(tileLabels()).toHaveLength(11);
    expect(screen.queryByRole('heading', { name: 'Zacznij tutaj' })).toBeNull();
    expect(screen.queryByRole('link', { name: START_LABEL })).toBeNull();
    expect(screen.getAllByTestId('tense-row')).toHaveLength(scale === 1 ? 6 : 11);
  });
});

test.each(['light', 'dark'] as const)('uses the %s theme colours (covers: AC-10)', async (mode) => {
  jest.mocked(useColorScheme).mockReturnValue(mode);
  await render(<HomeScreen />);

  expect(screen.root).toHaveStyle({ backgroundColor: themes[mode].colors.paper });
  expect(screen.getByRole('heading', { name: 'Mapa czasów' })).toHaveStyle({
    color: themes[mode].colors.ink,
  });
});
