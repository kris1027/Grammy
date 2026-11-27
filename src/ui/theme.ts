// Design tokens (spec 0003). The only file in src/ that may hold a colour literal.
// docs/design.md explains how to use them; keep its values in step with this file.

import { fonts } from './fonts';

const lightColors = {
  paper: '#FBF6EC',
  surface: '#FFFDF8',
  ink: '#2B2622',
  inkMuted: '#6B6158',
  outline: '#2B2622',
  shadow: '#2B2622',
  accent: '#F5A524',
  onAccent: '#2B2622',
  accentSoft: '#FFE1A8',
  accentText: '#A34A00',
  error: '#B3261E',
  success: '#2E7D32',
} as const;

const darkColors = {
  paper: '#1F1C1A',
  surface: '#2A2623',
  ink: '#F3EDE4',
  inkMuted: '#B8AEA3',
  outline: '#D9D0C4',
  shadow: '#0F0D0C',
  accent: '#F0A83A',
  onAccent: '#1F1C1A',
  accentSoft: '#4A3311',
  accentText: '#FFB866',
  error: '#FF8A80',
  success: '#81C784',
} as const satisfies Record<keyof typeof lightColors, string>;

export type ColorKey = keyof typeof lightColors;
export type ColorScheme = 'light' | 'dark';

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 8, md: 14, lg: 20, pill: 999 } as const;
export const border = { width: 2, thin: 1 } as const;
export const shadowOffset = 3;

export const sizes = {
  /** Number circle diameter. */
  badge: 32,
  /** List and example bullet. */
  dot: 8,
  /** Speech bubble accent stripe width. */
  stripe: 4,
  /** Speech bubble tail square side. */
  tail: 14,
  /** Tail distance from the bubble's left edge. */
  tailInset: 20,
  /** Table column floor, before font scale. Columns are otherwise as wide as their longest word. */
  minColumn: 64,
  /** Default icon size. */
  icon: 20,
  /** Patrick Hand headings stop growing here. */
  maxHeadingScale: 1.5,
  /** Icons, badges and dots stop growing here. */
  maxGraphicScale: 2,
} as const;

/** Points before Dynamic Type. Patrick Hand has one weight, so its styles set no fontWeight. */
export const typeScale = {
  display: { fontFamily: fonts.hand, fontSize: 34, lineHeight: 40 },
  title: { fontFamily: fonts.hand, fontSize: 28, lineHeight: 34 },
  heading: { fontFamily: fonts.hand, fontSize: 22, lineHeight: 28 },
  body: { fontSize: 17, lineHeight: 24 },
  strong: { fontSize: 17, lineHeight: 24, fontWeight: '600' },
  callout: { fontSize: 16, lineHeight: 22 },
  caption: { fontSize: 13, lineHeight: 18 },
} as const;

const shared = { spacing, radius, border, shadowOffset, sizes, typeScale } as const;

export const themes = {
  light: { scheme: 'light', colors: lightColors, ...shared },
  dark: { scheme: 'dark', colors: darkColors, ...shared },
} as const;

export type Theme = (typeof themes)[ColorScheme];

/** Keys a part may use as a text colour. Each needs a `text` entry in CONTRAST_PAIRS. */
export const TEXT_COLOR_KEYS = [
  'ink',
  'inkMuted',
  'accentText',
  'onAccent',
  'error',
  'success',
] as const satisfies readonly ColorKey[];

export type ContrastPair = {
  readonly fg: ColorKey;
  readonly bg: ColorKey;
  readonly kind: 'text' | 'graphic';
};

const textOn = (bg: ColorKey, fgs: readonly ColorKey[]): readonly ContrastPair[] =>
  fgs.map((fg) => ({ fg, bg, kind: 'text' }));

/** Every colour combination a part can render. Jest checks each one for WCAG AA. */
export const CONTRAST_PAIRS: readonly ContrastPair[] = [
  ...textOn('paper', ['ink', 'inkMuted', 'accentText', 'error', 'success']),
  ...textOn('surface', ['ink', 'inkMuted', 'accentText', 'error', 'success']),
  ...textOn('accentSoft', ['ink', 'inkMuted', 'accentText']),
  ...textOn('accent', ['onAccent']),
  { fg: 'outline', bg: 'paper', kind: 'graphic' },
  { fg: 'outline', bg: 'surface', kind: 'graphic' },
  { fg: 'error', bg: 'surface', kind: 'graphic' },
  { fg: 'success', bg: 'surface', kind: 'graphic' },
];
