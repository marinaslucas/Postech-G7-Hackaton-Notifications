import { NotificationEntity, NotificationProps } from "../../notification.entity";
import { notificationDataBuilder } from "../../../testing/helpers/notification-data-builder";

describe("NotificationEntity integration tests", () => {
  let props: NotificationProps;
  let sut: NotificationEntity;

  beforeEach(() => {
    props = notificationDataBuilder();
    sut = new NotificationEntity(props);
  });

  describe("Constructor", () => {
    it("Should create a new notification entity", () => {
      expect(() => {
        new NotificationEntity(props);
      }).not.toThrow();
      expect(sut.props).toStrictEqual(props);
      expect(sut.destinatario).toEqual(props.destinatario);
      expect(sut.titulo).toEqual(props.titulo);
      expect(sut.mensagem).toEqual(props.mensagem);
      expect(sut.userId).toEqual(props.userId);
      expect(sut.enviadoEm).toBeDefined();
    });

    it("Should throw error when destinatario is invalid", () => {
      expect(() => new NotificationEntity({ ...props, destinatario: "" })).toThrowError(
        "Entity Validation Error"
      );
      expect(() => new NotificationEntity({ ...props, destinatario: null })).toThrowError(
        "Entity Validation Error"
      );
      expect(() => new NotificationEntity({ ...props, destinatario: undefined })).toThrowError(
        "Entity Validation Error"
      );
      expect(() => new NotificationEntity({ ...props, destinatario: 123 as any })).toThrowError(
        "Entity Validation Error"
      );
    });

    it("Should throw error when titulo is invalid", () => {
      expect(() => new NotificationEntity({ ...props, titulo: "" })).toThrowError(
        "Entity Validation Error"
      );
      expect(() => new NotificationEntity({ ...props, titulo: 123 as any })).toThrowError(
        "Entity Validation Error"
      );
      expect(() => new NotificationEntity({ ...props, titulo: "a".repeat(256) })).toThrowError(
        "Entity Validation Error"
      );
    });

    it("Should throw error when mensagem is invalid", () => {
      expect(() => new NotificationEntity({ ...props, mensagem: "" })).toThrowError(
        "Entity Validation Error"
      );
      expect(() => new NotificationEntity({ ...props, mensagem: 123 as any })).toThrowError(
        "Entity Validation Error"
      );
    });

    it("Should throw error when userId is invalid", () => {
      expect(() => new NotificationEntity({ ...props, userId: 123 as any })).toThrowError(
        "Entity Validation Error"
      );
      expect(() => new NotificationEntity({ ...props, userId: "invalid-uuid" })).toThrowError(
        "Entity Validation Error"
      );
    });

    it("Should throw error when enviadoEm is invalid", () => {
      expect(() => new NotificationEntity({ ...props, enviadoEm: "invalid-date" as any })).toThrowError(
        "Entity Validation Error"
      );
      expect(() => new NotificationEntity({ ...props, enviadoEm: 123 as any })).toThrowError(
        "Entity Validation Error"
      );
    });
  });

  describe("Setters", () => {
    it("Should throw error when update with invalid titulo", () => {
      let newTitulo = "";
      expect(() => sut.updateTitulo(newTitulo)).toThrowError("Entity Validation Error");

      newTitulo = "a".repeat(256);
      expect(() => sut.updateTitulo(newTitulo)).toThrowError("Entity Validation Error");

      newTitulo = 123 as any;
      expect(() => sut.updateTitulo(newTitulo)).toThrowError("Entity Validation Error");
    });

    it("Should throw error when update with invalid mensagem", () => {
      let newMensagem = "";
      expect(() => sut.updateMensagem(newMensagem)).toThrowError("Entity Validation Error");

      newMensagem = 123 as any;
      expect(() => sut.updateMensagem(newMensagem)).toThrowError("Entity Validation Error");
    });

    it("Should throw error when update with invalid userId", () => {
      let newUserId = "invalid-uuid";
      expect(() => sut.updateUserId(newUserId)).toThrowError("Entity Validation Error");

      newUserId = 123 as any;
      expect(() => sut.updateUserId(newUserId)).toThrowError("Entity Validation Error");
    });
  });
});
