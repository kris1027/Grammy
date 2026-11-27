import { themes } from '@/ui/theme';

// The exact colours are temporary until feature 4, so they are not pinned here.

test('gives light and dark mode different backgrounds and text colours (covers: AC-3)', () => {
  expect(themes.dark.background).not.toBe(themes.light.background);
  expect(themes.dark.text).not.toBe(themes.light.text);
});

test.each(['light', 'dark'] as const)(
  'never paints %s mode text in the background colour',
  (mode) => {
    expect(themes[mode].text).not.toBe(themes[mode].background);
  },
);
