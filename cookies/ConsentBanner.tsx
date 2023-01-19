import { useCookieConsentContext } from './Cookies';
import Markdown from './CookieBannerText.mdx';
import { ActionButton } from '../button/ActionButton';

export function ConsentBanner() {
  const [hasConsent, setConsent] = useCookieConsentContext();

  return (
    <>
      {typeof window !== 'undefined' && hasConsent === null && (
        <div className="fixed inset-x-0 bottom-0 z-50 bg-white p-4 shadow-2xl">
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
