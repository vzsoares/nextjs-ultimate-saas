'use client';

import { useServerInsertedHTML } from 'next/navigation';

import { ClientStrategyContext } from './ClinetInterface';
import { Clients } from './types';

export default function ThemeRegistryProvider({
    children,
    client,
}: {
    children: React.ReactNode;
    client: Clients;
}) {
    const ClientContext = new ClientStrategyContext(client);
    const palette = ClientContext.palette.primary;

    useServerInsertedHTML(() => {
        const styles = `:root {
  --primary-color-100: ${palette[100]};
  --primary-color-200: ${palette[200]};
  --primary-color-300: ${palette[300]};
  --primary-color-400: ${palette[400]};
  --primary-color-500: ${palette[500]};
}`;

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
