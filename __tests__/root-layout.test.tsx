import { useTheme } from 'expo-router';
import { renderRouter, screen } from 'expo-router/testing-library';
import { fireEvent } from '@testing-library/react-native';
import { Text, useColorScheme } from 'react-native';

import RootLayout from '@/app/_layout';
import HomeScreen from '@/app/index';
import ShowcaseRoute from '@/app/showcase';
import { themes } from '@/ui/theme';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockColorScheme = jest.mocked(useColorScheme);

// Stands in for any screen, to show which navigation theme screens receive.
function ThemeProbe() {
  return <Text>{useTheme().dark ? 'dark navigation' : 'light navigation'}</Text>;
}

beforeEach(() => {
  mockColorScheme.mockReturnValue('light');
});

afterEach(() => {
  // renderRouter switches fake timers on.
  jest.useRealTimers();
});

test('opens on the home screen', async () => {
  await renderRouter({ _layout: RootLayout, index: HomeScreen, showcase: ShowcaseRoute });

  expect(screen).toHavePathname('/');
  expect(screen.getByRole('heading', { name: 'Gramatyka angielska' })).toBeOnTheScreen();
});

test('hides the navigation header above the home screen', async () => {
  await renderRouter({ _layout: RootLayout, index: HomeScreen, showcase: ShowcaseRoute });

  // The iPhone draws the header itself, so there is no header text to query.
  // This reads the setting handed to the native view (a react-native-screens
  // internal name, so check it first if an upgrade breaks this test).
  const headers = screen.container.queryAll((node) => node.type === 'RNSScreenStackHeaderConfig');
  expect(headers).not.toHaveLength(0);
  headers.forEach((header) => expect(header.props.hidden).toBe(true));
});

test.each([
  ['light', 'light navigation'],
  ['dark', 'dark navigation'],
  [null, 'light navigation'],
] as const)(
  'gives screens the matching navigation theme for the %s setting (covers: AC-3)',
  async (mode, expected) => {
    mockColorScheme.mockReturnValue(mode);

    await renderRouter({ _layout: RootLayout, index: ThemeProbe, showcase: ShowcaseRoute });

    expect(screen.getByText(expected)).toBeOnTheScreen();
  },
);

test('the home link opens the sample book under a themed header (covers: AC-8)', async () => {
  await renderRouter({ _layout: RootLayout, index: HomeScreen, showcase: ShowcaseRoute });

  await fireEvent.press(screen.getByRole('link', { name: 'Zobacz wzornik' }));

  expect(screen).toHavePathname('/showcase');
  expect(screen.getByRole('heading', { name: 'Kolory' })).toBeOnTheScreen();

  const header = screen.container
    .queryAll((node) => node.type === 'RNSScreenStackHeaderConfig')
    .find((node) => node.props.hidden !== true);
  expect(header?.props).toMatchObject({
    title: 'Wzornik',
    backTitle: 'Wstecz',
    backgroundColor: themes.light.colors.paper,
    color: themes.light.colors.accentText,
    titleColor: themes.light.colors.ink,
    titleFontFamily: 'PatrickHand-Regular',
  });
});
