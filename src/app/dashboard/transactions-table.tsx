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
import { ArrowDownNarrowWide, ArrowUpNarrowWide, CalendarCheck2, CalendarClock, CalendarX2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TransactionsTable({
  params
}: {params: IParams}) {
  const [data, setData] = useState<ISelectTransaction>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTransactions({ 
          year: params.year, 
          month: params.month 
        });
        setData(result);
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
    router.push(`/?newOffset=${data?.newOffset ?? 0}`, { scroll: false });
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
        <CardTitle className='mb-2'>Todas as transações</CardTitle>
        <CardDescription className='flex items-center'>
          {/* Manage your products and view their sales performance. */}
          <CalendarCheck2 className='mr-2 ml-2 text-green-700'/> Pagas |
          <CalendarClock className='mr-2 ml-2 text-orange-500'/> Pendentes |
          <CalendarX2 className='mr-2 ml-2 text-red-500'/> Atrasadas |
          <ArrowDownNarrowWide className='mr-2 ml-2 text-red-800'/> Despesa |
          <ArrowUpNarrowWide className='mr-2 ml-2 text-green-800'/> Ganho |
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
            {data.transactions.map((transaction) => (
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
              {Math.min(data.newOffset - transactionsPerPage, data.totalTransactions) + 1}-{data.newOffset}
            </strong>{' '}
            de <strong>{data.totalTransactions}</strong> gastos
          </div>
          <div className="flex">
            <Button
              formAction={prevPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={data.newOffset === transactionsPerPage}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              formAction={nextPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={data.newOffset + transactionsPerPage > data.totalTransactions}
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