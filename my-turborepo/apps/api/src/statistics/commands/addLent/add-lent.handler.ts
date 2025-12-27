import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddLentCommand } from "./add-lent.command";
import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
@CommandHandler(AddLentCommand)
export class AddLentHandler implements ICommandHandler<AddLentCommand> {
    constructor(private prisma: PrismaService){}

    async execute(command: AddLentCommand): Promise<void> {
        const { debtorId, creditorId, amount } = command;

        const prisma = command.tx ?? this.prisma;

        await prisma.statistic.updateMany({
            where: {
                debtorId: debtorId,
                creditorId: creditorId,
            },
            data: {
                totalLent: {
                    increment: amount,
                }
            }
        });
    }
}