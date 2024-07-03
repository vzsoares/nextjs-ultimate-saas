import Link from 'next/link';

import { ClientStrategyContext } from '@/ClientInterface';
import { Clients } from '@/types';

export function ContactFactory({ client }: { client: Clients }): JSX.Element {
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
                <form className="max-w-sm mx-auto w-full m-auto pb-[15%]">
                    <div className="mb-5">
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Your email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 block w-full p-2.5"
                            placeholder="name@flowbite.com"
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label
                            htmlFor="content"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Content
                        </label>
                        <textarea
                            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 block w-full p-2.5 min-h-[200px]"
                            required
                            id="content"
                        />
                    </div>
                    <button
                        type="submit"
                        className="text-white bg-primary-500 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                        Submit
                    </button>
                </form>
            </section>
            <footer className="px-4 py-2 w-full max-w-[1080px] bg-primary-500 m-auto">
                <p className="text-center">2024 ©</p>
            </footer>
        </main>
    );
}
