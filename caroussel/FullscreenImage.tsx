import { useRouter } from 'next/router';
import { ReactNode, useCallback, useMemo } from 'react';
import { ImageInfo } from '../types/ImageTypes';
import { Image } from '../utils/Image';
import { ensureString } from '../form/Url2Form';
import { NextButton, PrevButton } from './AbstractCaroussel';
import styles from './FullscreenImage.module.css';

export function FullscreenImage({ images, children }: { images: Array<[string, ImageInfo]>, children?:(filename:string) => ReactNode }) {
  const { query } = useRouter();
  const { fileName } = query;
  const fileNameValue = ensureString(fileName);
  const imageIdx = useMemo(() => (fileNameValue === undefined ? -1 : images.findIndex(([name]) => name === fileNameValue)), [fileNameValue, images]);

  if (imageIdx < 0) return <>{null}</>;
  return (
    <DisplayFullscreen images={images} imageIdx={imageIdx}>
      { (e) => children !== undefined && children(e) }
    </DisplayFullscreen>
  );
}

function DisplayFullscreen({ images, imageIdx, children }:{ images: Array<[string, ImageInfo]>, imageIdx: number, children:(filename:string) => ReactNode }) {
  const [curFilename, curInfo] = images[imageIdx];
  const { query, push, pathname } = useRouter();

  const setFileNameQuery = useCallback((idx: number) => {
    const image1 = images[idx];
    const fileName = image1[0];
    return push({
      pathname,
      query: {
        ...query,
        fileName,
      },
    }, undefined, { shallow: true });
  }, [images, pathname, push, query]);

  const lowerIndex = useCallback(() => setFileNameQuery(imageIdx - 1), [imageIdx, setFileNameQuery]);
  const higherIndex = useCallback(() => setFileNameQuery(imageIdx + 1), [imageIdx, setFileNameQuery]);
  const savedChildren = useCallback(() => children(curFilename), [children, curFilename]);
  const close = useCallback(() => push({
    pathname,
    query: {
      ...query,
      fileName: undefined,
    },
  }), [pathname, push, query]);
  return (
    <div className="fixed inset-0 z-50 h-full w-full bg-black">
      <Image filename={curFilename} alt={curInfo.metadata.title} heightConstraint="100vh" />

      {imageIdx < images.length - 1 && <PrevButton onClick={higherIndex} />}
      {imageIdx > 0 && <NextButton onClick={lowerIndex} />}
      <div className="absolute top-0 right-0 z-50 rounded-bl bg-white/20 px-4 pb-2 pt-3">
        <div className="inline-flex space-x-8">
          {savedChildren()}

          <span className={styles.actionButton} onClick={close}>
            X
          </span>

        </div>
      </div>
    </div>
  );
}
