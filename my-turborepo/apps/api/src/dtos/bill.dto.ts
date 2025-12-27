import { BillType } from "@generated/prisma";

export class BillDto{
    id?: string;
    creditorId: string;
    debtorIDs: string;
    description?: string;
    totalAmount: number;
    billType: BillType;
}