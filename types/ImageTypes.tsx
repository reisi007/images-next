import { ImageSize } from 'ts-exif-parser';

export type ImageInfo = { size: ImageSize, metadata: Metadata };
export type Metadata = JsonMetadata & { created: number|null };
export type JsonMetadata = { title: string, tags: Array<string> };
export type MetadataMap<F extends string> = Record<F, ImageInfo>;
