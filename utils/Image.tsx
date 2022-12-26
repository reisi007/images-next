import { useMemo } from 'react';
import classNames from 'classnames';
import { useLink } from './useLink';
import { Styleable } from '../types/Styleable';
import { ImageInfo, ImageSize } from '../types/ImageTypes';

const IMAGE_SIZES = [20];
const DEVICE_SIZES = [400, 700, 1200, 2050];

export const SORT_NEWEST_TO_OLDEST = ([_, a]: [string, ImageInfo], [, b]: [string, ImageInfo]) => -(a.metadata.created ?? '').localeCompare(b.metadata.created ?? '');

export function Image({
  alt,
  size,
  className,
  filename: baseFilename,
  breakpoints,
  moreHeightConstraints,
}: {
  filename: string,
  alt?: string,
  size?: ImageSize,
  moreHeightConstraints?: string,
  breakpoints?: ImageBreakpoints
} & Pick<Styleable, 'className'>) {
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
        alt={alt ?? realFilename.substring(0)}
        sizes={buildSizeString(breakpoints)}
        srcSet={computeSrcSet(realFolderName, realFilename)}
        decoding="async"
        className={classNames('absolute inset-0 bg-center h-full w-full bg-cover object-contain backdrop-blur-2xl', className)}
        loading="lazy"
        style={{ backgroundImage: `url(${computeFileName(realFolderName, realFilename, IMAGE_SIZES[0])})` }}
      />
    );
  }, [alt, breakpoints, className, filename]);

  const paddingTop = useImagePadding(size, moreHeightConstraints);
  return (
    <div
      style={{ paddingTop }}
      className={classNames('relative overflow-hidden', className)}
    >
      {nextImage}
    </div>
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
      if (key === '0') return `${100 / cnt}vw`;
      return `(max-width: ${key}px) ${Number(key) / cnt}px`;
    })
    .join(',');
}

const DEFAULT_IMAGE_HEIGHT = '80vh';

export function useImagePadding(imageDimensions?: ImageSize, moreConstraints?: string) {
  return useMemo(() => {
    if (imageDimensions === undefined || imageDimensions === null) {
      return DEFAULT_IMAGE_HEIGHT;
    }

    const {
      width,
      height,
    } = imageDimensions;
    if (moreConstraints !== undefined) return `min(${DEFAULT_IMAGE_HEIGHT},${100 * (height / width)}%,${moreConstraints})`;
    return `min(${DEFAULT_IMAGE_HEIGHT},${100 * (height / width)}%)`;
  }, [imageDimensions, moreConstraints]);
}
