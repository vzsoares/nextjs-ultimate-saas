import { HomeFactory } from '@/components/pages/HomeFactory';
import { PageProps } from '@/types';
import ensureClient from '@/utils/ensureClient';

export default function Page(p: PageProps) {
    const client = ensureClient(p.params.client);
    return <HomeFactory client={client} />;
}
