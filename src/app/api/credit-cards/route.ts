import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const credit_cards = await prisma.credit_card.findMany({ include: { transactions: true } });
    return NextResponse.json(credit_cards);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch credit_cards' }, { status: 500 });
  }
}