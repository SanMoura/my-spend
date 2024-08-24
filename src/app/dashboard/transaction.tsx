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
import { ArrowDownNarrowWide, BadgeDollarSign, Calendar, CalendarCheck2, CalendarClock, CalendarX2, Menu } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { ITransaction } from '@/lib/db';
import { deleteTransaction, updateTransaction } from './actions';

export function Transaction({ transaction }: { transaction: ITransaction }) {
  let statusIcon: any;
  switch (transaction.status) {
    case 'paid': statusIcon = <CalendarCheck2 className='text-center text-green-700'/>;
    break;

    case 'pending': statusIcon = <CalendarClock className='text-center text-orange-500'/>;
    break;

    case 'late': statusIcon = <CalendarX2 className='text-center text-red-500'/>;
    break;

    default:  statusIcon = <Calendar />;
      break;
  }

  return (
    <TableRow>
      {/* <TableCell className="hidden sm:table-cell">
        <ArrowDownNarrowWide />
      </TableCell> */}
      <TableCell className='hidden text-center md:table-cell'>{statusIcon}</TableCell>
      <TableCell className="font-medium">{transaction.name}</TableCell>
      <TableCell className="hidden text-left md:table-cell">{`$${transaction.price}`}</TableCell>
      <TableCell className="hidden text-center md:table-cell">{transaction.installments}</TableCell>
      <TableCell className="hidden md:table-cell">
        {transaction.availableAt.toLocaleDateString()}
      </TableCell>
      <TableCell className='text-right'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <Menu />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem>
              <form action={updateTransaction}>
                <button type="submit">Editar</button>
              </form>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <form action={deleteTransaction}>
                <button type="submit">Apagar</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}