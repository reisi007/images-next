import { DependencyList, useEffect } from 'react';

export function useCancelableEffect(effect: (signal: AbortSignal) => void, deps: DependencyList) {
  useEffect(() => {
    const ac = new AbortController();
    effect(ac.signal);
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
