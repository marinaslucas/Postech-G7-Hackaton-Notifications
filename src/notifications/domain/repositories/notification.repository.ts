import {
  SearchableRepositoryInterface,
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from "../../../shared/domain/repositories/searchable-repository-contract";
import { NotificationEntity } from "../entities/notification.entity";

export namespace NotificationRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class SearchResult extends DefaultSearchResult<NotificationEntity, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      NotificationEntity,
      string,
      SearchParams,
      SearchResult
    > {
    findByDestinatario(destinatario: string): Promise<NotificationEntity | null>;
  }
}
