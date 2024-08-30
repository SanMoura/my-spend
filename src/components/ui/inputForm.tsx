import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { description: string }

interface InputSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: { describe: string; value: string }[];
  description: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, description, ...props }, ref) => {
    return (
      <>
        <div>
          <label className="block mb-2 text-sm font-medium">{description}</label>
          <input
            type={type}
            className={cn(
              'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      </>
    );
  }
);
Input.displayName = 'Input';

const InputSelectCreditCard = React.forwardRef<HTMLInputElement, InputSelectProps>(
  ({ className, description, ...props }, ref) => {

    const [data, setData] = React.useState<{describe: string, id: string}[]>();
    const [loading, setLoading] = React.useState(true);
    
    React.useEffect(() => {
      const fetchData = async () => {
        try {
          fetch('/api/credit-cards')
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


    return (
      <>
        <div>
          <label className="block mb-2 text-sm font-medium">{description}</label>
          <select
            className={cn(
              'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
              className
            )}
            {...props}
          > 
            <option>Selecione...</option>
            {data?.map((option) => (
              <option key={option.id} value={option.id}>
                {option.describe}
              </option>
            ))} 
          </select>
        </div>
      </>
    );
  }
);
InputSelectCreditCard.displayName = 'InputSelectCreditCard';

const InputSelect = React.forwardRef<HTMLInputElement, InputSelectProps>(
  ({ className, options ,description, ...props }, ref) => {

    return (
      <>
        <div>
          <label className="block mb-2 text-sm font-medium">{description}</label>
          <select
            className={cn(
              'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
              className
            )}
            {...props}
          > 
            {options?.map((option) => (
              <option key={option.describe} value={option.value}>
                {option.describe}
              </option>
            ))} 
          </select>
        </div>
      </>
    );
  }
);
InputSelect.displayName = 'InputSelect';

const InputInstallment = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, description, ...props }, ref) => {
    return (
      <>
        <div>
          <label className="block mb-2 text-sm font-medium">{description}</label>
          <div className='flex'>
            <input
              type={type}
              name='current_installment'
              className={cn(
                'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
                className
              )}
              ref={ref}
              {...props}
            />
            <span className='mr-2 ml-2 mt-2 text-xl'>/</span>
            <input
              type={type}
              name='total_installment'
              className={cn(
                'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
                className
              )}
              ref={ref}
              {...props}
            />
          </div>
        </div>
      </>
    );
  }
);
InputInstallment.displayName = 'InputInstallment';

export { Input, InputSelectCreditCard, InputSelect, InputInstallment };
