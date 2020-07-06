import { AllowedCurrency } from "../currency.model";
import { IsOptional, IsIn, isDate } from "class-validator";

export class GetCurrencyDto {
    @IsOptional()
    @IsIn([AllowedCurrency.USD, AllowedCurrency.EUR])
    currency: AllowedCurrency;
    
    date: Date;
}AllowedCurrency