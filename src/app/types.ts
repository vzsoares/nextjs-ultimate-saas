export type PageProps<P = object, T = object> = {
    params: { client: Clients } & P;
    searchParams: Record<string, string>;
} & T;

export type Clients = 'foo' | 'bar' | 'baz';
