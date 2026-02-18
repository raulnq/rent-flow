import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ENV } from '#/env.js';
import { v7 } from 'uuid';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: ENV.S3_ENDPOINT,
  forcePathStyle: ENV.S3_FORCE_PATH_STYLE,
  credentials: {
    accessKeyId: ENV.S3_ACCESS_KEY_ID,
    secretAccessKey: ENV.S3_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = ENV.S3_BUCKET_NAME;

export async function uploadFile(
  file: File,
  applicationId: string
): Promise<string> {
  const fileExtension = file.name.split('.').pop();
  const filePath = `${applicationId}/${v7()}.${fileExtension}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filePath,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
  });
  await s3Client.send(command);

  return filePath;
}
