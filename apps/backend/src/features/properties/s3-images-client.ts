import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ENV } from '#/env.js';
import { v7 } from 'uuid';

const s3Client = new S3Client({
  region: ENV.S3_REGION,
  endpoint: ENV.S3_ENDPOINT,
  forcePathStyle: ENV.S3_FORCE_PATH_STYLE,
  credentials: {
    accessKeyId: ENV.S3_ACCESS_KEY_ID,
    secretAccessKey: ENV.S3_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = ENV.S3_IMAGES_BUCKET_NAME;
const PUBLIC_BASE_URL = `${ENV.S3_IMAGES_PUBLIC_BASE_URL}/${BUCKET_NAME}`;

export async function uploadImage(
  file: File,
  propertyId: string
): Promise<string> {
  const fileExtension = file.name.split('.').pop();
  const key = `${propertyId}/${v7()}.${fileExtension}`;

  const contentType =
    file.type && file.type.length > 0 && file.type.length <= 255
      ? file.type
      : 'application/octet-stream';

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: contentType,
  });
  await s3Client.send(command);

  return `${PUBLIC_BASE_URL}/${key}`;
}

export async function deleteImage(imagePath: string): Promise<void> {
  const key = imagePath.slice(PUBLIC_BASE_URL.length + 1);

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  await s3Client.send(command);
}
