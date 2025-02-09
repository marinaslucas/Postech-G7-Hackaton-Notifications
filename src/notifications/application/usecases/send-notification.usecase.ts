import axios from 'axios';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import {
  NotificationOutput,
  NotificationOutputMapper,
} from '../dtos/notification-output';

interface Input {
  destinatario: string;
  titulo: string;
  mensagem: string;
  userId?: string;
}

export type Output = NotificationOutput;

export class SendNotificationUseCase {
  private readonly EMAIL_API_URL =
    'https://el-ctgi-login.cia.cloud.el.com.br/api/v1/identity/email';

  constructor(
    private notificationRepository: NotificationRepository.Repository
  ) {}

  async execute(input: Input): Promise<Output> {
    const notification = new NotificationEntity({
      destinatario: input.destinatario,
      titulo: input.titulo,
      mensagem: input.mensagem,
      userId: input.userId,
    });

    await this.notificationRepository.insert(notification);

    try {
      await axios.post(this.EMAIL_API_URL, null, {
        params: {
          email: input.destinatario,
          titulo: input.titulo,
          corpoHtml: input.mensagem,
        },
      });

      return NotificationOutputMapper.toOutput(notification);
    } catch (error) {
      console.error(
        '❌ Erro ao enviar e-mail:',
        error.response?.data || error.message
      );
      throw new Error('Falha ao enviar e-mail');
    }
  }
}
