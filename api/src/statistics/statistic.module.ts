import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AddLentHandler } from './commands/addLent/add-lent.handler';
import { AddOwedHandler } from './commands/addOwed/add-owed.handler';
import { PrismaModule } from '@/prisma/prisma.module';
import { StatisticService } from './statistic.service';
import { QueryStatisticQueryHandler } from './queries/queryStatistic/query-statistic.handler';

const Handlers = [AddLentHandler, AddOwedHandler , QueryStatisticQueryHandler];

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [...Handlers, StatisticService],
  exports: [StatisticService],
})
export class StatisticModule {}
