import {
  useCallback, useEffect, useMemo, useState,
} from 'react';

export function useLocalStorage<T extends object>(key: string): readonly [NonNullable<T> | undefined | null, (newVal: NonNullable<T> | null) => void] {
  const [state, setState] = useLocalStorageString(key);

  const publicSet = useCallback((newVal: NonNullable<T> | null) => {
    const next = newVal ?? null;
    if (next === null) {
      setState(null);
    } else {
      setState(JSON.stringify(next));
    }
  }, [setState]);

  const publicState = useMemo(() => (state === null || state === undefined ? state : JSON.parse(state)), [state]);

  return [publicState, publicSet];
}

export function useLocalStorageString(key: string): readonly [string | null | undefined, (newVal: string | null) => void] {
  const [state, setState] = useState<string | null | undefined>(undefined);

  const localStorage = typeof window !== 'undefined' ? window.localStorage : undefined;

  useEffect(() => {
    if (localStorage === undefined) return;
    const data = localStorage.getItem(key);
    setState(data);
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
