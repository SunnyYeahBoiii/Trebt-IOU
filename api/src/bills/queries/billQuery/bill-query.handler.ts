import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BillQuery } from './bill-query.query';
import { Bill, Prisma } from '@generated/prisma';
import { PrismaService } from '@/prisma/prisma.service';
import { QueryDto } from '@/dtos/QueryDto';

@Injectable()
@QueryHandler(BillQuery)
export class BillQueryHandler implements IQueryHandler<BillQuery, Bill[]> {
  constructor(private prisma: PrismaService) {}

  async execute(command: BillQuery): Promise<Bill[]> {
    const query: QueryDto = command.query;
    const where: Prisma.BillWhereInput = {};
    const debtors = query.debtorIds?.split(',');
    const creditors = query.creditorIds?.split(',');

    if (creditors) {
      where.creditorId = { in: creditors };
    }
    if (query.lowerAmount != null || query.upperAmount != null) {
      where.totalAmount = {};
      if (query.lowerAmount != null) where.totalAmount.gte = query.lowerAmount;
      if (query.upperAmount != null) where.totalAmount.lte = query.upperAmount;
    }
    if (debtors) {
      where.AND = debtors.map((debtor) => ({
        debtorIDs: {
          contains: debtor,
        },
      }));
    }
    return this.prisma.bill.findMany({
      where,
      orderBy: {
        updatedAt: query.timeAsc ? 'asc' : 'desc',
      },
    });
  }
}
