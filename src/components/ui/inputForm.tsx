import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { description: string }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, description, ...props }, ref) => {
    return (
      <>
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
      </>
    );
  }
);
Input.displayName = 'Input';

export { Input };