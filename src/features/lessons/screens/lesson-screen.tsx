import { Link, Stack, router, useLocalSearchParams } from 'expo-router';
import { useState, type ReactNode } from 'react';
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { AppText } from '@/ui/app-text';
import { Chip } from '@/ui/chip';
import { Heading } from '@/ui/heading';
import { Screen } from '@/ui/screen';
import { SketchCard } from '@/ui/sketch-card';
import { TextLink } from '@/ui/text-link';
import { createThemedStyles, useThemedStyles } from '@/ui/themed-styles';

import type { TopicId } from '../content/catalog';
import type { Section, Topic } from '../model/types';
import { SectionView } from '../views/block-view';
import { getLesson } from '../views/queries';
import { TopicCard } from '../views/topic-card';
import { isHeaderTitleVisible } from './header-title';

export const DRAFT_CHIP = 'Wersja robocza';
export const NOT_WRITTEN_TEXT = 'Ta lekcja jeszcze nie powstała.';
export const NOT_FOUND_TITLE = 'Nie znaleziono lekcji';
export const BACK_HOME = 'Wróć do strony głównej';
export const SEE_ALSO = 'Zobacz też';

const UNDER_HEADER = ['left', 'right', 'bottom'] as const;

const themed = createThemedStyles(({ spacing }) =>
  StyleSheet.create({
    page: { gap: spacing.xl, paddingTop: spacing.lg },
    top: { gap: spacing.sm },
    chip: { alignSelf: 'flex-start' },
    sections: { gap: spacing.xxl },
    cards: { gap: spacing.md },
  }),
);

const openTopic = (id: TopicId) => router.push({ pathname: '/lesson/[id]', params: { id } });

/**
 * One route for every topic (spec 0004): a written lesson, a topic that is not written
 * yet, or a not found page. Never throws, whatever the route param is.
 */
export function LessonScreen() {
  const { id } = useLocalSearchParams();
  const lookup = getLesson(id);

  if (lookup.kind === 'unknown') return <NotFound />;

  return (
    <TopicPage
      topic={lookup.topic}
      draft={lookup.kind === 'ok' && lookup.lesson.review === 'draft'}
    >
      {lookup.kind === 'ok' ? (
        <LessonBody
          currentId={lookup.topic.id}
          sections={lookup.lesson.sections}
          related={lookup.lesson.related ?? []}
        />
      ) : (
        <AppText variant="muted">{NOT_WRITTEN_TEXT}</AppText>
      )}
    </TopicPage>
  );
}

type TopicPageProps = {
  readonly topic: Topic<TopicId>;
  readonly draft: boolean;
  readonly children: ReactNode;
};

/** The shared top (title, subtitle, draft chip, summary) and the header title on scroll. */
function TopicPage({ topic, draft, children }: TopicPageProps) {
  const styles = useThemedStyles(themed);
  const [headingBottom, setHeadingBottom] = useState<number | undefined>(undefined);
  const [titleVisible, setTitleVisible] = useState(false);

  const onTopLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) =>
    setHeadingBottom(layout.y + layout.height);

  const onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const visible = isHeaderTitleVisible(nativeEvent.contentOffset.y, headingBottom);
    if (visible !== titleVisible) setTitleVisible(visible);
  };

  return (
    <Screen edges={UNDER_HEADER} onScroll={onScroll}>
      <Stack.Screen options={{ title: titleVisible ? topic.title : '' }} />
      <View style={styles.page}>
        <View testID="page-top" style={styles.top} onLayout={onTopLayout}>
          <Heading level={1}>{topic.title}</Heading>
          {topic.subtitle !== undefined && <AppText variant="muted">{topic.subtitle}</AppText>}
          {draft && (
            <View style={styles.chip}>
              <Chip>{DRAFT_CHIP}</Chip>
            </View>
          )}
        </View>
        <SketchCard variant="accent">
          <AppText>{topic.summary}</AppText>
        </SketchCard>
        {children}
      </View>
    </Screen>
  );
}

type LessonBodyProps = {
  readonly currentId: TopicId;
  readonly sections: readonly Section[];
  readonly related: readonly TopicId[];
};

function LessonBody({ currentId, sections, related }: LessonBodyProps) {
  const styles = useThemedStyles(themed);
  // A link to the lesson you are on does nothing (spec 0004, AC-4).
  const onOpenTopic = (id: TopicId) => {
    if (id !== currentId) openTopic(id);
  };

  return (
    <>
      <View style={styles.sections}>
        {sections.map((section, index) => (
          <SectionView key={index} section={section} number={index + 1} onOpenTopic={onOpenTopic} />
        ))}
      </View>
      {related.length > 0 && (
        <View style={styles.cards}>
          <Heading level={2}>{SEE_ALSO}</Heading>
          {related.map((id) => (
            <TopicCard key={id} topicId={id} variant="plain" onPress={() => onOpenTopic(id)} />
          ))}
        </View>
      )}
    </>
  );
}

function NotFound() {
  const styles = useThemedStyles(themed);

  return (
    <Screen edges={UNDER_HEADER}>
      <Stack.Screen options={{ title: '' }} />
      <View style={styles.page}>
        <Heading level={1}>{NOT_FOUND_TITLE}</Heading>
        <Link href="/" dismissTo asChild>
          <TextLink>{BACK_HOME}</TextLink>
        </Link>
      </View>
    </Screen>
  );
}
