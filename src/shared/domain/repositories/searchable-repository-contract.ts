import { Entity } from '../entities/entity';
import { RepositoryInterface } from './repositories-contracts';

export type SortDirection = 'asc' | 'desc';

export type SearchProps<Filter = string> = {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDirection | null;
  filter?: Filter | null;
};

export type SearchResultProps<E extends Entity, Filter> = {
  items: E[];
  total: number;
  currentPage: number;
  perPage: number;
  sort: string | null;
  sortDir: string | null;
  filter: Filter | null;
};

export class SearchParams {
  protected _page: number;
  protected _perPage = 15;
  protected _sort: string | null;
  protected _sortDir: SortDirection | null;
  protected _filter: string | null;

  constructor(props?: SearchProps) {
    this.page = props?.page;
    this.perPage = props?.perPage;
    this.sort = props?.sort;
    this.sortDir = props?.sortDir;
    this.filter = props?.filter;
  }

  get page() {
    return this._page;
  }

  private set page(value: number) {
    let _page = +value;
    if (
      typeof _page !== 'number' ||
      _page <= 0 ||
      parseInt(_page as any) !== _page
    ) {
      _page = 1;
    }
    this._page = _page;
  }

  get perPage() {
    return this._perPage;
  }

  private set perPage(value: number) {
    console.log(value);
    let _perPage = value;
    if (
      typeof _perPage !== 'number' ||
      _perPage <= 0 ||
      parseInt(_perPage as any) !== _perPage
    ) {
      _perPage = this._perPage;
    }
    this._perPage = _perPage;
    console.log(this._perPage);
  }

  get sort() {
    return this._sort;
  }

  private set sort(value: string | null) {
    const sortValue = value ? value.toString() : null;
    this._sort = sortValue;
  }

  get sortDir() {
    return this._sortDir;
  }

  private set sortDir(value: string | null) {
    if (!this.sort) {
      this._sortDir = null;
      return;
    }

    if (!value) {
      this._sortDir = 'desc';
      return;
    }

    const dir = value.toString().toLowerCase();
    this._sortDir = dir !== 'asc' && dir !== 'desc' ? 'desc' : dir;
  }

  get filter() {
    return this._filter;
  }

  private set filter(value: string | null) {
    const filterValue = value ? value.toString() : null;
    this._filter = filterValue;
  }
}

export class SearchResult<E extends Entity, Filter = string> {
  readonly items: E[];
  readonly total: number;
  readonly currentPage: number;
  readonly perPage: number;
  readonly lastPage: number;
  readonly sort: string | null;
  readonly sortDir: string | null;
  readonly filter: Filter | null;

  constructor(params: SearchResultProps<E, Filter>) {
    this.items = params.items;
    this.total = params.total;
    this.currentPage = params.currentPage;
    this.perPage = params.perPage;
    this.lastPage = Math.ceil(this.total / this.perPage);
    this.sort = params.sort ?? null;
    this.sortDir = params.sortDir ?? null;
    this.filter = params.filter ?? null;
  }

  toJSON(forceEntity = false) {
    return {
      items: forceEntity ? this.items.map(item => item.toJson()) : this.items,
      total: this.total,
      currentPage: this.currentPage,
      perPage: this.perPage,
      lastPage: this.lastPage,
      sort: this.sort,
      sortDir: this.sortDir,
      filter: this.filter,
    };
  }
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  Filter = string,
  SearchInput = SearchParams,
  SearchOutput = SearchResult<E, Filter>,
> extends RepositoryInterface<E> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SearchOutput>;
}
