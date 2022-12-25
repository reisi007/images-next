import {
  Control, DeepPartial, FormState, Resolver, SubmitHandler, useForm,
} from 'react-hook-form';
import { ReactNode, useCallback } from 'react';
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
  return (
    <form className={className} style={style} onReset={onReset} onSubmit={handleSubmit(onSubmit)}>
      {children(formState, register, control, setValue)}
    </form>
  );
}

type FormConfig<T extends object> = {
  initialValue: DeepPartial<T>
  onSubmit: SubmitHandler<T>,
  resolver: Resolver<T>,
  children: (state: FormState<T>, register: UseFormRegister<T>, control: Control<T>, setValue: UseFormSetValue<T>) => ReactNode,
};

export type FormChildrenProps<T extends object> = { formState: FormState<T>, register: UseFormRegister<T>, control: Control<T>, setValue: UseFormSetValue<T> };
