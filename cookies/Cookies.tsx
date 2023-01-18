import React, {
  createContext, ReactNode, useCallback, useContext, useMemo,
} from 'react';
import { useLocalStorageString } from '../utils/LocalStorage';

function setNotPossible() {
  console.error('Setting the cookie was called, but no provider found....');
}

type CookieConsentContextType = [boolean | null, (next?: null | boolean) => void];
const baseContext = createContext<CookieConsentContextType>([false, setNotPossible]);
baseContext.displayName = 'Cookie Consent Context';

export function CookieConsentContext({ children }: { children: ReactNode }) {
  const [rawValue, rawSetValue] = useLocalStorageString('cookieConsent');
  const setValue = useCallback((v?: boolean | null) => {
    rawSetValue(v === null || v === undefined ? null : v.toString());
  }, [rawSetValue]);
  const value = useMemo(() => (rawValue === null ? null : rawValue === 'true' || rawValue === '"true"'), [rawValue]);
  return (
    <baseContext.Provider value={useMemo(() => [value, setValue], [value, setValue])}>
      {children}
    </baseContext.Provider>
  );
}

export function useCookieConsentContext() {
  return useContext(baseContext);
}
