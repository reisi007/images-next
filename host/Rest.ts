import { useCallback } from 'react';
import { UseFormClearErrors, UseFormSetError } from 'react-hook-form/dist/types/form';
import { FieldPath } from 'react-hook-form/dist/types/path';

export const ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL;

export type ServerError = { server?: string };
export type ManualRequest<Body extends object, Errors extends ServerError> = (b: Body, setErrors: UseFormSetError<Errors>, clearError: UseFormClearErrors<Errors>) => Promise<unknown>;

export function useManualFetch<Body extends ServerError, Error extends ServerError>(internalUrl: string, method: 'post' | 'put' | 'delete' = 'post'): ManualRequest<Body, Error> {
  return useCallback((body: Body, setError: UseFormSetError<Error>, clearErrors: UseFormClearErrors<Error>) => {
    let url: string;
    if (internalUrl.startsWith('http')) {
      url = internalUrl;
    } else {
      url = `${ROOT_URL}/${internalUrl}`;
    }

    // @ts-ignore Server is a valid field path for body...
    const server: FieldPath<Error> = 'server';
    clearErrors(server);

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
      .then((r) => r, (reason) => {
        setError(server, {
          type: 'server',
          message: JSON.stringify(reason),
        });
      });
  }, [internalUrl, method]);
}

export function useSendEmail<T extends EmailSubmittable & ServerError>() {
  return useManualFetch<T, T>('https://api.reisinger.pictures/email.php');
}

export type EmailSubmittable = {
  email: string,
  subject: string
  message: string
};
