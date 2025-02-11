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
    const notifications = {
      failed: {
        titulo: 'Falha no Processamento do Vídeo',
        mensagem: `
          <p>Olá,</p>
          <p>Houve uma falha no processamento do seu vídeo (ID: ${message.videoId}).</p>
          <p>Por favor, tente fazer o upload novamente. Se o problema persistir, entre em contato com o suporte.</p>
          <p>Atenciosamente,<br>Equipe de Processamento de Vídeos</p>
        `,
      },
      processing: {
        titulo: 'Vídeo em Processamento',
        mensagem: `
          <p>Olá,</p>
          <p>Seu vídeo (ID: ${message.videoId}) está sendo processado.</p>
          <p>Você receberá uma notificação assim que o processamento for concluído.</p>
          <p>Atenciosamente,<br>Equipe de Processamento de Vídeos</p>
        `,
      },
      completed: {
        titulo: 'Processamento de Vídeo Concluído',
        mensagem: `
          <p>Olá,</p>
          <p>O processamento do seu vídeo (ID: ${message.videoId}) foi concluído com sucesso!</p>
          <p>Você já pode acessá-lo em nossa plataforma.</p>
          <p>Atenciosamente,<br>Equipe de Processamento de Vídeos</p>
        `,
      },
    };

    const notification = notifications[message.status];
    if (notification) {
      await this.sendNotificationUseCase.execute({
        destinatario: message.email,
        titulo: notification.titulo,
        mensagem: notification.mensagem,
      });
    }
  }
}
