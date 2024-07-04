import { AboutFactory } from '@/components/pages/AboutFactory';
import { PageProps } from '@/types';
import ensureClient from '@/utils/ensureClient';

export default function Page(p: PageProps) {
    const client = ensureClient(p.params.client);
    return <AboutFactory client={client} />;
}
