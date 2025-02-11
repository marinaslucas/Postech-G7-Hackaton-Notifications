import { SendNotificationUseCase } from './send-notification.usecase';

interface VideoProcessingMessage {
  videoId: string;
  status: string;
  email: string;
}

export class SubNotificationUseCase {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase
  ) {}

  async execute(message: VideoProcessingMessage): Promise<void> {
    if (message.status === 'failed') {
      await this.sendNotificationUseCase.execute({
        destinatario: message.email,
        titulo: 'Falha no Processamento do Vídeo',
        mensagem: `
          <p>Olá,</p>
          <p>Houve uma falha no processamento do seu vídeo (ID: ${message.videoId}).</p>
          <p>Por favor, tente fazer o upload novamente. Se o problema persistir, entre em contato com o suporte.</p>
          <p>Atenciosamente,<br>Equipe de Processamento de Vídeos</p>
        `,
      });
    }
  }
}
