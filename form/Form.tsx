import {
  Control, DeepPartial, FormState, Resolver, SubmitHandler, useForm,
} from 'react-hook-form';
import { FormEventHandler, ReactNode, useCallback } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form/dist/types/form';
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
    reset,
    register,
    handleSubmit,
    formState,
    setValue,
  } = useForm<T>({ defaultValues: initialValue, resolver, mode: 'all' });

  const onReset = useCallback(() => reset(), [reset]);
  const formEventHandler: FormEventHandler<HTMLFormElement> = useCallback((event) => {
    event?.preventDefault();
    handleSubmit(onSubmit)()
      .catch((reason) => console.error(reason));
  }, [handleSubmit, onSubmit]);
  return (
    <form className={className} style={style} onReset={onReset} onSubmit={formEventHandler}>
      {children(formState, register, control, setValue)}
    </form>
  );
}

export const PHONE_REGEXP = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

type FormConfig<T extends object> = {
  initialValue?: DeepPartial<T>
  onSubmit: SubmitHandler<T>,
  resolver: Resolver<T>,
  children: (state: FormState<T>, register: UseFormRegister<T>, control: Control<T>, setValue: UseFormSetValue<T>) => ReactNode,
};

export type FormChildrenProps<T extends object> = { formState: FormState<T>, register: UseFormRegister<T>, control: Control<T>, setValue: UseFormSetValue<T> };
