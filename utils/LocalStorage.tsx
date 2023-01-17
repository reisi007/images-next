import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string) {
  const memoryState = useState<T | null>(null);
  const [state, setState] = memoryState;

  const localStorage = typeof window !== 'undefined' ? window.localStorage : undefined;

  useEffect(() => {
    if (localStorage === undefined) return;
    const data = localStorage.getItem(key);
    if (data !== null) setState(JSON.parse(data));
  }, [key, localStorage, setState]);

  const publicSet = useCallback((newVal: T | null | undefined) => {
    if (localStorage === undefined) return;
    const val = newVal ?? null;
    if (newVal === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(newVal));
    }
    setState(val);
  }, [key, localStorage, setState]);

  return [state, publicSet] as const;
}
