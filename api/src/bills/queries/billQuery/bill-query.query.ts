import { QueryDto } from '@/dtos/QueryDto';
import { Bill } from '@generated/prisma';
import { Injectable } from '@nestjs/common';
import { Query } from '@nestjs/cqrs';
@Injectable()
export class BillQuery extends Query<Bill[]> {
  constructor(public readonly query: QueryDto) {
    super();
  }
}
