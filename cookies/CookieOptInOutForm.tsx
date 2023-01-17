import { useCookieConsentContext } from './Cookies';
import { ActionButton } from '../button/ActionButton';

export function CookieOptInOutForm() {
  const [hasConsent, setConsent] = useCookieConsentContext();

  // eslint-disable-next-line no-nested-ternary
  const curConsentText = hasConsent === null ? 'Keine Informationen zum aktuellen Consent Status gefunden' : hasConsent ? 'Aktuell wird mit Cookies getrackt' : 'Cookie Tracking ist deaktiviert';

  return (
    <>
      <p className="text-center">
        {curConsentText}
      </p>
      <div className="flex justify-evenly">
        {hasConsent !== true && <ActionButton onClick={() => setConsent(true)}>Cookies erlauben</ActionButton>}
        {hasConsent !== false && <ActionButton onClick={() => setConsent(false)}>Cookies nicht erlauben</ActionButton>}
      </div>
    </>
  );
}
