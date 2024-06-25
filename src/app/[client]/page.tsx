import MainIllustration from 'public/innovation_illustration.svg';

import { ClientSchema } from '@/schemas';
import { Clients, PageProps } from '@/types';

export default function Page(p: PageProps) {
    const client = p.params.client;
    ClientSchema.parse(client);
    return HomeFactory(client);
}

export function HomeFactory(client: Clients) {
    return (
        <main className="min-h-screen flex-col flex">
            <nav className="px-4 py-2 w-full max-w-[1080px] bg-red-500 m-auto">
                <p className="font-medium text-lg">{client}</p>
            </nav>
            <section className="px-4 w-full py-2 max-w-[1080px] m-auto flex-1">
                <p className="text-2xl mt-8 text-center">
                    Welcome too <span className="text-4xl">{client}</span>
                </p>
                <div className="text-red-500 max-w-[500px] m-auto pt-12">
                    <MainIllustration />
                </div>
                <div>
                    <p className="text-center pt-4 text-medium text-lg">Seeking innovation</p>
                </div>
            </section>
            <footer className="px-4 py-2 w-full max-w-[1080px] bg-red-500 m-auto">
                <p className="text-center">2024 ©</p>
            </footer>
        </main>
    );
}
