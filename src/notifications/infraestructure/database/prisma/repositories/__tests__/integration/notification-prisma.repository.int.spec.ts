import { PrismaClient } from '@prisma/client';
import { NotificationPrismaRepository } from '../../nofitication-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundError } from '../../../../../../../shared/domain/errors/not-found-error';
import { NotificationEntity } from '../../../../../../domain/entities/notification.entity';
import { notificationDataBuilder } from '../../../../../../domain/testing/helpers/notification-data-builder';
import { DatabaseModule } from '../../../../../../../shared/infraestructure/database/database.module';
import { NotificationRepository } from '../../../../../../domain/repositories/notification.repository';
import { setupPrismaTests } from '../../../../../../../shared/infraestructure/database/prisma/testing/setup-prisma-tests';

describe('NotificationPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: NotificationPrismaRepository;
  let module: TestingModule;
  const userId = 'd4255494-f981-4d26-a2a1-35d3f5b8d36a';

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    await prismaService.user.deleteMany();
    await prismaService.user.create({
      data: {
        id: userId,
        name: 'Test User',
        email: 'a@a.com',
        password: 'password123',
        createdAt: new Date(),
      },
    });
  });

  beforeEach(async () => {
    sut = new NotificationPrismaRepository(prismaService as any);
    await prismaService.notification.deleteMany();
  });

  it('should throw error when notification not found by id', async () => {
    await expect(() => sut.findById('FakeId')).rejects.toThrow(
      new NotFoundError('Notification not found using ID FakeId')
    );
  });

  it('should find a notification by destinatario (email)', async () => {
    const entity = new NotificationEntity(
      notificationDataBuilder({
        destinatario: 'a@a.com',
        userId: 'd4255494-f981-4d26-a2a1-35d3f5b8d36a',
      })
    );
    await prismaService.notification.create({
      data: entity.toJson(),
    });
    const output = await sut.findByDestinatario('a@a.com');
    expect(output.toJson()).toStrictEqual(entity.toJson());
  });

  it('should find a notification by id', async () => {
    const entity = new NotificationEntity(notificationDataBuilder({ userId }));
    const newNotification = await prismaService.notification.create({
      data: entity.toJson(),
    });
    const output = await sut.findById(newNotification.id);
    expect(output.toJson()).toStrictEqual(entity.toJson());
  });

  it('should insert a new notification', async () => {
    const entity = new NotificationEntity(notificationDataBuilder({ userId }));
    await sut.insert(entity);

    const createdNotification = await prismaService.notification.findUnique({
      where: { id: entity.id },
    });
    expect(createdNotification).toStrictEqual(entity.toJson());
  });

  it('should find all notifications', async () => {
    const entity1 = new NotificationEntity(notificationDataBuilder({ userId }));
    const entity2 = new NotificationEntity(notificationDataBuilder({ userId }));

    await sut.insert(entity1);
    await sut.insert(entity2);
    const entities = await sut.findAll();
    expect(entities).toHaveLength(2);
    expect(entities).toContainEqual(entity1);
    expect(entities).toContainEqual(entity2);
  });

  it('should throw error when notification not found', async () => {
    await expect(() => sut.findByDestinatario('FakeEmail')).rejects.toThrow(
      new NotFoundError('Notification not found for email provided FakeEmail')
    );
  });

  it('should throw error on update when a notification is not found', async () => {
    const entity = new NotificationEntity(notificationDataBuilder({ userId }));
    await expect(() => sut.update(entity)).rejects.toThrow(
      new NotFoundError(`Notification not found using ID ${entity.id}`)
    );
  });

  it('should update a notification', async () => {
    const entity = new NotificationEntity(notificationDataBuilder({ userId }));
    await prismaService.notification.create({
      data: entity.toJson(),
    });

    entity.updateTitulo('Novo Título');
    await sut.update(entity);

    const output = await prismaService.notification.findUnique({
      where: { id: entity.id },
    });
    expect(output.titulo).toBe('Novo Título');
  });

  it('should throw error on delete when a notification is not found', async () => {
    const entity = new NotificationEntity(notificationDataBuilder({ userId }));
    await expect(() => sut.delete(entity.id)).rejects.toThrow(
      new NotFoundError(`Notification not found using ID ${entity.id}`)
    );
  });

  it('should delete a notification', async () => {
    const entity = new NotificationEntity(notificationDataBuilder({ userId }));
    await prismaService.notification.create({
      data: entity.toJson(),
    });
    await sut.delete(entity.id);

    const output = await prismaService.notification.findUnique({
      where: { id: entity.id },
    });
    expect(output).toBeNull();
  });

  describe('search method tests', () => {
    it('should apply only pagination when the other params are null', async () => {
      const createdAt = new Date();
      const entities: NotificationEntity[] = [];
      const arrange = Array(16).fill(notificationDataBuilder({ userId }));
      arrange.forEach((element, index) => {
        entities.push(
          new NotificationEntity({
            ...element,
            destinatario: `test${index}@mail.com`,
            enviadoEm: new Date(createdAt.getTime() + index),
          })
        );
      });

      await prismaService.notification.createMany({
        data: entities.map(item => item.toJson()),
      });

      const searchOutput = await sut.search(
        new NotificationRepository.SearchParams()
      );

      expect(searchOutput).toBeInstanceOf(NotificationRepository.SearchResult);
      expect(searchOutput.total).toBe(16);
      expect(searchOutput.items.length).toBe(15);
      searchOutput.items.forEach(item => {
        expect(item).toBeInstanceOf(NotificationEntity);
      });
    });

    it('should search using filter, sort and paginate', async () => {
      await prismaService.user.create({
        data: {
          id: 'fdfaf0f0-17f0-4cdd-b8d3-956bf925b1f5',
          name: 'Test User 2',
          email: 'b@b.com',
          password: 'password123',
          createdAt: new Date(),
        },
      });
      const entities: NotificationEntity[] = [];
      const entity1 = new NotificationEntity(
        notificationDataBuilder({
          destinatario: 'usera@gmail.com',
          titulo: 'Title 1',
          mensagem: 'This is a test message.',
          userId: 'd4255494-f981-4d26-a2a1-35d3f5b8d36a',
          enviadoEm: new Date(),
        })
      );

      const entity2 = new NotificationEntity(
        notificationDataBuilder({
          destinatario: 'userb@gmail.com',
          titulo: 'Title 2',
          mensagem:
            'Casso tripudio cerno magnam conturbo peccatus constans defleo velit sopor. Beatus socius angustus tabgo blanditiis subnecto fugiat bellum. Voco ago cresco advenio viridis.',
          userId: 'fdfaf0f0-17f0-4cdd-b8d3-956bf925b1f5',
          enviadoEm: new Date('2025-02-09T02:21:43.327Z'),
        })
      );

      entities.push(entity1, entity2);

      await prismaService.notification.createMany({
        data: entities.map(item => item.toJson()),
      });

      const searchOutputPage1 = await sut.search(
        new NotificationRepository.SearchParams({
          page: 1,
          perPage: 1,
          sort: 'titulo',
          sortDir: 'asc',
          filter: 'Title',
        })
      );

      expect(searchOutputPage1.items[0].toJson()).toMatchObject(
        entity1.toJson()
      );

      const searchOutputPage2 = await sut.search(
        new NotificationRepository.SearchParams({
          page: 2,
          perPage: 1,
          sort: 'titulo',
          sortDir: 'asc',
          filter: 'Title',
        })
      );

      expect(searchOutputPage2.items[0].toJson()).toMatchObject(
        entity2.toJson()
      );
    });
  });
});
