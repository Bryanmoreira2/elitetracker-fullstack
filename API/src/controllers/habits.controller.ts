import dayjs from 'dayjs';
import { type Request, type Response } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';

import { habitModel } from '../models/habit.schemas';
import { buildValidationErroMessagen } from '../utils/build-validation-error-message.util';

export class HabitsController {
    // Cria um novo hábito
    store = async (request: Request, response: Response): Promise<Response> => {
        const schemas = z.object({ name: z.string() });

        const habit = schemas.safeParse(request.body);

        if (!habit.success) {
            const errors = buildValidationErroMessagen(habit.error.issues);
            return response.status(422).json({ message: errors });
        }

        const findHabit = await habitModel.findOne({ name: habit.data.name });

        if (findHabit) {
            return response
                .status(400)
                .json({ message: 'Habit already exists' });
        }

        const newHabit = await habitModel.create({
            name: habit.data.name,
            completedDates: [],
            userId: request.user.id,
        });

        return response.status(201).json(newHabit);
    };

    // Lista todos os hábitos cadastrados
    index = async (request: Request, response: Response) => {
        const habits = await habitModel
            .find({
                userId: request.user.id,
            })
            .sort({ name: 1 });
        return response.status(200).json(habits);
    };

    // Remove um hábito pelo ID
    remove = async (request: Request, response: Response) => {
        const schemas = z.object({ id: z.string() });
        const habit = schemas.safeParse(request.params);

        if (!habit.success) {
            const errors = buildValidationErroMessagen(habit.error.issues);
            return response.status(422).json({ message: errors });
        }

        const findHabit = await habitModel.findOne({
            _id: habit.data.id,
            userId: request.user.id,
        });

        if (!findHabit) {
            return response.status(404).json({ message: 'Habit not found' });
        }

        await habitModel.deleteOne({ _id: habit.data.id });

        return response.status(204).send();
    };

    // Marca ou desmarca o hábito do dia atual
    toggle = async (request: Request, response: Response) => {
        const schema = z.object({ id: z.string() });
        const validated = schema.safeParse(request.params);

        if (!validated.success) {
            const errors = buildValidationErroMessagen(validated.error.issues);
            return response.status(422).json({ message: errors });
        }

        const findHabit = await habitModel.findOne({
            _id: validated.data.id,
            userId: request.user.id,
        });

        if (!findHabit) {
            return response.status(404).json({ message: 'Habit not found' });
        }

        const now = dayjs().startOf('day').toISOString();

        // Verifica se já está marcado para hoje
        const isHabitCompletedOnDate = findHabit
            .toObject()
            ?.completedDates.find(
                (item) => dayjs(String(item)).toISOString() === now,
            );

        if (isHabitCompletedOnDate) {
            // Desmarca o hábito de hoje
            const habitUpdated = await habitModel.findOneAndUpdate(
                { _id: validated.data.id },
                { $pull: { completedDates: now } },
                { returnDocument: 'after' },
            );
            return response.status(200).json(habitUpdated);
        }

        // Marca o hábito de hoje
        const habitUpdated = await habitModel.findOneAndUpdate(
            { _id: validated.data.id },
            { $push: { completedDates: now } },
            { returnDocument: 'after' },
        );

        return response.status(200).json(habitUpdated);
    };

    // Retorna métricas de um hábito em um mês específico
    matrics = async (request: Request, response: Response) => {
        const schema = z.object({
            id: z.string(),
            date: z.coerce.date(),
        });

        const validated = schema.safeParse({
            ...request.params,
            ...request.query,
        });

        if (!validated.success) {
            const errors = buildValidationErroMessagen(validated.error.issues);
            return response.status(402).json({ message: errors });
        }

        const dateFrom = dayjs(validated.data.date).startOf('month');
        const dateTo = dayjs(validated.data.date).endOf('month');

        // Consulta os dados do hábito filtrando as datas do mês informado
        const [habitMetrics] = await habitModel
            .aggregate()
            .match({
                _id: new mongoose.Types.ObjectId(validated.data.id),
                userId: request.user.id,
            })
            .project({
                _id: 1,
                name: 1,
                completedDates: {
                    $filter: {
                        input: '$completedDates',
                        as: 'completedDate',
                        cond: {
                            $and: [
                                {
                                    $gte: [
                                        '$$completedDate',
                                        dateFrom.toDate(),
                                    ],
                                },
                                {
                                    $lte: ['$$completedDate', dateTo.toDate()],
                                },
                            ],
                        },
                    },
                },
            });

        if (!habitMetrics) {
            return response.status(404).json({ message: 'Habit not found' });
        }

        return response.status(200).json(habitMetrics);
    };
}
