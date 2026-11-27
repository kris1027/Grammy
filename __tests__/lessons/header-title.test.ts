import { isHeaderTitleVisible } from '@/features/lessons/screens/header-title';

test('stays hidden before the heading is measured (covers: AC-3)', () => {
  expect(isHeaderTitleVisible(0, undefined)).toBe(false);
  expect(isHeaderTitleVisible(5000, undefined)).toBe(false);
});

test('stays hidden while the heading bottom is still below the header (covers: AC-3)', () => {
  expect(isHeaderTitleVisible(0, 120)).toBe(false);
  expect(isHeaderTitleVisible(119.5, 120)).toBe(false);
});

test('shows at and past the heading bottom (covers: AC-3)', () => {
  expect(isHeaderTitleVisible(120, 120)).toBe(true);
  expect(isHeaderTitleVisible(900, 120)).toBe(true);
});
