import { StyleSheet, Text, View } from 'react-native';

import { getLesson, SectionView } from '@/features/lessons';
import { AppText, type TextVariant } from '@/ui/app-text';
import { Chip } from '@/ui/chip';
import { Heading } from '@/ui/heading';
import { Icon } from '@/ui/icon';
import { NumberBadge } from '@/ui/number-badge';
import { Screen } from '@/ui/screen';
import { SketchCard } from '@/ui/sketch-card';
import { SketchTable } from '@/ui/sketch-table';
import { SpeechBubble } from '@/ui/speech-bubble';
import { sizes, themes, type ColorKey } from '@/ui/theme';
import { createThemedStyles, useThemedStyles } from '@/ui/themed-styles';
import { useTheme } from '@/ui/use-theme';

// Temporary sample book (spec 0003): every token, shared part and lesson block in one
// place, to check the look on the iPhone. Feature 6 deletes it.

export const POLISH_LETTERS = 'Zażółć gęślą jaźń ĄĆĘŁŃÓŚŹŻ';
export const MISSING_LESSON = 'Brak lekcji przykładowej';

const COLOR_KEYS = Object.keys(themes.light.colors) as readonly ColorKey[];

const TEXT_SAMPLES: readonly { readonly variant: TextVariant; readonly label: string }[] = [
  { variant: 'body', label: 'body · tekst lekcji, 17 pt' },
  { variant: 'strong', label: 'strong · przykład po angielsku, 17 pt' },
  { variant: 'muted', label: 'muted · tłumaczenie po polsku, 17 pt' },
  { variant: 'callout', label: 'callout · komórki tabeli i wzory, 16 pt' },
  { variant: 'caption', label: 'caption · podpisy i uwagi, 13 pt' },
];

const themed = createThemedStyles(({ colors, border, radius, spacing, typeScale }) =>
  StyleSheet.create({
    page: { gap: spacing.xxl, paddingTop: spacing.lg },
    group: { gap: spacing.lg },
    swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
    swatch: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minWidth: '45%' },
    swatchColor: {
      width: spacing.xxl,
      height: spacing.xxl,
      borderRadius: radius.sm,
      borderColor: colors.outline,
      borderWidth: border.width,
    },
    swatchText: { flexShrink: 1 },
    hand: { ...typeScale.heading, color: colors.ink },
    row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.md },
  }),
);

function Swatches() {
  const styles = useThemedStyles(themed);
  const { colors } = useTheme();

  return (
    <View style={styles.swatches}>
      {COLOR_KEYS.map((key) => (
        <View key={key} style={styles.swatch}>
          <View style={[styles.swatchColor, { backgroundColor: colors[key] }]} />
          <View style={styles.swatchText}>
            <AppText variant="strong">{key}</AppText>
            <AppText variant="caption">{colors[key]}</AppText>
          </View>
        </View>
      ))}
    </View>
  );
}

function Lesson() {
  const lookup = getLesson('present-simple');
  if (lookup.kind !== 'ok') return <AppText variant="muted">{MISSING_LESSON}</AppText>;

  return (
    <>
      <AppText variant="muted">{lookup.topic.title}</AppText>
      {lookup.lesson.sections.map((section) => (
        <SectionView key={section.title} section={section} />
      ))}
    </>
  );
}

export function ShowcaseScreen() {
  const styles = useThemedStyles(themed);

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <View style={styles.page}>
        <View style={styles.group}>
          <Heading level={2}>Kolory</Heading>
          <Swatches />
        </View>

        <View style={styles.group}>
          <Heading level={2}>Pismo</Heading>
          <Heading level={1}>display · tytuł ekranu</Heading>
          <Heading level={2}>title · tytuł sekcji</Heading>
          <Heading level={3}>heading · podtytuł i karta</Heading>
          {TEXT_SAMPLES.map(({ variant, label }) => (
            <AppText key={variant} variant={variant}>
              {label}
            </AppText>
          ))}
        </View>

        <View style={styles.group}>
          <Heading level={2}>Polskie litery</Heading>
          <Text maxFontSizeMultiplier={sizes.maxHeadingScale} style={styles.hand}>
            {POLISH_LETTERS}
          </Text>
          <AppText>{POLISH_LETTERS}</AppText>
        </View>

        <View style={styles.group}>
          <Heading level={2}>Części</Heading>
          <SketchCard>
            <Heading level={3}>Karta zwykła</Heading>
            <AppText>Obramowanie, zaokrąglone rogi i pełny cień przesunięty w bok.</AppText>
          </SketchCard>
          <SketchCard variant="accent">
            <Heading level={3}>Karta wyróżniona</Heading>
            <AppText>Miękkie pomarańczowe tło, tylko z ciemnym tekstem.</AppText>
          </SketchCard>
          <SpeechBubble icon="lightbulb.fill">
            <AppText>Dymek z ikoną i pomarańczowym paskiem.</AppText>
          </SpeechBubble>
          <View style={styles.row}>
            <NumberBadge value={1} />
            <NumberBadge value={2} />
            <NumberBadge value={3} />
            <Chip>podmiot</Chip>
            <Chip>czasownik</Chip>
          </View>
          <View style={styles.row}>
            <Icon name="book.fill" label="Książka" />
            <Icon name="star.fill" color="accentText" label="Gwiazdka" />
            <Icon name="checkmark.circle.fill" color="success" label="Poprawnie" />
            <Icon name="xmark.circle.fill" color="error" label="Błędnie" />
          </View>
          <SketchTable
            caption="Tabela, która się mieści"
            header={['Osoba', 'Forma']}
            rows={[
              ['I / you', 'work'],
              ['he / she / it', 'works'],
            ]}
          />
          <SketchTable
            caption="Tabela szersza niż ekran"
            header={['I', 'you', 'he', 'she', 'we', 'they']}
            rows={[['am', 'are', 'is', 'is', 'are', 'are']]}
          />
        </View>

        <View style={styles.group}>
          <Heading level={2}>Lekcja przykładowa</Heading>
          <Lesson />
        </View>
      </View>
    </Screen>
  );
}
