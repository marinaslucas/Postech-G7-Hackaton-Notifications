import { ConflictError } from "../../../../../shared/domain/errors/conflict-error";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found-error";
import { PrismaService } from "../../../../../shared/infraestructure/database/prisma/prisma.service";
import { NotificationEntity } from "../../../../domain/entities/notification.entity";
import { NotificationRepository } from "../../../../domain/repositories/notification.repository";
import { NotificationModelMapper } from "../models/notification-model.mapper";

export class NotificationPrismaRepository implements NotificationRepository.Repository {
  sortableFields: string[] = ["titulo", "enviadoEm"];

  constructor(private prismaService: PrismaService) {}

  async findByDestinatario(destinatario: string): Promise<NotificationEntity | null> {
    const model = await this.prismaService.notification.findFirst({
      where: { destinatario },
    });
    return model ? NotificationModelMapper.toEntity(model) : null;
  }

  // Implementação de busca paginada
  async search(
    props: NotificationRepository.SearchParams
  ): Promise<NotificationRepository.SearchResult> {
    const sortable = this.sortableFields?.includes(props.sort);
    const orderByField = sortable ? props.sort : "enviadoEm";
    const orderByDir = sortable ? props.sortDir : "desc";
    const filter = props.filter || null;

    const count = await this.prismaService.notification.count({
      ...(props.filter && {
        where: {
          titulo: {
            contains: filter,
            mode: "insensitive",
          },
        },
      }),
    });

    const models = await this.prismaService.notification.findMany({
      ...(props.filter && {
        where: {
          titulo: {
            contains: filter,
            mode: "insensitive",
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
      items: models.map((model) => NotificationModelMapper.toEntity(model)),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
      sort: props.sort,
      sortDir: props.sortDir,
      filter: props.filter,
    });
  }

  async insert(entity: NotificationEntity): Promise<void> {
    await this.prismaService.notification.create({
      data: entity.toJson(),
    });
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
    return models.map((model) => NotificationModelMapper.toEntity(model));
  }

  async delete(id: string): Promise<void> {
    await this._get(id);
    await this.prismaService.notification.delete({
      where: { id },
    });
  }

  protected async _get(id: string): Promise<NotificationEntity> {
    const model = await this.prismaService.notification.findUnique({
      where: { id },
    });

    if (!model) {
      throw new NotFoundError(`Notification not found using ID ${id}`);
    }

    return NotificationModelMapper.toEntity(model);
  }
}
