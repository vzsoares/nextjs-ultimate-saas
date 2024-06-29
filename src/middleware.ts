import { NextRequest, NextResponse } from 'next/server';

import { ClientStrategyContext } from './ClinetInterface';
import { ClientsArray } from './schemas';
import { Clients } from './types';

const PartnerHost: Record<string, Clients> = {
    'foo.com': 'foo',
    'baz.com': 'baz',
    'bar.com': 'bar',
    [process.env.NEXT_PUBLIC_USE_LOCALHOST === 'TRUE' ? 'localhost:3000' : '']:
        'foo',
    [process.env.NEXT_PUBLIC_USE_LOCALHOST === 'TRUE' ? 'localhost:3001' : '']:
        'baz',
    [process.env.NEXT_PUBLIC_USE_LOCALHOST === 'TRUE' ? 'localhost:3002' : '']:
        'bar',
};

export type RouteStack = '/index' | '/about' | '/contact' | '/404';
/** ROUTE  PERMISSIONS */
export const AppRouteStackPermissions: Record<RouteStack, Clients[]> = {
    '/index': ['baz', 'bar', 'foo'],
    '/about': ['baz', 'bar', 'foo'],
    '/contact': ['baz', 'bar', 'foo'],
    '/404': ['baz', 'bar', 'foo'],
};

const BUILD_TYPE = process.env.NEXT_PUBLIC_BUILD_TYPE as 'INSTANCES' | 'SINGLE';
const BASE_CLIENT = process.env.NEXT_PUBLIC_BASE_CLIENT as Clients;

const AvClients = BUILD_TYPE === 'INSTANCES' ? [BASE_CLIENT] : ClientsArray;

export function middleware(req: NextRequest) {
    const reqHost = req.headers.get('Host') as string;
    const reqPath = req.nextUrl.pathname;
    const url = req.nextUrl.clone();
    console.log({
        PartnerHost,
        reqHost,
        useLocal: process.env.NEXT_PUBLIC_USE_LOCALHOST,
        BUILD_TYPE,
        BASE_CLIENT,
        req: JSON.stringify(req.nextUrl.host),
        re: JSON.stringify(req.nextUrl.toJSON()),
    });

    if (reqPath === '/404') return NextResponse.next();

    for (const client of Object.values(AvClients)) {
        // Instantiate client ctx obj
        const ClientContext = new ClientStrategyContext(client);

        const clientPrefix = `/${client}`;

        // handle multiple hosts
        if (PartnerHost[reqHost] !== client) {
            continue;
        }

        const { route, isFound, isValid } = getRouteStatus({
            reqPath,
            client,
            clientPrefix,
        });

        if (!isValid) {
            const routeToRedirect = ClientContext.getRouteToRedirect(route);
            // handle external redirect
            if (routeToRedirect.startsWith('http')) {
                return NextResponse.redirect(routeToRedirect);
            }
            url.pathname = routeToRedirect;
            return NextResponse.redirect(url);
        }

        if (!isFound) {
            url.pathname = '/404';
            return NextResponse.redirect(url);
        }

        /* mask client in final url using **rewrite**
         * in   `/foo/about`
         * out  `/about`                        */
        if (
            reqPath.startsWith(clientPrefix + '/') ||
            reqPath === clientPrefix
        ) {
            url.pathname = url.pathname.slice(clientPrefix.length);
            return NextResponse.redirect(url);
        } else {
            url.pathname = clientPrefix + url.pathname;
            return NextResponse.rewrite(url);
        }
    }

    url.pathname = '/404';
    return NextResponse.redirect(url);
}

function getRouteStatus({
    reqPath,
    clientPrefix,
    client,
}: {
    reqPath: string;
    clientPrefix: string;
    client: Clients;
}): { isValid: boolean; isFound: boolean; route: RouteStack } {
    const baseRoute = reqPath.startsWith(clientPrefix)
        ? reqPath.slice(clientPrefix.length)
        : reqPath;
    const entries = Object.entries(AppRouteStackPermissions);
    for (const [route, permissions] of entries) {
        if (
            baseRoute === route ||
            (route === '/index' && (baseRoute === '/' || baseRoute === ''))
        ) {
            return {
                route: route as RouteStack,
                isValid: permissions.includes(client),
                isFound: true,
            };
        }
    }
    return {
        route: entries[entries.length - 1][0] as RouteStack,
        isValid: false,
        isFound: false,
    };
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
