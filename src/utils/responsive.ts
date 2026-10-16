export interface DesignFrame {
  width: number;
  height: number;
}

/** The reference design frame (the Welcome export, 721×1428 px at 2x). Every screen is 360 dp wide. */
export const DESIGN_FRAME: DesignFrame = { width: 360, height: 714 };

/**
 * Figma exports come at different pixel sizes and aspect ratios. This maps an export
 * to a 360-dp-wide frame, so sizes stay comparable across screens while
 * `verticalScale` follows that export's own height.
 */
export function designFrameFromExport(pixelWidth: number, pixelHeight: number): DesignFrame {
  return { width: DESIGN_FRAME.width, height: (pixelHeight * DESIGN_FRAME.width) / pixelWidth };
}

/**
 * Stops layouts from blowing up on tablets. Above every phone (the tallest,
 * 956 dp, is ×1.34) so on phones content tracks the cover-scaled artwork exactly.
 */
const MAX_SCALE_FACTOR = 1.5;

export interface Responsive {
  width: number;
  height: number;
  /** Scales a design dp value by screen width — sizes, fonts, horizontal offsets. */
  scale: (size: number) => number;
  /** Scales a design dp value by screen height — vertical placement on the screen. */
  verticalScale: (size: number) => number;
}

export function createResponsive(
  width: number,
  height: number,
  frame: DesignFrame = DESIGN_FRAME,
): Responsive {
  const widthFactor = Math.min(width / frame.width, MAX_SCALE_FACTOR);
  const heightFactor = Math.min(height / frame.height, MAX_SCALE_FACTOR);

  return {
    width,
    height,
    scale: (size) => size * widthFactor,
    verticalScale: (size) => size * heightFactor,
  };
}
