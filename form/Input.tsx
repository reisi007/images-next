import { HTMLProps, useId } from 'react';
import { FieldError } from 'react-hook-form';
import classNames from 'classnames';

export function Input({
  errorMessage, label, name, className, ...props
}: HTMLProps<HTMLInputElement> & { errorMessage?: FieldError, label:string }) {
  const id = useId();
  return (
    <div className={classNames(className, 'flex flex-col')}>
      <Label id={id} label={label} required={props.required} />
      <input {...props} name={name} id={id} />
      {!!errorMessage && <span className="text-red-600">{errorMessage.message}</span>}
    </div>
  );
}

export function Textarea({
  errorMessage, label, name, className, ...props
}: HTMLProps<HTMLTextAreaElement> & { errorMessage?: FieldError, label:string }) {
  const id = useId();
  return (
    <div className={classNames(className, 'flex flex-col')}>
      <Label id={id} label={label} required={props.required} />
      <textarea {...props} name={name} id={id} />
      {!!errorMessage && <span className="text-red-600">{errorMessage.message}</span>}
    </div>
  );
}

function Label({ required, label, id } : { required?:boolean, id:string, label:string }) {
  return (
    <label htmlFor={id}>
      {label}
      {' '}
      {required ? <span className="text-error">*</span> : false}
    </label>
  );
}
