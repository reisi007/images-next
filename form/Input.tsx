import { HTMLProps, ReactNode, useId } from 'react';
import {
  Control, Controller, FieldError, FieldPath, FieldPathValue,
} from 'react-hook-form';
import classNames from 'classnames';
import { FiveStarRating } from '../rating/FiveStarRating';
import { ReisishotIconSizes } from '../utils/ReisishotIcons';
import { Styleable } from '../types/Styleable';

type FieldProperties<T extends object, P extends FieldPath<T>> = { errorMessage?: FieldError, label: ReactNode, control: Control<T>, name: FieldPathValue<T, P> };

type HtmlInputNoUnwantedProperties<T extends object, P extends FieldPath<T>> = Omit<HTMLProps<HTMLInputElement>, 'ref' | 'name'> & { name: P };

export function Input<T extends object, P extends FieldPath<T> >({
  errorMessage,
  label,
  name: fieldName,
  className,
  control,
  ...props
}: HtmlInputNoUnwantedProperties<T, P> & FieldProperties<T, P>) {
  const id = useId();
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({
        field: {
          value,
          onChange,
          ref,
        },
      }) => (
        <div className={classNames(className, 'flex flex-col')}>
          <Label id={id} label={label} required={props.required} />
          <input {...props} ref={ref} value={value ?? ''} onChange={onChange} id={id} />
          {!!errorMessage && <span className="text-red-600">{errorMessage.message}</span>}
        </div>
      )}
    />
  );
}

export function CheckboxInput<T extends object, P extends FieldPath<T>= FieldPath<T>>({
  errorMessage,
  label,
  name: fieldName,
  className,
  control,
  ...props
}: Omit<HtmlInputNoUnwantedProperties<T, P>, 'type' | 'label'> & FieldProperties<T, P>) {
  const id = useId();
  return (
    <Controller<T, P>
      name={fieldName}
      control={control}
      render={({
        field: {
          value,
          onChange,
          ref,
        },
      }) => (
        <div className={classNames(className, 'flex flex-col')}>
          <Label id={id} className="ml-2" label={label} required={props.required}>
            <input {...props} ref={ref} value={value} onChange={onChange} type="checkbox" id={id} />
          </Label>
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
}: Omit<HTMLProps<HTMLTextAreaElement>, 'name' | 'ref'> & { name: P } & FieldProperties<T, P>) {
  const id = useId();

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({
        field: {
          value,
          onChange,
          ref,
        },
      }) => (
        <div className={classNames(className, 'flex flex-col')}>
          <Label id={id} label={label} required={props.required} />
          <textarea {...props} ref={ref} id={id} value={value ?? ''} onChange={onChange} />
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
  children,
  className,
}: { required?: boolean, id: string, label: ReactNode, children?:ReactNode } & Pick<Styleable, 'className'>) {
  return (
    <label className="inline-flex" htmlFor={id}>
      {children}
      <span className={className}>
        {label}
        {required ? <span className="text-error">&nbsp;*</span> : false}
      </span>
    </label>
  );
}
