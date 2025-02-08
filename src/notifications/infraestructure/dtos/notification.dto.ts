import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class NotificationDto {
  @ApiProperty({ example: "user@example.com", description: "E-mail do destinatário" })
  @IsEmail()
  @IsNotEmpty()
  destinatario: string;

  @ApiProperty({ example: "Promoção Especial!", description: "Título da notificação" })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ example: "<p>Você recebeu um desconto exclusivo!</p>", description: "Mensagem em HTML" })
  @IsString()
  @IsNotEmpty()
  mensagem: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000", description: "ID do usuário associado", required: false })
  @IsOptional()
  @IsString()
  userId?: string;
}
