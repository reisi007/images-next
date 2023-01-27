import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ParsedUrlQuery } from 'querystring';

export type CommonFormFields = Record<'email' | 'firstName' | 'lastName' | 'tel', string> & { server?: string };

export type RequiredFormFields = { dsgvo: boolean };

export function ensureString(input: string | Array<string> | undefined): string | undefined {
  if (Array.isArray(input)) return input.join(',');
  return input;
}

export function usePrefilledValue<T extends CommonFormFields>(): Partial<T> | undefined {
  const { query } = useRouter();
  return useMemo(() => extractFromQuery<T>(query, 'lastName', 'email', 'firstName', 'tel'), [query]);
}

function extractFromQuery<T extends object>(query: ParsedUrlQuery, ...args: Array<keyof T>): Partial<T> | undefined {
  if (Object.keys(query).length === 0) return undefined;
  const strings = Object.fromEntries(
    args.map((e) => {
      const queryElement = query[e.toString()];
      return [e, typeof queryElement === 'string' || typeof queryElement === 'undefined' ? queryElement : queryElement.toString()];
    }),
  );
  return strings as Partial<T>;
}
