import { useCallback } from 'react';
import { UseFormClearErrors, UseFormSetError } from 'react-hook-form/dist/types/form';
import { FieldPath } from 'react-hook-form/dist/types/path';

export const ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL;

export type ServerError = { server?: string };
export type ManualRequest<Errors extends ServerError, Response extends unknown, Header extends Record<string, string> | undefined, Body extends object> =
  (setErrors: UseFormSetError<Errors>, clearError: UseFormClearErrors<Errors>, header?: Header, body?: Body) => Promise<Response>;

export type ManualStringRequest<Errors extends ServerError, Header extends Record<string, string> | undefined, Body extends object> =
  (setErrors: UseFormSetError<Errors>, clearError: UseFormClearErrors<Errors>, header?: Header, body?: Body) => Promise<string>;

export function useManualFetchString<FormErrors extends ServerError, Header extends Record<string, string> | undefined = undefined, Body extends object = object>(
  internalUrl: string,
  method: 'post' | 'put' | 'delete' = 'post',
  defaultHeaders: HeadersInit = {},
): ManualStringRequest<FormErrors, Header, Body> {
  return useCallback((setError: UseFormSetError<FormErrors>, clearErrors: UseFormClearErrors<FormErrors>, requestHeader?: Header, body?: Body) => {
    const url = `${ROOT_URL}/${internalUrl}`;

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
          ...requestHeader,
        },
      },
    )
      .then(async (r) => {
        if (r.ok) {
          if (r.status === 204) return Promise.resolve();
          return r.text();
        }

        const text = stripHtml(await r.text());
        setError(server, {
          type: 'server',
          message: text,
        });
        const error = new Error(text);
        error.name = r.status.toString(10);
        return Promise.reject(error);
      }, (reason) => {
        setError(server, {
          type: 'server',
          message: JSON.stringify(reason),
        });
        return reason;
      });
  }, [defaultHeaders, internalUrl, method]);
}

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
  const action = useManualFetchString<FormErrors, Header, Body>(internalUrl, method, defaultHeaders);
  return useCallback((setErrors, clearError, header, body) => action(setErrors, clearError, header, body)
    .then((e) => {
      try {
        return JSON.parse(e);
      } catch (ex) {
        return e;
      }
    }), [action]);
}

export function useSendEmail<T extends EmailSubmittable & ServerError>() {
  return useManualFetch<T, unknown, undefined, T>('api/email.php');
}

export type EmailSubmittable = {
  email: string,
  subject: string
  message: string
};

export function stripHtml(html: string) {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}
