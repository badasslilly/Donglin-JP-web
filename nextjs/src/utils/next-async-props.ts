/** Only async-ify request props; leave others (like children) alone */
export type WithAsyncRequest<T extends { params?: any; searchParams?: any }> =
  Omit<T, 'params' | 'searchParams'> & {
    params: Promise<NonNullable<T['params']>>;
    searchParams?: Promise<NonNullable<T['searchParams']>>;
  };
