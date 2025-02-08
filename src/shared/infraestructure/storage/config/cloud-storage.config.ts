import { Storage } from '@google-cloud/storage';

const BUCKET_NAME = process.env.GCLOUD_STORAGE_BUCKET;

const storage = process.env.NODE_ENV === "test" || !process.env.NODE_ENV
  ? new Storage({
      projectId: process.env.GCLOUD_PROJECT_ID,
      keyFilename: process.env.GCLOUD_KEY_FILENAME,
    })
  : new Storage({
      projectId: process.env.GCLOUD_PROJECT_ID,
      credentials: JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY), // JSON direto da secret
    });


export const cloudStorage = {
  storage,
  bucket: storage.bucket(BUCKET_NAME),
};
