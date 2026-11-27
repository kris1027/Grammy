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

const pluginOptions = (name: string): Record<string, unknown> | undefined => {
  const entry = expo.plugins.find((plugin) => Array.isArray(plugin) && plugin[0] === name);
  return Array.isArray(entry) ? (entry[1] as Record<string, unknown>) : undefined;
};

test('embeds Patrick Hand at build time (covers spec 0003: AC-3, AC-11)', () => {
  expect(pluginOptions('expo-font')).toEqual({
    fonts: ['./assets/fonts/PatrickHand-Regular.ttf'],
  });
});

test('paints the splash in paper (light) and chalkboard (dark) (covers spec 0003: AC-9)', () => {
  expect(pluginOptions('expo-splash-screen')).toMatchObject({
    backgroundColor: '#FBF6EC',
    image: './assets/images/splash-icon.png',
    dark: { backgroundColor: '#1F1C1A', image: './assets/images/splash-icon-dark.png' },
  });
});

test('keeps the app icon in the .icon file', () => {
  expect(expo.ios.icon).toBe('./assets/expo.icon');
});
