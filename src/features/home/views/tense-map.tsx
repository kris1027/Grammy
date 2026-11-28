import { StyleSheet, useWindowDimensions, View } from 'react-native';

import {
  getTenseGrid,
  TENSE_ASPECTS,
  TENSE_TIME_LABELS,
  TENSE_TIMES,
  TopicCard,
  type TenseAspect,
  type TenseTime,
  type TopicId,
  type TopicStatus,
} from '@/features/lessons';
import { Heading } from '@/ui/heading';
import { Icon, type SymbolName } from '@/ui/icon';
import { sizes } from '@/ui/theme';
import { createThemedStyles, useThemedStyles } from '@/ui/themed-styles';

import { MAP_HEADING } from '../home-copy';

/** Read together they make a timeline: now, back, forward. Decorative. */
export const TIME_FRAME_ICONS: Readonly<Record<TenseTime, SymbolName>> = {
  present: 'smallcircle.filled.circle',
  past: 'arrow.left.circle',
  future: 'arrow.right.circle',
};

/** Two rows of two: Simple | Continuous, then Perfect | Perfect Continuous. */
const ASPECT_ROWS: readonly (readonly TenseAspect[])[] = [
  TENSE_ASPECTS.slice(0, 2),
  TENSE_ASPECTS.slice(2, 4),
];

export type TenseMapProps = {
  readonly onOpenTopic: (id: TopicId) => void;
};

const themed = createThemedStyles(({ spacing }) =>
  StyleSheet.create({
    map: { gap: spacing.lg },
    blocks: { gap: spacing.xl },
    block: { gap: spacing.md },
    blockHeading: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    headingText: { flex: 1 },
    tiles: { gap: spacing.md },
    row: { flexDirection: 'row', alignItems: 'stretch', gap: spacing.md },
    cell: { flex: 1 },
  }),
);

/** The 12 tenses as three time frame blocks of 2×2 tiles (one column at large text). */
export function TenseMap({ onOpenTopic }: TenseMapProps) {
  const styles = useThemedStyles(themed);
  const { fontScale } = useWindowDimensions();
  const oneColumn = fontScale >= sizes.gridMaxFontScale;
  const grid = getTenseGrid();

  const tile = (topic: TopicStatus<TopicId>) => (
    <TopicCard
      topicId={topic.id}
      variant="plain"
      layout="tile"
      onPress={() => onOpenTopic(topic.id)}
    />
  );

  const tiles = (time: TenseTime) => {
    const slots = grid[time];
    if (oneColumn) {
      return TENSE_ASPECTS.map((aspect) => {
        const topic = slots[aspect];
        return topic === undefined ? null : (
          <View key={aspect} testID="tense-row">
            {tile(topic)}
          </View>
        );
      });
    }
    return ASPECT_ROWS.map((row) => (
      <View key={row.join('-')} style={styles.row} testID="tense-row">
        {row.map((aspect) => {
          const topic = slots[aspect];
          return (
            <View key={aspect} style={styles.cell}>
              {topic !== undefined && tile(topic)}
            </View>
          );
        })}
      </View>
    ));
  };

  return (
    <View style={styles.map}>
      <Heading level={2}>{MAP_HEADING}</Heading>
      <View style={styles.blocks}>
        {TENSE_TIMES.map((time) => (
          <View key={time} style={styles.block}>
            <View style={styles.blockHeading}>
              <Icon name={TIME_FRAME_ICONS[time]} color="accentText" />
              <View style={styles.headingText}>
                <Heading level={3}>{TENSE_TIME_LABELS[time]}</Heading>
              </View>
            </View>
            <View style={styles.tiles}>{tiles(time)}</View>
          </View>
        ))}
      </View>
    </View>
  );
}
