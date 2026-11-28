import { StyleSheet, View } from 'react-native';

import { listCategories, listTopics, TopicCard, type TopicId } from '@/features/lessons';
import { Heading } from '@/ui/heading';
import { createThemedStyles, useThemedStyles } from '@/ui/themed-styles';

import { OTHER_TOPICS_HEADING } from '../home-copy';

const TENSES_CATEGORY = 'tenses';

export type OtherTopicsProps = {
  readonly onOpenTopic: (id: TopicId) => void;
};

const themed = createThemedStyles(({ spacing }) =>
  StyleSheet.create({
    section: { gap: spacing.lg },
    category: { gap: spacing.md },
  }),
);

/** Lessons outside the tense map, grouped by category. Renders nothing when there are none. */
export function OtherTopics({ onOpenTopic }: OtherTopicsProps) {
  const styles = useThemedStyles(themed);
  const groups = listCategories()
    .filter((category) => category.id !== TENSES_CATEGORY)
    .map((category) => ({ category, topics: listTopics(category.id) }))
    .filter(({ topics }) => topics.length > 0);

  if (groups.length === 0) return null;

  return (
    <View style={styles.section}>
      <Heading level={2}>{OTHER_TOPICS_HEADING}</Heading>
      {groups.map(({ category, topics }) => (
        <View key={category.id} style={styles.category}>
          <Heading level={3}>{category.title}</Heading>
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topicId={topic.id}
              variant="plain"
              onPress={() => onOpenTopic(topic.id)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
