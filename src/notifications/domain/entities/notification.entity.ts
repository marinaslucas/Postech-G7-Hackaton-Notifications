import { NotificationValidatorFactory } from "../validators/notification.validator";
import { Entity } from "../../../shared/domain/entities/entity";
import { EntityValidationError } from "../../../shared/domain/errors/validation-error";

export type NotificationProps = {
  destinatario: string;
  titulo: string;
  mensagem: string;
  userId?: string; // Agora é opcional
  enviadoEm?: Date;
};

export class NotificationEntity extends Entity<NotificationProps> {
  constructor(public readonly props: NotificationProps, id?: string) {
    NotificationEntity.validate(props);
    super(props, id);
    this.props.enviadoEm = props.enviadoEm ?? new Date();
  }

  updateTitulo(value: string) {
    NotificationEntity.validate({ ...this.props, titulo: value });
    this.props.titulo = value;
  }

  updateMensagem(value: string) {
    NotificationEntity.validate({ ...this.props, mensagem: value });
    this.props.mensagem = value;
  }

  updateUserId(userId: string | null) {
    NotificationEntity.validate({ ...this.props, userId: userId || undefined });
    this.props.userId = userId || undefined;
  }

  get destinatario(): string {
    return this.props.destinatario;
  }

  get titulo(): string {
    return this.props.titulo;
  }

  private set titulo(value: string) {
    this.props.titulo = value;
  }

  get mensagem(): string {
    return this.props.mensagem;
  }

  private set mensagem(value: string) {
    this.props.mensagem = value;
  }

  get userId(): string | undefined {
    return this.props.userId;
  }

  private set userId(value: string | undefined) {
    this.props.userId = value;
  }

  get enviadoEm(): Date {
    return this.props.enviadoEm;
  }

  static validate(data: NotificationProps) {
    const validator = NotificationValidatorFactory.create();
    const isValid = validator.validate(data);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
