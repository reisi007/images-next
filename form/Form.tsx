import {
  Control, DeepPartial, FormState, Resolver, SubmitHandler, useForm,
} from 'react-hook-form';
import { FormEventHandler, ReactNode, useCallback } from 'react';
import {
  UseFormClearErrors, UseFormRegister, UseFormSetError, UseFormSetValue,
} from 'react-hook-form/dist/types/form';
import * as yup from 'yup';
import { Styleable } from '../types/Styleable';

export function Form<T extends object>({
  onSubmit,
  initialValue,
  children,
  className,
  resolver,
  style,
}: FormConfig<T> & Partial<Styleable>) {
  const {
    control,
    reset: rawReset,
    register,
    handleSubmit,
    formState,
    setValue,
    setError,
    clearErrors,
  } = useForm<T>({
    defaultValues: initialValue,
    resolver,
    mode: 'all',
  });

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
      {children(formState, register, control, setValue, reset)}
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

export type ExtSubmitHandler<T extends object> = (setErrors: UseFormSetError<T>, clearErrors: UseFormClearErrors<T>, data: T, event?: React.BaseSyntheticEvent) => unknown;
type FormConfig<T extends object> = {
  initialValue?: DeepPartial<T>
  onSubmit: ExtSubmitHandler<T>,
  resolver: Resolver<T>,
  children: (state: FormState<T>, register: UseFormRegister<T>, control: Control<T>, setValue: UseFormSetValue<T>, reset: () => void) => ReactNode,
};

export type FormChildrenProps<T extends object> = {
  formState: FormState<T>,
  register: UseFormRegister<T>,
  control: Control<T>,
  setValue: UseFormSetValue<T>,
  reset: () => void
};
