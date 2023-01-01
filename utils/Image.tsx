import { useMemo } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { useLink } from './useLink';
import { Styleable } from '../types/Styleable';
import { ImageInfo, ImageSize } from '../types/ImageTypes';

const IMAGE_SIZES = [20];
const DEVICE_SIZES = [400, 700, 1200, 2050];

export const SORT_NEWEST_TO_OLDEST = ([_, a]: [string, ImageInfo], [, b]: [string, ImageInfo]) => -(a.metadata.created ?? '').localeCompare(b.metadata.created ?? '');

type ImageProps = {
  filename: string,
  alt?: string,
  size?: ImageSize,
  heightConstraint?: string,
  breakpoints?: ImageBreakpoints
  onClick?: () => void
} & Pick<Styleable, 'className'>;

export function Image({
  alt,
  size,
  className,
  onClick,
  filename: baseFilename,
  breakpoints,
  heightConstraint = '80vh',
}: ImageProps) {
  const filename = useLink(`${baseFilename}`)
    .replaceAll('\\', '/');

  const nextImage = useMemo(() => {
    let start = filename.lastIndexOf('/');
    if (start < 0) start = filename.lastIndexOf('\\');
    const realFilename = start > 0 ? filename.substring(start) : filename;
    const realFolderName = start > 0 ? `/${filename.substring(0, start + 1)}` : '';
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt={alt ?? realFilename.substring(1)}
        sizes={buildSizeString(breakpoints)}
        srcSet={computeSrcSet(realFolderName, realFilename)}
        decoding="async"
        className={classNames('absolute inset-0 bg-center h-full w-full bg-cover object-contain backdrop-blur-2xl', className)}
        loading="lazy"
        style={{ backgroundImage: `url(${computeFileName(realFolderName, realFilename, IMAGE_SIZES[0])})` }}
      />
    );
  }, [alt, breakpoints, className, filename]);

  const paddingTop = useImagePadding(heightConstraint, size);
  return (
    <div
      style={{ paddingTop }}
      onClick={onClick}
      className={classNames('relative overflow-hidden', className)}
    >
      {nextImage}
    </div>
  );
}

export function ImageWithText({
  text,
  url,
  ...imageProps
}: ImageProps & { text: string, url: string }) {
  return (
    <Link href={url} className="black relative">
      <Image {...imageProps} />
      <span className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-center font-logo text-xl text-white">{text}</span>
    </Link>
  );
}

function computeSrcSet(realFolderName: string, realFilename: string) {
  return DEVICE_SIZES.map((s) => `${computeFileName(realFolderName, realFilename, s)} ${s}w`)
    .join(', ');
}

function computeFileName(realFolderName: string, realFilename: string, size: number) {
  return `/images${realFolderName}/nextImageExportOptimizer${realFilename}-opt-${size}.WEBP`;
}

export type ImageBreakpoints = Record<Breakpoint, number>;

export enum Breakpoint {
  '2xl' = 1320,
  xl = 1140,
  lg = 960,
  md = 720,
  sm = 540,
  default = 0,
}

const DEFAULT_BREAKPOINTS: ImageBreakpoints = {
  [Breakpoint.default]: 1,
  [Breakpoint.sm]: 1,
  [Breakpoint.md]: 1,
  [Breakpoint.lg]: 1,
  [Breakpoint.xl]: 1,
  [Breakpoint['2xl']]: 1,
};

function buildSizeString(data?: ImageBreakpoints): string | undefined {
  if (data === undefined) return buildSizeString(DEFAULT_BREAKPOINTS);

  return Object.entries(data)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([key, cnt]) => {
      if (key === '0') return `calc(100vw / ${cnt})`;
      return `(max-width: ${key}px) calc(${key}px / ${cnt})`;
    })
    .join(',');
}

export function useImagePadding(constraint: string, imageDimensions?: ImageSize) {
  return useMemo(() => {
    if (imageDimensions === undefined || imageDimensions === null) {
      return constraint;
    }

    const {
      width,
      height,
    } = imageDimensions;
    return `min(${constraint},${100 * (height / width)}%)`;
  }, [imageDimensions, constraint]);
}
