import { Command } from "@nestjs/cqrs";
import { Prisma } from '@generated/prisma';


export class AddLentCommand extends Command<void> {
    constructor(
        public readonly debtorId: string,
        public readonly creditorId: string,
        public readonly amount: number,
        public readonly tx?: Prisma.TransactionClient,
    ) {
        super();
    }
}