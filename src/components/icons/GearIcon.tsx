import Svg, { Circle, Path } from 'react-native-svg';

import type { IconProps } from './types';

const TEETH = 8;
const OUTER = 10.2;
const INNER = 7.6;
/** Half-widths of each tooth, in radians, at its tip and at its root. */
const TIP_HALF = 0.2;
const ROOT_HALF = 0.3;

/** Outline of an 8-tooth cog centred in the 24-unit box. */
const GEAR_PATH = (() => {
  const point = (radius: number, angle: number) =>
    `${(12 + radius * Math.cos(angle)).toFixed(2)} ${(12 + radius * Math.sin(angle)).toFixed(2)}`;
  const step = (Math.PI * 2) / TEETH;
  const segments: string[] = [];
  for (let i = 0; i < TEETH; i += 1) {
    const centre = i * step - Math.PI / 2;
    segments.push(
      `${i === 0 ? 'M' : 'L'}${point(INNER, centre - ROOT_HALF)}`,
      `L${point(OUTER, centre - TIP_HALF)}`,
      `L${point(OUTER, centre + TIP_HALF)}`,
      `L${point(INNER, centre + ROOT_HALF)}`,
      `A${INNER} ${INNER} 0 0 1 ${point(INNER, centre + step - ROOT_HALF)}`,
    );
  }
  return `${segments.join('')}Z`;
})();

/** Cog wheel (MEP works). */
export function GearIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={GEAR_PATH} stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Circle cx={12} cy={12} r={3.2} stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}
