import { useEffect } from 'react';
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
