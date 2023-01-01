import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { Breakpoint, Image, ImageBreakpoints } from '../utils/Image';
import { ImageInfo } from '../types/ImageTypes';
import { Styleable } from '../types/Styleable';
import { useIntersection } from '../utils/UseIntersection';
import { FullscreenImage } from '../caroussel/FullscreenImage';

const GALLERY_IMAGE_BREAKPOINTS: ImageBreakpoints = {
  [Breakpoint.default]: 1,
  [Breakpoint.sm]: 1,
  [Breakpoint.md]: 1,
  [Breakpoint.lg]: 2,
  [Breakpoint.xl]: 2,
  [Breakpoint['2xl']]: 2,
};

export function Gallery({
  images,
  className,
  initialLoadedImages = 4,
  loadImageStepSize = 4,
}: { images: Array<[string, ImageInfo]>, initialLoadedImages?: number, loadImageStepSize?: number } & Pick<Styleable, 'className'>) {
  const [length, setLength] = useState(initialLoadedImages);
  const { push, query, pathname } = useRouter();

  const ref = useIntersection(useCallback(() => setLength((o) => Math.min(o + loadImageStepSize, images.length)), [images.length, loadImageStepSize]));

  return (
    <>
      <FullscreenImage images={images} />
      <div className={classNames('grid grid-cols-1 md:grid-cols-2', className)}>
        {images.slice(0, length)
          .map(([name, metadata]) => (
            <Image
              className="cursor-pointer"
              onClick={() => push({
                pathname,
                query: {
                  ...query,
                  fileName: name,
                },
              }, undefined, { shallow: true })}
              key={name}
              breakpoints={GALLERY_IMAGE_BREAKPOINTS}
              size={metadata.size}
              filename={name}
            />
          ))}
      </div>
      {length < images.length && <div ref={ref} />}
    </>
  );
}
