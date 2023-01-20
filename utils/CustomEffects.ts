import { DependencyList, useEffect, useRef } from 'react';

export function useCancelableEffect(effect: (signal: AbortSignal) => void, deps: DependencyList) {
  useEffect(() => {
    const ac = new AbortController();
    effect(ac.signal);
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useOnce(effect: () => void) {
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
