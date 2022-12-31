import { ReactNode } from 'react';

export function Card({
  className = '',
  children,
}: { className?: string, children: ReactNode }) {
  return <div className={`flex flex-col rounded-xl border p-2 ${className}`}>{children}</div>;
}
