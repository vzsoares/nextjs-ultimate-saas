import { LayoutProps } from '@/types';
import ThemeRegistryProvider from '../../ThemeRegistry';

export default function Layout({ children, params }: LayoutProps) {
    return <ThemeRegistryProvider client={params.client}>{children}</ThemeRegistryProvider>;
}
