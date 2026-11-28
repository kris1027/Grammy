import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { getTopic, InlineText, plainText, TopicCard, type TopicId } from '@/features/lessons';
import { Heading } from '@/ui/heading';
import { Screen } from '@/ui/screen';
import { SpeechBubble } from '@/ui/speech-bubble';
import { createThemedStyles, useThemedStyles } from '@/ui/themed-styles';

import {
  HOME_TITLE,
  INTRO,
  START_CARD_LABEL_PREFIX,
  START_HEADING,
  START_TOPIC_ID,
} from './home-copy';
import { OtherTopics } from './views/other-topics';
import { TenseMap } from './views/tense-map';

export const openTopic = (id: TopicId) => router.push({ pathname: '/lesson/[id]', params: { id } });

const themed = createThemedStyles(({ spacing }) =>
  StyleSheet.create({
    page: { gap: spacing.xl, paddingTop: spacing.lg },
    start: { gap: spacing.md },
  }),
);

/** The front door: title, start card, intro, the tense map and other topics (spec 0005). */
export function HomeScreen() {
  const styles = useThemedStyles(themed);
  const start = getTopic(START_TOPIC_ID);

  return (
    <Screen>
      <View style={styles.page}>
        <Heading level={1}>{HOME_TITLE}</Heading>
        {start !== undefined && (
          <View style={styles.start}>
            <Heading level={2}>{START_HEADING}</Heading>
            <TopicCard
              topicId={START_TOPIC_ID}
              variant="accent"
              showSummary
              accessibilityLabel={`${START_CARD_LABEL_PREFIX}${start.title}`}
              onPress={() => openTopic(START_TOPIC_ID)}
            />
          </View>
        )}
        <SpeechBubble icon="map" accessibilityText={plainText(INTRO)}>
          <InlineText text={INTRO} />
        </SpeechBubble>
        <TenseMap onOpenTopic={openTopic} />
        <OtherTopics onOpenTopic={openTopic} />
      </View>
    </Screen>
  );
}
