import { Injectable } from '@nestjs/common';
import {
  CommandHandler,
  ICommandHandler,
  IQueryHandler,
  QueryHandler,
} from '@nestjs/cqrs';
import { BillQuery } from './bill-query.query';
import { QueryDto } from '@/dtos/QueryDto';
import { $Enums, Bill } from '@generated/prisma';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
@QueryHandler(BillQuery)
export class BillQueryHandler implements IQueryHandler<BillQuery, Bill[]> {
  constructor(private prisma: PrismaService) {}

  async execute(command: BillQuery): Promise<Bill[]> {
    const query = command.query;
    const where: any = {};
    if (query.creditorId) where.creditorId = query.creditorId;
    if (query.lowerAmount) where.totalAmount.gte = query.lowerAmount;
    if (query.upperAmount) where.totalAmount.lte = query.upperAmount;
    return this.prisma.bill.findMany({
      where,
      orderBy: { createdAt: query.timeDesc === false ? 'asc' : 'desc' },
    });
  }
}
