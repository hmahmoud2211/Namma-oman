import { Platform, Share } from 'react-native';

/**
 * Hands an invite to the system share sheet. Browsers without one (most desktops) copy it
 * instead, so the caller can say so. `failed` also covers the resident cancelling.
 */
export async function shareInvite(message: string, title: string) {
  if (Platform.OS === 'web') {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text: message });
        return 'shared' as const;
      } catch {
        return 'failed' as const;
      }
    }
    try {
      await navigator.clipboard.writeText(message);
      return 'copied' as const;
    } catch {
      return 'failed' as const;
    }
  }
  try {
    await Share.share({ message, title });
    return 'shared' as const;
  } catch {
    return 'failed' as const;
  }
}
