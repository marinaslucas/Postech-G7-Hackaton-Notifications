import axios from "axios";
import { NotificationEntity } from "../../domain/entities/notification.entity";
import { NotificationRepository } from "../../domain/repositories/notification.repository";

interface SendNotificationInput {
  destinatario: string;
  titulo: string;
  mensagem: string;
  userId?: string;
}

export class SendNotificationUseCase {
  private readonly EMAIL_API_URL = "https://el-ctgi-login.cia.cloud.el.com.br/api/v1/identity/email";

  constructor(private notificationRepository: NotificationRepository.Repository) {}

  async execute(input: SendNotificationInput): Promise<void> {
    // Criando a entidade de notificação
    const notification = new NotificationEntity({
      destinatario: input.destinatario,
      titulo: input.titulo,
      mensagem: input.mensagem,
      userId: input.userId,
    });

    // Salvando a notificação no repositório
    await this.notificationRepository.insert(notification);

    try {
      // Chamando a API externa para enviar o e-mail
      await axios.post(this.EMAIL_API_URL, null, {
        params: {
          email: input.destinatario,
          titulo: input.titulo,
          corpoHtml: input.mensagem,
        },
      });

      console.log(`✅ E-mail enviado para ${input.destinatario}`);
    } catch (error) {
      console.error("❌ Erro ao enviar e-mail:", error.response?.data || error.message);
      throw new Error("Falha ao enviar e-mail");
    }
  }
}
