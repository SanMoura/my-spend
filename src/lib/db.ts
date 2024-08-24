
export type ITransaction = {
  id: string;
  imageUrl: string;
  name: string;
  status: string;
  price: number;
  installments: string;
  availableAt: Date;
};

export type IParams = {
  year: string;
  month: string;
}

export type ISelectTransaction = {
  transactions: ITransaction[];
  newOffset: number;
  totalTransactions: number;
} | null;
export async function getTransactions(params: IParams) {
  const ret: ISelectTransaction = {
    transactions: [
      {
        id: 'lorem',
        imageUrl: '',
        name: 'MORADIA',
        status: 'paid',
        price: 600.00,
        installments: '1/10',
        availableAt: new Date(),
      },
      {
        id: 'lorem 2',
        imageUrl: '',
        name: 'CARTÃO ITAÚ GOLD',
        status: 'pending',
        price: 4000.00,
        installments: '10/10',
        availableAt: new Date(),
      },
      {
        id: 'lorem 3',
        imageUrl: '',
        name: 'CARTÃO ITAÚ BLACK',
        status: 'late',
        price: 3000.00,
        installments: '0',
        availableAt: new Date(),
      },
    ],
    newOffset: 0,
    totalTransactions: 3
  }

  return ret
}