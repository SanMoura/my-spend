'use client';
import { useEffect, useState } from 'react';
import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Transaction } from './transaction';
import { getTransactions, ISelectTransaction, IParams } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { ArrowDownNarrowWide, ArrowUpNarrowWide, CalendarCheck2, CalendarClock, CalendarX2, ChevronLeft, ChevronRight, CircleCheckBig, Coins, DollarSign, PiggyBank } from 'lucide-react';
import { Button } from '@/components/ui/button';

// import show from '@/app/api/transactions'
import { Prisma  } from '@prisma/client';
type TransactionsWithInstallments = Prisma.transactionsGetPayload<{
  include: { installment: true };
}>;
export function TransactionsTable({
  params
}: { params: IParams }) {
  const [data, setData] = useState<TransactionsWithInstallments[]>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const result = await getTransactions({
        //   year: params.year,
        //   month: params.month
        // });
        fetch('/api/transactions')
        .then((response) => response.json())
        .then((data) => setData(data));

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  let router = useRouter();
  let transactionsPerPage = 5;

  function prevPage() {
    router.back();
  }

  function nextPage() {
    router.push(`/?newOffset=${0}`, { scroll: false });
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gastos</CardTitle>
          <CardDescription>
            Manage your products and view their sales performance.
          </CardDescription>
        </CardHeader>

        <CardContent>
          Carregando...
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gastos</CardTitle>
          <CardDescription>
            Manage your products and view their sales performance.
          </CardDescription>
        </CardHeader>

        <CardContent>
          Sem dados...
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        {/* <CardTitle className='mb-8 flex'>
            <PiggyBank className='text-teal-300'/>
            <span className='ml-2'>
              <div className='font-bold text-sm'>Saldo Atual</div>
              <div>R$ 200,00</div>
            </span>
          </CardTitle> */}
        <div className="flex items-center mb-2">
          <CardTitle className='mb-2 mr-2 flex p-4 border-2'>
            <CircleCheckBig className='text-teal-300' />
            <span className='ml-2'>
              <div className='font-bold text-base'>Recebidos</div>
              <div>R$ 2000,00</div>
            </span>
          </CardTitle>

          <CardTitle className='mb-2 mr-2 flex p-4 border-2'>
            <CircleCheckBig className='text-red-300' />
            <span className='ml-2'>
              <div className='font-bold text-base'>Pagas</div>
              <div>R$ 200,00</div>
            </span>
          </CardTitle>
          <CardTitle className='mb-2 mr-2 flex p-4 border-2'>
            <Coins className='text-cyan-600' />
            <span className='ml-2'>
              <div className='font-bold text-base'>Falta pagar</div>
              <div>R$ 0,00</div>
            </span>
          </CardTitle>

          <CardTitle className='mb-2 mr-2 flex p-4 border-2'>
            <DollarSign className='text-green-700' />
            <span className='ml-2'>
              <div className='font-bold text-base'>Receitas</div>
              <div>R$ 200,00</div>
            </span>
          </CardTitle>
          <CardTitle className='mb-2 mr-2 flex p-4 border-2'>
            <DollarSign className='text-red-700' />
            <span className='ml-2'>
              <div className='font-bold text-base'>Despesas</div>
              <div>R$ 200,00</div>
            </span>
          </CardTitle>
          <CardTitle className='mb-2 mr-2 flex p-4 border-2'>
            <DollarSign className='text-cyan-600' />
            <span className='ml-2'>
              <div className='font-bold text-base'>Saldo</div>
              <div>R$ 0,00</div>
            </span>
          </CardTitle>
        </div>
        {/* <CardTitle className='mb-2'>Todas as transações</CardTitle> */}
        <CardDescription className='flex items-center'>
          {/* Manage your products and view their sales performance. */}
          <CalendarCheck2 className='mr-1 ml-2 text-green-700' /> Pagas
          <CalendarClock className='mr-1 ml-2 text-orange-500' /> Pendentes
          <CalendarX2 className='mr-1 ml-2 text-red-500' /> Atrasadas
          <ArrowDownNarrowWide className='mr-1 ml-2 text-red-800' /> Despesa
          <ArrowUpNarrowWide className='mr-1 ml-2 text-green-800' /> Ganho
        </CardDescription>
      </CardHeader>

      <CardContent>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='font-bold text-right w-[20px]'>
                {/* ações */}
                {/* <span className="sr-only">Actions</span> */}
              </TableHead>
              <TableHead className='text-xl font-bold'>Descrição</TableHead>
              <TableHead className="text-xl font-bold text-left sm:table-cell">Valor</TableHead>
              <TableHead className="text-xl font-bold w-[30px] sm:table-cell text-center">
                Parcelas
              </TableHead>
              <TableHead className="text-xl font-bold text-center md:table-cell">Vencimento</TableHead>
              <TableHead className="text-xl font-bold w-[20px] sm:table-cell"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((transaction) => (
              <Transaction key={transaction.id} transaction={transaction} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className='hidden'>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Mostrando{' '}
            <strong>
              0
            </strong>{' '}
            de 0 gastos
          </div>
          <div className="flex">
            <Button
              formAction={prevPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={0 === transactionsPerPage}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              formAction={nextPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={0 + transactionsPerPage > 1}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
      {/* )} */}
    </Card>
  );
}