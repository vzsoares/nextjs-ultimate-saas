import { Metadata } from 'next';

import './globals.css';

import { Inter } from 'next/font/google';

import ThemeRegistryProvider from '@/ThemeRegistry';
import { Clients } from '@/types';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: `Nextjs Ultimate SaaS`,
    description: `The SaaS tamplate you needed`,
};

const BASE_CLIENT = process.env.NEXT_PUBLIC_BASE_CLIENT as Clients;

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeRegistryProvider client={BASE_CLIENT ?? 'default'}>
                    {children}
                </ThemeRegistryProvider>
            </body>
        </html>
    );
}
