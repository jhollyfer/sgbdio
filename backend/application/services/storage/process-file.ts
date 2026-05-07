import type { MultipartFile } from '@fastify/multipart';
import sharp from 'sharp';

const IMAGE_MIMETYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/tiff',
];

export interface ProcessedFile {
  filename: string;
  buffer: Buffer;
  mimetype: string;
  originalName: string;
  size: number;
}

export async function processFile(
  part: MultipartFile,
  staticName?: string,
): Promise<ProcessedFile> {
  const name = staticName ?? Math.floor(Math.random() * 100000000)?.toString();
  const originalExt = part.filename?.split('.').pop();
  const buffer = await part.toBuffer();

  let finalBuffer: Buffer;
  let finalExt: string;
  let finalMimetype: string;

  if (IMAGE_MIMETYPES.includes(part.mimetype)) {
    finalBuffer = await sharp(buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    finalExt = 'webp';
    finalMimetype = 'image/webp';
  } else {
    finalBuffer = buffer;
    finalExt = originalExt!;
    finalMimetype = part.mimetype;
  }

  const filename = name.concat('.').concat(finalExt);

  return {
    filename,
    buffer: finalBuffer,
    mimetype: finalMimetype,
    originalName: part.filename,
    size: finalBuffer.length,
  };
}
