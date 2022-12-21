import {DeepPartial, SubmitHandler, useForm} from 'react-hook-form';
import {RegisterOptions} from 'react-hook-form/dist/types/validator';

export function Form<T extends object>(onSubmit: SubmitHandler<T>, initial?: DeepPartial<T>) {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<T>({defaultValues: initial});

  return <form onSubmit={handleSubmit(onSubmit)}>

  </form>;
}

export type FormConfig<T extends object> = { [K in keyof  T]: {

  }}