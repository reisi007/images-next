import { useEffect, useState } from 'react';
import { useCookieConsentContext } from './Cookies';
import Markdown from './CookieBannerText.mdx';
import { ActionButton } from '../button/ActionButton';

export function ConsentBanner() {
  const [hasConsent, setConsent] = useCookieConsentContext();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <>
      {isVisible && hasConsent === null && (
        <div className="fixed inset-x-0 bottom-0 z-50 overflow-y-auto bg-white p-4 shadow-2xl">
          <Markdown />
          <div className="grid grid-cols-1 justify-evenly space-y-2 md:grid-cols-3 md:space-y-0 md:space-x-2">
            <ActionButton className="bg-primary text-onPrimary" onClick={() => setConsent(true)}>Cookies erlauben</ActionButton>
            <ActionButton onClick={() => setConsent(false)}>Cookies nicht erlauben</ActionButton>
            <ActionButton onClick={() => setVisible(false)}>Ignorieren</ActionButton>
          </div>
        </div>
      )}
    </>
  );
}
