import type { ColorTokens } from './colors';

export interface ShadowToken {
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  color: string;
}

/** Shadows in design dp. Built from the active colors so each theme gets its own. */
export function createShadows(colors: ColorTokens) {
  return {
    buttonGlow: { offsetX: 0, offsetY: 0, blurRadius: 7, color: colors.buttonPrimaryGlow },
    // The design's Sign In button casts a soft dark shadow onto the glass, not a glow.
    emeraldButtonShadow: { offsetX: 0, offsetY: 1, blurRadius: 14, color: colors.buttonEmeraldShadow },
    glassCardGlow: { offsetX: 0, offsetY: 0, blurRadius: 10, color: colors.glassCardGlow },
    glassTileGlow: { offsetX: 0, offsetY: 0, blurRadius: 5, color: colors.glassTileGlow },
  } satisfies Record<string, ShadowToken>;
}

export type Shadows = ReturnType<typeof createShadows>;

/** Converts a design-dp shadow token into a scaled RN `boxShadow` value. */
export function toBoxShadow(token: ShadowToken, scale: (size: number) => number) {
  return [
    {
      offsetX: scale(token.offsetX),
      offsetY: scale(token.offsetY),
      blurRadius: scale(token.blurRadius),
      color: token.color,
    },
  ];
}
