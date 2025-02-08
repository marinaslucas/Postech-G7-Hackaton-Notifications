import { faker } from "@faker-js/faker";
import { NotificationProps } from "../../entities/notification.entity";

export function notificationDataBuilder(
  props: Partial<NotificationProps> = {}
): NotificationProps {
  return {
    destinatario: props.destinatario ?? faker.internet.email(),
    titulo: props.titulo ?? faker.lorem.sentence(3),
    mensagem: props.mensagem ?? faker.lorem.paragraph(),
    userId: props.userId ?? faker.string.uuid(),
    enviadoEm: props.enviadoEm ?? new Date(),
  };
}
