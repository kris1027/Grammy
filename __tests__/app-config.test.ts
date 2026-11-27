import { expo } from '../app.json';

// These settings only take effect in a real build. The tests stop them from
// changing by accident; `/check verify` still has to check them on the iPhone.

test('keeps the app in portrait (covers: AC-3)', () => {
  expect(expo.orientation).toBe('portrait');
});

test('lets the app follow the iPhone light or dark setting (covers: AC-3)', () => {
  expect(expo.userInterfaceStyle).toBe('automatic');
});

test('builds for iPhone only', () => {
  expect(expo.platforms).toEqual(['ios']);
  expect(expo.ios.supportsTablet).toBe(false);
});

// Spec 0001: a different identifier installs a second app, without your saved progress.
test('keeps the same bundle identifier', () => {
  expect(expo.ios.bundleIdentifier).toBe('com.personal.grammygrammar');
});
