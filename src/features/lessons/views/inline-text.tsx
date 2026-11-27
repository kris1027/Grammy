import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

import { AppText, type TextVariant } from '@/ui/app-text';
import { createThemedStyles, useThemedStyles } from '@/ui/themed-styles';

import type { TopicId } from '../content/catalog';
import { parseInline } from '../model/markup';
import { linkLabel } from './plain-text';
import { getLesson } from './queries';

export type InlineTextProps = {
  readonly text: string;
  readonly variant?: TextVariant;
  readonly italic?: boolean;
  /** Without it links are styled but not pressable. */
  readonly onOpenTopic?: (id: TopicId) => void;
  readonly style?: StyleProp<TextStyle>;
};

const themed = createThemedStyles(({ colors, typeScale }) =>
  StyleSheet.create({
    bold: { fontWeight: typeScale.strong.fontWeight },
    highlight: { backgroundColor: colors.accentSoft },
    link: { color: colors.accentText, textDecorationLine: 'underline' },
    unwritten: { color: colors.inkMuted },
  }),
);

/** Lesson text with **bold**, ==highlight== and [[topic]] links, as one wrapping paragraph. */
export function InlineText({
  text,
  variant = 'body',
  italic,
  onOpenTopic,
  style,
}: InlineTextProps) {
  const styles = useThemedStyles(themed);

  return (
    <AppText variant={variant} italic={italic} style={style}>
      {parseInline(text).map((span, index) => {
        switch (span.kind) {
          case 'text':
            return span.text;
          case 'bold':
            return (
              <Text key={index} style={styles.bold}>
                {span.text}
              </Text>
            );
          case 'highlight':
            return (
              <Text key={index} style={styles.highlight}>
                {span.text}
              </Text>
            );
          case 'link': {
            const written = getLesson(span.topicId).kind === 'ok';
            const topicId = span.topicId as TopicId;
            return (
              <Text
                key={index}
                role="link"
                style={[styles.link, !written && styles.unwritten]}
                onPress={onOpenTopic === undefined ? undefined : () => onOpenTopic(topicId)}
              >
                {linkLabel(span)}
              </Text>
            );
          }
        }
      })}
    </AppText>
  );
}
