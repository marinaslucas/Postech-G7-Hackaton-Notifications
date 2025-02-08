import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { NotificationProps } from "../entities/notification.entity";
import { ClassValidatorFields } from "../../../shared/domain/validators/class-validator-fields";

export class NotificationRules {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  destinatario: string;

  @MinLength(3)
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsNotEmpty()
  @IsString()
  mensagem: string;

  @IsOptional()
  @IsDate()
  enviadoEm: Date;

  constructor(data: NotificationProps) {
    Object.assign(this, data);
  }
}

export class NotificationValidator extends ClassValidatorFields<NotificationRules> {
  validate(data: NotificationProps) {
    return data && super.validate(new NotificationRules(data));
  }
}

export class NotificationValidatorFactory {
  static create() {
    return new NotificationValidator();
  }
}
