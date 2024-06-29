import Link from 'next/link';

import { ClientStrategyContext } from '@/ClinetInterface';
import { ClientSchema } from '@/schemas';
import { Clients, PageProps } from '@/types';

export default function Page(p: PageProps) {
    const client = p.params.client;
    ClientSchema.parse(client);
    return <AboutFactory client={client} />;
}

function AboutFactory({ client }: { client: Clients }): JSX.Element {
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
            <section className="px-4 w-full py-2 max-w-[1080px] m-auto flex-1 flex">
                <p className="max-w-[480px] text-center m-auto pb-[15%] m-auto">
                    Knaped almanac night relies god tenaciously nonetheless
                    above all god paradox absolutely subsequently of perhaps nor
                    so IQ juvenile stoic too besought for grubble reckoned thou
                    youngster thine hence concludes wharf ridge absolutely
                    juvenile thus whomst thee furthermore my conjure to
                    summarise night quintessential esteem deprecated verbose in
                    spite my ere incredulous hence exculpate iconoclastic whomst
                    obviously conjure for my from nonetheless 'tis forsake
                    moreover as or in spite of campus tidings avaricious
                    reckoned obviously crapulous tenaciously foretold heresy IQ
                    scrutinize may above all esteem.
                </p>
            </section>
            <footer className="px-4 py-2 w-full max-w-[1080px] bg-primary-500 m-auto">
                <p className="text-center">2024 ©</p>
            </footer>
        </main>
    );
}
