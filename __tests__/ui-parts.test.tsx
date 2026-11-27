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
import {
  columnMinWidths,
  longestWordWidth,
  SCROLL_HINT,
  SketchTable,
  tableNeedsScroll,
} from '@/ui/sketch-table';
import { SpeechBubble } from '@/ui/speech-bubble';
import { TextLink } from '@/ui/text-link';
import { border, radius, sizes, spacing, themes, typeScale } from '@/ui/theme';

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
      borderRadius: radius.lg,
    });
  });

  test('Chip corners stay small enough for wrapped text (regression, AC-4)', async () => {
    // A 999 radius turns a chip that wraps at large text sizes into an oval, and its
    // text then crosses the outline. radius.lg still reads as a pill on one line
    // (a one line chip is 34 points tall) and keeps wrapped text inside the edge.
    await render(<Chip>czasownik (+ -s / -es dla he, she, it)</Chip>);
    const chip = screen.getByText('czasownik (+ -s / -es dla he, she, it)').parent;
    expect(chip).toHaveStyle({ borderRadius: radius.lg });
    const oneLineHeight = typeScale.callout.lineHeight + 2 * spacing.xs + 2 * border.width;
    expect(radius.lg).toBeGreaterThanOrEqual(oneLineHeight / 2);
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
  const rows = [
    ['I / you / we / they', 'I work', "I don't work", 'Do I work?'],
    ['he / she / it', 'She works', "She doesn't work", 'Does she work?'],
  ];

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

  test('estimates a word no narrower than SF Pro semibold draws it (16 pt)', () => {
    // Widths measured with the system font, semibold, 16 pt.
    const measured = { Twierdzenie: 90.5, Przeczenie: 82.2, Pytanie: 56.3, Osoba: 48.4 };
    Object.entries(measured).forEach(([word, width]) =>
      expect(longestWordWidth(word, 16)).toBeGreaterThanOrEqual(width - 0.5),
    );
    expect(longestWordWidth("I don't work", 16)).toBe(longestWordWidth("don't", 16));
    expect(longestWordWidth('', 16)).toBe(0);
  });

  test('every column is at least its longest word plus padding, never below the floor', () => {
    const widths = columnMinWidths([header, ...rows], 4, 1);
    expect(widths).toHaveLength(4);
    widths.forEach((width) => expect(width).toBeGreaterThanOrEqual(sizes.minColumn));
    expect(widths[1]).toBeGreaterThanOrEqual(longestWordWidth('Twierdzenie', 16) + 2 * spacing.sm);
    expect(columnMinWidths([['a']], 1, 2)).toEqual([sizes.minColumn * 2]);
  });

  test('the Present Simple table fits an iPhone at normal size and scrolls one step up', () => {
    // Regression: at 80 points per column "Twierdzenie" broke mid word on a 402 point iPhone.
    const iPhoneContent = 402 - 2 * spacing.lg;
    expect(tableNeedsScroll(columnMinWidths([header, ...rows], 4, 1), iPhoneContent)).toBe(false);
    expect(tableNeedsScroll(columnMinWidths([header, ...rows], 4, 1.24), iPhoneContent)).toBe(true);
  });

  test('six short columns still scroll at normal size (the floor)', () => {
    const six = [['I', 'you', 'he', 'she', 'we', 'they']];
    expect(tableNeedsScroll(columnMinWidths(six, 6, 1), 402 - 2 * spacing.lg)).toBe(true);
  });
});

describe('TextLink (spec 0004, covers: AC-6, AC-10)', () => {
  test('puts the link role on a view, so iOS reads it as a link, not static text', async () => {
    await render(<TextLink>Wróć do strony głównej</TextLink>);
    const link = screen.getByRole('link', { name: 'Wróć do strony głównej' });
    expect(link.type).toBe('View');
    expect(link).toHaveStyle({ minHeight: sizes.minTouch });
  });

  test('shows underlined accent text and calls onPress', async () => {
    const onPress = jest.fn();
    await render(<TextLink onPress={onPress}>Zobacz wzornik</TextLink>);
    expect(screen.getByText('Zobacz wzornik')).toHaveStyle({
      color: themes.light.colors.accentText,
      textDecorationLine: 'underline',
    });
    await fireEvent.press(screen.getByRole('link', { name: 'Zobacz wzornik' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
