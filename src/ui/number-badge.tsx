import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { sizes } from './theme';
import { createThemedStyles, useThemedStyles } from './themed-styles';

export type NumberBadgeProps = {
  readonly value: number;
};

const themed = createThemedStyles(({ colors, border, typeScale }) =>
  StyleSheet.create({
    circle: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accent,
      borderColor: colors.outline,
      borderWidth: border.width,
    },
    number: { ...typeScale.heading, color: colors.onAccent, textAlign: 'center' },
  }),
);

/** An orange circle with a dark hand written number. */
export function NumberBadge({ value }: NumberBadgeProps) {
  const styles = useThemedStyles(themed);
  const { fontScale } = useWindowDimensions();
  const diameter = sizes.badge * Math.min(fontScale, sizes.maxGraphicScale);

  return (
    <View
      testID="number-badge"
      style={[styles.circle, { width: diameter, height: diameter, borderRadius: diameter / 2 }]}
    >
      <Text maxFontSizeMultiplier={sizes.maxGraphicScale} style={styles.number}>
        {value}
      </Text>
    </View>
  );
}
