import { createContext, type RefObject } from 'react';
import type { View } from 'react-native';

/**
 * The screen's background view, for glass surfaces to blur.
 * Android's BlurView can only blur a registered target; iOS and web blur whatever is behind.
 */
export const BlurTargetContext = createContext<RefObject<View | null> | null>(null);
