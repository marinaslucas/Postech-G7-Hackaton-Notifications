import { SendNotificationUseCase } from "../../send-notification.usecase";
import { NotificationRepository } from "../../../../domain/repositories/notification.repository";
import { NotificationInMemoryRepository } from "src/notifications/infraestructure/database/in-memory/repositories/notification-in-memory.repository";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("SendNotificationUseCase", () => {
  let notificationRepository: NotificationRepository.Repository;
  let sendNotificationUseCase: SendNotificationUseCase;

  beforeEach(() => {
    notificationRepository = new NotificationInMemoryRepository();
    sendNotificationUseCase = new SendNotificationUseCase(notificationRepository);
    jest.clearAllMocks();
  });

  it("should create a notification and send an email successfully", async () => {
    const input = {
      destinatario: "test@example.com",
      titulo: "Bem-vindo ao sistema!",
      mensagem: "<p>Seu cadastro foi realizado com sucesso!</p>",
    };

    mockedAxios.post.mockResolvedValueOnce({ status: 200 });

    await expect(sendNotificationUseCase.execute(input)).resolves.not.toThrow();

    const storedNotifications = await notificationRepository.findAll();
    expect(storedNotifications).toHaveLength(1);
    expect(storedNotifications[0].destinatario).toEqual(input.destinatario);
    expect(storedNotifications[0].titulo).toEqual(input.titulo);
    expect(storedNotifications[0].mensagem).toEqual(input.mensagem);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "https://el-ctgi-login.cia.cloud.el.com.br/api/v1/identity/email",
      null,
      {
        params: {
          email: input.destinatario,
          titulo: input.titulo,
          corpoHtml: input.mensagem,
        },
      }
    );
  });

  it("should throw an error if email API fails", async () => {
    const input = {
      destinatario: "test@example.com",
      titulo: "Erro no envio",
      mensagem: "<p>Não foi possível enviar seu e-mail</p>",
    };

    mockedAxios.post.mockRejectedValueOnce(new Error("Falha no servidor"));

    await expect(sendNotificationUseCase.execute(input)).rejects.toThrow("Falha ao enviar e-mail");

    const storedNotifications = await notificationRepository.findAll();
    expect(storedNotifications).toHaveLength(1);
  });
});
