import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { sizes } from '@/ui/theme';
import { createThemedStyles, useThemedStyles } from '@/ui/themed-styles';

const themed = createThemedStyles(({ colors, border, typeScale }) =>
  StyleSheet.create({
    // As tall as one body line, so the dot sits beside the first line of text.
    line: { height: typeScale.body.lineHeight, justifyContent: 'center' },
    dot: {
      backgroundColor: colors.accent,
      borderColor: colors.outline,
      borderWidth: border.thin,
    },
  }),
);

/** The orange bullet used by lists and examples. Decorative. */
export function BulletDot() {
  const styles = useThemedStyles(themed);
  const { fontScale } = useWindowDimensions();
  const scale = Math.min(fontScale, sizes.maxGraphicScale);
  const diameter = sizes.dot * scale;

  return (
    <View
      style={[styles.line, { height: styles.line.height * fontScale }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View
        style={[styles.dot, { width: diameter, height: diameter, borderRadius: diameter / 2 }]}
      />
    </View>
  );
}
