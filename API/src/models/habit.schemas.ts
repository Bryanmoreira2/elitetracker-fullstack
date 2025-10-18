import { Schema, model } from 'mongoose';

const HabitSchemas = new Schema(
    {
        name: String,
        completedDates: [Date],
        userId: String,
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

export const habitModel = model('Habit', HabitSchemas);
