import { Metadata } from 'next';

import './globals.css';

import { Inter } from 'next/font/google';

import ThemeRegistryProvider from '@/ThemeRegistry';
import ensureClient from '@/utils/ensureClient';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: `Nextjs Ultimate SaaS`,
    description: `The SaaS tamplate you needed`,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeRegistryProvider client={ensureClient()}>
                    {children}
                </ThemeRegistryProvider>
            </body>
        </html>
    );
}
