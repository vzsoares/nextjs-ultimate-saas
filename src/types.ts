export type Clients = 'default' | 'foo' | 'bar' | 'baz';

export type LayoutProps<P = object> = {
    params: { client: Clients } & P;
    children: React.ReactNode;
};

export type PageProps<P = object, T = object> = {
    params: { client: Clients } & P;
    searchParams: Record<string, string>;
    // children: React.ReactNode;
} & T;
