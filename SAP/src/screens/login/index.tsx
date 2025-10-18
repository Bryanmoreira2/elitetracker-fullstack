import { GithubLogoIcon } from '@phosphor-icons/react';

import { Button } from '../../components/button';
import { api } from '../../services/api';
import styles from './styles.module.css';

export function Login() {
    // const navigate = useNavigate();

    async function hadleAuth() {
        const { data } = await api.get('/auth');

        window.location.href = data.redirecUrl;
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1>Entra com</h1>
                <Button onClick={hadleAuth}>
                    <GithubLogoIcon />
                    GitHub
                </Button>
                <p>
                    Ao acessar, concordo com os Termos de Serviço e a Política de
                    Privacidade.
                </p>
            </div>
        </div>
    );
}
