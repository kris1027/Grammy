import { StyleSheet, View } from 'react-native';

import { Heading } from '@/ui/heading';
import { NumberBadge } from '@/ui/number-badge';
import { createThemedStyles, useThemedStyles } from '@/ui/themed-styles';

import type { TopicId } from '../content/catalog';
import type { Block, Section } from '../model/types';
import {
  ExamplesBlock,
  FormulaBlock,
  ListBlock,
  MistakeBlock,
  TableBlock,
  TipBlock,
} from './block-views';
import { InlineText } from './inline-text';
import { plainText } from './plain-text';

export type BlockViewProps = {
  readonly block: Block;
  readonly onOpenTopic?: (id: TopicId) => void;
};

/** Renders any lesson block. An eighth block type fails typecheck here until it gets a view. */
export function BlockView({ block, onOpenTopic }: BlockViewProps) {
  switch (block.type) {
    case 'text':
      return <InlineText text={block.text} onOpenTopic={onOpenTopic} />;
    case 'table':
      return <TableBlock block={block} onOpenTopic={onOpenTopic} />;
    case 'examples':
      return <ExamplesBlock block={block} onOpenTopic={onOpenTopic} />;
    case 'tip':
      return <TipBlock block={block} onOpenTopic={onOpenTopic} />;
    case 'formula':
      return <FormulaBlock block={block} onOpenTopic={onOpenTopic} />;
    case 'mistake':
      return <MistakeBlock block={block} onOpenTopic={onOpenTopic} />;
    case 'list':
      return <ListBlock block={block} onOpenTopic={onOpenTopic} />;
    default: {
      const unhandled: never = block;
      return unhandled;
    }
  }
}

export type SectionViewProps = {
  readonly section: Section;
  readonly onOpenTopic?: (id: TopicId) => void;
  /** Its place in the lesson, from 1. Adds a number badge and reads as `1. Title`. */
  readonly number?: number;
};

const themed = createThemedStyles(({ spacing }) =>
  StyleSheet.create({
    section: { gap: spacing.lg },
    numbered: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    title: { flex: 1 },
  }),
);

/** A section title and its blocks. With `number`, the title gets a number badge. */
export function SectionView({ section, onOpenTopic, number }: SectionViewProps) {
  const styles = useThemedStyles(themed);

  return (
    <View style={styles.section}>
      {number === undefined ? (
        <Heading level={2}>{section.title}</Heading>
      ) : (
        <View style={styles.numbered}>
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <NumberBadge value={number} />
          </View>
          <View style={styles.title}>
            <Heading level={2} accessibilityLabel={`${number}. ${plainText(section.title)}`}>
              {section.title}
            </Heading>
          </View>
        </View>
      )}
      {section.blocks.map((block, index) => (
        <BlockView key={index} block={block} onOpenTopic={onOpenTopic} />
      ))}
    </View>
  );
}
