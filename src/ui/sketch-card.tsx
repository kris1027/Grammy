import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { createThemedStyles, useThemedStyles } from './themed-styles';

export type SketchCardProps = {
  /** `accent` fills with the soft marker colour; it only holds ink, muted or accentText text. */
  readonly variant?: 'plain' | 'accent';
  /** Default false. Grows the card to fill its parent, so cards in a row match heights. */
  readonly fill?: boolean;
  readonly children: ReactNode;
};

const themed = createThemedStyles(({ colors, border, radius, spacing, shadowOffset }) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.outline,
      borderWidth: border.width,
      borderRadius: radius.md,
      padding: spacing.lg,
      gap: spacing.md,
      boxShadow: [
        { offsetX: shadowOffset, offsetY: shadowOffset, blurRadius: 0, color: colors.shadow },
      ],
    },
    accent: { backgroundColor: colors.accentSoft },
    fill: { flexGrow: 1 },
  }),
);

/** A drawn card: dark outline, rounded corners, solid offset shadow. */
export function SketchCard({ variant = 'plain', fill = false, children }: SketchCardProps) {
  const styles = useThemedStyles(themed);

  return (
    <View style={[styles.card, variant === 'accent' && styles.accent, fill && styles.fill]}>
      {children}
    </View>
  );
}
