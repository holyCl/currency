import { Module } from '@nestjs/common';
import { CurrencyModule } from './currency/currency.module';
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CurrencyModule, 
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`mongodb://mongo/currency`, { useNewUrlParser: true })
  ]
})
export class AppModule {}