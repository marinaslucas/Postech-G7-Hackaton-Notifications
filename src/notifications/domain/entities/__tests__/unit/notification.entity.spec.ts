import { NotificationEntity, NotificationProps } from "../../notification.entity";
import { notificationDataBuilder } from "../../../testing/helpers/notification-data-builder";
import { faker } from "@faker-js/faker";

describe("NotificationEntity unit tests", () => {
  let props: NotificationProps;
  let sut: NotificationEntity;
  NotificationEntity.validate = jest.fn();

  beforeEach(() => {
    props = notificationDataBuilder();
    sut = new NotificationEntity(props);
  });

  it("Constructor: should create a new notification entity", () => {
    expect(sut).toBeInstanceOf(NotificationEntity);
    expect(NotificationEntity.validate).toHaveBeenCalled();
    expect(sut.destinatario).toEqual(props.destinatario);
    expect(sut.titulo).toEqual(props.titulo);
    expect(sut.mensagem).toEqual(props.mensagem);
    expect(sut.userId).toEqual(props.userId);
  });

  it("Getters: should return the correct values", () => {
    expect(sut.destinatario).toEqual(props.destinatario);
    expect(sut.titulo).toEqual(props.titulo);
    expect(sut.mensagem).toEqual(props.mensagem);
    expect(sut.userId).toEqual(props.userId);
    expect(sut.enviadoEm).toEqual(sut.props.enviadoEm);
  });

  it("Getters: should return the correct values types", () => {
    expect(typeof sut.destinatario).toEqual("string");
    expect(typeof sut.titulo).toEqual("string");
    expect(typeof sut.mensagem).toEqual("string");
    expect(typeof sut.userId).toEqual("string");
    expect(sut.enviadoEm).toBeInstanceOf(Date);
  });

  it("Setters: should update the titulo", () => {
    const newTitulo = faker.lorem.sentence(3);
    sut.updateTitulo(newTitulo);
    expect(NotificationEntity.validate).toHaveBeenCalled();
    expect(sut.titulo).toEqual(newTitulo);
  });

  it("Setters: should update the mensagem", () => {
    const newMensagem = faker.lorem.paragraph();
    sut.updateMensagem(newMensagem);
    expect(NotificationEntity.validate).toHaveBeenCalled();
    expect(sut.mensagem).toEqual(newMensagem);
  });

  it("Setters: should update the userId", () => {
    const newUserId = faker.string.uuid();
    sut.updateUserId(newUserId);
    expect(NotificationEntity.validate).toHaveBeenCalled();
    expect(sut.userId).toEqual(newUserId);
  });
});
