import { NotificationEntity } from "../../../../domain/entities/notification.entity";
import { NotificationRepository } from "../../../../domain/repositories/notification.repository";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found-error";
import { SearchableInMemoryRepository } from "../../../../../shared/domain/repositories/in-memory-searchable-repository";
import { SortDirection } from "../../../../../shared/domain/repositories/searchable-repository-contract";

export class NotificationInMemoryRepository
  extends SearchableInMemoryRepository<NotificationEntity, string>
  implements NotificationRepository.Repository
{
  sortableFields: string[] = ["titulo", "enviadoEm"];

  async findByDestinatario(destinatario: string): Promise<NotificationEntity | null> {
    return this.items.find((item) => item.destinatario === destinatario) || null;
  }

  protected async applyFilter(
    items: NotificationEntity[],
    filter: NotificationRepository.Filter | null
  ): Promise<NotificationEntity[]> {
    if (!filter) {
      return items;
    }
    return items.filter((item) =>
      item.titulo.toLowerCase().includes(filter.toLowerCase()) ||
      item.mensagem.toLowerCase().includes(filter.toLowerCase())
    );
  }

  protected async applySort(
    items: NotificationEntity[],
    sort: string | null,
    sortDir: SortDirection | null
  ): Promise<NotificationEntity[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return super.applySort(items, "enviadoEm", "desc");
    }
    return super.applySort(items, sort, sortDir);
  }
}
