import { Link, useLocation, useNavigate } from 'react-router';

import clsx from 'clsx';

import {
    ClockClockwiseIcon,
    ListChecksIcon,
    SignOutIcon,
} from '@phosphor-icons/react';

import { useUser } from '../../hooks/use-user';
import style from './styles.module.css';

export function Sidebar() {
    const { userData, logout } = useUser();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    function handleLogout() {
        logout();
        navigate('/entra');
    }
    return (
        <div className={style.container}>
            <img src={userData.avatarUrl} alt={userData.name} />
            <div className={style.links}>
                <Link to="/">
                    <ListChecksIcon
                        className={clsx(pathname === '/' ? style.active : '')}
                    />
                </Link>
                <Link to="/foco">
                    <ClockClockwiseIcon
                        className={clsx(pathname === '/foco' && style.active)}
                    />
                </Link>
            </div>
            <SignOutIcon onClick={handleLogout} className={style.signgout} />
        </div>
    );
}
