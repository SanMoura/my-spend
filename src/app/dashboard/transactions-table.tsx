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
import { ArrowDown, ArrowDownNarrowWide, ArrowUp, ArrowUpNarrowWide, CalendarCheck2, CalendarClock, CalendarX2, ChevronLeft, ChevronRight, CircleCheckBig, Coins, DollarSign, PiggyBank, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { moneyFormat } from '@/utils/formats'
// import show from '@/app/api/transactions'
import { Prisma  } from '@prisma/client';
import { IConfigsModal, Modal } from '@/components/modal/modal';
type TransactionsWithIncluds = Prisma.transactionsGetPayload<{
  include: { installment: true, credit_card: true };
}>;
export function TransactionsTable({
  params
}: { params: IParams }) {
  const [data, setData] = useState<TransactionsWithIncluds[]>();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [configModal, setConfigModal] = useState<IConfigsModal>({
    type: "transaction-create",
    competence_date: new Date(`${params.year}-${params.month}-15`),
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        fetch('/api/transactions?year=' + params.year + '&month=' + params.month)
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

  const openModal = (params: IConfigsModal) => {
    setConfigModal(params);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const dashboardData = {
    pendingExpense: 0,
    paid: {
      income: 0,
      expense: 0,
    },
    incomes: 0,
    expenses: 0,
    economies: 0,
    balance: 0,
  }

  data.map((item) => {
    if (item.type === 'EXPENSE' && item.status === 'PENDING') {
      dashboardData.pendingExpense = dashboardData.pendingExpense + item.value;
    }
    if (item.type === 'EXPENSE' && item.status === 'PAID') {
      dashboardData.paid.expense = dashboardData.paid.expense + item.value;
    }
    if (item.type === 'INCOME' && item.status === 'PAID') {
      dashboardData.paid.income = dashboardData.paid.income + item.value;
    }
    if (item.type === 'INCOME') {
      dashboardData.incomes = dashboardData.incomes + item.value;
    }
    if (item.type === 'EXPENSE') {
      dashboardData.expenses = dashboardData.expenses + item.value;
    }
    if (item.type === 'ECONOMY') {
      dashboardData.economies = dashboardData.economies + item.value;
    }
    dashboardData.balance = dashboardData.incomes - dashboardData.expenses - dashboardData.economies;
  })

 

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal} configs={configModal}/>
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
                <div>{moneyFormat(dashboardData.paid.income)}</div>
              </span>
            </CardTitle>

            <CardTitle className='mb-2 mr-2 flex p-4 border-2'>
              <CircleCheckBig className='text-red-300' />
              <span className='ml-2'>
                <div className='font-bold text-base'>Pagas</div>
                <div>{moneyFormat(dashboardData.paid.expense)}</div>
              </span>
            </CardTitle>
            <CardTitle className='mb-2 mr-2 flex p-4 border-2'>
              <Coins className='text-cyan-600' />
              <span className='ml-2'>
                <div className='font-bold text-base'>Falta pagar</div>
                <div>{moneyFormat(dashboardData.pendingExpense)}</div>
              </span>
            </CardTitle>

            <CardTitle className='mb-2 mr-2 flex p-4 border-2'>
              <ArrowUp className='text-green-700' />
              <span className='ml-2'>
                <div className='font-bold text-base'>Receitas</div>
                <div>{moneyFormat(dashboardData.incomes)}</div>
              </span>
            </CardTitle>
            <CardTitle className='mb-2 mr-2 flex p-4 border-2'>
              <ArrowDown className='text-red-700' />
              <span className='ml-2'>
                <div className='font-bold text-base'>Despesas</div>
                <div>{moneyFormat(dashboardData.expenses)}</div>
              </span>
            </CardTitle>
            <CardTitle className='mb-2 mr-2 flex p-4 border-2'>
              <PiggyBank className='text-fuchsia-400' />
              <span className='ml-2'>
                <div className='font-bold text-base'>Economia</div>
                <div>{moneyFormat(dashboardData.economies)}</div>
              </span>
            </CardTitle>
            <CardTitle className='mb-2 mr-2 flex p-4 border-2'>
              <DollarSign className='text-cyan-600' />
              <span className='ml-2'>
                <div className='font-bold text-base'>Saldo</div>
                <div>{moneyFormat(dashboardData.balance)}</div>
              </span>
            </CardTitle>
            <div className="ml-auto flex items-center gap-2">
            <Button size="sm" className="h-8 gap-1"
              onClick={() => openModal({type: 'transaction-create', competence_date: new Date(`${params.year}-${params.month}-15`)})}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap"
              >
                Adicionar
              </span>
            </Button>
          </div>
          </div>
          {/* <CardTitle className='mb-2'>Todas as transações</CardTitle> */}
          <CardDescription className='flex items-center'>
            {/* Manage your products and view their sales performance. */}
            <CalendarCheck2 className='mr-1 ml-2 text-green-700' /> Pagas
            <CalendarClock className='mr-1 ml-2 text-orange-500' /> Pendentes
            <CalendarX2 className='mr-1 ml-2 text-red-500' /> Atrasadas
            {/* <ArrowDownNarrowWide className='mr-1 ml-2 text-red-800' /> Despesa
            <ArrowUpNarrowWide className='mr-1 ml-2 text-green-800' /> Ganho */}
          </CardDescription>
        </CardHeader>

        <CardContent className='max-h-[980px] overflow-y-auto'>
          <Table className='w-full border-collapse'>
            <TableHeader className='position-sticky top-0 z-10'>
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
                {/* <TableHead className="text-xl font-bold w-[20px] sm:table-cell"></TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody >
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
    </>
  );
}