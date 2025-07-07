import { cn } from '@/lib/utils';
import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, placeholder, id, ...props }, ref) => {
	const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

	return (
	  <div className="space-y-2">
		{label && (
		  <label
			htmlFor={selectId}
			className="block text-sm font-medium text-gray-700"
		  >
			{label}
		  </label>
		)}
		<select
		  id={selectId}
		  className={cn(
			'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
			error && 'border-red-500 focus:ring-red-500',
			className
		  )}
		  ref={ref}
		  {...props}
		>
		  {placeholder && (
			<option value="" disabled>
			  {placeholder}
			</option>
		  )}
		  {options.map((option) => (
			<option key={option.value} value={option.value}>
			  {option.label}
			</option>
		  ))}
		</select>
		{error && (
		  <p className="text-sm text-red-600">{error}</p>
		)}
		{helperText && !error && (
		  <p className="text-sm text-gray-500">{helperText}</p>
		)}
	  </div>
	);
  }
);

Select.displayName = 'Select';

export { Select };
