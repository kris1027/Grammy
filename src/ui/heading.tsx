import type { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';

import type { TextTone } from './app-text';
import { sizes } from './theme';
import { createThemedStyles, useThemedStyles } from './themed-styles';

export type HeadingLevel = 1 | 2 | 3;

export type HeadingProps = {
  readonly level: HeadingLevel;
  readonly children: ReactNode;
  /** Default `ink`. Only keys checked for contrast are allowed. */
  readonly tone?: TextTone;
  /** What VoiceOver reads instead of the visible text, for example `1. Budowa`. */
  readonly accessibilityLabel?: string;
};

const themed = createThemedStyles(({ colors, typeScale }) =>
  StyleSheet.create({
    1: { ...typeScale.display, color: colors.ink },
    2: { ...typeScale.title, color: colors.ink },
    3: { ...typeScale.heading, color: colors.ink },
  }),
);

const tones = createThemedStyles(({ colors }) =>
  StyleSheet.create({
    ink: { color: colors.ink },
    inkMuted: { color: colors.inkMuted },
    accentText: { color: colors.accentText },
    onAccent: { color: colors.onAccent },
    error: { color: colors.error },
    success: { color: colors.success },
  }),
);

/** Patrick Hand heading. Grows with Dynamic Type up to 1.5 times. */
export function Heading({ level, children, tone, accessibilityLabel }: HeadingProps) {
  const styles = useThemedStyles(themed);
  const toneStyles = useThemedStyles(tones);

  return (
    <Text
      role="heading"
      accessibilityLabel={accessibilityLabel}
      maxFontSizeMultiplier={sizes.maxHeadingScale}
      style={[styles[level], tone !== undefined && toneStyles[tone]]}
    >
      {children}
    </Text>
  );
}
