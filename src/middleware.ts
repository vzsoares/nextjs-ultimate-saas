import { NextRequest, NextResponse } from 'next/server';

import { ClientStrategyContext } from './ClinetInterface';
import { ClientsArray } from './schemas';
import { Clients } from './types';

const PartnerHost: Record<string, Clients> = {
    'foo.com': 'foo',
    'bar.com': 'bar',
    'baz.com': 'baz',
    [process.env.NEXT_PUBLIC_LOCALHOST === 'TRUE' ? 'localhost:3000' : '']:
        'foo',
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
    const reqHost = req.nextUrl.host;
    const reqPath = req.nextUrl.pathname;
    const url = req.nextUrl.clone();

    if (reqPath === '/404') return NextResponse.next();

    for (const client of Object.values(AvClients)) {
        // Instantiate client ctx obj
        const ClientContext = new ClientStrategyContext(client);

        const clientPrefix = `/${client}`;

        // handle multiple hosts
        if (PartnerHost[reqHost] !== client) {
            continue;
        }
        if (
            reqPath.startsWith(clientPrefix + '/') ||
            reqPath === clientPrefix
        ) {
            const baseRoute = reqPath.slice(clientPrefix.length);
            for (const [route, permissions] of Object.entries(
                AppRouteStackPermissions
            )) {
                if (
                    baseRoute === route ||
                    (route === '/index' && baseRoute === '')
                ) {
                    if (!permissions.includes(client)) {
                        const routeToRedirect =
                            ClientContext.getRouteToRedirect(
                                route as RouteStack
                            );
                        // handle external redirect
                        if (routeToRedirect.startsWith('http')) {
                            return NextResponse.redirect(routeToRedirect);
                        }
                        url.pathname = clientPrefix + routeToRedirect;
                        return NextResponse.redirect(url);
                    }
                    url.pathname = url.pathname.slice(clientPrefix.length);
                    return NextResponse.redirect(url);
                }
            }
            break;
        }
        url.pathname = clientPrefix + url.pathname;
        return NextResponse.rewrite(url);
    }

    // handle forbiden access to /index
    // if (reqPath === '/') {
    //     url.pathname = '/404';
    //     return NextResponse.redirect(url);
    // }

    // Ensure correct paths and block unknown clients
    // for (const appPath of Object.keys(AppRouteStackPermissions)) {
    //     const size = appPath.length;
    //     const slPath = reqPath.slice(0, size);
    //     if (slPath === appPath) return NextResponse.next();
    // }

    url.pathname = '/404';
    return NextResponse.redirect(url);
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
