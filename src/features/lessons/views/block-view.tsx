import { StyleSheet, View } from 'react-native';

import { Heading } from '@/ui/heading';
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
};

const themed = createThemedStyles(({ spacing }) =>
  StyleSheet.create({ section: { gap: spacing.lg } }),
);

/** A section title and its blocks. */
export function SectionView({ section, onOpenTopic }: SectionViewProps) {
  const styles = useThemedStyles(themed);

  return (
    <View style={styles.section}>
      <Heading level={2}>{section.title}</Heading>
      {section.blocks.map((block, index) => (
        <BlockView key={index} block={block} onOpenTopic={onOpenTopic} />
      ))}
    </View>
  );
}
