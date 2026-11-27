import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon, type SymbolName } from './icon';
import { createThemedStyles, useThemedStyles } from './themed-styles';

export type SpeechBubbleProps = {
  /** Optional leading SF Symbol, drawn in accentText. */
  readonly icon?: SymbolName;
  /** When given, the whole bubble is one screen reader element with this label. */
  readonly accessibilityText?: string;
  readonly children: ReactNode;
};

const themed = createThemedStyles(({ colors, border, radius, spacing, shadowOffset, sizes }) =>
  StyleSheet.create({
    // No clipping here, so the tail below the body is never cut.
    outer: { paddingBottom: sizes.tail },
    body: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderColor: colors.outline,
      borderWidth: border.width,
      borderRadius: radius.md,
      padding: spacing.lg,
      paddingLeft: spacing.lg + sizes.stripe,
      boxShadow: [
        { offsetX: shadowOffset, offsetY: shadowOffset, blurRadius: 0, color: colors.shadow },
      ],
    },
    // Rounded to match the body's inner corner, so the body needs no overflow clipping
    // (clipping would also cut its offset shadow).
    stripe: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: sizes.stripe,
      backgroundColor: colors.accent,
      borderTopLeftRadius: radius.md - border.width,
      borderBottomLeftRadius: radius.md - border.width,
    },
    content: { flex: 1, gap: spacing.sm },
    tail: {
      position: 'absolute',
      left: sizes.tailInset,
      bottom: sizes.tail / 2,
      width: sizes.tail,
      height: sizes.tail,
      backgroundColor: colors.surface,
      borderColor: colors.outline,
      borderRightWidth: border.width,
      borderBottomWidth: border.width,
      transform: [{ rotate: '45deg' }],
    },
  }),
);

/** An outlined speech bubble with a small tail and an orange edge stripe. */
export function SpeechBubble({ icon, accessibilityText, children }: SpeechBubbleProps) {
  const styles = useThemedStyles(themed);
  const a11y =
    accessibilityText === undefined
      ? {}
      : ({ accessible: true, accessibilityLabel: accessibilityText } as const);

  return (
    <View style={styles.outer} {...a11y}>
      <View style={styles.body}>
        <View style={styles.stripe} />
        {icon !== undefined && <Icon name={icon} color="accentText" />}
        <View style={styles.content}>{children}</View>
      </View>
      <View style={styles.tail} />
    </View>
  );
}
