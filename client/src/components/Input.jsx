import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  icon: Icon, 
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-zinc-400">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-400 transition-colors" />
        )}
        <input
          ref={ref}
          className={`
            w-full bg-zinc-900/70 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600
            focus:bg-zinc-900 focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/50 outline-none transition-all duration-200
            ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 text-sm
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500"></span>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
