import { ICommandHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/prisma/prisma.service";
import { AddOwedCommand } from "./add-owed.command";


export class AddOwedHandler implements ICommandHandler<AddOwedCommand> {
    constructor(private prisma: PrismaService){}

    async execute(command: AddOwedCommand): Promise<void> {
        const { debtorId, creditorId, amount } = command;

        await this.prisma.statistic.updateMany({
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