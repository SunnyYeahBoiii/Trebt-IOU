import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveDebtCommand } from './remove-debt.command';
import { PrismaService } from '@/prisma/prisma.service';
import { StatisticService } from '@/statistics/statistic.service';

@Injectable()
@CommandHandler(RemoveDebtCommand)
export class RemoveDebtHandler implements ICommandHandler<RemoveDebtCommand> {
  private readonly logger = new Logger(RemoveDebtHandler.name);

  constructor(
    private prisma: PrismaService,
    private statistics: StatisticService,
  ) {}

  async execute(command: RemoveDebtCommand): Promise<boolean | null> {
    const newDebtDto = command.debtDto;
    const prisma = command.tx ?? this.prisma;

    try {
      const newDebt = await prisma.debt.delete({
        where: {
          billId_debtorId: {
            billId: newDebtDto.billId,
            debtorId: newDebtDto.debtorId,
          },
        },
      });

      if (!newDebt) {
        throw new ConflictException('Debt not found');
      }

      await this.statistics.addLent(
        newDebt.debtorId,
        newDebt.creditorId,
        -newDebt.amount,
        prisma,
      );
      await this.statistics.addOwed(
        newDebt.creditorId,
        newDebt.debtorId,
        -newDebt.amount,
        prisma,
      );

      return true;
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      this.logger.error('Failed to execute RemoveDebtCommand', error instanceof Error ? error.stack : String(error));
      throw new InternalServerErrorException('Operation failed');
    }
  }
}
