import dayjs from 'dayjs';
import { type Request, type Response } from 'express';
import { z } from 'zod';

import { focusTimeModel } from '../models/focus-time.model';
import { buildValidationErroMessagen } from '../utils/build-validation-error-message.util';

export class FocusTimeController {
    // Cria um novo período de foco
    store = async (request: Request, response: Response) => {
        // Validação dos dados com zod
        const schemas = z.object({
            timeFrom: z.coerce.date(),
            timeTo: z.coerce.date(),
        });

        const focusTime = schemas.safeParse(request.body);

        // Retorna erro se os dados forem inválidos
        if (!focusTime.success) {
            const errors = buildValidationErroMessagen(focusTime.error.issues);
            return response.status(402).json({ message: errors });
        }

        // Converte para objetos dayjs para manipulação de datas
        const timeFrom = dayjs(focusTime.data?.timeFrom);
        const timeTo = dayjs(focusTime.data?.timeTo);

        // Verifica se a data final é anterior à data inicial
        const isTimeToBeforeTimeFrom = timeTo.isBefore(timeFrom);

        if (isTimeToBeforeTimeFrom) {
            return response
                .status(400)
                .json({ message: 'Time To cannot be in the past ' });
        }

        // Cria e salva o novo período de foco no banco
        const createdFocusTime = await focusTimeModel.create({
            timeFrom: timeFrom.toDate(),
            timeTo: timeTo.toDate(),
            userId: request.user.id,
        });

        // Retorna o novo foco criado
        return response.status(201).json(createdFocusTime);
    };

    index = async (request: Request, response: Response) => {
        const schema = z.object({
            date: z.coerce.date(),
        });

        const validated = schema.safeParse(request.query);

        if (!validated.success) {
            const errors = buildValidationErroMessagen(validated.error.issues);
            return response.status(402).json({ message: errors });
        }

        const startDate = dayjs(validated.data.date).startOf('day');
        const endDate = dayjs(validated.data.date).endOf('day');

        const focusTimes = await focusTimeModel
            .find({
                timeFrom: {
                    $gte: startDate.toDate(),
                    $lte: endDate.toDate(),
                },
            })
            .sort({
                timeFrom: 1,
            });

        return response.status(200).json(focusTimes);
    };

    metricsByMonth = async (request: Request, response: Response) => {
        const schema = z.object({
            date: z.coerce.date(),
        });

        const validated = schema.safeParse(request.query);

        if (!validated.success) {
            const errors = buildValidationErroMessagen(validated.error.issues);
            return response.status(402).json({ message: errors });
        }

        const startDate = dayjs(validated.data.date).startOf('month');
        const endDate = dayjs(validated.data.date).endOf('month');

        const focusTimeMetrics = await focusTimeModel
            .aggregate()
            .match({
                timeFrom: {
                    $gte: startDate.toDate(),
                    $lte: endDate.toDate(),
                },
                userId: request.user.id,
            })

            .project({
                year: {
                    $year: '$timeFrom',
                },
                month: {
                    $month: '$timeFrom',
                },
                day: {
                    $dayOfMonth: '$timeFrom',
                },
            })
            .group({
                _id: ['$year', '$month', '$day'],
                count: {
                    $sum: 1,
                },
            })
            .sort({
                _id: 1,
            });
        return response.status(200).json(focusTimeMetrics);
    };
}
