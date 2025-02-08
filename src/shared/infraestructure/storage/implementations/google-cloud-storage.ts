import { Readable } from 'stream';
import { StorageInterface } from '../storage-interface';
import * as fs from 'fs';
import { cloudStorage } from '../config/cloud-storage.config';
import { NotFoundError } from 'src/shared/domain/errors/not-found-error';
import { BadRequestError } from 'src/shared/application/errors/bad-request-error';
import * as path from 'path';

export class GoogleCloudStorageService implements StorageInterface {
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.GCLOUD_STORAGE_BUCKET;
  }

  async upload(filePath: string, destination: string): Promise<string> {
    try{
    if (!fs.existsSync(filePath)) {
      throw new BadRequestError('File not found for upload');
    }

    const bucket = cloudStorage.bucket;
    const fileName = path.basename(filePath);
    const fileUpload = bucket.file(destination + fileName);
    await bucket.upload(filePath, {
      destination: fileUpload.name,
      resumable: false,
      metadata: {
        contentType: 'application/zip',
      },
    });
    return `https://storage.googleapis.com/${this.bucketName}/${fileUpload.name}`;
  }
  catch(error){
    throw error;
  }
}

  async download(fileId: string): Promise<Readable> {
    const bucketName = this.bucketName;
    const fileName = `${fileId}.zip`;

    fs.mkdirSync('downloads', { recursive: true });

    const downloadOptions = {
      destination: './downloads/' + fileName,
    };

    const file = cloudStorage.storage.bucket(bucketName).file(fileName);
    await file.download(downloadOptions);

    const filePath = `./downloads/${fileId}.zip`;

    const fileStream = fs.createReadStream(filePath);

    fileStream.on('error', err => {
      console.error('File stream error:', err);
      throw new NotFoundError('File not found');
    });

    return fileStream;
  }

  async delete(fileName: string): Promise<void> {
    //filename ou filepath?
    const bucket = cloudStorage.bucket;
    await bucket.file(fileName).delete();
  }

  async listFiles(prefix?: string): Promise<string[]> {
    const bucket = cloudStorage.bucket
    const [files] = await bucket.getFiles({ prefix });
    return files.map(file => file.name);
  }
}
