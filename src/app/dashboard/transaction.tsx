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
import { ArrowDownNarrowWide, Calendar, CalendarCheck2, CalendarClock, CalendarX2, CreditCard, Pen, ArrowUpNarrowWide, ShieldCheck, PiggyBank, DollarSign, ArrowDown, ArrowUp } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { ITransaction } from '@/lib/db';
import { deleteTransaction, updateTransaction } from './actions';
import { Modal, IConfigsModal } from '@/components/modal/modal';
import { Prisma } from '@prisma/client';
type TransactionsWithInstallments = Prisma.transactionsGetPayload<{
  include: { installment: true, credit_card: true };
}>;
export function Transaction({ transaction }: { transaction: TransactionsWithInstallments }) {
  let statusIcon: any;
  let typeIcon: any;
  switch (transaction.type) {
    case 'INCOME': typeIcon = <ArrowUp className='text-green-700 mr-2' />;
      break;

    case 'EXPENSE': typeIcon = <ArrowDown className='text-red-700 mr-2' />;
      break;

    case 'ECONOMY': typeIcon =  <PiggyBank className='text-fuchsia-400 mr-2' />;
      break;

    default: typeIcon = null;
      break;
  }

  switch (transaction.status) {
    case 'PAID': statusIcon = <CalendarCheck2 className='text-center text-green-700 mr-2' />;
      break;

    case 'PENDING': statusIcon = <CalendarClock className='text-center text-orange-500 mr-2' />;
      break;

    case 'LATE': statusIcon = <CalendarX2 className='text-center text-red-500 mr-2' />;
      break;

    default: statusIcon = null;
      break;
  }
  const [isModalOpen, setModalOpen] = useState(false);
  const [configModal, setConfigModal] = useState<IConfigsModal>({
    type: "transaction-update",
    competence_date: new Date(),
  });
  const openModal = (params: IConfigsModal) => {
    setConfigModal(params);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const dueDate = new Date(transaction.due_date);
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal} configs={configModal} />
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
              <DropdownMenuItem 
                onClick={
                  () => openModal({ 
                    transaction_id: transaction.id, 
                    type: 'transaction-update', 
                    competence_date: dueDate 
                  })
                }
                >
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
            {typeIcon} 
            {statusIcon}
            {
              transaction.credit_card_id 
              ? <CreditCard className='mr-2' color={transaction.credit_card?.color}/> 
              : null 
            }
            {transaction.describe}
          </div>
        </TableCell>
        <TableCell className="hidden text-left md:table-cell">{`R$ ${transaction.value.toFixed(2).toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</TableCell>
        <TableCell className="hidden text-center md:table-cell">{transaction.current_installment}/{transaction.installment?.total}</TableCell>
        <TableCell className="hidden md:table-cell text-center">{dueDate.toISOString()}</TableCell>
        {/* <TableCell className='md:table-cell'></TableCell> */}
      </TableRow>
    </>
  );
}