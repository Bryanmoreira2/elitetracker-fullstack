import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { RouterProvider } from 'react-router';

import { MantineProvider } from '@mantine/core';

import { UserProvider } from './hooks/use-user';
import { router } from './routes';

export function App() {
    return (
        <UserProvider>
            <MantineProvider defaultColorScheme="dark">
                <RouterProvider router={router} />
            </MantineProvider>
        </UserProvider>
    );
}
