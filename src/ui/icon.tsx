import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useWindowDimensions } from 'react-native';

import { sizes, type ColorKey } from './theme';
import { useTheme } from './use-theme';

export type SymbolName = SymbolViewProps['name'];

export type IconProps = {
  readonly name: SymbolName;
  /** Points before Dynamic Type. Default `sizes.icon`. */
  readonly size?: number;
  /** Default `ink`. */
  readonly color?: ColorKey;
  /** Polish label. Without it the icon is decorative and hidden from screen readers. */
  readonly label?: string;
};

/** An SF Symbol, built into iOS. Grows with Dynamic Type up to 2 times. */
export function Icon({ name, size = sizes.icon, color = 'ink', label }: IconProps) {
  const { colors } = useTheme();
  const { fontScale } = useWindowDimensions();
  const scaled = size * Math.min(fontScale, sizes.maxGraphicScale);

  const a11y =
    label === undefined
      ? ({
          accessibilityElementsHidden: true,
          importantForAccessibility: 'no-hide-descendants',
        } as const)
      : ({ accessible: true, accessibilityLabel: label, accessibilityRole: 'image' } as const);

  return (
    <SymbolView
      name={name}
      size={scaled}
      tintColor={colors[color]}
      style={{ width: scaled, height: scaled }}
      {...a11y}
    />
  );
}
