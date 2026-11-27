import { useState, type ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native';

import { AppText } from './app-text';
import { sizes } from './theme';
import { createThemedStyles, useThemedStyles } from './themed-styles';

export const SCROLL_HINT = 'Przesuń w bok, aby zobaczyć więcej →';

export type SketchTableProps = {
  readonly caption?: ReactNode;
  readonly header?: readonly ReactNode[];
  readonly rows: readonly (readonly ReactNode[])[];
};

/** True when the columns cannot all get their minimum width in `width` points. */
export const tableNeedsScroll = (columns: number, width: number, fontScale: number): boolean =>
  columns * sizes.minColumn * fontScale > width;

const themed = createThemedStyles(({ colors, border, radius, spacing }) =>
  StyleSheet.create({
    wrapper: { gap: spacing.sm },
    frame: {
      borderColor: colors.outline,
      borderWidth: border.width,
      borderRadius: radius.sm,
      backgroundColor: colors.surface,
      overflow: 'hidden',
    },
    row: { flexDirection: 'row' },
    rowDivider: { borderTopWidth: border.thin, borderTopColor: colors.outline },
    headerRow: { backgroundColor: colors.accentSoft },
    cell: { padding: spacing.sm },
    fitCell: { flex: 1, flexBasis: 0 },
    cellDivider: { borderLeftWidth: border.thin, borderLeftColor: colors.outline },
  }),
);

const asCell = (content: ReactNode): ReactNode =>
  typeof content === 'string' ? <AppText variant="callout">{content}</AppText> : content;

/** A drawn table. Too many columns for the width (or a big text size) makes it scroll sideways. */
export function SketchTable({ caption, header, rows }: SketchTableProps) {
  const styles = useThemedStyles(themed);
  const { fontScale } = useWindowDimensions();
  const [width, setWidth] = useState<number | undefined>(undefined);

  const columns = Math.max(header?.length ?? 0, ...rows.map((row) => row.length));
  const scroll = width !== undefined && tableNeedsScroll(columns, width, fontScale);
  const columnWidth = sizes.minColumn * fontScale;

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  const renderRow = (cells: readonly ReactNode[], index: number, isHeader: boolean) => (
    <View
      key={isHeader ? 'header' : `row-${index}`}
      style={[
        styles.row,
        isHeader && styles.headerRow,
        (index > 0 || (!isHeader && header !== undefined)) && styles.rowDivider,
      ]}
    >
      {Array.from({ length: columns }, (_, column) => (
        <View
          key={column}
          style={[
            styles.cell,
            scroll ? { width: columnWidth } : styles.fitCell,
            column > 0 && styles.cellDivider,
          ]}
        >
          {asCell(cells[column])}
        </View>
      ))}
    </View>
  );

  const body = (
    <View>
      {header !== undefined && renderRow(header, 0, true)}
      {rows.map((row, index) => renderRow(row, index, false))}
    </View>
  );

  return (
    <View style={styles.wrapper} onLayout={onLayout}>
      {typeof caption === 'string' ? <AppText variant="caption">{caption}</AppText> : caption}
      <View style={styles.frame}>
        {scroll ? (
          <ScrollView horizontal testID="table-scroll">
            {body}
          </ScrollView>
        ) : (
          body
        )}
      </View>
      {scroll && <AppText variant="caption">{SCROLL_HINT}</AppText>}
    </View>
  );
}
