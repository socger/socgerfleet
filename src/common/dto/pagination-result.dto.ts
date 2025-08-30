export class PaginationResultDto<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };

  constructor(data: T[], total: number, page: number, limit: number) {
    // Asegurar que page y limit son números
    const numPage = typeof page === 'string' ? parseInt(page, 10) : page;
    const numLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit;

    this.data = data;
    this.meta = {
      total,
      page: numPage,
      limit: numLimit,
      totalPages: Math.ceil(total / numLimit),
      hasNextPage: numPage < Math.ceil(total / numLimit),
      hasPreviousPage: numPage > 1,
    };
  }
}
