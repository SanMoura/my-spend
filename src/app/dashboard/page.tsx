// 'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TransactionsTable } from './transactions-table';
import { getTransactions, ISelectTransaction } from '@/lib/db'; 
import { useRef } from 'react';

export default async function ProductsPage({
  searchParams, 
  transactions,
}: {
  searchParams: { q: string; offset: string };
  transactions: ISelectTransaction
}) {
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  
  const tabList = [
    { name: 'Janeiro', value: '1' },
    { name: 'Fevereiro', value: '2' },
    { name: 'Março', value: '3' },
    { name: 'Abril', value: '4' },
    { name: 'Maio', value: '5' },
    { name: 'Junho', value: '6' },
    { name: 'Julho', value: '7' },
    { name: 'Agosto', value: '8' },
    { name: 'Setembro', value: '9' },
    { name: 'Outubro', value: '10' },
    { name: 'Novembro', value: '11' },
    { name: 'Dezembro', value: '12' },
  ]

  return (
    <Tabs defaultValue="1">
      <div className="flex items-center">
        <TabsList>
          {tabList.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value="1">
        <TransactionsTable
          params={{ year: '2024', month: '1' }}
        />
      </TabsContent>
    </Tabs>
  );
}