import { Command } from "@nestjs/cqrs";


export class AddLentCommand extends Command<void> {
    constructor(
        public readonly debtorId: string,
        public readonly creditorId: string,
        public readonly amount: number,
    ) {
        super();
    }
}