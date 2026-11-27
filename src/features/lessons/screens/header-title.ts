/**
 * Whether the native header shows the page title (spec 0004, AC-3): only once the bottom
 * of the page's top heading has scrolled under the header. Unmeasured means hidden.
 */
export const isHeaderTitleVisible = (offsetY: number, headingBottom: number | undefined): boolean =>
  headingBottom !== undefined && offsetY >= headingBottom;
