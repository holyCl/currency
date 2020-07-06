import {IsNotEmpty, IsPositive} from 'class-validator';
import { AllowedCurrency } from '../currency.model';

export class UpdateCurrencyDto{
    @IsNotEmpty()
    @IsPositive()
    value: number;

    @IsNotEmpty()
    currency: AllowedCurrency;
}