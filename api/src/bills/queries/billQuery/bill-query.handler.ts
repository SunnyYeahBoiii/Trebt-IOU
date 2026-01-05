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

    console.log(query);

    if (query.creditorId) where.creditorId = query.creditorId;
    if (query.lowerAmount || query.upperAmount) {
      where.totalAmount = {};
      if (query.lowerAmount) where.totalAmount.gte = query.lowerAmount;
      if (query.upperAmount) where.totalAmount.lte = query.upperAmount;
    }
    if(debtors){
      where.AND = debtors.map(debtor => ({
        debtorIDs: {
          contains: debtor,
        }
      }))
    }
    return this.prisma.bill.findMany({
      where,
      orderBy: { 
        updatedAt: query.timeAsc ? 'asc' : 'desc', 
        // totalAmount: query.amountAsc ? 'asc' : 'desc',
      },
    });
  }
}
