import Link from 'next/link';
import MainIllustration from 'public/innovation_illustration.svg';

import { ClientStrategyContext } from '@/ClientInterface';
import { Clients } from '@/types';

export function HomeFactory({ client }: { client: Clients }): JSX.Element {
    const ClientContext = new ClientStrategyContext(client);
    return (
        <main className="min-h-screen flex-col flex">
            <nav className="px-4 py-2 w-full max-w-[1080px] bg-primary-500 m-auto flex">
                <p className="font-medium text-lg">{client}</p>
                <div className="w-full flex gap-4 justify-center">
                    <Link href={ClientContext.mountRouteUrl('/')}>
                        <p className="underline cursor-pointer">home</p>
                    </Link>
                    <Link href={ClientContext.mountRouteUrl('/about')}>
                        <p className="underline cursor-pointer">about</p>
                    </Link>
                    <Link href={ClientContext.mountRouteUrl('/contact')}>
                        <p className="underline cursor-pointer">contact</p>
                    </Link>
                </div>
            </nav>
            <section className="px-4 w-full py-2 max-w-[1080px] m-auto flex-1">
                <p className="text-2xl mt-8 text-center">
                    Welcome too <span className="text-4xl">{client}</span>
                </p>
                <div className="text-primary-500 max-w-[500px] m-auto pt-12">
                    <MainIllustration />
                </div>
                <div>
                    <p className="text-center pt-4 text-medium text-lg">
                        Seeking innovation
                    </p>
                </div>
            </section>
            <footer className="px-4 py-2 w-full max-w-[1080px] bg-primary-500 m-auto">
                <p className="text-center">2024 ©</p>
            </footer>
        </main>
    );
}
