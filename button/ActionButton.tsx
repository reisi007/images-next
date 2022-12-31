import { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import { StyledButton } from './StyledButton';
import { LoadingIndicator } from '../../rest/LoadingIndicator';
import { ManualRequestStatus } from '../host/Rest';

export function ActionButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className } = props;
  const classes = classNames(
    className,
    'p-2.5 font-bold rounded-2xl',
  );
  return <StyledButton {...props} className={classes} />;
}

export function SubmitButton(rawProps:Omit< ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & { status: ManualRequestStatus }) {
  const {
    status, children, ...props
  } = rawProps;
  const { isSubmitting, error } = status;

  return (
    <ActionButton {...props} type="submit">
      {!isSubmitting && !error && children}
      {isSubmitting && <LoadingIndicator />}
      {!!error && JSON.stringify(error)}
    </ActionButton>
  );
}
