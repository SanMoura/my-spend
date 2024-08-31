'use client'
import React, { useEffect, useState } from "react";
import styles from './modal.module.css'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input, InputSelectCreditCard, InputSelect } from '@/components/ui/inputForm';
import { updateTransaction } from '@/app/dashboard/actions';
import { ICreateFormTransaction } from '@/interfaces/ITransactions'
import dayjs from "dayjs";
export type IConfigsModal = {
  transaction_id?: string;
  type: 'transaction-update' | 'transaction-delete' | 'transaction-create' | 'credit-card-show'
  competence_date: Date
}
export function Modal(data: { isOpen: boolean, onClose: () => void, configs: IConfigsModal }) {

  // const [loading, setLoading] = React.useState(true);

  const [formValues, setFormValues] = useState<ICreateFormTransaction>({
    describe: "",
    value: 0,
    type: "none",
    due_date: null,
    current_installment: 0,
    installments: 0,
    installment_value: 0,
    credit_card_id: null,
    status: 'PENDING',
    competence_date: data.configs?.competence_date,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleCreateTransaction = () => {
    try {
      const transactionSchema = z.object({
        describe: z.string().min(2),
        value: z.number().positive(),
        type: z.enum(['EXPENSE', 'INCOME']),
        due_date: z.date().nullable(),
        current_installment: z.number(),
        installments: z.number(),
        installment_value: z.number(),
        credit_card_id: z.string().nullable(),
        status: z.enum(['PENDING', 'PAID', 'LATE']),
        // Adicione outros campos conforme necessário
      });

      let formattedFormValues = formValues
      formattedFormValues.value = +formattedFormValues.value
      formattedFormValues.installments = +formattedFormValues.installments
      formattedFormValues.installment_value = +formattedFormValues.installment_value
      formattedFormValues.current_installment = +formattedFormValues.current_installment
      formattedFormValues.due_date = new Date(formattedFormValues.due_date || '2022-01-01')

      if (
        (formattedFormValues.current_installment > 0 ||
        formattedFormValues.installments > 0 || 
        formattedFormValues.installment_value > 0 )
      ) {
        if (formattedFormValues.current_installment <= 0 ||
          formattedFormValues.installments <= 0 || 
          formattedFormValues.installment_value <= 0 )
        throw new Error('Verifique os campos de parcelamento');
      }

      const validatedData = transactionSchema.parse(formattedFormValues);

      const fetchData = async () => {
        try {
          fetch('/api/transactions', { method: 'POST', body: JSON.stringify(formattedFormValues) })
          .then((response) => response.json())
          .then(() => data.onClose());
  
        } catch (error) {
          console.error('Erro ao buscar dados:', error);
        } finally {
          // setLoading(false);
        }
      };
  
      fetchData();

    } catch (e: any) {
      if (e instanceof z.ZodError) {
        // Se a validação falhar, Zod retornará um erro que pode ser tratado aqui
        console.log(e.errors)
      } else {
        // Outros tipos de erro
        console.log(e.message);
      }
    }
  };

  if (!data.configs) return null;
  if (!data.isOpen) return null;
  let contentModal = <></>

  if (data.configs.type === 'transaction-update') {
    contentModal = <div className="w-5/6 shadow-lg rounded-md">
    <Card className={styles.background_modal}>
      <CardHeader>
        <CardTitle className='mb-2'>Editar transação</CardTitle>
        <CardDescription className='flex items-center'>
          Código da transação: {data.configs.transaction_id ?? 'Não informado'}
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
  }

  if (data.configs.type === 'transaction-create') {
    contentModal = <div className="w-5/6 shadow-lg rounded-md">
    <Card className={styles.background_modal}>
      <CardHeader>
        <CardTitle className='mb-2'>Nova transação</CardTitle>
        <CardDescription className='flex items-center'>
          Competência: {dayjs(data.configs.competence_date).format('MM/YYYY')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={updateTransaction} className="relative ml-auto flex-1 md:grow-0">
          <div className="mb-5">
            <div className="grid grid-cols-4 gap-4">
              <InputSelect
                name="type"
                options={[
                  { value: 'none', describe: 'Selecione...' },
                  { value: 'EXPENSE', describe: 'Despesa' },
                  { value: 'INCOME', describe: 'Receita' },
                  { value: 'ECONOMY', describe: 'Economia' },
                ]}
                description="Tipo"
                onChange={handleChange} 
              />
              <Input
                name="describe"
                description="Descrição"
                type="text"
                placeholder="Descrição"
                onChange={handleChange} 
              />
              <Input
                name="value"
                description="Valor"
                type=""
                placeholder="Valor"
                onChange={handleChange} 
              />
              <Input
                name="due_date"
                description="Data de vencimento"
                type="date"
                placeholder="Data de vencimento"
                onChange={handleChange} 
              />
            </div>
            <div className="mt-8 grid grid-cols-4 gap-4">
              <InputSelectCreditCard
                name="credit_card_id"
                description="Cartão de crédito"
                onChange={handleChange} 
              />
              <div className="flex">
                <Input
                  name="current_installment"
                  description="Parcela atual"
                  type="number"
                  placeholder="0"
                  onChange={handleChange} 
                />
                <span className='mr-2 ml-2 mt-2 text-xl'>/</span>
                <Input
                  name="installments"
                  description="total"
                  type="number"
                  placeholder="0"
                  onChange={handleChange} 
                />
              </div>
               <Input
                name="installment_value"
                description="Valor da parcela"
                type="number"
                placeholder="Valor da parcela"
                onChange={handleChange} 
              />
               <InputSelect
                name="status"
                options={[
                  { value: 'PENDING', describe: 'Pendente' },
                  { value: 'LATE', describe: 'Atrasado' },
                  { value: 'PAID', describe: 'Pago' },
                ]}
                description="Situação"
                value={formValues.status}
                onChange={handleChange} 
              />
            </div>
          </div>
          {/* <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Cadastrar
          </button> */}
          
        </form>
      </CardContent>
      <CardFooter className="flex">
        <Button size="sm" className="h-8 gap-1 mr-4 bg-red-700 text-white" onClick={data.onClose}>
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Fechar
          </span>
        </Button>
        <Button size="lg" className="h-8 gap-1 bg-blue-700 text-white" onClick={handleCreateTransaction}>
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Cadastrar
          </span>
        </Button>
      </CardFooter>
    </Card>
  </div>
  }

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-40 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      {contentModal}
    </div>
  );
}