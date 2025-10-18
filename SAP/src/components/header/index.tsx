import styles from './styles.module.css';

type HearderProps = {
    title: string;
};

export function Header({ title }: HearderProps) {
    return (
        <header className={styles.container}>
            <h1>{title}</h1>
            <span>{`Hoje,${new Intl.DateTimeFormat('pt-BR', {
                dateStyle: 'long',
                timeZone: 'America/Sao_Paulo',
            }).format(new Date())}`}</span>
        </header>
    );
}
