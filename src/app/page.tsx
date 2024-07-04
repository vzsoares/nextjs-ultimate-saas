import { HomeFactory } from '@/components/pages/HomeFactory';
import { ClientSchema } from '@/schemas';
import { Clients } from '@/types';

const BUILD_TYPE = process.env.NEXT_PUBLIC_BUILD_TYPE as 'INSTANCES' | 'SINGLE';
const BASE_CLIENT = process.env.NEXT_PUBLIC_BASE_CLIENT as Clients;

export default function Page() {
    const client = BASE_CLIENT ?? 'default';
    ClientSchema.parse(client);

    if (BUILD_TYPE === 'INSTANCES') return <HomeFactory client={client} />;
    return null;
}
