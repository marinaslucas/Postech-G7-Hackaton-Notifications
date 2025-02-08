import { PrismaClient } from "@prisma/client";
import { NotificationPrismaRepository } from "../../nofitication-prisma.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundError } from "../../../../../../../shared/domain/errors/not-found-error";
import { NotificationEntity } from "../../../../../../domain/entities/notification.entity";
import { notificationDataBuilder } from "../../../../../../domain/testing/helpers/notification-data-builder";
import { DatabaseModule } from "../../../../../../../shared/infraestructure/database/database.module";
import { NotificationRepository } from "../../../../../../domain/repositories/notification.repository";

describe("NotificationPrismaRepository integration tests", () => {
  const prismaService = new PrismaClient();
  let sut: NotificationPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
  });

  beforeEach(async () => {
    sut = new NotificationPrismaRepository(prismaService as any);
    await prismaService.notification.deleteMany();
  });

  it("should throw error when notification not found by id", async () => {
    await expect(() => sut.findById("FakeId")).rejects.toThrow(
      new NotFoundError("Notification not found using ID FakeId")
    );
  });

  it("should find a notification by destinatario (email)", async () => {
    const entity = new NotificationEntity(
      notificationDataBuilder({ destinatario: "a@a.com" })
    );
    await prismaService.notification.create({
      data: entity.toJson(),
    });
    const output = await sut.findByDestinatario("a@a.com");
    expect(output.toJson()).toStrictEqual(entity.toJson());
  });

  it("should find a notification by id", async () => {
    const entity = new NotificationEntity(notificationDataBuilder({}));
    const newNotification = await prismaService.notification.create({
      data: entity.toJson(),
    });
    const output = await sut.findById(newNotification.id);
    expect(output.toJson()).toStrictEqual(entity.toJson());
  });

  it("should insert a new notification", async () => {
    const entity = new NotificationEntity(notificationDataBuilder({}));
    await sut.insert(entity);

    const createdNotification = await prismaService.notification.findUnique({
      where: { id: entity.id },
    });
    expect(createdNotification).toStrictEqual(entity.toJson());
  });

  it("should find all notifications", async () => {
    const entity1 = new NotificationEntity(notificationDataBuilder({}));
    const entity2 = new NotificationEntity(notificationDataBuilder({}));

    await sut.insert(entity1);
    await sut.insert(entity2);
    const entities = await sut.findAll();
    expect(entities).toHaveLength(2);
    expect(entities).toContainEqual(entity1);
    expect(entities).toContainEqual(entity2);
  });

  it("should throw error when notification not found", async () => {
    await expect(() => sut.findByDestinatario("FakeEmail")).rejects.toThrow(
      new NotFoundError("Notification not found for email provided FakeEmail")
    );
  });

  it("should throw error on update when a notification is not found", async () => {
    const entity = new NotificationEntity(notificationDataBuilder({}));
    await expect(() => sut.update(entity)).rejects.toThrow(
      new NotFoundError(`Notification not found using ID ${entity.id}`)
    );
  });

  it("should update a notification", async () => {
    const entity = new NotificationEntity(notificationDataBuilder({}));
    await prismaService.notification.create({
      data: entity.toJson(),
    });

    entity.updateTitulo("Novo Título");
    await sut.update(entity);

    const output = await prismaService.notification.findUnique({
      where: { id: entity.id },
    });
    expect(output.titulo).toBe("Novo Título");
  });

  it("should throw error on delete when a notification is not found", async () => {
    const entity = new NotificationEntity(notificationDataBuilder({}));
    await expect(() => sut.delete(entity.id)).rejects.toThrow(
      new NotFoundError(`Notification not found using ID ${entity.id}`)
    );
  });

  it("should delete a notification", async () => {
    const entity = new NotificationEntity(notificationDataBuilder({}));
    await prismaService.notification.create({
      data: entity.toJson(),
    });
    await sut.delete(entity.id);

    const output = await prismaService.notification.findUnique({
      where: { id: entity.id },
    });
    expect(output).toBeNull();
  });

  describe("search method tests", () => {
    it("should apply only pagination when the other params are null", async () => {
      const createdAt = new Date();
      const entities: NotificationEntity[] = [];
      const arrange = Array(16).fill(notificationDataBuilder({}));
      arrange.forEach((element, index) => {
        entities.push(
          new NotificationEntity({
            ...element,
            destinatario: `test${index}@mail.com`,
            createdAt: new Date(createdAt.getTime() + index),
          })
        );
      });

      await prismaService.notification.createMany({
        data: entities.map((item) => item.toJson()),
      });

      const searchOutput = await sut.search(new NotificationRepository.SearchParams());

      expect(searchOutput).toBeInstanceOf(NotificationRepository.SearchResult);
      expect(searchOutput.total).toBe(16);
      expect(searchOutput.items.length).toBe(15);
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(NotificationEntity);
      });
    });

    it("should search using filter, sort and paginate", async () => {
      const createdAt = new Date();
      const entities: NotificationEntity[] = [];
      const arrange = ["Promoção", "Urgente", "PROMO", "Atenção", "Desconto"];
      arrange.forEach((element, index) => {
        entities.push(
          new NotificationEntity({
            ...notificationDataBuilder({ titulo: element }),
          })
        );
      });

      await prismaService.notification.createMany({
        data: entities.map((item) => item.toJson()),
      });

      const searchOutputPage1 = await sut.search(
        new NotificationRepository.SearchParams({
          page: 1,
          perPage: 2,
          sort: "titulo",
          sortDir: "asc",
          filter: "PROMO",
        })
      );

      expect(searchOutputPage1.items[0].toJson()).toMatchObject(
        entities[0].toJson()
      );
      expect(searchOutputPage1.items[1].toJson()).toMatchObject(
        entities[2].toJson()
      );

      const searchOutputPage2 = await sut.search(
        new NotificationRepository.SearchParams({
          page: 2,
          perPage: 2,
          sort: "titulo",
          sortDir: "asc",
          filter: "PROMO",
        })
      );

      expect(searchOutputPage2.items[0].toJson()).toMatchObject(
        entities[2].toJson()
      );
    });
  });
});
