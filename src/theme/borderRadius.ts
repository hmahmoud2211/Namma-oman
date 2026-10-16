/** Corner radii in design dp (scale with `scale()`), measured from the Figma exports. */
export const borderRadius = {
  /** Text fields and icon tiles. */
  control: 7.7,
  /** Frosted-glass cards. */
  card: 18,
  pill: 9999,
} as const;

export type BorderRadius = typeof borderRadius;
