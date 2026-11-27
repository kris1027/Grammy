import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from './app-text';
import { createThemedStyles, useThemedStyles } from './themed-styles';

export type ChipProps = {
  /** A string is shown in `callout`; pass your own text element for markup. */
  readonly children: ReactNode;
};

const themed = createThemedStyles(({ colors, border, radius, spacing }) =>
  StyleSheet.create({
    chip: {
      flexShrink: 1,
      backgroundColor: colors.surface,
      borderColor: colors.outline,
      borderWidth: border.width,
      borderRadius: radius.pill,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
  }),
);

/** An outlined pill. */
export function Chip({ children }: ChipProps) {
  const styles = useThemedStyles(themed);

  return (
    <View style={styles.chip}>
      {typeof children === 'string' ? <AppText variant="callout">{children}</AppText> : children}
    </View>
  );
}
