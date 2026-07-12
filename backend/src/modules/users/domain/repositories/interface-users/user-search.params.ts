export type UserSearchParams = {
  search?: string;
  page: number;
  limit: number;
};

export type PaginatedUsers<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
