import { useCallback } from 'react';
import { UseFormClearErrors, UseFormSetError } from 'react-hook-form/dist/types/form';
import { FieldPath } from 'react-hook-form/dist/types/path';

export const ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL;

export type ServerError = { server?: string };
export type ManualRequest<Errors extends ServerError, Response extends unknown, Header extends Record<string, string> | undefined, Body extends object> =
  (setErrors: UseFormSetError<Errors>, clearError: UseFormClearErrors<Errors>, h?: Header, b?: Body) => Promise<Response>;

export function useManualFetch<
  FormErrors extends ServerError,
  Response extends unknown = unknown,
  Header extends Record<string, string> | undefined = undefined,
  Body extends ServerError = FormErrors,
>(
  internalUrl: string,
  method: 'post' | 'put' | 'delete' = 'post',
  defaultHeaders: HeadersInit = {},
): ManualRequest<FormErrors, Response, Header, Body> {
  return useCallback((setError: UseFormSetError<FormErrors>, clearErrors: UseFormClearErrors<FormErrors>, reuqestHeader?: Header, body?: Body) => {
    let url: string;
    if (internalUrl.startsWith('http')) {
      url = internalUrl;
    } else {
      url = `${ROOT_URL}/${internalUrl}`;
    }

    // @ts-ignore Server is a valid field path for body...
    const server: FieldPath<FormErrors> = 'server';
    clearErrors(server);

    return fetch(
      url,
      {
        method,
        body: body !== undefined ? JSON.stringify(body) : body,
        headers: {
          'Content-Type': 'application/json',
          ...defaultHeaders,
          ...reuqestHeader,
        },
      },
    )
      .then((r) => r.json(), (reason) => {
        setError(server, {
          type: 'server',
          message: JSON.stringify(reason),
        });
      });
  }, [defaultHeaders, internalUrl, method]);
}

export function useSendEmail<T extends EmailSubmittable & ServerError>() {
  return useManualFetch<T, unknown, undefined, T>('api/email.php');
}

export type EmailSubmittable = {
  email: string,
  subject: string
  message: string
};
