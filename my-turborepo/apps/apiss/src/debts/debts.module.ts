import { Module } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { CqrsModule } from '@nestjs/cqrs';
import { StatisticModule } from '@/statistics/statistic.module';

@Module({
  imports: [PrismaModule, CqrsModule , StatisticModule],
  providers: [DebtsService],
  exports: [DebtsService],
})
export class DebtsModule {}
