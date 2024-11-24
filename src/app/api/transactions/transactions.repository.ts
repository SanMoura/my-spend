'use server'

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ICreateFormTransaction } from "@/interfaces/ITransactions";
import dayjs from 'dayjs'

type findOneParams = {
  year: string;
  month: string;
}
export async function findMany(data: findOneParams) {
  try {

    const { year, month } = data

    const transactions = await prisma.transactions.findMany({
      where: {
        competence_date: {
          gte: new Date(`${year}-${month}-01`),
          lte: new Date(`${year}-${month}-31`),
        }
      },
      include: { installment: true, credit_card: true },
    });

    const creditCardTotals = transactions.reduce((totals, transaction) => {
      if (transaction.credit_card) {
        const cardId = transaction.credit_card.id;
        const cardDescription = transaction.credit_card.describe;
  
        if (!totals[cardId]) {
          totals[cardId] = {
            credit_card_id: cardId,
            credit_card_description: cardDescription,
            totalValue: 0,
            transactionCount: 0,
          };
        }
  
        totals[cardId].totalValue += transaction.value;
        totals[cardId].transactionCount += 1;
      }
  
      return totals;
    }, {} as Record<string, { credit_card_id: string; credit_card_description: string; totalValue: number; transactionCount: number }>);
   

    // Transforma os resultados em uma lista
    const creditCardTotalsList = Object.values(creditCardTotals);

    return {
      transactions,
      creditCardTotals: creditCardTotalsList,
    };
  } catch (error) {
    return {data: [], error: "Failed to fetch transactions"}
      
    }
  }

