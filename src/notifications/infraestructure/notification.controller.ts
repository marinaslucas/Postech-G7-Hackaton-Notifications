import {
  Controller,
  Post,
  Body,
  Inject,
  HttpCode,
  UseGuards,
} from "@nestjs/common";
import { SendNotificationUseCase } from "../application/usecases/send-notification.usecase";
import { NotificationDto } from "./dtos/notification.dto";
import { AuthGuard } from "../../auth/infraestructure/auth.guard";
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Notifications")
@Controller("notifications")
export class NotificationController {
  @Inject(SendNotificationUseCase)
  private sendNotificationUseCase: SendNotificationUseCase;

  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: "Notificação enviada com sucesso",
  })
  @ApiResponse({
    status: 422,
    description: "Corpo da requisição com dados inválidos",
  })
  @ApiResponse({
    status: 401,
    description: "Acesso não autorizado",
  })
  @UseGuards(AuthGuard)
  @HttpCode(201)
  @Post("send")
  async sendNotification(@Body() notificationDto: NotificationDto) {
    await this.sendNotificationUseCase.execute(notificationDto);
    return { message: "Notificação enviada com sucesso" };
  }
}
