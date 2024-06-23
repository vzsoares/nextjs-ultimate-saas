import { PageProps } from '../types';

export default function Page(p: PageProps) {
    console.log(p.params.client);
    return null;
}
