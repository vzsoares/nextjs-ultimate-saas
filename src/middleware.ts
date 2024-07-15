import { NextRequest, NextResponse } from 'next/server';

import { ClientStrategyContext } from './ClientInterface';
import { ClientsArray } from './schemas';
import { Clients } from './types';

const BUILD_TYPE = process.env.NEXT_PUBLIC_BUILD_TYPE as 'INSTANCES' | 'SINGLE';
const BASE_CLIENT = process.env.NEXT_PUBLIC_BASE_CLIENT as Clients;
const USE_LOCALHOST = process.env.NEXT_PUBLIC_USE_LOCALHOST as string;

const PartnerHost: Record<string, Clients> = {
    'foo.com': 'foo',
    'baz.com': 'baz',
    'bar.com': 'bar',
    [USE_LOCALHOST === 'TRUE' ? 'localhost:3000' : '']: 'foo',
    [USE_LOCALHOST === 'TRUE' ? 'localhost:3001' : '']: 'baz',
    [USE_LOCALHOST === 'TRUE' ? 'localhost:3002' : '']: 'bar',
};

export type RouteStack = '/index' | '/about' | '/contact' | '/404';
/** ROUTE  PERMISSIONS */
export const AppRouteStackPermissions: Record<RouteStack, Clients[]> = {
    '/index': ['baz', 'bar', 'foo'],
    '/about': ['baz', 'bar', 'foo'],
    '/contact': ['baz', 'bar', 'foo'],
    '/404': ['baz', 'bar', 'foo'],
};

const AvClients = BUILD_TYPE === 'INSTANCES' ? [BASE_CLIENT] : ClientsArray;

export function middleware(req: NextRequest) {
    const reqHost = req.headers.get('Host') as string;
    const reqClient = req.headers.get('X-Saas-Client') as string;
    const reqPath = req.nextUrl.pathname;
    const url = req.nextUrl.clone();
    console.log({
        PartnerHost,
        reqHost,
        useLocal: USE_LOCALHOST,
        BUILD_TYPE,
        BASE_CLIENT,
        url: JSON.stringify(req.nextUrl.toJSON()),
    });

    if (reqPath === '/404') return NextResponse.next();

    for (const client of Object.values(AvClients)) {
        // Instantiate client ctx obj
        const ClientContext = new ClientStrategyContext(client);

        const clientPrefix = BUILD_TYPE === 'INSTANCES' ? '' : `/${client}`;

        // handle multiple hosts
        if (reqClient !== client && PartnerHost[reqHost] !== client) {
            if (BUILD_TYPE === 'SINGLE') continue;
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
        if (BUILD_TYPE === 'INSTANCES') return NextResponse.next();
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
