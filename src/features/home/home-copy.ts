import type { TopicId } from '@/features/lessons';

// Polish text on the home screen (spec 0005). AI draft: you check it (AC-11).

export const HOME_TITLE = 'Gramatyka angielska';
export const START_HEADING = 'Zacznij tutaj';
export const START_CARD_LABEL_PREFIX = 'Otwórz lekcję: ';
export const INTRO =
  'Angielski ma **12 czasów**. Każdy łączy dwie rzeczy: **kiedy** coś się dzieje (teraźniejszość, przeszłość albo przyszłość) i **jak** na to patrzysz: jako fakt (Simple), jako coś w trakcie (Continuous), jako coś już zrobionego (Perfect) albo jako coś, co trwa aż do jakiegoś momentu (Perfect Continuous). Na mapie poniżej każdy blok to jeden okres, a jego cztery kafelki zawsze stoją w tej samej kolejności.';
export const MAP_HEADING = 'Mapa czasów';
export const OTHER_TOPICS_HEADING = 'Inne tematy';

/** The lesson the start card opens. Feature 8 may turn this block into `Kontynuuj`. */
export const START_TOPIC_ID: TopicId = 'present-simple';
