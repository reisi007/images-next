import { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import { StyledButton } from './StyledButton';

export function FloatingActionButton({ className, ...buttonProps }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <StyledButton {...buttonProps} className={classNames('!rounded-full fixed right-8 bottom-8 px-4 py-4', className)} />;
}
