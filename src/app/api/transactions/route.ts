import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ICreateFormTransaction } from "@/interfaces/ITransactions";
import dayjs from 'dayjs'
export async function GET(req: NextRequest) {
  try {
    const rawParams = req.url.split('?')[1];
    if (!rawParams) throw new Error("params not found");

    const params = new URLSearchParams(rawParams);

    const year = params.get('year');
    const month = params.get('month');

    if (!year || !month) throw new Error("competence date not found");
    
    const transactions = await prisma.transactions.findMany({
      where: {
        competence_date: {
          gte: new Date(`${year}-${month}-01`),
          lte: new Date(`${year}-${month}-31`),
        }
      },
      include: { installment: true, credit_card: true },
    });
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let createInstallment;
    const data: ICreateFormTransaction = await req.json();
    const {
      competence_date,
      describe,
      value,
      type,
      due_date,
      current_installment,
      installments,
      installment_value,
      credit_card_id,
      status,
    } = data;

    if (type === "none") throw new Error("Selecione o tipo de transação");
    if (!due_date) throw new Error("Selecione a data de vencimento");

    if (current_installment > 0 && installments > 0 && installment_value > 0) {
      createInstallment = await prisma.installment.create({
        data: {
          total: installments,
          value: installment_value,
        },
      });
      if (!createInstallment) throw new Error("Failed to create installment");
    }

    const createData: Prisma.transactionsCreateArgs = {
      data: {
        competence_date,
        describe,
        value,
        type,
        due_date,
        current_installment,
        credit_card_id,
        status,
        installment_id: createInstallment?.id,
      },
    };

    if (credit_card_id && credit_card_id.length < 2)
      delete createData.data.credit_card_id;

    if (createInstallment) {
      for (let i = 1; i <= installments; i++) {
        createData.data.current_installment = i;
        createData.data.value = installment_value;
        createData.data.competence_date = 
        i === 1 
        ? createData.data.competence_date
        : dayjs(createData.data.competence_date).add(1, 'month').format() 

        // todo: applty create many here
        const createTransactionWithInstallment =
          await prisma.transactions.create(createData);

        if (!createTransactionWithInstallment)
          throw new Error("Failed to create transaction with installment");
      }
    } else {
      const transactions = await prisma.transactions.create(createData);
      if (!transactions) throw new Error("Failed to create transaction");
    }

    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
