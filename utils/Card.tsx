import { ReactNode } from 'react';
import classNames from 'classnames';

export function Card({
  className = '',
  children,
  onClick,
}: { className?: string, children: ReactNode, onClick?: ()=> void }) {
  return <div onClick={onClick} className={classNames('flex flex-col rounded-xl border p-2', className, { 'cursor-pointer': onClick !== undefined })}>{children}</div>;
}
