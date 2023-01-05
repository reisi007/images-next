const ILLEGAL_CHAR_REGEX = /[:\s-]+/gm;

export function fileName2url(fileName: string) {
  return fileName.replaceAll(ILLEGAL_CHAR_REGEX, '-')
    .replaceAll('ä', 'ae')
    .replaceAll('ö', 'oe')
    .replaceAll('ü', 'ue')
    .replaceAll('Ä', 'Ae')
    .replaceAll('Ö', 'Oe')
    .replaceAll('Ü', 'Ue')
    .replaceAll('ß', 'ss');
}
