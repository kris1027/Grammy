import { Link, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { TopicCard } from '@/features/lessons';
import { AppText } from '@/ui/app-text';
import { Heading } from '@/ui/heading';
import { Screen } from '@/ui/screen';
import { sizes, spacing, typeScale } from '@/ui/theme';

export default function HomeScreen() {
  return (
    <Screen>
      <View style={styles.page}>
        <Heading level={1}>Gramatyka angielska</Heading>
        {/* Temporary: feature 6 replaces this card with the tense map. */}
        <TopicCard
          topicId="present-simple"
          variant="accent"
          showSummary
          accessibilityLabel="Otwórz lekcję: Present Simple"
          onPress={() =>
            router.push({ pathname: '/lesson/[id]', params: { id: 'present-simple' } })
          }
        />
        {/* Temporary: feature 6 removes this link with the showcase. */}
        <Link href="/showcase" asChild>
          <AppText role="link" tone="accentText" style={styles.link}>
            Zobacz wzornik
          </AppText>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.xl, paddingTop: spacing.lg },
  // A Text cannot centre itself, so padding lifts one body line to the touch size.
  link: {
    alignSelf: 'flex-start',
    minHeight: sizes.minTouch,
    paddingVertical: (sizes.minTouch - typeScale.body.lineHeight) / 2,
    textDecorationLine: 'underline',
  },
});
