import { Prisma  } from '@prisma/client';
import dayjs from 'dayjs';
import { ArrowDownNarrowWide, Calendar, CalendarCheck2, CalendarClock, CalendarX2, CreditCard, Pen, ArrowUpNarrowWide, ShieldCheck, PiggyBank, DollarSign, ArrowDown, ArrowUp } from 'lucide-react';
type TransactionsWithIncluds = Prisma.transactionsGetPayload<{
  include: { installment: true, credit_card: true };
}>;

const KanbanCard: React.FC<{ transaction: TransactionsWithIncluds }> = ({ transaction }) => {

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

  return (
    <div className="m-1 p-5 bg-white border hover:shadow-lg border-gray-200 rounded-lg cursor-pointer">
      

      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span className="text-gray-800">
          <div className="text-lg font-bold text-gray-800">{transaction.describe}</div>
        </span>
        {/* icons */}
        <span className="text-gray-800">
          <div className='flex'>
            {typeIcon}
            {
              transaction.credit_card_id 
              ? <CreditCard color={transaction.credit_card?.color}/> 
              : null 
            }
          </div>
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span className="font-semibold">Valor:</span>
        <span className="text-gray-800">R$ {transaction.value.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span className="font-semibold">Parcelas:</span>
        <span className="text-gray-800">{transaction.installment?.total ? transaction.current_installment+'/'+transaction.installment?.total : 'N/A'}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span className="font-semibold">Vencimento:</span>
        <span className="text-gray-800">
          {dayjs(transaction.due_date).format('DD/MM/YYYY') || 'N/A'}
        </span>
      </div>
    </div>
  );
};


export default KanbanCard;
