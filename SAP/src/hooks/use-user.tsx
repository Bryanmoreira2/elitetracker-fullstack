import {
    createContext,
    useState,
    useContext,
    type ReactNode,
    useEffect,
} from 'react';

import { api } from '../services/api';

// Tipos para o contexto e dados do usuário
type UserContextProps = {
    getUserInfo: (githubCode: string) => Promise<void>;
    userData: UserData;
    logout: () => void;
};

export type UserData = {
    id: string;
    name: string;
    avatarUrl: string;
    token: string;
};

type UserProviderProps = {
    children: ReactNode;
};

// Chave do localStorage
export const userLocalStorageKey = `${import.meta.env.VITE_LOCALSTORAGE_KEY}:userData`;

// Criação do contexto
const UserContext = createContext<UserContextProps>({} as UserContextProps);

export function UserProvider({ children }: UserProviderProps) {
    const [userData, setUserData] = useState<UserData>({} as UserData);

    // Salva usuário no estado e localStorage
    function putUserData(data: UserData) {
        setUserData(data);
        localStorage.setItem(userLocalStorageKey, JSON.stringify(data));
    }

    // Busca dados do usuário na API
    async function getUserInfo(githubCode: string) {
        const { data } = await api.get<UserData>('auth/callback', {
            params: { code: githubCode },
        });
        putUserData(data);
    }

    // Carrega dados salvos
    async function loadUserData() {
        const storedData = localStorage.getItem(userLocalStorageKey);
        if (storedData) setUserData(JSON.parse(storedData) as UserData);
    }

    // Remove dados do usuário
    async function logout() {
        setUserData({} as UserData);
        localStorage.removeItem(userLocalStorageKey);
    }

    // Carrega usuário ao iniciar
    useEffect(() => {
        loadUserData();
    }, []);

    // Fornece contexto para os filhos
    return (
        <UserContext.Provider value={{ userData, getUserInfo, logout }}>
            {children}
        </UserContext.Provider>
    );
}

// Hook para usar o contexto
export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within an UserProvider');
    return context;
}
