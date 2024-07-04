import { ContactFactory } from '@/components/pages/ContactFactory';
import ensureClient from '@/utils/ensureClient';

const BUILD_TYPE = process.env.NEXT_PUBLIC_BUILD_TYPE as 'INSTANCES' | 'SINGLE';

export default function Page() {
    const client = ensureClient();

    if (BUILD_TYPE === 'INSTANCES') return <ContactFactory client={client} />;
    return null;
}
