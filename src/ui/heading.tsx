import type { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';

import { sizes } from './theme';
import { createThemedStyles, useThemedStyles } from './themed-styles';

export type HeadingLevel = 1 | 2 | 3;

export type HeadingProps = {
  readonly level: HeadingLevel;
  readonly children: ReactNode;
};

const themed = createThemedStyles(({ colors, typeScale }) =>
  StyleSheet.create({
    1: { ...typeScale.display, color: colors.ink },
    2: { ...typeScale.title, color: colors.ink },
    3: { ...typeScale.heading, color: colors.ink },
  }),
);

/** Patrick Hand heading. Grows with Dynamic Type up to 1.5 times. */
export function Heading({ level, children }: HeadingProps) {
  const styles = useThemedStyles(themed);

  return (
    <Text role="heading" maxFontSizeMultiplier={sizes.maxHeadingScale} style={styles[level]}>
      {children}
    </Text>
  );
}
