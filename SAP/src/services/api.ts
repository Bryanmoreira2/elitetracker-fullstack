import axios from 'axios';
import { userLocalStorageKey } from '../hooks/use-user';

// Cria instância do axios com baseURL da API
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Intercepta requisições para adicionar o token de autenticação
api.interceptors.request.use((config) => {
    const useDate = localStorage.getItem(userLocalStorageKey); // Pega dados do localStorage
    const token = useDate && JSON.parse(useDate).token; // Extrai o token

    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Adiciona token no header
    }

    return config; // Retorna config com ou sem token
});
