import {
  useCallback, useEffect, useMemo, useState,
} from 'react';

export function useLocalStorage<T extends object>(key: string) {
  const [state, setState] = useLocalStorageString(key);

  const publicSet = useCallback((newVal: T | null | undefined) => {
    const next = newVal ?? null;
    if (next === null) setState(null);
    else setState(JSON.stringify(next));
  }, [setState]);

  const publicState = useMemo(() => (state === null ? null : JSON.parse(state)), [state]);

  return [publicState, publicSet] as const;
}

export function useLocalStorageString(key: string) {
  const [state, setState] = useState<string | null>(null);

  const localStorage = typeof window !== 'undefined' ? window.localStorage : undefined;

  useEffect(() => {
    if (localStorage === undefined) return;
    const data = localStorage.getItem(key);
    if (data !== null) setState(data);
  }, [key, localStorage, setState]);

  const publicSet = useCallback((newVal: string | null | undefined) => {
    if (localStorage === undefined) return;
    const val = newVal ?? null;
    if (typeof newVal !== 'string') {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, newVal);
    }
    setState(val);
  }, [key, localStorage, setState]);

  return [state, publicSet] as const;
}
