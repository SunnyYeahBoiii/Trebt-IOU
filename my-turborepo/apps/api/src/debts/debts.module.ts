import { Module } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { CqrsModule, QueryHandlerNotFoundException } from '@nestjs/cqrs';
import { StatisticModule } from '@/statistics/statistic.module';
import { AddDebtHandler } from './commands/debts/addDebt/add-debt.handler';
import { EditDebtHandler } from './commands/debts/editDebt/edit-debt.handler';
import { RemoveDebtHandler } from './commands/debts/removeDebt/remove-debt.handler';

const Handlers = [AddDebtHandler , EditDebtHandler , RemoveDebtHandler]

@Module({
  imports: [PrismaModule, CqrsModule , StatisticModule],
  providers: [DebtsService , ...Handlers],
  exports: [DebtsService],
})
export class DebtsModule {}
