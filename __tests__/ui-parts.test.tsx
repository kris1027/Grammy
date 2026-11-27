import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Text, useColorScheme, useWindowDimensions } from 'react-native';

import { AppText } from '@/ui/app-text';
import { Chip } from '@/ui/chip';
import { fonts } from '@/ui/fonts';
import { Heading } from '@/ui/heading';
import { Icon } from '@/ui/icon';
import { NumberBadge } from '@/ui/number-badge';
import { Screen } from '@/ui/screen';
import { SketchCard } from '@/ui/sketch-card';
import { SCROLL_HINT, SketchTable, tableNeedsScroll } from '@/ui/sketch-table';
import { SpeechBubble } from '@/ui/speech-bubble';
import { themes } from '@/ui/theme';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockColorScheme = jest.mocked(useColorScheme);
const mockDimensions = jest.mocked(useWindowDimensions);

const setFontScale = (fontScale: number) =>
  mockDimensions.mockReturnValue({ width: 390, height: 844, scale: 3, fontScale });

beforeEach(() => {
  mockColorScheme.mockReturnValue('light');
  setFontScale(1);
});

describe.each(['light', 'dark'] as const)('%s mode (covers: AC-5)', (mode) => {
  const { colors } = themes[mode];
  beforeEach(() => mockColorScheme.mockReturnValue(mode));

  test('Screen paints the paper background', async () => {
    await render(
      <Screen>
        <Text>treść</Text>
      </Screen>,
    );
    expect(screen.root).toHaveStyle({ backgroundColor: colors.paper });
  });

  test('Heading is a Patrick Hand heading in ink that stops growing at 1.5x (covers: AC-4)', async () => {
    await render(<Heading level={2}>Budowa</Heading>);
    const heading = screen.getByRole('heading', { name: 'Budowa' });
    expect(heading).toHaveStyle({ fontFamily: fonts.hand, fontSize: 28, color: colors.ink });
    expect(heading.props.maxFontSizeMultiplier).toBe(1.5);
  });

  test('AppText variants use the system font and their colours', async () => {
    await render(
      <>
        <AppText>zwykły</AppText>
        <AppText variant="muted">wyciszony</AppText>
        <AppText variant="strong">mocny</AppText>
        <AppText variant="caption" tone="error">
          błąd
        </AppText>
      </>,
    );
    expect(screen.getByText('zwykły')).toHaveStyle({ fontSize: 17, color: colors.ink });
    expect(screen.getByText('zwykły').props.maxFontSizeMultiplier).toBeUndefined();
    expect(screen.getByText('zwykły')).not.toHaveStyle({ fontFamily: fonts.hand });
    expect(screen.getByText('wyciszony')).toHaveStyle({ color: colors.inkMuted });
    expect(screen.getByText('mocny')).toHaveStyle({ fontWeight: '600' });
    expect(screen.getByText('błąd')).toHaveStyle({ fontSize: 13, color: colors.error });
  });

  test('SketchCard has an outline and a solid offset shadow; accent fills soft orange', async () => {
    await render(
      <>
        <SketchCard>
          <Text>zwykła</Text>
        </SketchCard>
        <SketchCard variant="accent">
          <Text>wyróżniona</Text>
        </SketchCard>
      </>,
    );
    const plain = screen.getByText('zwykła').parent;
    const accent = screen.getByText('wyróżniona').parent;
    expect(plain).toHaveStyle({
      backgroundColor: colors.surface,
      borderColor: colors.outline,
      borderWidth: 2,
    });
    expect(accent).toHaveStyle({ backgroundColor: colors.accentSoft });
  });

  test('NumberBadge is an orange circle with a dark hand written number', async () => {
    await render(<NumberBadge value={3} />);
    expect(screen.getByTestId('number-badge')).toHaveStyle({
      backgroundColor: colors.accent,
      borderColor: colors.outline,
      width: 32,
    });
    expect(screen.getByText('3')).toHaveStyle({ fontFamily: fonts.hand, color: colors.onAccent });
  });

  test('Chip is an outlined pill', async () => {
    await render(<Chip>podmiot</Chip>);
    expect(screen.getByText('podmiot')).toHaveStyle({ fontSize: 16 });
    expect(screen.getByText('podmiot').parent).toHaveStyle({
      borderColor: colors.outline,
      borderRadius: 999,
    });
  });

  test('Icon takes its tint from the theme', async () => {
    await render(<Icon name="lightbulb.fill" color="accentText" />);
    expect(screen.getByTestId('icon', { includeHiddenElements: true })).toHaveProp(
      'tintColor',
      colors.accentText,
    );
  });
});

