import { createBrowserRouter } from 'react-router';

import { Auth } from '../screens/auth';
import { Focus } from '../screens/focus';
import { Habits } from '../screens/habit';
import { Login } from '../screens/login';
import { PrivateRoute } from './private-route';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <PrivateRoute component={<Habits />} />,
    },
    {
        path: '/foco',
        element: <PrivateRoute component={<Focus />} />,
    },
    {
        path: '/entra',
        element: <Login />,
    },

    {
        path: '/autenticacao',
        element: <Auth />,
    },
]);
