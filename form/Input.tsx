import { HTMLProps } from 'react';
import { FieldError } from 'react-hook-form';

export function Input({
  errorMessage, name, className, ...props
}: HTMLProps<HTMLInputElement> & { errorMessage?: FieldError }) {
  return (
    <div className={className}>
      <input name={name} {...props} />
      {!!errorMessage && <span className="text-red-600">{errorMessage.message}</span>}
    </div>
  );
}
