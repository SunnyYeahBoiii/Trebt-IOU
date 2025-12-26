import { type DebtDto } from "@/dtos/debt.dto";
import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { Command } from "@nestjs/cqrs";



@Injectable()
export class EditDebtCommand extends Command<boolean>{
    constructor(
        public readonly debt: DebtDto,
    ){
        super()
    }
}