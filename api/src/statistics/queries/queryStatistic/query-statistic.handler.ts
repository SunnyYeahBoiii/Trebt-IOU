import { Injectable } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import {QueryStatisticQuery } from "./query-statistic.query";
import { StatisticDto } from "@/dtos/statistic.dto";
import { PrismaService } from "@/prisma/prisma.service";




@Injectable()
@QueryHandler(QueryStatisticQuery)
export class QueryStatisticQueryHandler implements IQueryHandler<number , StatisticDto[]>{
    constructor(private readonly prisma: PrismaService){

    }

    async execute(): Promise<StatisticDto[]> {
        const data = this.prisma.statistic.findMany({
            select:{
                id: true,
                creditorId: true,
                debtorId: true,
                totalLent: true,
                totalOwed: true,
            }
        });
        return data;
    }
} 