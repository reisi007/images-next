import {
  ReactNode, useCallback, useEffect, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import { Styleable } from '../types/Styleable';
import styles from './AbstractCaroussel.module.css';

export function AbstractCaroussel<I extends string | { id: string | number }>(
  {
    children,
    className,
    style,
    items,
    intervalMs,
  }: {
    items: Array<I>,
    intervalMs?: number,
    children: (cur: I) => ReactNode
  } & Partial<Styleable>,
) {
  const [curIndex, setCurIndex] = useState(0);
  const nextItem = useCallback(() => {
    setCurIndex((old) => {
      const next = old - 1;
      return next < 0 ? items.length - 1 : next;
    });
  }, [items.length]);

  const prevItem = useCallback(() => {
    setCurIndex((old) => {
      const next = old + 1;
      return next >= items.length ? 0 : next;
    });
  }, [items.length]);

  const itemsToDisplay = useMemo((): Array<I> => {
    let prevIndex = curIndex - 1;
    if (prevIndex < 0) prevIndex = items.length - 1;
    let nextIndex = curIndex + 1;
    if (nextIndex >= items.length) nextIndex = 0;
    return [
      items[prevIndex],
      items[curIndex],
      items[nextIndex],
    ].filter(onlyUnique);
  }, [curIndex, items]);

  useEffect(() => {
    const interval = intervalMs === undefined || intervalMs <= 0 ? undefined : setInterval(nextItem, intervalMs);
    return () => {
      if (interval !== undefined) clearInterval(interval);
    };
  }, [intervalMs, curIndex, nextItem]);

  return (
    <div style={style} className={classNames('relative inset-0', className)}>
      {itemsToDisplay.map((cur, idx) => {
        const key = typeof cur === 'string' ? cur : cur.id;
        return (
          <div
            key={key}
            className={classNames(
              'motion-reduce:transition-none transition-all duration-1000 delay-300 ease-in-out absolute top-1/2 left-1/2 block w-full -translate-x-1/2 -translate-y-1/2',
              { hidden: idx === 1 && itemsToDisplay.length !== 1 },
            )}
          >
            {children(cur)}
          </div>
        );
      })}
      <PrevButton onClick={nextItem} />
      <NextButton onClick={prevItem} />
    </div>
  );
}

export function PrevButton({ onClick }:{ onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="absolute top-0 left-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none focus:ring-0"
    >
      <span className={classNames('group', styles.prevNextButton)}>
        <svg aria-hidden="true" className="h-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="sr-only">Previous</span>
      </span>
    </button>
  );
}

export function NextButton({ onClick }:{ onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="absolute top-0 right-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none focus:ring-0"
    >
      <span className={classNames('group', styles.prevNextButton)}>
        <svg aria-hidden="true" className="h-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span className="sr-only">Next</span>
      </span>
    </button>
  );
}

function onlyUnique<I>(value: I, index: number, self: Array<I>) {
  return self.indexOf(value) === index;
}
