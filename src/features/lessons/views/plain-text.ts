import { parseInline } from '../model/markup';
import type { InlineSpan } from '../model/types';
import { getTopic } from './queries';

/** What a link shows: its own label, else the topic title, else the raw id. */
export const linkLabel = (span: Extract<InlineSpan, { kind: 'link' }>): string =>
  span.label ?? getTopic(span.topicId)?.title ?? span.topicId;

/** Lesson text as a screen reader should say it: no `**`, `==` or `[[ ]]`. Never throws. */
export const plainText = (text: string): string =>
  parseInline(text)
    .map((span) => (span.kind === 'link' ? linkLabel(span) : span.text))
    .join('');
