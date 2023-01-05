import { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import { StyledButton } from './StyledButton';

export function FloatingActionButton({ className, ...buttonProps }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <StyledButton
      {...buttonProps}
      className={classNames('!rounded-full fixed right-4 sm:right-8 bottom-8 !p-4', className)}
    />
  );
}
