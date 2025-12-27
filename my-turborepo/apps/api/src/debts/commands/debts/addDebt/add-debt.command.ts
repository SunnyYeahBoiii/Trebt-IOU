import { type DebtDto } from "@/dtos/debt.dto";
import { Debt, Prisma } from "@generated/prisma";
import { Injectable } from "@nestjs/common";
import { Command } from "@nestjs/cqrs";


@Injectable()
export class AddDebtCommand extends Command<Debt | null>{
    constructor(
        public readonly debtDto: DebtDto,
        public readonly tx?: Prisma.TransactionClient,
    ) {
        super()
    }
}