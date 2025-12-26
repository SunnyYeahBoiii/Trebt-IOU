import { ICommandHandler } from "@nestjs/cqrs";
import { AddLentCommand } from "./add-lent.command";
import { PrismaService } from "@/prisma/prisma.service";


export class AddLentHandler implements ICommandHandler<AddLentCommand> {
    constructor(private prisma: PrismaService){}

    async execute(command: AddLentCommand): Promise<void> {
        const { debtorId, creditorId, amount } = command;

        await this.prisma.statistic.updateMany({
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