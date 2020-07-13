import { AllowedCurrency } from "../currency.model";
import { IsOptional, IsIn, MinDate, MaxDate } from "class-validator";
import { Transform } from 'class-transformer';

export class ConvertCurrencyDto {
    @IsOptional()
    @IsIn([AllowedCurrency.USD, AllowedCurrency.EUR])
    currency: AllowedCurrency;

    @Transform(x => new Date(x))
    @MinDate(new Date("2020-01-01"))
    @MaxDate(new Date("2040-01-01"))
    date: Date;

}AllowedCurrency