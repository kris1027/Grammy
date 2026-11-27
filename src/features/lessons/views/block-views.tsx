import { StyleSheet, View } from 'react-native';

import { AppText } from '@/ui/app-text';
import { Chip } from '@/ui/chip';
import { Icon } from '@/ui/icon';
import { SketchCard } from '@/ui/sketch-card';
import { SketchTable } from '@/ui/sketch-table';
import { SpeechBubble } from '@/ui/speech-bubble';
import { createThemedStyles, useThemedStyles } from '@/ui/themed-styles';

import type { TopicId } from '../content/catalog';
import type { Block } from '../model/types';
import { BulletDot } from './bullet-dot';
import { InlineText } from './inline-text';
import { plainText } from './plain-text';

// One view per lesson block type (spec 0003, Block look). BlockView picks among them.

type BlockOf<T extends Block['type']> = Extract<Block, { type: T }>;
type OpenTopic = { readonly onOpenTopic?: (id: TopicId) => void };

const themed = createThemedStyles(({ spacing }) =>
  StyleSheet.create({
    stack: { gap: spacing.md },
    tight: { gap: spacing.xs },
    item: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
    itemText: { flex: 1, gap: spacing.xs },
    formulaParts: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm },
    struck: { textDecorationLine: 'line-through' },
  }),
);

export function TableBlock({
  block,
  onOpenTopic,
}: { readonly block: BlockOf<'table'> } & OpenTopic) {
  return (
    <SketchTable
      caption={
        block.caption === undefined ? undefined : (
          <InlineText text={block.caption} variant="caption" onOpenTopic={onOpenTopic} />
        )
      }
      header={block.header?.map((cell) => (
        <InlineText key={cell} text={cell} variant="strong" onOpenTopic={onOpenTopic} />
      ))}
      rows={block.rows.map((row) =>
        row.map((cell, column) => (
          <InlineText key={column} text={cell} variant="callout" onOpenTopic={onOpenTopic} />
        )),
      )}
    />
  );
}

export function ExamplesBlock({
  block,
  onOpenTopic,
}: { readonly block: BlockOf<'examples'> } & OpenTopic) {
  const styles = useThemedStyles(themed);

  return (
    <View style={styles.stack}>
      {block.items.map((item, index) => (
        <View key={index} style={styles.item}>
          <BulletDot />
          <View style={styles.itemText}>
            <InlineText text={item.en} variant="strong" onOpenTopic={onOpenTopic} />
            <InlineText text={item.pl} variant="muted" onOpenTopic={onOpenTopic} />
            {item.note !== undefined && (
              <InlineText text={item.note} variant="caption" italic onOpenTopic={onOpenTopic} />
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

export function TipBlock({ block, onOpenTopic }: { readonly block: BlockOf<'tip'> } & OpenTopic) {
  return (
    <SpeechBubble icon="lightbulb.fill" accessibilityText={`Wskazówka: ${plainText(block.text)}`}>
      <InlineText text={block.text} onOpenTopic={onOpenTopic} />
    </SpeechBubble>
  );
}

const formulaLabel = (block: BlockOf<'formula'>): string => {
  const parts = block.parts.map(plainText).join(' plus ');
  return block.label === undefined ? `Wzór: ${parts}` : `Wzór, ${plainText(block.label)}: ${parts}`;
};

export function FormulaBlock({
  block,
  onOpenTopic,
}: { readonly block: BlockOf<'formula'> } & OpenTopic) {
  const styles = useThemedStyles(themed);

  return (
    <View style={styles.tight} accessible accessibilityLabel={formulaLabel(block)}>
      {block.label !== undefined && (
        <InlineText text={block.label} variant="caption" onOpenTopic={onOpenTopic} />
      )}
      <View style={styles.formulaParts}>
        {block.parts.map((part, index) => (
          <View key={index} style={styles.formulaParts}>
            {index > 0 && (
              <AppText variant="strong" tone="accentText">
                +
              </AppText>
            )}
            <Chip>
              <InlineText text={part} variant="callout" onOpenTopic={onOpenTopic} />
            </Chip>
          </View>
        ))}
      </View>
    </View>
  );
}

export function MistakeBlock({
  block,
  onOpenTopic,
}: { readonly block: BlockOf<'mistake'> } & OpenTopic) {
  const styles = useThemedStyles(themed);

  return (
    <SketchCard>
      <View
        style={styles.item}
        accessible
        accessibilityLabel={`Błędnie: ${plainText(block.wrong)}`}
      >
        <Icon name="xmark.circle.fill" color="error" />
        <View style={styles.itemText}>
          <AppText variant="caption" tone="error">
            Błędnie
          </AppText>
          <InlineText text={block.wrong} variant="muted" style={styles.struck} />
        </View>
      </View>
      <View
        style={styles.item}
        accessible
        accessibilityLabel={`Poprawnie: ${plainText(block.right)}`}
      >
        <Icon name="checkmark.circle.fill" color="success" />
        <View style={styles.itemText}>
          <AppText variant="caption" tone="success">
            Poprawnie
          </AppText>
          <InlineText text={block.right} variant="strong" />
        </View>
      </View>
      {block.note !== undefined && <InlineText text={block.note} onOpenTopic={onOpenTopic} />}
    </SketchCard>
  );
}

export function ListBlock({ block, onOpenTopic }: { readonly block: BlockOf<'list'> } & OpenTopic) {
  const styles = useThemedStyles(themed);

  return (
    <View style={styles.stack}>
      {block.items.map((item, index) => (
        <View key={index} style={styles.item}>
          <BulletDot />
          <View style={styles.itemText}>
            <InlineText text={item} onOpenTopic={onOpenTopic} />
          </View>
        </View>
      ))}
    </View>
  );
}
