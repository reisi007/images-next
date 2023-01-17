import { useEffect } from 'react';
import { push } from '@socialgouv/matomo-next';
import { useCookieConsentContext } from './Cookies';
import Markdown from './CookieBannerText.mdx';
import { ActionButton } from '../button/ActionButton';

export function ConsentBanner() {
  const [hasConsent, setConsent] = useCookieConsentContext();

  useEffect(() => {
    if (hasConsent === null) return;
    if (hasConsent) {
      push(['setCookieConsentGiven']);
    }
  }, [hasConsent]);

  return (
    <>
      {hasConsent === null && (
        <div className="fixed bottom-0 z-50  bg-white p-4 shadow-2xl">
          <Markdown />
          <div className="flex justify-evenly">
            <ActionButton onClick={() => setConsent(true)}>Cookies erlauben</ActionButton>
            <ActionButton onClick={() => setConsent(false)}>Cookies nicht erlauben</ActionButton>
          </div>
        </div>
      )}
    </>
  );
}
