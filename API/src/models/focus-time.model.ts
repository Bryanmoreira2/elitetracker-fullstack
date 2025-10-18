import { Schema, model } from 'mongoose';

const FocusSchemas = new Schema(
    {
        timeFrom: {
            type: Date,
            required: true,
        },
        timeTo: {
            type: Date,
            required: true,
        },
        userId: {
            type: String,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

export const focusTimeModel = model('FocusTime', FocusSchemas);
