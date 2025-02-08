import { PrismaClient, Notification } from "@prisma/client";
import { NotificationModelMapper } from "../../notification-model.mapper";
import { ValidationError } from "../../../../../../../shared/domain/errors/validation-error";
import { NotificationEntity } from "../../../../../../domain/entities/notification.entity";
import { setupPrismaTests } from "../../../../../../../shared/infraestructure/database/prisma/testing/setup-prisma-tests";

describe("NotificationModelMapper integration tests", () => {
  let prismaService: PrismaClient;
  let props: any;

  beforeAll(async () => {
    //setupPrismaTests();
    prismaService = new PrismaClient();
    await prismaService.$connect();
  });

  beforeEach(async () => {
    await prismaService.notification.deleteMany();
    props = {
      id: "d4255494-f981-4d26-a2a1-35d3f5b8d36a",
      destinatario: "user@example.com",
      titulo: "Test Title",
      mensagem: "Test Message",
      userId: "123e4567-e89b-12d3-a456-426614174000",
      enviadoEm: new Date(),
    };
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it("should throw error when notification model is invalid", async () => {
    const model: Notification = Object.assign(props, { titulo: null });
    expect(() => NotificationModelMapper.toEntity(model)).toThrowError(ValidationError);
  });

  it("should convert a notification model to a notification entity", async () => {
    const model: Notification = await prismaService.notification.create({
      data: props,
    });

    const sut = NotificationModelMapper.toEntity(model);

    expect(sut).toBeInstanceOf(NotificationEntity);
    expect(sut.toJson()).toStrictEqual({
      ...props,
      enviadoEm: props.enviadoEm.toISOString(), // Ajuste para data no formato ISO
    });
  });
});
