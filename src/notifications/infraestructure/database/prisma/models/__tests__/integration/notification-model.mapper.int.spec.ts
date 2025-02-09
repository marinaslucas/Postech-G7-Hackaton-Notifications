import { PrismaClient, Notification } from '@prisma/client';
import { NotificationModelMapper } from '../../notification-model.mapper';
import { ValidationError } from '../../../../../../../shared/domain/errors/validation-error';
import { NotificationEntity } from '../../../../../../domain/entities/notification.entity';
import { setupPrismaTests } from '../../../../../../../shared/infraestructure/database/prisma/testing/setup-prisma-tests';

describe('NotificationModelMapper integration tests', () => {
  const enviadoEm = new Date('2024-10-19T03:24:00');
  let prismaService: PrismaClient;
  let props: any;

  beforeAll(async () => {
    setupPrismaTests();
    prismaService = new PrismaClient();
    await prismaService.$connect();

    await prismaService.user.deleteMany({
      where: {
        id: 'd4255494-f981-4d26-a2a1-35d3f5b8d36a',
      },
    });
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    await prismaService.notification.deleteMany();

    props = {
      id: 'd4255494-f981-4d26-a2a1-35d3f5b8d36a',
      destinatario: 'user@example.com',
      titulo: 'Test Title',
      mensagem: 'Test Message',
      enviadoEm: enviadoEm,
      userId: 'd4255494-f981-4d26-a2a1-35d3f5b8d36a',
    };
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should throw error when notification model is invalid', async () => {
    const model: Notification = Object.assign(props, { titulo: null });
    expect(() => NotificationModelMapper.toEntity(model)).toThrowError(
      ValidationError
    );
  });

  it('should convert a notification model to a notification entity', async () => {
    await prismaService.user.create({
      data: {
        id: 'd4255494-f981-4d26-a2a1-35d3f5b8d36a',
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        createdAt: new Date(),
      },
    });

    const model: Notification = await prismaService.notification.create({
      data: props,
    });

    const sut = NotificationModelMapper.toEntity(model);

    expect(sut).toBeInstanceOf(NotificationEntity);
    expect(sut.toJson()).toStrictEqual({
      ...props,
      enviadoEm,
      userId: props.userId,
    });
  });
});
