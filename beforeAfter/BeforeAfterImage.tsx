import classNames from 'classnames';
import {
  CSSProperties, Dispatch, MouseEventHandler, SetStateAction, TouchEventHandler, useCallback, useEffect, useState,
} from 'react';
import { ImageInfo, ImageSize } from '../types/ImageTypes';
import {
  Breakpoint, Image, ImageBreakpoints, SORT_NEWEST_TO_OLDEST, useImagePadding,
} from '../utils/Image';
import { Styleable } from '../types/Styleable';
import { useSendMatomoEvent } from '../matomo/Matomo';

type BeforeAfterImageProps = {
  data: ImageInfo,
  name: string,
  size: ImageSize,
  breakpoints: ImageBreakpoints,
  heightConstraint?: string,
  onChange?: () => void
} & Partial<Styleable>;

export function BeforeAfterImage({
  className,
  style,
  data,
  name,
  breakpoints,
  size,
  onChange,
  heightConstraint = '80vh',
}: BeforeAfterImageProps) {
  const paddingTop = useImagePadding(heightConstraint, data.size);
  const [widthPercentage, setWidthPercentage] = useState(50);
  const beforeWidth = `${(100 / widthPercentage) * 100}%`;

  const onClick: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setWidthPercentage((x * 100) / e.currentTarget.offsetWidth);
    if (onChange !== undefined) onChange();
  }, [onChange]);

  const onTouch: TouchEventHandler<HTMLDivElement> = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.changedTouches[0].clientX - rect.left;
    setWidthPercentage((x * 100) / e.currentTarget.offsetWidth);
    if (onChange !== undefined) onChange();
  }, [onChange]);

  const myStyle: CSSProperties = style ?? { paddingTop };
  return (
    <div
      style={myStyle}
      onClick={onClick}
      onMouseMove={onClick}
      onTouchMove={onTouch}
      className={classNames('group relative cursor-grab overflow-hidden left-1/2 -translate-x-1/2', className)}
    >
      <div className="absolute inset-0 block w-full overflow-hidden">
        <div className={classNames(className, 'w-full h-full')}>
          <Image heightConstraint={heightConstraint} alt={data.metadata.title} size={size} breakpoints={breakpoints} className={classNames(className, 'overflow-visible')} filename={name} />
        </div>
      </div>
      <div className="absolute inset-0 z-10 block overflow-hidden" style={{ width: `${widthPercentage}%` }}>
        <div style={{ width: beforeWidth }} className={classNames('h-full', className)}>
          <Image heightConstraint={heightConstraint} alt={`Original von ${data.metadata.title}`} size={size} breakpoints={breakpoints} className={className} filename={`${name}o`} />
        </div>
      </div>
      <div
        className={classNames(
          'before:block before:fixed before:inset-y-0 before:-top-10 before:w-0.5 before:bg-white before:h-1/2 before:ml-4',
          'after:block after:fixed after:bottom-0 after:w-0.5 after:bg-white after:h-1/2 after:ml-4',
          'z-20 absolute top-1/2 text-center align-middle -ml-9 -mt-10 h-10 w-10 pointer-events-none text-white rounded-full',
          'shadow bg-transparent border-2',
        )}
        style={{ left: `calc(${widthPercentage}% + 1rem)` }}
      >
        <span
          className="mt-[-0.1875rem] inline-flex h-10 items-center text-lg tracking-[0.25rem]"
        >
          ◂▸
        </span>
      </div>
    </div>
  );
}

const BEFORE_AFTER_BREAKPOINTS: ImageBreakpoints = {
  [Breakpoint.default]: 1,
  [Breakpoint.sm]: 1,
  [Breakpoint.md]: 1,
  [Breakpoint.lg]: 2,
  [Breakpoint.xl]: 3,
  [Breakpoint['2xl']]: 3,
};

export function MultipleBeforeAfterImages<T extends string>({ data }: { data: Record<T, ImageInfo> }) {
  const entries: Array<[string, ImageInfo]> = Object.entries(data);
  const [lastChangedImage, setLastChangedImage] = useState<string | null>(null);
  const sendEvent = useSendMatomoEvent<'beforeAfter'>();

  useEffect(() => {
    if (lastChangedImage !== null) sendEvent('beforeAfter', 'slide', lastChangedImage);
  }, [lastChangedImage, sendEvent]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {entries
        .sort(SORT_NEWEST_TO_OLDEST) // Sort from newest to oldest
        .map(([name, info]) => <SingleBeforeAfterImages key={name} name={name} info={info} setLastChangedImage={setLastChangedImage} />)}
    </div>
  );
}

function SingleBeforeAfterImages({ name, info, setLastChangedImage }:{ name:string, info:ImageInfo, setLastChangedImage: Dispatch<SetStateAction<string | null>> }) {
  return <BeforeAfterImage className="h-full" size={info.size} onChange={() => { setLastChangedImage(name); }} name={name} breakpoints={BEFORE_AFTER_BREAKPOINTS} data={info} />;
}
