import { HTMLProps, useId } from 'react';
import {
  Control, Controller, FieldError, FieldPath, FieldPathValue,
} from 'react-hook-form';
import classNames from 'classnames';
import { FiveStarRating } from '../rating/FiveStarRating';
import { ReisishotIconSizes } from '../utils/ReisishotIcons';
import { Styleable } from '../types/Styleable';

type FieldProperties<T extends object, P extends FieldPath<T>> = { errorMessage?: FieldError, label: string, control: Control<T>, name: FieldPathValue<T, P> };

export function Input<T extends object, P extends FieldPath<T> >({
  errorMessage,
  label,
  name: fieldName,
  className,
  control,
  ...props
}: HTMLProps<HTMLInputElement> & FieldProperties<T, P>) {
  const id = useId();
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({
        field: {
          value,
          onChange,
        },
      }) => (
        <div className={classNames(className, 'flex flex-col')}>
          <Label id={id} label={label} required={props.required} />
          <input {...props} value={value ?? ''} onChange={onChange} id={id} />
          {!!errorMessage && <span className="text-red-600">{errorMessage.message}</span>}
        </div>
      )}
    />
  );
}

export function Textarea<T extends object, P extends FieldPath<T>>({
  errorMessage,
  label,
  name: fieldName,
  control,
  className,
  ...props
}: HTMLProps<HTMLTextAreaElement> & FieldProperties<T, P>) {
  const id = useId();

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({
        field: {
          value,
          onChange,
        },
      }) => (
        <div className={classNames(className, 'flex flex-col')}>
          <Label id={id} label={label} required={props.required} />
          <textarea {...props} id={id} value={value ?? ''} onChange={onChange} />
          {!!errorMessage && <span className="text-red-600">{errorMessage.message}</span>}
        </div>
      )}
    />
  );
}

export function FiveStarInput<T extends object, P extends FieldPath<T>>({
  errorMessage,
  label,
  name: fieldName,
  starSize,
  className,
  control,
  ...props
}: FieldProperties<T, P> & Pick<Styleable, 'className'> & { starSize: ReisishotIconSizes, required?:boolean }) {
  const id = useId();
  return (
    <Controller<T, P>
      name={fieldName}
      control={control}
      render={({
        field: {
          value,
          onChange,
        },
      }) => (
        <div className={classNames(className, 'flex flex-col')}>
          <Label id={id} label={label} required={props.required} />
          <FiveStarRating className="inline-flex" starSize={starSize} value={value ?? 0} onChange={onChange} />
          {!!errorMessage && <span className="text-red-600">{errorMessage.message}</span>}
        </div>
      )}
    />
  );
}

function Label({
  required,
  label,
  id,
}: { required?: boolean, id: string, label: string }) {
  return (
    <label htmlFor={id}>
      {label}
      {' '}
      {required ? <span className="text-error">*</span> : false}
    </label>
  );
}
