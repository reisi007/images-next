import { useCallback, useState } from 'react';

export const ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL;

export type ManualRequest<Body > = {
  isSubmitting: boolean,
  error?: unknown
  action: (b: Body) => Promise<unknown>
};

export type SyncManualRequest<Body> = Omit<ManualRequest<object>, 'action'> & { action:(b: Body) => void };

export type ManualRequestStatus = Omit<ManualRequest<object>, 'action'>;

export function useManualFetch<Body extends object>(internalUrl: string, method: 'post' | 'put' | 'delete' = 'post'): ManualRequest<Body> {
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState<unknown | undefined>(undefined);

  const action = useCallback((body:Body) => {
    let url: string;
    if (internalUrl.startsWith('http')) {
      url = internalUrl;
    } else {
      url = `${ROOT_URL}/${internalUrl}`;
    }

    setSubmitting(true);
    setError(undefined);

    return fetch(
      url,
      {
        method,
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then((_) => {
        setSubmitting(false);
        setError(undefined);
      }, (reason) => {
        setSubmitting(false);
        setError(reason);
      });
  }, [internalUrl, method]);

  return {
    action,
    isSubmitting,
    error,
  };
}

export function useSendEmail() {
  return useManualFetch('https://api.reisinger.pictures/email.php');
}

export type EmailSubmittable = {
  email: string,
  subject: string
  message: string
};
