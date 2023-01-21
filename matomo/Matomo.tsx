import { useCallback, useEffect } from 'react';
import { init, push } from '@socialgouv/matomo-next';
import { useCookieConsentContext } from './Cookies';
import { useOnce } from '../utils/CustomEffects';

export function Matomo({
  url = 'https://analytics.reisinger.pictures/',
  siteId,
}: { url?: string, siteId: `${number}` }) {
  const [hasConsent] = useCookieConsentContext();

  useOnce(() => {
    init({
      url,
      siteId,
    });
    push(['requireCookieConsent']);
  });

  useEffect(() => {
    if (hasConsent === null) return;
    if (hasConsent) {
      push(['setCookieConsentGiven']);
    } else {
      push(['forgetCookieConsentGiven']);
    }
  }, [hasConsent]);

  return <>{false}</>;
}

type Category = 'gallery' | 'beforeAfter';
type CategoryType<C extends Category> =
  C extends 'gallery' ? 'imageView' :
    (C extends 'beforeAfter' ? 'slide' :
      never
    );

type UseSendEvent<C extends Category> = (
  category: C,
  type: CategoryType<C>,
  data: string,
) => void;

export function useSendMatomoEvent<C extends Category = Category>(): UseSendEvent<C> {
  return useCallback((category, type, data) => {
    push(['trackEvent', category, `${category}_${type}`, data]);
  }, []);
}
