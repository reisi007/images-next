import { FieldPath } from 'react-hook-form';
import { UseFormSetValue } from 'react-hook-form/dist/types/form';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export type CommonFormFields = Record<'email' | 'firstName' | 'lastName' | 'tel', string> & { server?:string };

export function useSetValue<T extends CommonFormFields>(label: FieldPath<CommonFormFields>, setValue: UseFormSetValue<T>) {
  const { query } = useRouter();
  const queryValue = query[label];

  useEffect(() => {
    const value = ensureString(queryValue);
    if (value === undefined) return;
    // @ts-ignore label: I have no idea how to type this correctly, CommonFormFields are a subset of T -> ok
    setValue(label, value, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [label, queryValue, setValue]);
}

export function ensureString(input: string | Array<string> | undefined): string | undefined {
  if (Array.isArray(input)) return input.join(',');
  return input;
}
