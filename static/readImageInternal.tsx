import path from 'path';
import { promises as fs } from 'fs';
import {
  ImageInfo, JsonExifMetadata, JsonMetadata, Metadata, MetadataMap,
} from '../types/ImageTypes';
import { asyncMap } from '../utils/asyncFlatMap';

export const DIRECTORY_IMAGE = path.join(process.cwd(), 'public', 'images');

export async function readImageInternal(filename: string, metadataFolder: string = DIRECTORY_IMAGE): Promise<ImageInfo> {
  const jsonFileName = path.basename(filename);
  const {
    exif,
    width,
    height,
  }: JsonExifMetadata = JSON.parse(await fs.readFile(path.join(metadataFolder, `${jsonFileName}.exif.json`), 'utf8'));
  const jsonMetadata: JsonMetadata = JSON.parse(await fs.readFile(path.join(metadataFolder, `${jsonFileName}.json`), 'utf8'));

  const metadata: Metadata = {
    ...jsonMetadata,
    created: exif.CREATION_DATETIME ?? null,
  };
  return {
    size: {
      width,
      height,
    },
    metadata,
  };
}

export async function readMultipleImagesInternal<F extends string>(filename: Array<F>, metadataFolder: string = DIRECTORY_IMAGE): Promise<MetadataMap<F>> {
  const entries: Array<readonly[F, ImageInfo]> = await asyncMap(filename, async (f: F) => [f, await readImageInternal(f, metadataFolder)] as const);
  return Object.fromEntries(entries) as MetadataMap<F>;
}
