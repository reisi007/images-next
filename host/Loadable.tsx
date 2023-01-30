import { SWRResponse } from 'swr';
import { ReactNode } from 'react';
import classNames from 'classnames';
import { LoadingIndicator } from '../utils/LoadingIndicator';

export function Loadable<Data>({ data, error, children }: SWRResponse<Data, Error> & { children: (date:Data) => ReactNode }):JSX.Element {
  if (error) return <DisplayError error={error} />;
  if (data === undefined) return <LargeLoadingIndicator />;
  return <>{children(data)}</>;
}

export function DisplayError({ error, className }:{ error: { message:string }, className?:string }) {
  return (
    <div className={classNames('text-error', className)}>
      {error.message}
    </div>
  );
}

export function LargeLoadingIndicator() {
  return <LoadingIndicator className="my-8" height="20rem" />;
}
