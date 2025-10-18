import { useEffect, useRef, useState, useMemo } from 'react';
import { useTimer } from 'react-timer-hook';

import dayjs from 'dayjs';

import { Indicator } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { AlarmIcon, PlusIcon } from '@phosphor-icons/react';

import { Button } from '../../components/button';
import { Header } from '../../components/header';
import { Info } from '../../components/info';
import { api } from '../../services/api';
import styles from './styles.module.css';

// Tipos para tempos de foco e descanso
type Timers = {
    focus: number;
    rest: number;
};

// Tipo para métricas de foco retornadas da API
type FocusMetrics = {
    _id: [number, number, number];
    count: number;
};

type FocusTime = {
    _id: string;
    timeFrom: string;
    timeTo: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
};

// Enum para representar o estado atual do cronômetro
enum TimerState {
    PAUSED = 'PAUSED',
    FOCUS = 'FOCUS',
    REST = 'REST',
}

// Títulos descritivos para cada estado do cronômetro
const TimerStateTitle = {
    [TimerState.PAUSED]: 'Pausado',
    [TimerState.FOCUS]: 'Em foco',
    [TimerState.REST]: 'Em descanso',
};

export function Focus() {
    // Referências para inputs de tempo
    const focusInput = useRef<HTMLInputElement>(null);
    const restInput = useRef<HTMLInputElement>(null);

    // Estados principais do componente
    const [timers, setTimers] = useState<Timers>({ focus: 0, rest: 0 });
    const [timerState, setTimerState] = useState<TimerState>(TimerState.PAUSED);
    const [timeFrom, setTimeFrom] = useState<Date | null>();
    const [focusMetrics, setFocusMetrics] = useState<FocusMetrics[]>([]);
    const [focusTimes, setFocusTimes] = useState<FocusTime[]>([]);
    const [currentMonth, setcurrentMonth] = useState<dayjs.Dayjs>(
        dayjs().startOf('month'),
    );
    const [currentDate, setCurrentDate] = useState<dayjs.Dayjs>(
        dayjs().startOf('day'),
    );

    // Função para somar segundos a uma data
    function addSeconds(date: Date, seconds: number) {
        const time = dayjs(date).add(seconds, 'seconds');
        return time.toDate();
    }

    // Inicia o tempo de foco
    function handleTimerStart() {
        restTimer.pause();
        const now = new Date();
        focusTimer.restart(addSeconds(now, timers.focus * 60));
        setTimeFrom(now);
    }

    // Finaliza o tempo de foco e envia os dados para a API
    async function handleEnd() {
        focusTimer.pause();
        await api.post('/focus-time', {
            timeFrom: timeFrom?.toISOString(),
            timeTo: new Date().toISOString(),
        });
        setTimeFrom(null);
    }

    // Configuração do timer de foco
    const focusTimer = useTimer({
        expiryTimestamp: new Date(),
        async onExpire() {
            if (timerState !== TimerState.PAUSED) {
                await handleEnd();
            }
        },
    });

    // Configuração do timer de descanso
    const restTimer = useTimer({
        expiryTimestamp: new Date(),
    });

    // Adiciona 5 minutos ao tempo de foco ou descanso
    function handleAddMinutos(type: 'focus' | 'rest') {
        const inputRef = type === 'focus' ? focusInput : restInput;
        const currentValue = Number(inputRef.current?.value);

        if (inputRef.current) {
            const value = currentValue + 5;
            inputRef.current.value = String(value);
            setTimers((old) => ({
                ...old,
                [type]: value,
            }));
        }
    }

    // Cancela o ciclo e reseta o estado
    function handleCancelar() {
        setTimers({ focus: 0, rest: 0 });
        setTimerState(TimerState.PAUSED);

        if (focusInput.current) focusInput.current.value = '';
        if (restInput.current) restInput.current.value = '';
    }

    // Inicia o ciclo de foco
    function handleStart() {
        if (timers.focus <= 0 || timers.rest <= 0) return;

        handleTimerStart();
        setTimerState(TimerState.FOCUS);
    }

    // Inicia o período de descanso após o foco
    async function handleRest() {
        await handleEnd();
        const now = new Date();
        restTimer.restart(addSeconds(now, timers.rest * 60));
        setTimerState(TimerState.REST);
    }

    // Retoma o foco após o descanso
    function handleResumir() {
        handleTimerStart();
        setTimerState(TimerState.FOCUS);
    }

    async function loadFocusMetrics(currentMonth: string) {
        const { data } = await api.get<FocusMetrics[]>('/focus-time/metrics', {
            params: {
                date: currentMonth,
            },
        });
        setFocusMetrics(data || []);
    }

    async function loadFocusTimes(currentDate: string) {
        const { data } = await api.get<FocusTime[]>('/focus-time', {
            params: {
                date: currentDate,
            },
        });
        setFocusTimes(data || []);
    }

    const matricsInfoByDay = useMemo(() => {
        const timesMetrics = focusTimes.map((item) => ({
            timeFrom: dayjs(item.timeFrom),
            timeTo: dayjs(item.timeTo),
        }));

        let totalTimeInMinutes = 0;

        if (timesMetrics.length) {
            for (const { timeFrom, timeTo } of timesMetrics) {
                const diff = timeTo.diff(timeFrom, 'minutes');
                totalTimeInMinutes += diff;
            }
        }
        return {
            timesMetrics,
            totalTimeInMinutes,
        };
    }, [focusTimes]);

    const matricsInfoByMonth = useMemo(() => {
        const completedDates: string[] = [];
        let counter = 0;

        if (focusMetrics.length) {
            focusMetrics.forEach((item) => {
                const date = dayjs(
                    `${item._id[0]}-${item._id[1]}-${item._id[2]}`,
                )
                    .startOf('day')
                    .toISOString();
                completedDates.push(date);
                counter += item.count;
            });
        }

        return { completedDates, counter };
    }, [focusMetrics]);

    const focusTimelineData = useMemo(() => {
        return focusTimes
            .map((item) => {
                const timeFrom = dayjs(item.timeFrom);
                const timeTo = dayjs(item.timeTo);
                const duration = timeTo.diff(timeFrom, 'minutes');

                return {
                    id: item._id,
                    timeRange: `${timeFrom.format('HH:mm')} - ${timeTo.format('HH:mm')}`,
                    duration: `${duration} minutos`,
                    timeFrom,
                    timeTo,
                };
            })
            .sort((a, b) => a.timeFrom.valueOf() - b.timeFrom.valueOf()); // Ordena por horário
    }, [focusTimes]);

    // Seleciona o mês atual no calendário
    async function handleSelectMonth(date: Date) {
        setcurrentMonth(dayjs(date));
    }

    async function handleSelectDay(date: Date) {
        setCurrentDate(dayjs(date));
    }

    // Atualiza as métricas sempre que o mês mudar
    useEffect(() => {
        loadFocusMetrics(currentMonth.toISOString());
    }, [currentMonth]);

    useEffect(() => {
        loadFocusTimes(currentDate.toISOString());
    }, [currentDate]);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Header title="Tempo de Foco" />

                <div className={styles['input-grup']}>
                    <div className={styles.input}>
                        <PlusIcon onClick={() => handleAddMinutos('focus')} />
                        <input
                            ref={focusInput}
                            placeholder="Tempo de foco"
                            type="number"
                            disabled
                        />
                    </div>
                    <div className={styles.input}>
                        <PlusIcon onClick={() => handleAddMinutos('rest')} />
                        <input
                            ref={restInput}
                            placeholder="Tempo de pausa"
                            type="number"
                            disabled
                        />
                    </div>
                </div>

                <div className={styles.time}>
                    <strong>{TimerStateTitle[timerState]}</strong>
                    {timerState === TimerState.PAUSED && (
                        <span>{`${String(timers.focus).padStart(2, '0')}:00`}</span>
                    )}
                    {timerState === TimerState.FOCUS && (
                        <span>
                            {`${String(focusTimer.minutes).padStart(2, '0')}:${String(focusTimer.seconds).padStart(2, '0')}`}
                        </span>
                    )}
                    {timerState === TimerState.REST && (
                        <span>
                            {`${String(restTimer.minutes).padStart(2, '0')}:${String(restTimer.seconds).padStart(2, '0')}`}
                        </span>
                    )}
                </div>

                <div className={styles['button-grup']}>
                    {timerState === TimerState.PAUSED && (
                        <Button
                            onClick={handleStart}
                            disabled={timers.focus <= 0 || timers.rest <= 0}
                        >
                            Começar
                        </Button>
                    )}
                    {timerState === TimerState.FOCUS && (
                        <Button onClick={handleRest}>Iniciar Descanso</Button>
                    )}
                    {timerState === TimerState.REST && (
                        <Button onClick={handleResumir}>Retomar</Button>
                    )}
                    <Button onClick={handleCancelar} variant="error">
                        Cancelar
                    </Button>
                </div>
            </div>

            <div className={styles.metrics}>
                <h2>Estatísticas</h2>
                <div className={styles['info-container']}>
                    <Info
                        value={String(matricsInfoByMonth.counter)}
                        label="Ciclos Totais"
                    />
                    <Info
                        value={`${matricsInfoByDay.totalTimeInMinutes} minutos`}
                        label="Tempo total de foco"
                    />
                </div>

                {/* Timeline de foco do dia selecionado */}
                <div className={styles.focustimelinec}>
                    <h3 className={styles.focusdateheader}>
                        {currentDate.format('D [de] MMMM')}
                    </h3>

                    {focusTimes.length > 0 ? (
                        <div className={styles.listwrapper}>
                            <ul>
                                {focusTimes.map((session, index) => {
                                    const from = dayjs(session.timeFrom).format(
                                        'HH:mm',
                                    );
                                    const to = dayjs(session.timeTo).format(
                                        'HH:mm',
                                    );
                                    const diff = dayjs(session.timeTo).diff(
                                        dayjs(session.timeFrom),
                                        'minute',
                                    );

                                    return (
                                        <li
                                            key={session._id || index}
                                            className={styles.focusitem}
                                        >
                                            <div className={styles.iconline}>
                                                <AlarmIcon size={23} />
                                                {index !==
                                                    focusTimes.length - 1 && (
                                                    <div
                                                        className={
                                                            styles.vertline
                                                        }
                                                    ></div>
                                                )}
                                            </div>

                                            <div
                                                className={styles.focuscontent}
                                            >
                                                <span
                                                    className={
                                                        styles.focustimerange
                                                    }
                                                >
                                                    {from} - {to}
                                                </span>
                                                <span
                                                    className={
                                                        styles.focusduration
                                                    }
                                                >
                                                    {diff} minutos
                                                </span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : (
                        <div className={styles.nodata}>
                            <p>Nenhum foco registrado neste dia</p>
                        </div>
                    )}
                </div>

                <div className={styles['calender-contanier']}>
                    <div className={styles.calendarContainer}>
                        <Calendar
                            className={styles.calendar}
                            getDayProps={(date) => ({
                                selected: dayjs(date).isSame(
                                    currentDate,
                                    'day',
                                ),
                                onClick: async () =>
                                    await handleSelectDay(date),
                            })}
                            size="xl"
                            allowLevelChange={false}
                            static
                            onMonthSelect={handleSelectMonth}
                            onNextMonth={handleSelectMonth}
                            onPreviousMonth={handleSelectMonth}
                            locale="pt"
                            firstDayOfWeek={0}
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
                                const isSomeDate =
                                    matricsInfoByMonth.completedDates.some(
                                        (item) =>
                                            dayjs(item).isSame(
                                                dayjs(date),
                                                'day',
                                            ),
                                    );

                                const isToday = dayjs(date).isSame(
                                    dayjs(),
                                    'day',
                                );
                                const isCurrentMonth = dayjs(date).isSame(
                                    currentMonth,
                                    'month',
                                );

                                // Define a classe de estilo
                                let dayClass = styles.dayCell;
                                if (!isCurrentMonth) {
                                    dayClass = `${styles.dayCell} ${styles.dayInactive}`;
                                } else if (isSomeDate) {
                                    dayClass = `${styles.dayCell} ${styles.dayCompleted}`;
                                } else {
                                    dayClass = `${styles.dayCell} ${styles.dayDefault}`;
                                }

                                if (isToday) {
                                    dayClass += ` ${styles.dayToday}`;
                                }

                                return (
                                    <div className={dayClass}>
                                        {dayjs(date).date()}
                                    </div>
                                );
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
