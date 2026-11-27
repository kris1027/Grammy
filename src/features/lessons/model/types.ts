// The shape every lesson and topic follows (spec 0002). This file imports nothing.

export const TENSE_TIMES = ['present', 'past', 'future'] as const;
export const TENSE_ASPECTS = ['simple', 'continuous', 'perfect', 'perfectContinuous'] as const;

export type TenseTime = (typeof TENSE_TIMES)[number];
export type TenseAspect = (typeof TENSE_ASPECTS)[number];

export type TenseSlot = {
  readonly time: TenseTime;
  readonly aspect: TenseAspect;
};

export type Category = {
  readonly id: string;
  /** Polish. */
  readonly title: string;
  /** Polish. */
  readonly summary?: string;
};

export type Topic<Id extends string = string> = {
  readonly id: Id;
  readonly categoryId: string;
  readonly title: string;
  /** Polish gloss, for example "czas teraźniejszy prosty". */
  readonly subtitle?: string;
  /** Polish. */
  readonly summary: string;
  readonly tense?: TenseSlot;
};

export type Example = {
  /** English. */
  readonly en: string;
  /** Polish. */
  readonly pl: string;
  /** Polish. */
  readonly note?: string;
};

export type Block =
  | { readonly type: 'text'; readonly text: string }
  | {
      readonly type: 'table';
      readonly caption?: string;
      readonly header?: readonly string[];
      readonly rows: readonly (readonly string[])[];
    }
  | { readonly type: 'examples'; readonly items: readonly Example[] }
  | { readonly type: 'tip'; readonly text: string }
  | { readonly type: 'formula'; readonly label?: string; readonly parts: readonly string[] }
  | {
      readonly type: 'mistake';
      /** English. */
      readonly wrong: string;
      /** English. */
      readonly right: string;
      /** Polish. */
      readonly note?: string;
    }
  | { readonly type: 'list'; readonly items: readonly string[] };

export type BlockType = Block['type'];

export type Section = {
  /** Polish. */
  readonly title: string;
  readonly blocks: readonly Block[];
};

export type LessonReview = 'draft' | 'checked';

export type Lesson<Id extends string = string> = {
  readonly review: LessonReview;
  readonly sections: readonly Section[];
  readonly related?: readonly Id[];
};

/** Lessons keyed by topic id, so one topic can never have two lessons. */
export type LessonsById<Id extends string = string> = Readonly<Partial<Record<Id, Lesson<Id>>>>;

export type TopicStatus<Id extends string = string> = Topic<Id> & {
  readonly isWritten: boolean;
};

export type TenseGrid<Id extends string = string> = Readonly<
  Record<TenseTime, Readonly<Record<TenseAspect, TopicStatus<Id> | undefined>>>
>;

export type LessonLookup<Id extends string = string> =
  | { readonly kind: 'ok'; readonly topic: Topic<Id>; readonly lesson: Lesson<Id> }
  | { readonly kind: 'not-written'; readonly topic: Topic<Id> }
  | { readonly kind: 'unknown' };

export type InlineSpan =
  | { readonly kind: 'text'; readonly text: string; readonly source: string }
  | { readonly kind: 'bold'; readonly text: string; readonly source: string }
  | { readonly kind: 'highlight'; readonly text: string; readonly source: string }
  | {
      readonly kind: 'link';
      readonly topicId: string;
      readonly label?: string;
      readonly source: string;
    };
