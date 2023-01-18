import { useEffect } from 'react';
import { init, push } from '@socialgouv/matomo-next';
import { useCookieConsentContext } from './Cookies';

export function Matomo({
  url = 'https://analytics.reisinger.pictures/',
  siteId,
}: { url?: string, siteId: `${number}` }) {
  const [hasConsent] = useCookieConsentContext();

  useEffect(() => {
    init({
      url,
      siteId,
    });
    push(['requireCookieConsent']);
  }, [siteId, url]);

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
