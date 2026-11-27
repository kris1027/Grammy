import { useColorScheme } from 'react-native';

import { themes, type ColorScheme, type Theme } from './theme';

/** 'dark' only when the iPhone says so; anything else (null, 'unspecified') is light. */
export const schemeOf = (colorScheme: string | null | undefined): ColorScheme =>
  colorScheme === 'dark' ? 'dark' : 'light';

export const useColorSchemeName = (): ColorScheme => schemeOf(useColorScheme());

export const useTheme = (): Theme => themes[useColorSchemeName()];
