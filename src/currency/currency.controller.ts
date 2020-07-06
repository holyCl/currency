import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { GetCurrencyDto } from './dto/get-currency.dto';
import { ConvertCurrencyDto } from './dto/convert-currency.dto';
import { isPositive } from 'class-validator';

@Controller('currency')
export class CurrencyController {
    constructor(private currencyService: CurrencyService) {}

    @Get('/latest/:currency')
    async getCurrency(@Param(ValidationPipe) getCurrency: GetCurrencyDto) {
        return await this.currencyService.getCurrency(getCurrency);
    }

    @Get('/history/:currency/:date')
    async findAll(@Query('amount') amount, @Param() params : ConvertCurrencyDto) {

        return await this.currencyService.convertCurrency(params, amount);
    }
}