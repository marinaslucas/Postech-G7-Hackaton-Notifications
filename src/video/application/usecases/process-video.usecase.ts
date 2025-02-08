import { VideoRepository } from '../../domain/repositories/video.repository';
import { UseCase as DefaultUseCase } from '../../../shared/application/providers/usecases/use-case';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver';
import { VideoOutput, VideoOutputMapper } from '../dtos/video-output';
import { NotFoundError } from '../../../shared/domain/errors/not-found-error';
import { GoogleCloudStorageService } from '../../../shared/infraestructure/storage/implementations/google-cloud-storage';
import { ServerError } from '../../../shared/domain/errors/server-error';

export namespace ProcessVideoUseCase {
  export type Input = {
    id: string;
  };

  export type Output = VideoOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private videoRepository: VideoRepository.Repository, private storageService: GoogleCloudStorageService) {}

    private createTempDir(id: string): string {
      const tempDir = path.join(process.cwd(), 'processed-videos', id);
            
      try {
        if (fs.existsSync(tempDir)) {
          console.log(`Directory already exists: ${tempDir}`);
        } else {
          fs.mkdirSync(tempDir, { recursive: true });
          console.log(`Created directory: ${tempDir}`);
        }
      } catch (error) {
        console.error(`Failed to create directory: ${tempDir}`, error);
        throw error; 
      }
      
      return tempDir;
    }

    private async processVideo(videoPath: string, outputDir: string): Promise<string[]> {
    
      return new Promise((resolve, reject) => {
        console.log(`Processing video at path: ${videoPath}`);
        console.log(`Output directory for screenshots: ${outputDir}`);
    
        ffmpeg(videoPath)
          .on('filenames', (filenames) => {
            console.log('Screenshots filenames:', filenames);
            resolve(filenames.map((filename) => path.join(outputDir, filename)));
          })
          .on('end', function() {
            console.log('FFmpeg processing finished');
          })
          .on('error', function(err) {
            console.error('FFmpeg error:', err);
            reject(err);
          })
          .screenshots({
            count: 30,
            folder: outputDir,
            filename: 'screenshot-%i.png',
          });
      });
    }
    
    
    private async createZipFile(screenshots: string[], outputDir: string): Promise<string> {
      const zipPath = path.join(outputDir, 'screenshots.zip');
      
      if (fs.existsSync(zipPath)) {
        fs.unlinkSync(zipPath); 
        
        console.log(`Deleted existing zip file: ${zipPath}`);
      }
    
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
    
      return new Promise((resolve, reject) => {
        output.on('close', () => resolve(zipPath));
        archive.on('error', (err) => reject(err));
    
        archive.pipe(output);
        screenshots.forEach((screenshot) => {
          archive.file(screenshot, { name: path.basename(screenshot) });
        });
        archive.finalize();
      });
    }

    // private cleanup(tempDir: string): void {
    //   if (fs.existsSync(tempDir)) {
    //     try {
    //       const files = fs.readdirSync(tempDir);
    //       if (files.length > 0) {
    //         console.log(`Cleaning up directory: ${tempDir}. Contents: ${files.join(', ')}`);
    //         files.forEach(file => {
    //           const filePath = path.join(tempDir, file);
    //           let attempts = 0;
    //           const maxAttempts = 10; // Increase max attempts
    //           const delayBetweenAttempts = 200; // Increase delay between attempts
    
    //           const removeFile = () => {
    //             try {
    //               fs.unlinkSync(filePath);
    //               console.log(`Removed file: ${filePath}`);
    //             } catch (error) {
    //               if (error.code === 'EBUSY' && attempts < maxAttempts) {
    //                 attempts++;
    //                 console.log(`File is busy, retrying... Attempt ${attempts}`);
    //                 setTimeout(removeFile, delayBetweenAttempts); // Retry after increased delay
    //               } else {
    //                 console.error(`Failed to remove file: ${filePath}`, error);
    //               }
    //             }
    //           };
    
    //           removeFile();
    //         });
    //       }
    
    //       // Now remove the directory itself
    //       fs.rmSync(tempDir, { recursive: true, force: true });
    //       console.log(`Removed directory: ${tempDir}`);
    //     } catch (error) {
    //       console.error(`Failed to clean up directory: ${tempDir}`, error);
    //     }
    //   }
    // }

    // private cleanup(tempDir: string): void {
    //   if (fs.existsSync(tempDir)) {
    //     fs.rmSync(tempDir, { recursive: true, force: true });
    //   }
    // }

    async execute(input: Input): Promise<Output> {
      const { id } = input;


      const video = await this.videoRepository.findById(id);
      if (!video) {
        throw new NotFoundError('Video not found');
      }

      const tempDir = this.createTempDir(id);

      const videoPath = path.join(tempDir, 'video.mp4');

      try {
        const videoBuffer = Buffer.from(video.base64, 'base64');
        fs.writeFileSync(videoPath, videoBuffer);
        const screenshots = await this.processVideo(videoPath, tempDir);

        const zipPath = await this.createZipFile(screenshots, tempDir);

        const zipUrl = await this.storageService.upload(zipPath, 'processed-');
        video.updateStatus('completed');
        video.updateVideoUrl(zipUrl);
        await this.videoRepository.update(video);
        // this.cleanup(tempDir);
        return VideoOutputMapper.toOutput(video);
      } catch (error) {
        // this.cleanup(tempDir);
        video.updateStatus('failed');
        await this.videoRepository.update(video);

        //ENVIAR MENSAGEM PARA CLIENTE

        throw new ServerError('Failed to process video');
      }
    }
  }
}

