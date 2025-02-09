import { NotificationEntity } from '../../../../domain/entities/notification.entity';
import { notificationDataBuilder } from '../../../../domain/testing/helpers/notification-data-builder';
import { NotificationOutputMapper } from '../../notification-output';

describe('NotificationOutputMapper unit tests', () => {
  it('should convert a notification entity to output', () => {
    const fixedDate = new Date('2025-02-08T21:15:48-03:00');
    const entity = new NotificationEntity(
      notificationDataBuilder({ enviadoEm: fixedDate })
    );
    console.log(entity);
    const sut = NotificationOutputMapper.toOutput(entity);
    expect(sut).toStrictEqual({
      id: entity.id,
      destinatario: entity.destinatario,
      titulo: entity.titulo,
      mensagem: entity.mensagem,
      userId: entity.userId,
      enviadoEm: fixedDate,
    });
  });
});
