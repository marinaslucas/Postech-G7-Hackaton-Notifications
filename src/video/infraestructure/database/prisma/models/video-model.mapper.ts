import { ValidationError } from '../../../../../shared/domain/errors/validation-error';
import { VideoEntity } from '../../../../domain/entities/video.entity';
import { Video } from '@prisma/client';

export class VideoModelMapper {
  static toEntity(model: Video) {
    const { title, base64, userId, userEmail, status, createdAt, processedVideoUrl } = model;
    const entity = {
      title,
      base64,
      userId,
      userEmail,
      status,
      createdAt,
      processedVideoUrl,
    };
    try {
      return new VideoEntity(entity, model.id);
    } catch (error) {
      throw new ValidationError('Entity not loaded');
    }
  }
}
