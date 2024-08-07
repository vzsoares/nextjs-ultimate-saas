import { RouteStack } from 'src/middleware';

import { Clients } from './types';

const BUILD_TYPE = process.env.NEXT_PUBLIC_BUILD_TYPE as 'INSTANCES' | 'SINGLE';
type Palette = {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
};
type RedirectMap = Record<RouteStack, string>;
type ClientPalette = { primary: Palette };

type ClientStrategy = {
    strategyName: Clients;
    redirectMap: Partial<RedirectMap>;
    palette: ClientPalette;
};

const DefaultStrategy: ClientStrategy = {
    strategyName: 'default',
    palette: {
        primary: {
            100: '#000000',
            200: '#000000',
            300: '#000000',
            400: '#000000',
            500: '#000000',
        },
    },
    redirectMap: {},
};

const FooStrategy: ClientStrategy = {
    strategyName: 'foo',
    palette: {
        primary: {
            100: '#ecfccb',
            200: '#d9f99d',
            300: '#bef264',
            400: '#a3e635',
            500: '#84cc16',
        },
    },
    redirectMap: {},
};

const BazStrategy: ClientStrategy = {
    strategyName: 'baz',
    palette: {
        primary: {
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
        },
    },
    redirectMap: {},
};

const BarStrategy: ClientStrategy = {
    strategyName: 'bar',
    palette: {
        primary: {
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
        },
    },
    redirectMap: {},
};

const StrategiesMap: Record<Clients, ClientStrategy> = {
    foo: FooStrategy,
    baz: BazStrategy,
    bar: BarStrategy,
    default: DefaultStrategy,
};

export class ClientStrategyContext {
    public strategyName: Clients;
    public redirectMap: Partial<RedirectMap>;
    public palette: ClientPalette;

    constructor(strategy: Clients) {
        const strategyToImplement = StrategiesMap[strategy];
        this.strategyName = strategyToImplement.strategyName;
        this.redirectMap = strategyToImplement.redirectMap;
        this.palette = strategyToImplement.palette;
    }

    public mountRouteUrl(path: string) {
        if (BUILD_TYPE === 'INSTANCES') return path;
        return `/${this.strategyName}${path}`;
    }

    public getRouteToRedirect(route: RouteStack) {
        return this.redirectMap[route] || '/404';
    }
}
