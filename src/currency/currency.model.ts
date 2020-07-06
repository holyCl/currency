import * as mongoose from 'mongoose';

export const CurrencySchema = mongoose.Schema({
    value: { type: Number, required: true },
    currency: { type: String, required: true },
    date: {type: Date, required: true},
    updatedAt: {
        type: Date,
        default: Date.now
      }
});

export interface Currency {
    value: string;
    currency: AllowedCurrency;
    date: string;
    updatedAt: Date;
}

export enum AllowedCurrency {
    USD = 'usd',
    EUR = 'eur'
}