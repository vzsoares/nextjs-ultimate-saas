import { LayoutProps } from '@/types';
import ensureClient from '@/utils/ensureClient';
import ThemeRegistryProvider from '../../ThemeRegistry';

export default function Layout({ children, params }: LayoutProps) {
    return (
        <ThemeRegistryProvider client={ensureClient(params.client)}>
            {children}
        </ThemeRegistryProvider>
    );
}
