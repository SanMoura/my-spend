'use client'
import React from "react";
import styles from './modal.module.css'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/inputForm';
import { updateTransaction } from '@/app/dashboard/actions';

export function Modal(data: { isOpen: boolean, onClose: () => void, transaction_id: string }) {
  const router = useRouter();

  if (!data.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-40 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      {/* <div className="p-4 border w-96 shadow-lg rounded-md bg-slate-500"> */}
      <div className="w-5/6 shadow-lg rounded-md">
        <Card className={styles.background_modal}>
          <CardHeader>
            <CardTitle className='mb-2'>Editar transação</CardTitle>
            <CardDescription className='flex items-center'>
              Código da transação: {data.transaction_id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateTransaction} className="relative ml-auto flex-1 md:grow-0">
              <div className="mb-5">
                <Input
                  name="q"
                  description="Descrição"
                  type="search"
                  placeholder="Procurar..."
                />
              </div>
              <div className="mb-5">
                <Input
                  name="q"
                  description="Descrição"
                  type="search"
                  placeholder="Procurar..."
                />
              </div>
              <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>
          </CardContent>
          <CardFooter>
            <Button size="sm" className="h-8 gap-1" onClick={data.onClose}>
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Fechar
              </span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}