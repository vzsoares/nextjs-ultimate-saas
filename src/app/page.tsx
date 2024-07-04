import { HomeFactory } from '@/components/pages/HomeFactory';
import ensureClient from '@/utils/ensureClient';

const BUILD_TYPE = process.env.NEXT_PUBLIC_BUILD_TYPE as 'INSTANCES' | 'SINGLE';

export default function Page() {
    const client = ensureClient();

    if (BUILD_TYPE === 'INSTANCES') return <HomeFactory client={client} />;
    return null;
}
