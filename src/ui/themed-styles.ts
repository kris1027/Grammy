import { themes, type ColorScheme, type Theme } from './theme';
import { useColorSchemeName } from './use-theme';

export type ThemedStyles<S> = Readonly<Record<ColorScheme, S>>;

/** Runs the style builder once per scheme, at module load. Wrap the result in StyleSheet.create. */
export const createThemedStyles = <S>(builder: (theme: Theme) => S): ThemedStyles<S> => ({
  light: builder(themes.light),
  dark: builder(themes.dark),
});

export const useThemedStyles = <S>(themed: ThemedStyles<S>): S => themed[useColorSchemeName()];
