export type ImageSize = { width: number, height: number };
export type ImageInfo = { size: ImageSize, metadata: Metadata };
export type Metadata = JsonMetadata & { created: string | null };
export type JsonMetadata = { title: string, tags: Array<string> };
export type MetadataMap<F extends string> = Record<F, ImageInfo>;

const EXIF_TAGS = [
  'CAMERA_MAKE',
  'CAMERA_MODEL',
  'LENS_MODEL',
  'FOCAL_LENGTH',
  'CREATION_DATETIME',
  'APERTURE',
  'SHUTTER_SPEED',
  'ISO',
];

type ExifTagsType = typeof EXIF_TAGS[number];
export type ExifInfo = Record<ExifTagsType, string | undefined>;
export type JsonExifMetadata = { width: number, height: number, exif: ExifInfo };
