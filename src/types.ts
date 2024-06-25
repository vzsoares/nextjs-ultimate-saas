export type Clients = 'foo' | 'bar' | 'baz';

export type PageProps<P = object, T = object> = {
    params: { client: Clients } & P;
    searchParams: Record<string, string>;
    children: React.ReactNode;
} & T;
