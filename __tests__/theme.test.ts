import { renderHook } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';

import { contrastRatio } from '@/ui/contrast';
import { CONTRAST_PAIRS, TEXT_COLOR_KEYS, themes, type ContrastPair } from '@/ui/theme';
import { schemeOf, useTheme } from '@/ui/use-theme';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockColorScheme = jest.mocked(useColorScheme);

const SCHEMES = ['light', 'dark'] as const;
const minimum = (kind: ContrastPair['kind']) => (kind === 'text' ? 4.5 : 3);

describe('tokens (covers: AC-1)', () => {
  test('light and dark have exactly the same colour keys', () => {
    expect(Object.keys(themes.dark.colors).sort()).toEqual(Object.keys(themes.light.colors).sort());
  });

  test('every colour is a #RRGGBB value', () => {
    SCHEMES.forEach((scheme) =>
      Object.values(themes[scheme].colors).forEach((value) =>
        expect(value).toMatch(/^#[0-9A-F]{6}$/),
      ),
    );
  });

  test('both schemes share one set of spacing, sizes and type scale', () => {
    expect(themes.dark.spacing).toBe(themes.light.spacing);
    expect(themes.dark.sizes).toBe(themes.light.sizes);
    expect(themes.dark.typeScale).toBe(themes.light.typeScale);
  });

  test('pins the paper and ink colours from the spec', () => {
    expect(themes.light.colors.paper).toBe('#FBF6EC');
    expect(themes.dark.colors.paper).toBe('#1F1C1A');
    expect(themes.light.colors.ink).toBe('#2B2622');
    expect(themes.dark.colors.ink).toBe('#F3EDE4');
  });
});

describe('useTheme (covers: AC-1)', () => {
  test.each([
    ['dark', 'dark'],
    ['light', 'light'],
    [null, 'light'],
    ['unspecified', 'light'],
  ] as const)('the %s setting gives the %s theme', async (setting, expected) => {
    mockColorScheme.mockReturnValue(setting as ReturnType<typeof useColorScheme>);

    const { result } = await renderHook(() => useTheme());

    expect(result.current).toBe(themes[expected]);
  });

  test('schemeOf treats anything but dark as light', () => {
    expect(schemeOf(undefined)).toBe('light');
    expect(schemeOf('dark')).toBe('dark');
  });
});

describe('contrast (covers: AC-2)', () => {
  test.each(SCHEMES.flatMap((scheme) => CONTRAST_PAIRS.map((pair) => [scheme, pair] as const)))(
    '%s: %o meets WCAG AA',
    (scheme, { fg, bg, kind }) => {
      const { colors } = themes[scheme];
      expect(contrastRatio(colors[fg], colors[bg])).toBeGreaterThanOrEqual(minimum(kind));
    },
  );

  test('every text colour key has at least one text pair', () => {
    TEXT_COLOR_KEYS.forEach((key) =>
      expect(CONTRAST_PAIRS.some((pair) => pair.fg === key && pair.kind === 'text')).toBe(true),
    );
  });

  test('a known bad pair fails (orange on paper is not text)', () => {
    const { colors } = themes.light;
    expect(contrastRatio(colors.accent, colors.paper)).toBeLessThan(4.5);
  });

  test('matches the known WCAG values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#777777', '#777777')).toBeCloseTo(1, 5);
    expect(() => contrastRatio('red', '#FFFFFF')).toThrow();
  });
});
