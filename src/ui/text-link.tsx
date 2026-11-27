import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { AppText } from './app-text';
import { createThemedStyles, useThemedStyles } from './themed-styles';

export type TextLinkProps = Omit<PressableProps, 'children' | 'style' | 'role'> & {
  readonly children: string;
};

const themed = createThemedStyles(({ sizes }) =>
  StyleSheet.create({
    link: { alignSelf: 'flex-start', minHeight: sizes.minTouch, justifyContent: 'center' },
    pressed: { opacity: 0.6 },
    text: { textDecorationLine: 'underline' },
  }),
);

/**
 * A standalone underlined text link, at least `minTouch` tall. The link role sits on a
 * `Pressable`, because iOS reads a lone `Text` with `role="link"` as static text.
 * Wrap it in expo-router's `<Link asChild>` to navigate.
 */
export function TextLink({ children, ...rest }: TextLinkProps) {
  const styles = useThemedStyles(themed);

  return (
    <Pressable
      {...rest}
      role="link"
      style={({ pressed }) => [styles.link, pressed && styles.pressed]}
    >
      <AppText tone="accentText" style={styles.text}>
        {children}
      </AppText>
    </Pressable>
  );
}
