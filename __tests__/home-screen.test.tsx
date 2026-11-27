import { render, screen } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';

import HomeScreen from '@/app/index';
import { sizes, themes } from '@/ui/theme';

// The iPhone's appearance setting is the only thing faked here.
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockColorScheme = jest.mocked(useColorScheme);

const title = () => screen.getByRole('heading', { name: 'Gramatyka angielska' });

function expectColors(mode: keyof typeof themes) {
  expect(screen.root).toHaveStyle({ backgroundColor: themes[mode].colors.paper });
  expect(title()).toHaveStyle({ color: themes[mode].colors.ink });
}

beforeEach(() => {
  mockColorScheme.mockReturnValue('light');
});

test('shows the Polish title', async () => {
  await render(<HomeScreen />);

  expect(title()).toBeOnTheScreen();
});

test('shows the Present Simple card above the sample book link (spec 0004, covers: AC-1)', async () => {
  await render(<HomeScreen />);

  const card = screen.getByRole('link', { name: 'Otwórz lekcję: Present Simple' });
  expect(card).toBeOnTheScreen();
  expect(screen.getByText('czas teraźniejszy prosty')).toBeOnTheScreen();
  expect(screen.getByText('Present Simple')).toBeOnTheScreen();

  const links = screen.getAllByRole('link').map((node) => node.props.accessibilityLabel ?? null);
  expect(links).toEqual(['Otwórz lekcję: Present Simple', null]);
});

test('the sample book link is tall enough to press (spec 0004, covers: AC-10)', async () => {
  await render(<HomeScreen />);

  expect(screen.getByRole('link', { name: 'Zobacz wzornik' })).toHaveStyle({
    minHeight: sizes.minTouch,
  });
});

test('links to the sample book (covers: AC-8)', async () => {
  await render(<HomeScreen />);

  const link = screen.getByRole('link', { name: 'Zobacz wzornik' });
  expect(link).toHaveStyle({
    color: themes.light.colors.accentText,
    textDecorationLine: 'underline',
  });
});

test.each(['light', 'dark'] as const)(
  'uses the %s colours when the iPhone is in that mode (covers: AC-1)',
  async (mode) => {
    mockColorScheme.mockReturnValue(mode);

    await render(<HomeScreen />);

    expectColors(mode);
  },
);

test('falls back to light colours when the iPhone reports no preference', async () => {
  mockColorScheme.mockReturnValue(null);

  await render(<HomeScreen />);

  expectColors('light');
});

test('changes colours when the appearance changes while the screen is open', async () => {
  await render(<HomeScreen />);
  expectColors('light');

  mockColorScheme.mockReturnValue('dark');
  await screen.rerender(<HomeScreen />);
  expectColors('dark');

  mockColorScheme.mockReturnValue('light');
  await screen.rerender(<HomeScreen />);
  expectColors('light');
});
