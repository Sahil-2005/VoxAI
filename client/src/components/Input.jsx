import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  icon: Icon, 
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        )}
        <input
          ref={ref}
          className={`
            w-full bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500
            focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all duration-200
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
