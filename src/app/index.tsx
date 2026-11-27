import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/ui/app-text';
import { Heading } from '@/ui/heading';
import { Screen } from '@/ui/screen';
import { spacing } from '@/ui/theme';

export default function HomeScreen() {
  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <Heading level={1}>Gramatyka angielska</Heading>
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  link: { textDecorationLine: 'underline' },
});
