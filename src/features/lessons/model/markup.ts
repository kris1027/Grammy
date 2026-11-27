import type { InlineSpan } from './types';

// One tokenizer feeds both parseInline and findMarkupProblems, so they never disagree.
// Rules (spec 0002, Markup rules): **bold**, ==highlight==, [[topic-id]] and
// [[topic-id|label]]. No nesting, no escapes. Anything malformed stays plain text.

type Token =
  | { readonly kind: 'text'; readonly source: string; readonly problem?: string }
  | Exclude<InlineSpan, { readonly kind: 'text' }>;

const MARKERS = ['**', '==', '[['] as const;
type Marker = (typeof MARKERS)[number];

const LINK_TARGET = /^[a-z0-9-]+$/;

const isBlank = (text: string): boolean => text.trim() === '';

const containsMarkup = (text: string): boolean =>
  text.includes('**') || text.includes('==') || text.includes('[[') || text.includes(']]');

/** The first opening marker (or stray `]]`) at or after `from`. */
const nextMarker = (
  text: string,
  from: number,
): { readonly index: number; readonly marker: Marker | ']]' } | undefined =>
  [...MARKERS, ']]' as const]
    .map((marker) => ({ index: text.indexOf(marker, from), marker }))
    .filter((found) => found.index !== -1)
    .reduce<{ readonly index: number; readonly marker: Marker | ']]' } | undefined>(
      (best, found) => (best === undefined || found.index < best.index ? found : best),
      undefined,
    );

/** Reads one marked span that opens at `start`. Returns the token and where reading continues. */
const readSpan = (
  text: string,
  start: number,
  marker: Marker,
): { readonly token: Token; readonly end: number } => {
  const closer = marker === '[[' ? ']]' : marker;
  const close = text.indexOf(closer, start + 2);

  if (close === -1) {
    return {
      token: { kind: 'text', source: marker, problem: `unclosed "${marker}"` },
      end: start + 2,
    };
  }

  const end = close + 2;
  const source = text.slice(start, end);
  const inner = text.slice(start + 2, close);
  const plain = (problem: string) => ({
    token: { kind: 'text', source, problem } as const,
    end,
  });

  if (isBlank(inner)) return plain(`empty "${marker}${closer}"`);
  if (containsMarkup(inner)) return plain(`nested markup in "${source}"`);

  if (marker === '**') return { token: { kind: 'bold', text: inner, source }, end };
  if (marker === '==') return { token: { kind: 'highlight', text: inner, source }, end };

  const bar = inner.indexOf('|');
  const target = bar === -1 ? inner : inner.slice(0, bar);
  const label = bar === -1 ? undefined : inner.slice(bar + 1);

  if (!LINK_TARGET.test(target)) return plain(`bad link target in "${source}"`);
  if (label !== undefined && isBlank(label)) return plain(`empty link label in "${source}"`);

  return {
    token:
      label === undefined
        ? { kind: 'link', topicId: target, source }
        : { kind: 'link', topicId: target, label, source },
    end,
  };
};

const tokenize = (text: string): readonly Token[] => {
  const tokens: Token[] = [];
  let position = 0;

  while (position < text.length) {
    const found = nextMarker(text, position);

    if (found === undefined) {
      tokens.push({ kind: 'text', source: text.slice(position) });
      break;
    }

    if (found.index > position) {
      tokens.push({ kind: 'text', source: text.slice(position, found.index) });
    }

    if (found.marker === ']]') {
      tokens.push({ kind: 'text', source: ']]', problem: 'stray "]]"' });
      position = found.index + 2;
      continue;
    }

    const { token, end } = readSpan(text, found.index, found.marker);
    tokens.push(token);
    position = end;
  }

  return tokens;
};

/** Turns inline markup into spans. Never throws; joining every `source` gives back the input. */
export const parseInline = (text: string): readonly InlineSpan[] =>
  tokenize(text).reduce<readonly InlineSpan[]>((spans, token) => {
    if (token.kind !== 'text') return [...spans, token];

    const last = spans.at(-1);
    if (last?.kind === 'text') {
      const source = last.source + token.source;
      return [...spans.slice(0, -1), { kind: 'text', text: source, source }];
    }
    return [...spans, { kind: 'text', text: token.source, source: token.source }];
  }, []);

/** Short English messages, one per piece of malformed markup. Empty when the text is clean. */
export const findMarkupProblems = (text: string): readonly string[] =>
  tokenize(text).flatMap((token) =>
    token.kind === 'text' && token.problem !== undefined ? [token.problem] : [],
  );
