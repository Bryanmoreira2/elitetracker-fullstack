import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

import { AppContainer } from '../components/app-container';
import { Sidebar } from '../components/sidebar';
import { userLocalStorageKey } from '../hooks/use-user';

type PrivateRouteProps = {
    component: ReactNode;
};

export function PrivateRoute({ component }: PrivateRouteProps) {
    const userData = localStorage.getItem(userLocalStorageKey);

    if (!userData) {
        return <Navigate to="/entra" />;
    }
    return (
        <AppContainer>
            <Sidebar />
            {component}
        </AppContainer>
    );
}
