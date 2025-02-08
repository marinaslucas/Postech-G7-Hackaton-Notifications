import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpCode,
  Query,
  UseGuards,
  Headers,
  Req
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { DeleteProcessedVideoUseCase } from '../application/usecases/delete-processed-video.usecase';
import { RetrieveProcessedVideoUseCase } from '../application/usecases/retrieve-processed-video.usecase';
// import { UploadProcessedVideoUseCase } from '../application/usecases/upload-processed-video.usecase';
import { UploadVideoUseCase } from '../application/usecases/upload-video.usecase';
import { ProcessVideoUseCase } from '../application/usecases/process-video.usecase';
import { GetVideoUseCase } from '../application/usecases/get-video.usecase';
import { UpdateVideoUseCase } from '../application/usecases/update-video';
import { ListVideosUseCase } from '../application/usecases/list-videos.usecase';

import { ListVideosDto } from './dtos/list-videos.dto';
//   import { RetrieveProcessedVideoDto } from './dtos/retrieve-processed-video.dto';
import { UpdateVideoDto } from './dtos/update-video.dto';
// import { UploadProcessedVideoDto } from './dtos/upload-processed-video.dto';
import { UploadVideoDto } from './dtos/upload-video.dto';

import {
  VideoCollectionPresenter,
  VideoPresenter,
} from './presenters/video.presenter';
import { VideoOutput } from '../application/dtos/video-output';
// import { AuthService } from '../../auth/infraestructure/auth.service';
import { AuthGuard } from '../../auth/infraestructure/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';


@ApiTags('Videos')
@Controller('videos')
export class VideosController {
  @Inject(DeleteProcessedVideoUseCase.UseCase)
  private deleteProcessedVideoUseCase: DeleteProcessedVideoUseCase.UseCase;

  @Inject(RetrieveProcessedVideoUseCase.UseCase)
  private retrieveProcessedVideoUseCase: RetrieveProcessedVideoUseCase.UseCase;

  // @Inject(UploadProcessedVideoUseCase.UseCase)
  // private uploadProcessedVideoUseCase: UploadProcessedVideoUseCase.UseCase;

  @Inject(UploadVideoUseCase.UseCase)
  private uploadVideoUseCase: UploadVideoUseCase.UseCase;

  @Inject(ProcessVideoUseCase.UseCase)
  private processVideoUseCase: ProcessVideoUseCase.UseCase;

  @Inject(GetVideoUseCase.UseCase)
  private getVideoUseCase: GetVideoUseCase.UseCase;

  @Inject(UpdateVideoUseCase.UseCase)
  private updateVideoUseCase: UpdateVideoUseCase.UseCase;

  @Inject(ListVideosUseCase.UseCase)
  private listVideosUseCase: ListVideosUseCase.UseCase;

  // @Inject(AuthService)
  // private authService: AuthService;

  static videoToResponse(output: VideoOutput) {
    return new VideoPresenter(output);
  }

  static listVideosToResponse(output: ListVideosUseCase.Output) {
    return new VideoCollectionPresenter(output);
  }

  @ApiBearerAuth()
  @HttpCode(201)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadVideoDto })
  @ApiResponse({ status: 401, description: 'Acesso não autorizado' })
  @UseGuards(AuthGuard)
  @Post('upload')
  async upload(@Req() request: FastifyRequest, @Headers('authorization') authHeader: string) {
    const data = (request.body as UploadVideoDto).file; 
    if (!data) {
      throw new Error('Nenhum arquivo enviado!');
    }

    const fileBuffer = await data.toBuffer();

    const jwtToken = authHeader.split(' ')[1];
    
    return this.uploadVideoUseCase.execute({
      file: { filename: data.filename, file: fileBuffer },
      jwtToken,
    });
  }

  // @HttpCode(201)
  // @Post('upload-processed')
  // async uploadProcessed(
  //   @Body() uploadProcessedVideoDto: UploadProcessedVideoDto
  // ) {
  //   return this.uploadProcessedVideoUseCase.execute(uploadProcessedVideoDto);
  // }

  @ApiResponse({ status: 500, description: 'Erro ao processar video' })
  @HttpCode(200)
  @ApiBearerAuth()
  @Post('process/:id')
  async process(@Param('id') id: string) {
    return this.processVideoUseCase.execute({ id });
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 404,
    description: 'Id não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @UseGuards(AuthGuard)
  @Get(':id')
  async getVideo(@Param('id') id: string) {
    const output = await this.getVideoUseCase.execute({ id });
    return VideosController.videoToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 404,
    description: 'Id não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @UseGuards(AuthGuard)
  @Get('processed/:id')
  async getProcessedVideo(@Param('id') id: string) {
    await this.retrieveProcessedVideoUseCase.execute({ id });
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 404,
    description: 'Id não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteProcessed(@Param('id') id: string) {
    await this.deleteProcessedVideoUseCase.execute({ id });
  }

  @ApiBearerAuth()
  @Get()
  async list(@Query() listVideosDto: ListVideosDto) {
    const output = await this.listVideosUseCase.execute(listVideosDto);
    return VideosController.listVideosToResponse(output);
  }

  @ApiBearerAuth()
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateVideoDto: UpdateVideoDto
  ) {
    return this.updateVideoUseCase.execute({ id, ...updateVideoDto });
  }
}
