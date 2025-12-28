export type BillType = "SPLITTING" | "EACHONE";

export interface BillDto {
  id: string;
  creditorId: string;
  debtorIDs: string;     // multiple debtors
  description: string;
  billType: BillType;      // use enum, not string
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
