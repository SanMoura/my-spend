import { Prisma } from '@prisma/client';
export interface ICreateFormTransaction {
  describe: Prisma.transactionsCreateInput['describe'];
  value: Prisma.transactionsCreateInput['value'];
  type: Prisma.transactionsCreateInput['type'] | "none";
  due_date: Prisma.transactionsCreateInput['due_date'] | null;
  current_installment: number;
  installments: number,
  installment_value: number;
  credit_card_id: Prisma.credit_cardCreateInput['id'] | null;
  status: Prisma.transactionsCreateInput['status'];
  competence_date: Prisma.transactionsCreateInput['competence_date'];
}