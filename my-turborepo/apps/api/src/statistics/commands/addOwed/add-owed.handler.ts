import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/prisma/prisma.service";
import { AddOwedCommand } from "./add-owed.command";
import { Injectable } from "@nestjs/common";

@Injectable()
@CommandHandler(AddOwedCommand)
export class AddOwedHandler implements ICommandHandler<AddOwedCommand> {
    constructor(private prisma: PrismaService){}

    async execute(command: AddOwedCommand): Promise<void> {
        const { debtorId, creditorId, amount } = command;

        const prisma = command.tx ?? this.prisma;

        await prisma.statistic.updateMany({
            where: {
                debtorId: debtorId,
                creditorId: creditorId,
            },
            data: {
                totalOwed: {
                    increment: amount,
                }
            }
        });
    }
}