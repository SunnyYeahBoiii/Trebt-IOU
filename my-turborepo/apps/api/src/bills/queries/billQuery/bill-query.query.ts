import { QueryDto } from '@/dtos/QueryDto';
import { Bill } from '@generated/prisma';
import { Injectable, Query } from '@nestjs/common';

@Injectable()
export class BillQuery {
  constructor(public readonly query: QueryDto) {
  }
}
