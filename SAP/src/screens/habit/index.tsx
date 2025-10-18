import { useEffect, useRef, useState, useMemo } from 'react';

import clsx from 'clsx';
import dayjs from 'dayjs';

import { Calendar } from '@mantine/dates';
import { PaperPlaneRightIcon, TrashIcon } from '@phosphor-icons/react';

import { Header } from '../../components/header';
import { Info } from '../../components/info';
import { api } from '../../services/api';
import styles from './styles.module.css';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

// Tipagem de um hábito
type Habit = {
    _id: string;
    name: string;
    completedDates: string[];
    userId: string;
    createdAt: string;
    updatedAt: string;
};

// Tipagem para exibir as métricas de um hábito
type HabitMetrics = {
    _id: string;
    name: string;
    completedDates: string[];
};

export function Habits() {
    const [habits, setHabits] = useState<Habit[]>([]); // Lista de hábitos
    const [metrics, setMetrics] = useState<HabitMetrics>({} as HabitMetrics); // Métricas do hábito selecionado
    const [selectedHabit, setSelectedHabit] = useState<null | Habit>(null); // Hábito atualmente selecionado
    const nameInput = useRef<HTMLInputElement>(null); // Referência ao input de texto
    const today = dayjs().startOf('day'); // Data atual sem hora

    // Cálculo das métricas do mês baseado nos dias concluídos
    const metricsInfo = useMemo(() => {
        const numberOfMonthDays = today.endOf('month').get('date');
        const numberOfDays = metrics?.completedDates
            ? metrics?.completedDates?.length
            : 0;

        const completedDatesPerMonth = `${numberOfDays}/${numberOfMonthDays}`;
        const completedMonthPercent = `${Math.round((numberOfDays / numberOfMonthDays) * 100)}%`;

        return {
            completedDatesPerMonth,
            completedMonthPercent,
        };
    }, [metrics]);

    // Define o hábito selecionado
    async function handleSelectHabit(habit: Habit, currentMonth?: Date) {
        setSelectedHabit(habit);

        const { data } = await api.get<HabitMetrics>(
            `/habits/${habit._id}/matrics`,
            {
                params: {
                    date: currentMonth
                        ? currentMonth.toISOString()
                        : today.startOf('month').toISOString(),
                },
            },
        );
        console.log('Métricas do hábito:', data);

        setMetrics(data);
    }

    // Carrega hábitos da API
    async function loadHabits() {
        const { data } = await api.get<Habit[]>('/habits');
        setHabits(data);
    }

    // Cria um novo hábito com o nome digitado
    async function handleSubmit() {
        const name = nameInput.current?.value;

        if (name) {
            await api.post('/habits', {
                name,
            });
            nameInput.current.value = '';

            await loadHabits();
        }
    }

    // Marca ou desmarca o hábito como concluído no dia atual
    async function handleToggle(habit: Habit) {
        await api.patch(`/habits/${habit._id}/toggle`);
        await loadHabits();
        await handleSelectHabit(habit);
    }

    // Exclui um hábito
    async function handleDelete(id: string) {
        await api.delete(`/habits/${id}`);
        setMetrics({} as HabitMetrics);
        setSelectedHabit(null);
        await loadHabits();
    }

    async function handleSelectMonth(date: Date) {
        const currentMonth = dayjs(date).startOf('month'); // Certificando-se de que estamos começando o mês correto
        console.log('Mês selecionado:', currentMonth.toISOString());
        if (selectedHabit) {
            await handleSelectHabit(selectedHabit, currentMonth.toDate());
        }
    }

    // Carrega os hábitos ao montar o componente
    useEffect(() => {
        loadHabits();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Header title="Hábito de Diários" />
                {/* Campo para digitar e enviar um novo hábito */}
                <div className={styles.input}>
                    <input
                        ref={nameInput}
                        placeholder="Digite aqui sua Atividade"
                        type="text"
                    />
                    <PaperPlaneRightIcon onClick={handleSubmit} />
                </div>

                {/* Lista de hábitos */}
                <div className={styles.habits}>
                    {habits.map((item) => (
                        <div
                            key={item._id}
                            className={clsx(
                                styles.habit,
                                item._id === selectedHabit?._id &&
                                    styles['habit-active'],
                            )}
                        >
                            {/* Nome do hábito (selecionável) */}
                            <p
                                onClick={async () =>
                                    await handleSelectHabit(item)
                                }
                            >
                                {item.name}
                            </p>

                            {/* Checkbox de conclusão e ícone de deletar */}
                            <div>
                                <input
                                    type="checkbox"
                                    checked={item.completedDates.some(
                                        (date) => date === today.toISOString(),
                                    )}
                                    onChange={async () =>
                                        await handleToggle(item)
                                    }
                                />
                                <TrashIcon
                                    onClick={async () => handleDelete(item._id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Exibe as métricas se um hábito estiver selecionado */}
            {selectedHabit && (
                <div className={styles.metrics}>
                    <h2>{selectedHabit.name}</h2>
                    <div className={styles['info-container']}>
                        <Info
                            value={metricsInfo.completedDatesPerMonth}
                            label="Dias concluídos"
                        />
                        <Info
                            value={metricsInfo.completedMonthPercent}
                            label="Porcentagem"
                        />
                    </div>
                    {/* Calendário */}
                    <div className={styles['calender-contanier']}>
                        <div className={styles.calendarContainer}>
                            <Calendar
                                size="xl"
                                allowLevelChange={false}
                                static
                                onMonthSelect={handleSelectMonth}
                                onNextMonth={handleSelectMonth}
                                onPreviousMonth={handleSelectMonth}
                                locale="pt"
                                firstDayOfWeek={0}
                                className={styles.calendar}
                                weekdayFormat={(date) => {
                                    const dias = [
                                        'D',
                                        'S',
                                        'T',
                                        'Q',
                                        'Q',
                                        'S',
                                        'S',
                                    ];
                                    return dias[dayjs(date).day()];
                                }}
                                renderDay={(date) => {
                                    const d = dayjs(date);
                                    const day = d.date();

                                    const isCurrentMonth =
                                        d.month() === dayjs().month();
                                    const isCompleted =
                                        metrics?.completedDates?.some((item) =>
                                            dayjs(item).isSame(d, 'day'),
                                        );
                                    const isToday = d.isSame(dayjs(), 'day');

                                    const dayClass = clsx(
                                        styles.dayCell,
                                        isCompleted
                                            ? styles.dayCompleted
                                            : styles.dayDefault,
                                        !isCurrentMonth && styles.dayInactive,
                                        isToday && styles.dayToday,
                                    );

                                    return (
                                        <div className={dayClass}>{day}</div>
                                    );
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
