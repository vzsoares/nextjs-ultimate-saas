import { ClientSchema } from '@/schemas';
import { Clients } from '@/types';

const BUILD_TYPE = process.env.NEXT_PUBLIC_BUILD_TYPE as 'INSTANCES' | 'SINGLE';
const BASE_CLIENT = process.env.NEXT_PUBLIC_BASE_CLIENT as Clients;

export default function ensureClient(client?: Clients | undefined) {
    if (BUILD_TYPE === 'INSTANCES') {
        const v = BASE_CLIENT;
        const r = ClientSchema.parse(v);
        return r;
    }
    const v = (client?.length ?? 0) < 2 ? 'default' : client;
    const r = ClientSchema.parse(v);
    return r;
}
