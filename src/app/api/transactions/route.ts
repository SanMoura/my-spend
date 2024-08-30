import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ICreateFormTransaction } from "@/interfaces/ITransactions";
export async function GET() {
  try {
    const transactions = await prisma.transactions.findMany({
      include: { installment: true },
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
      status
    } = data;

    if (type === "none"){
      throw new Error("Selecione o tipo de transação");
    }

    if (!due_date) {
      throw new Error("Selecione a data de vencimento");
    }

    const createData = {
      competence_date,
      describe,
      value,
      type, 
      due_date,
      current_installment,
      // installment_value,
      credit_card_id,
      status,
    }

    if (credit_card_id && credit_card_id.length < 2) delete createData.credit_card_id
    console.log(createData)
    const transactions = await prisma.transactions.create({
      data: createData,
    });
    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json(
      { error: error },
      { status: 500 }
    );
  }
}
