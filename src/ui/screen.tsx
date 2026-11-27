import type { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { createThemedStyles, useThemedStyles } from './themed-styles';

const ALL_EDGES: readonly Edge[] = ['top', 'right', 'bottom', 'left'];

export type ScreenProps = {
  readonly children: ReactNode;
  /** Default true. */
  readonly scroll?: boolean;
  /** Default all four. Under a native header pass ['left', 'right', 'bottom']. */
  readonly edges?: readonly Edge[];
  /** Passed to the ScrollView. Ignored when `scroll` is false. */
  readonly onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /** Default 16. Ignored when `scroll` is false. */
  readonly scrollEventThrottle?: number;
};

const themed = createThemedStyles(({ colors, spacing }) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.paper },
    content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
    fill: { flex: 1 },
  }),
);

/** The page every screen sits on: paper background, side padding, safe areas. */
export function Screen({
  children,
  scroll = true,
  edges = ALL_EDGES,
  onScroll,
  scrollEventThrottle = 16,
}: ScreenProps) {
  const styles = useThemedStyles(themed);

  return (
    <SafeAreaView edges={edges} style={styles.root}>
      {scroll ? (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.content}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fill, styles.content]}>{children}</View>
      )}
    </SafeAreaView>
  );
}
