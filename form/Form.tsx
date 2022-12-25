import {
  DeepPartial, FieldPath, FormState, SubmitHandler, useForm,
} from 'react-hook-form';
import { ReactNode } from 'react';
import { UseFormRegister, UseFormRegisterReturn } from 'react-hook-form/dist/types/form';
import { Styleable } from '../types/Styleable';

export function Form<T extends object>({
  onSubmit,
  initialValue,
  children,
  className,
  style,
}: FormConfig<T> & Partial<Styleable>) {
  const {
    register,
    handleSubmit,
    formState,
  } = useForm<T>({ defaultValues: initialValue });

  return (
    <form className={className} style={style} onSubmit={handleSubmit(onSubmit)}>
      {children(formState, register)}
    </form>
  );
}

type FormConfig<T extends object> = {
  initialValue: DeepPartial<T>
  onSubmit: SubmitHandler<T>,
  children: (state: FormState<T>, register: UseFormRegister<T>) => ReactNode
};

export type RegisterProps<T extends object, N extends FieldPath<T>> = UseFormRegisterReturn<N>;
