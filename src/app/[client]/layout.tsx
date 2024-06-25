import { PageProps } from '@/types';
import ThemeRegistryProvider from '../../ThemeRegistry';

export default function Layout({ children, params }: PageProps) {
    return <ThemeRegistryProvider client={params.client}>{children}</ThemeRegistryProvider>;
}
