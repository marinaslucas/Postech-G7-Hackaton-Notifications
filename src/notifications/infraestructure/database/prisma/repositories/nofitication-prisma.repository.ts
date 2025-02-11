import { NotFoundError } from '../../../../../shared/domain/errors/not-found-error';
import { PrismaService } from '../../../../../shared/infraestructure/database/prisma/prisma.service';
import { NotificationEntity } from '../../../../domain/entities/notification.entity';
import { NotificationRepository } from '../../../../domain/repositories/notification.repository';
import { NotificationModelMapper } from '../models/notification-model.mapper';
import { injectable } from 'tsyringe';

@injectable()
export class NotificationPrismaRepository
  implements NotificationRepository.Repository
{
  sortableFields: string[] = ['titulo', 'enviadoEm'];

  constructor(private prismaService: PrismaService) {}

  async findByDestinatario(
    destinatario: string
  ): Promise<NotificationEntity | null> {
    try {
      const model = await this.prismaService.notification.findFirst({
        where: { destinatario },
      });
      return NotificationModelMapper.toEntity(model);
    } catch (error) {
      throw new NotFoundError(
        `Notification not found for email provided ${destinatario}`
      );
    }
  }

  async search(
    props: NotificationRepository.SearchParams
  ): Promise<NotificationRepository.SearchResult> {
    const sortable = this.sortableFields?.includes(props.sort);
    const orderByField = sortable ? props.sort : 'enviadoEm';
    const orderByDir = sortable ? props.sortDir : 'desc';
    const filter = props.filter || null;

    const count = await this.prismaService.notification.count({
      ...(props.filter && {
        where: {
          titulo: {
            contains: filter,
            mode: 'insensitive',
          },
        },
      }),
    });

    const models = await this.prismaService.notification.findMany({
      ...(props.filter && {
        where: {
          titulo: {
            contains: filter,
            mode: 'insensitive',
          },
        },
      }),
      orderBy: {
        [orderByField]: orderByDir,
      },
      skip: props.page && props.page > 0 ? (props.page - 1) * props.perPage : 1,
      take: props.perPage,
    });

    return new NotificationRepository.SearchResult({
      items: models.map(model => NotificationModelMapper.toEntity(model)),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
      sort: props.sort,
      sortDir: props.sortDir,
      filter: props.filter,
    });
  }

  async insert(entity: NotificationEntity): Promise<void> {
    try {
      const data = {
        id: entity._id,
        destinatario: entity.destinatario,
        titulo: entity.titulo,
        mensagem: entity.mensagem,
        enviadoEm: entity.enviadoEm,
        userId: entity.userId,
      };

      await this.prismaService.$transaction(async (prisma) => {
        await prisma.notification.create({
          data,
        });
      }, {
        timeout: 20000, // 20 seconds
        maxWait: 25000, // 25 seconds
      });
    } catch (error) {
      console.error('Error inserting notification:', error);
      throw error;
    }
  }

  async update(entity: NotificationEntity): Promise<void> {
    await this._get(entity.id);
    await this.prismaService.notification.update({
      data: entity.toJson(),
      where: {
        id: entity.id,
      },
    });
  }

  async findById(id: string): Promise<NotificationEntity> {
    return await this._get(id);
  }

  async findAll(): Promise<NotificationEntity[]> {
    const models = await this.prismaService.notification.findMany();
    return models.map(model => NotificationModelMapper.toEntity(model));
  }

  async delete(id: string): Promise<void> {
    await this._get(id);
    await this.prismaService.notification.delete({
      where: { id },
    });
  }

  protected async _get(id: string): Promise<NotificationEntity> {
    try {
      const notification = await this.prismaService.notification.findUnique({
        where: {
          id,
        },
      });
      return NotificationModelMapper.toEntity(notification);
    } catch (error) {
      throw new NotFoundError(`Notification not found using ID ${id}`);
    }
  }
}
