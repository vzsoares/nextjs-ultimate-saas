'use client';

import { useServerInsertedHTML } from 'next/navigation';

import { Clients } from './types';

type Palette = { 100: string; 200: string; 300: string; 400: string; 500: string };
const ClientsPalette: Record<Clients, Palette> = {
    bar: { 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444' },
    foo: { 100: '#ecfccb', 200: '#d9f99d', 300: '#bef264', 400: '#a3e635', 500: '#84cc16' },
    baz: { 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9' },
};

export default function ThemeRegistryProvider({ children, client }: { children: React.ReactNode; client: Clients }) {
    const currTheme = ClientsPalette[client];
    useServerInsertedHTML(() => {
        const styles = `:root {
  --primary-color-100: ${currTheme[100]};
  --primary-color-200: ${currTheme[200]};
  --primary-color-300: ${currTheme[300]};
  --primary-color-400: ${currTheme[400]};
  --primary-color-500: ${currTheme[500]};
}
        `;
        return (
            <style
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                    __html: styles,
                }}
            />
        );
    });
    return <>{children}</>;
}
