import {
  Control, DeepPartial, FormState, Resolver, SubmitHandler, useForm,
} from 'react-hook-form';
import {
  FormEventHandler, ReactNode, useCallback, useEffect,
} from 'react';
import {
  UseFormClearErrors, UseFormGetValues, UseFormSetError, UseFormSetValue,
} from 'react-hook-form/dist/types/form';
import * as yup from 'yup';
import { FieldPath } from 'react-hook-form/dist/types/path';
import { Styleable } from '../types/Styleable';

export function Form<T extends object>({
  onSubmit,
  prefilled,
  children,
  className,
  resolver,
  style,
}: FormConfig<T> & Partial<Styleable>) {
  const {
    control,
    reset: rawReset,
    handleSubmit,
    formState,
    setValue,
    setError,
    clearErrors,
    getValues,
  } = useForm<T>({
    resolver,
    mode: 'all',
  });

  useEffect(() => {
    if (prefilled === undefined) return;
    Object.entries(prefilled)
      .forEach(([k, v]) => setValue(k as FieldPath<T>, v, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      }));
  }, [prefilled, setValue]);

  const reset = useCallback(() => {
    rawReset(undefined, {
      keepIsSubmitted: false,
      keepSubmitCount: false,
      keepDefaultValues: true,
    });
  }, [rawReset]);

  const submitHandler: SubmitHandler<T> = useCallback((data, event) => onSubmit(setError, clearErrors, data, event), [clearErrors, onSubmit, setError]);

  const onReset = useCallback(() => reset(), [reset]);
  const formEventHandler: FormEventHandler<HTMLFormElement> = useCallback((event) => {
    event?.preventDefault();
    handleSubmit(submitHandler)()
      .catch((reason) => console.error(reason));
  }, [handleSubmit, submitHandler]);
  return (
    <form className={className} style={style} onReset={onReset} onSubmit={formEventHandler}>
      {children(formState, control, getValues, setValue, reset)}
    </form>
  );
}

export type ConditionalSchema<T> = T extends string
  ? yup.StringSchema
  : T extends number
    ? yup.NumberSchema
    : T extends boolean
      ? yup.BooleanSchema
      : T extends Record<any, any>
        ? yup.AnyObjectSchema
        : T extends Array<any>
          ? yup.ArraySchema<any, any>
          : yup.AnySchema;

export type Shape<Fields> = {
  [Key in keyof Fields]: ConditionalSchema<Fields[Key]>;
};

export const PHONE_REGEXP = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

export type ExtSubmitHandler<T extends object> = (setErrors: UseFormSetError<T>, clearErrors: UseFormClearErrors<T>, data: T, event?: React.BaseSyntheticEvent, signal?: AbortSignal) => unknown;
type FormConfig<T extends object> = {
  prefilled?: DeepPartial<T>
  onSubmit: ExtSubmitHandler<T>,
  resolver: Resolver<T>,
  children: (state: FormState<T>, control: Control<T>, getValue: UseFormGetValues<T>, setValue: UseFormSetValue<T>, reset: () => void) => ReactNode,
};

export type FormChildrenProps<T extends object> = {
  formState: FormState<T>,
  control: Control<T>,

  getValue: UseFormGetValues<T>,
  setValue: UseFormSetValue<T>,
  reset: () => void

  prefilled?: DeepPartial<T>
};

export type MinimalFormChildrenProps<T extends object> = Pick<FormChildrenProps<T>, 'formState' | 'control' | 'prefilled'>;
