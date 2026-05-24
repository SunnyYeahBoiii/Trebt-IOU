import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EditDebtCommand } from './edit-debt.command';
import { PrismaService } from '@/prisma/prisma.service';
import { StatisticService } from '@/statistics/statistic.service';

@Injectable()
@CommandHandler(EditDebtCommand)
export class EditDebtHandler implements ICommandHandler<
  EditDebtCommand,
  boolean
> {
  private readonly logger = new Logger(EditDebtHandler.name);

  constructor(
    private prisma: PrismaService,
    private statistics: StatisticService,
  ) {}

  async execute(command: EditDebtCommand): Promise<boolean> {
    const debtInfo = command.debt;
    const prisma = command.tx ?? this.prisma;

    try {
      const oldDebt = await prisma.debt.findFirst({
        where: {
          debtorId: debtInfo.debtorId,
          billId: debtInfo.billId,
        },
      });

      if (!oldDebt) {
        throw new ConflictException('Debt does not exists');
      }

      await this.statistics.addLent(
        oldDebt.debtorId,
        oldDebt.creditorId,
        -oldDebt.amount,
        prisma,
      );
      await this.statistics.addOwed(
        oldDebt.creditorId,
        oldDebt.debtorId,
        -oldDebt.amount,
        prisma,
      );

      const newDebt = await prisma.debt.update({
        where: {
          id: oldDebt.id,
        },
        data: {
          creditorId: debtInfo.creditorId,
          amount: debtInfo.amount,
        },
      });

      await this.statistics.addLent(
        newDebt.debtorId,
        newDebt.creditorId,
        newDebt.amount,
        prisma,
      );
      await this.statistics.addOwed(
        newDebt.creditorId,
        newDebt.debtorId,
        newDebt.amount,
        prisma,
      );

      return true;
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      this.logger.error('Failed to execute EditDebtCommand', error instanceof Error ? error.stack : String(error));
      throw new InternalServerErrorException('Operation failed');
    }
  }
}