describe('Icon accessibility (covers: AC-5)', () => {
  test('is hidden from screen readers without a label', async () => {
    await render(<Icon name="star.fill" />);
    expect(screen.queryByTestId('icon')).toBeNull();
    expect(screen.getByTestId('icon', { includeHiddenElements: true })).toHaveProp(
      'name',
      'star.fill',
    );
  });

  test('is an image with a Polish label when given one', async () => {
    await render(<Icon name="star.fill" label="Gwiazdka" />);
    expect(screen.getByRole('image', { name: 'Gwiazdka' })).toBeOnTheScreen();
  });

  test('grows with text size up to 2x', async () => {
    setFontScale(3);
    await render(<Icon name="star.fill" size={20} />);
    expect(screen.getByTestId('icon', { includeHiddenElements: true })).toHaveProp('size', 40);
  });
});

describe('SpeechBubble (covers: AC-5)', () => {
  test('shows its leading icon and content', async () => {
    await render(
      <SpeechBubble icon="lightbulb.fill">
        <Text>rada</Text>
      </SpeechBubble>,
    );
    expect(screen.getByText('rada')).toBeOnTheScreen();
    expect(screen.getByTestId('icon', { includeHiddenElements: true })).toHaveProp(
      'name',
      'lightbulb.fill',
    );
  });

  test('becomes one screen reader element when given accessibility text', async () => {
    await render(
      <SpeechBubble accessibilityText="Wskazówka: rada">
        <Text>rada</Text>
      </SpeechBubble>,
    );
    expect(screen.getByLabelText('Wskazówka: rada')).toBeOnTheScreen();
  });
});

describe('SketchTable (covers: AC-4, AC-5)', () => {
  const header = ['Osoba', 'Twierdzenie', 'Przeczenie', 'Pytanie'];
  const rows = [['I', 'I work', "I don't work", 'Do I work?']];

  const layout = (width: number) =>
    act(() =>
      fireEvent(screen.getByText('Czasownik'), 'layout', {
        nativeEvent: { layout: { width, height: 200, x: 0, y: 0 } },
      }),
    );

  test('fits its columns at the default text size', async () => {
    await render(<SketchTable caption={<Text>Czasownik</Text>} header={header} rows={rows} />);
    await layout(390);
    expect(screen.queryByText(SCROLL_HINT)).toBeNull();
    expect(screen.queryByTestId('table-scroll')).toBeNull();
  });

  test('scrolls sideways with a hint at a huge text size on a narrow screen', async () => {
    setFontScale(3);
    await render(<SketchTable caption={<Text>Czasownik</Text>} header={header} rows={rows} />);
    expect(screen.queryByText(SCROLL_HINT)).toBeNull();

    await layout(320);

    expect(screen.getByText(SCROLL_HINT)).toBeOnTheScreen();
    expect(screen.getByTestId('table-scroll')).toBeOnTheScreen();
  });

  test('pads a short row with empty cells', async () => {
    await render(<SketchTable header={['a', 'b', 'c']} rows={[['x']]} />);
    expect(screen.getByText('x')).toBeOnTheScreen();
  });

  test('the width rule counts columns times the scaled minimum', () => {
    expect(tableNeedsScroll(4, 320, 1)).toBe(false);
    expect(tableNeedsScroll(4, 320, 3)).toBe(true);
  });
});
