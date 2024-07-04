import { ContactFactory } from '@/components/pages/ContactFactory';
import { PageProps } from '@/types';
import ensureClient from '@/utils/ensureClient';

export default function Page(p: PageProps) {
    const client = ensureClient(p.params.client);
    return <ContactFactory client={client} />;
}
