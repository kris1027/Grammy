import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/ui/app-text';
import { Heading } from '@/ui/heading';
import { Icon } from '@/ui/icon';
import { SketchCard } from '@/ui/sketch-card';
import { createThemedStyles, useThemedStyles } from '@/ui/themed-styles';

import type { TopicId } from '../content/catalog';
import { getLesson, getTopic } from './queries';

export const NOT_WRITTEN_CAPTION = 'Lekcja jeszcze niegotowa';

export type TopicCardProps = {
  readonly topicId: TopicId;
  readonly variant: 'accent' | 'plain';
  /** Default false. Shows the topic summary under the subtitle. */
  readonly showSummary?: boolean;
  /** Replaces the label built from the title, subtitle and written state. */
  readonly accessibilityLabel?: string;
  readonly onPress: () => void;
};

const themed = createThemedStyles(({ spacing }) =>
  StyleSheet.create({
    pressed: { opacity: 0.6 },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    text: { flex: 1, gap: spacing.xs },
  }),
);

/** A pressable card for one topic. An unwritten topic is muted and says so in words. */
export function TopicCard({
  topicId,
  variant,
  showSummary = false,
  accessibilityLabel,
  onPress,
}: TopicCardProps) {
  const styles = useThemedStyles(themed);
  const topic = getTopic(topicId);
  if (topic === undefined) return null;

  const written = getLesson(topicId).kind === 'ok';
  const label =
    accessibilityLabel ??
    [topic.title, topic.subtitle, written ? undefined : NOT_WRITTEN_CAPTION.toLowerCase()]
      .filter((part) => part !== undefined)
      .join(', ');

  return (
    <Pressable
      role="link"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <SketchCard variant={variant}>
        <View style={styles.row}>
          <View style={styles.text}>
            <Heading level={3} tone={written ? undefined : 'inkMuted'}>
              {topic.title}
            </Heading>
            {topic.subtitle !== undefined && <AppText variant="muted">{topic.subtitle}</AppText>}
            {showSummary && <AppText>{topic.summary}</AppText>}
            {!written && <AppText variant="caption">{NOT_WRITTEN_CAPTION}</AppText>}
          </View>
          <Icon name="chevron.right" color={written ? 'accentText' : 'inkMuted'} />
        </View>
      </SketchCard>
    </Pressable>
  );
}
