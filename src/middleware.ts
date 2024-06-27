import { NextRequest, NextResponse } from 'next/server';

import { ClientStrategyContext } from './ClinetInterface';
import { ClientsArray } from './schemas';
import { Clients } from './types';

const PartnerHost: Record<string, Clients> = {
    'foo.com': 'foo',
    'bar.com': 'bar',
    'baz.com': 'baz',
    'localhost:3000': 'foo',
};

export type RouteStack = '/index' | '/about' | '/contact' | '/404';
/** ROUTE  PERMISSIONS */
export const AppRouteStackPermissions: Record<RouteStack, Clients[]> = {
    '/index': ['baz', 'bar', 'foo'],
    '/about': ['baz', 'bar', 'foo'],
    '/contact': ['baz', 'bar', 'foo'],
    '/404': ['baz', 'bar', 'foo'],
};

export function middleware(req: NextRequest) {
    const reqHost = req.nextUrl.host;
    const reqPath = req.nextUrl.pathname;
    const url = req.nextUrl.clone();

    for (const client of Object.values(ClientsArray)) {
        // Instantiate client ctx obj
        const ClientContext = new ClientStrategyContext(client);

        const clientPrefix = `/${client}`;

        // handle multiple hosts
        if (PartnerHost[reqHost] === client) {
            // TODO create a env for this
            if (process.env.NODE_ENV === 'development') {
                //skip
            } else {
                if (
                    reqPath.startsWith(clientPrefix + '/') ||
                    reqPath == clientPrefix
                ) {
                    url.pathname = url.pathname.slice(clientPrefix.length);
                    return NextResponse.redirect(url);
                }
                url.pathname = clientPrefix + url.pathname;
                return NextResponse.rewrite(url);
            }
        }

        // handle route block/redirect
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
                        } else {
                            url.pathname = clientPrefix + routeToRedirect;
                            return NextResponse.redirect(url);
                        }
                    } else {
                        return NextResponse.next();
                    }
                }
            }
            break;
        }
    }

    // handle forbiden access to /index
    if (reqPath === '/') {
        url.pathname = '/404';
        return NextResponse.redirect(url);
    }

    // Ensure correct paths and block unknown clients
    for (const appPath of Object.keys(AppRouteStackPermissions)) {
        const size = appPath.length;
        const slPath = reqPath.slice(0, size);
        if (slPath === appPath) return NextResponse.next();
    }

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
