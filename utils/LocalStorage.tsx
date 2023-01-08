import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage<T extends object>(key:string) {
  const memoryState = useState<T | null>(null);
  const [state, setState] = memoryState;

  const localStorage = typeof window !== 'undefined' ? window.localStorage : undefined;

  useEffect(() => {
    if (localStorage === undefined) return;
    const data = localStorage.getItem(key);
    if (data !== null) setState(JSON.parse(data));
  }, [key, localStorage, setState]);

  const publicSet = useCallback((newVal:T | null | undefined) => {
    if (localStorage === undefined) return;
    if (newVal === null || newVal === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(newVal));
    setState(newVal ?? null);
  }, [key, localStorage, setState]);

  return [state, publicSet] as const;
}
