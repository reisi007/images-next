import {
  DeepPartial, FieldPath, FormState, SubmitHandler, useForm,
} from 'react-hook-form';
import { ReactNode } from 'react';
import { UseFormRegister, UseFormRegisterReturn } from 'react-hook-form/dist/types/form';

export function Form<T extends object>({
  onSubmit,
  initialValue,
  children,
}: FormConfig<T>) {
  const {
    register,
    handleSubmit,
    formState,
  } = useForm<T>({ defaultValues: initialValue });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
