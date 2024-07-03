import { ContactFactory } from '@/components/pages/ContactFactory';
import { ClientSchema } from '@/schemas';
import { PageProps } from '@/types';

export default function Page(p: PageProps) {
    const client = p.params.client;
    ClientSchema.parse(client);
    return <ContactFactory client={client} />;
}
