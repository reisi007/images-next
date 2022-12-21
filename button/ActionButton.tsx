import { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import { StyledButton } from './StyledButton';

type Props = ButtonHTMLAttributes<HTMLButtonElement> ;

export function ActionButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className } = props;
  const classes = classNames(
    className,
    'p-2.5 font-bold rounded-2xl',
  );
  return <StyledButton {...props} className={classes} />;
}
