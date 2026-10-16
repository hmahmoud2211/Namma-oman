import { useCallback } from 'react';

import { HardHatIcon } from '@/components/icons/HardHatIcon';
import { commonStrings } from '@/constants/strings';
import { useLocale } from '@/hooks/useLocale';
import { useToast } from '@/hooks/useToast';

/**
 * For buttons whose screen or feature isn't built yet: tells the user it is under development
 * instead of doing nothing. Replace the call with the real action once it exists.
 */
export function useUnderDevelopment(): () => void {
  const { showToast } = useToast();
  const { locale } = useLocale();

  return useCallback(() => {
    const copy = commonStrings[locale];
    showToast({
      title: copy.underDevelopmentTitle,
      body: copy.underDevelopmentBody,
      Icon: HardHatIcon,
    });
  }, [locale, showToast]);
}
