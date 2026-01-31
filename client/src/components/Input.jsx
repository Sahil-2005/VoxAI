import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  icon: Icon, 
  className = '',
  helperText,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
        )}
        <input
          ref={ref}
          className={`
            w-full bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600
            focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all duration-200
            hover:border-zinc-700
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 text-sm
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        />
        {/* Focus glow effect */}
        <div className="absolute inset-0 rounded-xl bg-violet-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
      </div>
      {helperText && !error && (
        <p className="text-xs text-zinc-500">{helperText}</p>
      )}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-400 rounded-full" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
