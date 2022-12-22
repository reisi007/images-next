import path from 'path';
import { promises as fs } from 'fs';
import { ExifParserFactory } from 'ts-exif-parser';
import {
  ImageInfo, JsonMetadata, Metadata, MetadataMap,
} from '../types/ImageTypes';
import { asyncMap } from '../utils/asyncFlatMap';

export const DIRECTORY_IMAGE = path.join(process.cwd(), 'public', 'images');

export async function readImageInternal(filename: string, imageFolder: string = DIRECTORY_IMAGE, metadataFolder: string = DIRECTORY_IMAGE): Promise<ImageInfo> {
  const imageFile = path.join(imageFolder, `${filename}.jpg`);
  const parser = ExifParserFactory.create(await fs.readFile(imageFile));
  parser.enableBinaryFields(true);
  parser.enableTagNames(true);
  parser.enableImageSize(true);
  parser.enableReturnTags(true);
  const exif = parser.parse();
  if (exif === undefined) throw Error(`Image ${filename} not found!`);
  const jsonFileName = path.basename(filename);
  const jsonMetadata: JsonMetadata = JSON.parse(await fs.readFile(path.join(metadataFolder, `${jsonFileName}.json`), 'utf8'));
  const metadata: Metadata = {
    ...jsonMetadata,
    created: exif.tags?.CreateDate,
  };
  return {
    size: exif.getImageSize(),
    metadata,
  };
}

export async function readMultipleImagesInternal<F extends string>(filename: Array<F>, imageFolder: string = DIRECTORY_IMAGE, metadataFolder: string = DIRECTORY_IMAGE): Promise<MetadataMap<F>> {
  const entries: Array<readonly[F, ImageInfo]> = await asyncMap(filename, async (f: F) => [f, await readImageInternal(f, imageFolder, metadataFolder)] as const);
  return Object.fromEntries(entries) as MetadataMap<F>;
}
