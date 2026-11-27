import { useState, type ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native';

import { AppText } from './app-text';
import { border, sizes, spacing, typeScale } from './theme';
import { createThemedStyles, useThemedStyles } from './themed-styles';

export const SCROLL_HINT = 'Przesuń w bok, aby zobaczyć więcej →';

export type SketchTableProps = {
  readonly caption?: ReactNode;
  readonly header?: readonly ReactNode[];
  readonly rows: readonly (readonly ReactNode[])[];
  /**
   * The plain words of the header and rows, used only to size the columns. Needed when the
   * cells are not plain strings (string cells are read directly).
   */
  readonly plain?: {
    readonly header?: readonly string[];
    readonly rows: readonly (readonly string[])[];
  };
};

// Letter width in ems of the system font, by shape. Calibrated against SF Pro semibold at
// 16 to 17 pt and rounded up, so a word is never estimated narrower than it draws.
const NARROW = /[iìíjlłtfrI.,:;'!|]/;
const WIDE = /[mw]/;
const WIDEST = /[MW]/;
const ROUND_CAPITAL = /[OÓQCĆDG]/;
const CAPITAL_OR_DIGIT = /[A-ZĄĆĘŁŃÓŚŹŻ0-9]/;

const letterEm = (letter: string): number => {
  if (NARROW.test(letter)) return 0.3;
  if (WIDEST.test(letter)) return 0.98;
  if (WIDE.test(letter)) return 0.86;
  if (ROUND_CAPITAL.test(letter)) return 0.78;
  if (CAPITAL_OR_DIGIT.test(letter)) return 0.7;
  return 0.56;
};

/** Estimated width in points of the widest single word in `text` at `fontSize`. */
export const longestWordWidth = (text: string, fontSize: number): number =>
  Math.max(
    0,
    ...text
      .split(/\s+/)
      .map((word) => [...word].reduce((sum, letter) => sum + letterEm(letter), 0) * fontSize),
  );

/**
 * The smallest width each column can take without breaking a word: its longest word in
 * table text (`typeScale.callout`) at this text size, plus cell padding and the divider.
 * Never below `sizes.minColumn` (also scaled).
 */
export const columnMinWidths = (
  cells: readonly (readonly string[])[],
  columns: number,
  fontScale: number,
): readonly number[] =>
  Array.from({ length: columns }, (_, column) => {
    const word = Math.max(
      0,
      ...cells.map((row) => longestWordWidth(row[column] ?? '', typeScale.callout.fontSize)),
    );
    return Math.max(sizes.minColumn * fontScale, word * fontScale + 2 * spacing.sm + border.thin);
  });

/** True when the columns cannot all get their minimum width inside the table's outline. */
export const tableNeedsScroll = (minWidths: readonly number[], width: number): boolean =>
  minWidths.reduce((sum, w) => sum + w, 0) + 2 * border.width > width;

const plainCells = (cells: readonly ReactNode[]): readonly string[] =>
  cells.map((cell) => (typeof cell === 'string' ? cell : ''));

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
    cellDivider: { borderLeftWidth: border.thin, borderLeftColor: colors.outline },
  }),
);

const asCell = (content: ReactNode): ReactNode =>
  typeof content === 'string' ? <AppText variant="callout">{content}</AppText> : content;

/** A drawn table. Columns too wide for the space (whole words at this text size) scroll sideways. */
export function SketchTable({ caption, header, rows, plain }: SketchTableProps) {
  const styles = useThemedStyles(themed);
  const { fontScale } = useWindowDimensions();
  const [width, setWidth] = useState<number | undefined>(undefined);

  const columns = Math.max(header?.length ?? 0, ...rows.map((row) => row.length));
  const sizing = plain ?? { header: header && plainCells(header), rows: rows.map(plainCells) };
  const minWidths = columnMinWidths(
    sizing.header === undefined ? sizing.rows : [sizing.header, ...sizing.rows],
    columns,
    fontScale,
  );
  const scroll = width !== undefined && tableNeedsScroll(minWidths, width);
  // Fits: columns share the width in proportion to their minimums, so each gets at least
  // its minimum. Scrolls: each column is exactly its minimum.
  const columnStyle = (column: number) =>
    scroll
      ? { width: minWidths[column] }
      : { flexGrow: minWidths[column], flexShrink: 1, flexBasis: 0 };

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
          style={[styles.cell, columnStyle(column), column > 0 && styles.cellDivider]}
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
