import { StyleSheet, Text, type TextProps } from 'react-native';

import type { TEXT_COLOR_KEYS } from './theme';
import { createThemedStyles, useThemedStyles } from './themed-styles';

export type TextVariant = 'body' | 'muted' | 'caption' | 'strong' | 'callout';
export type TextTone = (typeof TEXT_COLOR_KEYS)[number];

export type AppTextProps = TextProps & {
  readonly variant?: TextVariant;
  readonly italic?: boolean;
  /** Overrides the variant's colour. Only keys checked for contrast are allowed. */
  readonly tone?: TextTone;
};

const themed = createThemedStyles(({ colors, typeScale }) =>
  StyleSheet.create({
    body: { ...typeScale.body, color: colors.ink },
    muted: { ...typeScale.body, color: colors.inkMuted },
    caption: { ...typeScale.caption, color: colors.inkMuted },
    strong: { ...typeScale.strong, color: colors.ink },
    callout: { ...typeScale.callout, color: colors.ink },
    italic: { fontStyle: 'italic' },
    ink: { color: colors.ink },
    inkMuted: { color: colors.inkMuted },
    accentText: { color: colors.accentText },
    onAccent: { color: colors.onAccent },
    error: { color: colors.error },
    success: { color: colors.success },
  }),
);

/** Reading text in the system font. Scales fully with Dynamic Type. */
export function AppText({ variant = 'body', italic = false, tone, style, ...rest }: AppTextProps) {
  const styles = useThemedStyles(themed);

  return (
    <Text
      {...rest}
      style={[styles[variant], italic && styles.italic, tone !== undefined && styles[tone], style]}
    />
  );
}
