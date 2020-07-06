import { Injectable, HttpService, UnprocessableEntityException } from '@nestjs/common';
import { Currency, AllowedCurrency } from './currency.model';
import { GetCurrencyDto } from './dto/get-currency.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosResponse } from 'axios';

@Injectable()
export class CurrencyService {
    constructor(
        @InjectModel('Currency') private readonly currencyModel: Model<Currency>, 
        private httpService: HttpService
    ) {}

    isToday(date) {
        return new Date().toDateString() == new Date(date).toDateString();
    }

    async syncCurrency(currency: string, date: string):  Promise<AxiosResponse> {
        let formatedDate = this.isToday(date) ? "" : JSON.stringify(date).split("T")[0].substr(1);        
        let response;

        try {
            response = await this.httpService.get(`https://free.currconv.com/api/v7/convert?q=${currency}_UAH&compact=ultra&date=${formatedDate}&apiKey=${process.env.API_TOKEN}`).toPromise();
          } catch(err) {
            throw new UnprocessableEntityException();           
        }

        return response;
    }

    async checkSyncCurrency(currencyObject: Currency) : Promise<Currency> {
        if (currencyObject.updatedAt) {           
            const updateTimestamp = new Date(currencyObject.updatedAt).getTime();
            const currentTimestamp = new Date().getTime();
            const syncInterval = parseInt(process.env.SYNC_INTERVAL); //hours 

            if (currentTimestamp - updateTimestamp > syncInterval * 60 * 60 * 1000){
                return this.handleSyncResponse(currencyObject);
            }
        }

        return currencyObject; 
    }

    async handleSyncResponse(currencyObject) : Promise<Currency> {
        let latestCurrencyValue;
        const resp = await this.syncCurrency(currencyObject.currency, currencyObject.date);

        if (this.isToday(currencyObject.date)){
            latestCurrencyValue = Object.values(resp.data)[0];
        } else {
            latestCurrencyValue = Object.values(Object.values(resp.data)[0])[0];
        }

        return this.updateCurrency(latestCurrencyValue, currencyObject.currency, currencyObject.date);
    }

    async getCurrency(getCurrencyDto: GetCurrencyDto) {
        if (!getCurrencyDto.date){
            getCurrencyDto.date = new Date()
        }
        getCurrencyDto.date.setHours(3,0,0,0);

        let existedCurrency = await this.currencyModel.findOne({
            "currency": getCurrencyDto.currency,
            "date": getCurrencyDto.date
        });

        let currency = existedCurrency ? 
            await this.checkSyncCurrency(existedCurrency) :
            await this.handleSyncResponse(getCurrencyDto);

        return (+currency.value).toFixed(2);
    }

    async updateCurrency(value, currency: AllowedCurrency, date: string) {
        const doc = await this.currencyModel.findOne({ currency: currency, date: date });
        if (!doc){
            let newCurrency = new this.currencyModel({value, currency, date});
            return await newCurrency.save();
        } else {
            doc.overwrite({value, currency, date});
            return await doc.save();
        }
    }

    async convertCurrency(params, amount) {
        if (+amount <= 0) throw new UnprocessableEntityException();    
        const curency = await this.getCurrency(params);

        return (+curency * amount);        
    }
}