import { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import { FieldErrors } from 'react-hook-form';
import { StyledButton } from './StyledButton';
import { LoadingIndicator } from '../../rest/LoadingIndicator';

export function ActionButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className } = props;
  const classes = classNames(
    className,
    'p-2.5 font-bold rounded-2xl',
  );
  return <StyledButton {...props} className={classes} />;
}

export function SubmitButton(rawProps:Omit< ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & { isSubmitting:boolean, errors: FieldErrors<{ server:string }> }) {
  const {
    isSubmitting, errors, children, ...props
  } = rawProps;
  const error = errors.server;

  return (
    <ActionButton {...props} type="submit">
      {!isSubmitting && !error && children}
      {isSubmitting && <LoadingIndicator height="2rem" />}
      {!!error && <span className="text-error">{error.message}</span>}
    </ActionButton>
  );
}
