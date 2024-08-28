'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ArrowDownNarrowWide, Calendar, CalendarCheck2, CalendarClock, CalendarX2, Pen } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { ITransaction } from '@/lib/db';
import { deleteTransaction, updateTransaction } from './actions';
import { Modal } from '@/components/modal/modal';
import { Prisma } from '@prisma/client';
type TransactionsWithInstallments = Prisma.transactionsGetPayload<{
  include: { installment: true };
}>;
export function Transaction({ transaction }: { transaction: TransactionsWithInstallments }) {
  let statusIcon: any;
  switch (transaction.status) {
    case 'PAID': statusIcon = <CalendarCheck2 className='text-center text-green-700' />;
      break;

    case 'PENDING': statusIcon = <CalendarClock className='text-center text-orange-500' />;
      break;

    case 'LATE': statusIcon = <CalendarX2 className='text-center text-red-500' />;
      break;

    default: statusIcon = <Calendar />;
      break;
  }
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const dueDate = new Date(transaction.due_date);
  return (
    <>
    <Modal isOpen={isModalOpen} onClose={closeModal} transaction_id={transaction.id}/>
    <TableRow>
      <TableCell className='text-left'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <Pen className='h-5 w-5' />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className='border-gray-300'>
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem onClick={openModal}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <form action={deleteTransaction}>
                <button type="submit">Apagar</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      <TableCell className="hidden text-left md:table-cell">
        <div className='flex'>
          <ArrowDownNarrowWide className='h-5 w-5 mr-2 text-red-500' />
          {transaction.describe}
        </div>
      </TableCell>
      <TableCell className="hidden text-left md:table-cell">{`$${transaction.value}`}</TableCell>
      <TableCell className="hidden text-center md:table-cell">{transaction.installment_number}/{transaction.installment?.total}</TableCell>
      <TableCell className="hidden md:table-cell text-center">{dueDate.toISOString()}</TableCell>
      <TableCell className='md:table-cell'>{statusIcon}</TableCell>
    </TableRow>
    </>
  );
}