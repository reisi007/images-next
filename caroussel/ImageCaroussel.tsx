import classNames from 'classnames';
import { CSSProperties, useMemo } from 'react';
import { AbstractCaroussel } from './AbstractCaroussel';
import { ImageInfo, MetadataMap } from '../types/ImageTypes';
import { Styleable } from '../types/Styleable';
import { Image, useImagePadding } from '../utils/Image';

export function ImageCaroussel<T extends string>({
  metadataMap,
  intervalMs = 7500,
  className,
  style,
  heightConstraint = '80vh',
}: { intervalMs?: number, metadataMap: MetadataMap<T>, heightConstraint? :string } & Partial<Styleable>) {
  const classes = classNames(className, 'rounded-lg');
  const items = useMemo(() => Object.keys(metadataMap) as Array<T>, [metadataMap]);
  const string = Object.keys(metadataMap)[0] as T;
  const containerImageMetadata = metadataMap[string];
  const paddingTop = useImagePadding(heightConstraint, containerImageMetadata?.size);
  const myStyle: CSSProperties = useMemo(() => {
    if (style === undefined) {
      return { paddingTop };
    }
    return style;
  }, [paddingTop, style]);

  const containerSize = style === myStyle ? undefined : containerImageMetadata;

  return (
    <AbstractCaroussel<T> style={myStyle} intervalMs={intervalMs} className={classes} items={items}>
      {(cur) => {
        const metadata = metadataMap[cur];
        return <CurImage heightConstraint={heightConstraint} className={classes} containerSize={containerSize} filename={cur} imageInfo={metadata} />;
      }}
    </AbstractCaroussel>
  );
}

function CurImage({
  imageInfo,
  containerSize,
  filename,
  className,
  heightConstraint,
}: { imageInfo: ImageInfo, heightConstraint: string, containerSize?: ImageInfo, filename: string, className: string }) {
  return (
    <Image
      heightConstraint={heightConstraint}
      className={className}
      alt={imageInfo?.metadata?.title}
      size={(containerSize ?? imageInfo).size}
      filename={filename}
    />
  );
}
