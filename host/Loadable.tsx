import { SWRResponse } from 'swr';
import { ReactNode } from 'react';
import { LoadingIndicator } from '../utils/LoadingIndicator';

export function Loadable<Data>({ data, error, children }: SWRResponse<Data, Error> & { children: (date:Data) => ReactNode }):JSX.Element {
  if (error) return <DisplayError error={error} />;
  if (data === undefined) return <LargeLoadingIndicator />;
  return <>{children(data)}</>;
}

function DisplayError({ error }:{ error: Error }) {
  return (
    <div className="text-error">
      {error.message}
    </div>
  );
}

export function LargeLoadingIndicator() {
  return <LoadingIndicator className="my-8" height="20rem" />;
}
