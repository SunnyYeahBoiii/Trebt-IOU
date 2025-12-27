import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DebtsModule } from './debts/debts.module';
import { ConfigService } from '@nestjs/config';
import { BillModule } from './bills/bill.module';
import { StatisticModule } from './statistics/statistic.module';
import { CqrsModule } from '@nestjs/cqrs';

@Global()
@Module({
  imports: [
    DebtsModule,
    BillModule,
    DebtsModule,
    StatisticModule,
    CqrsModule
  ],
  controllers: [AppController],
  providers: [AppService , ConfigService],
})
export class AppModule {}
