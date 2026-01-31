import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed btn-press overflow-hidden';
  
  const variants = {
    primary: 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:opacity-95 border border-violet-400/20',
    secondary: 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700/50 hover:border-zinc-600 shadow-lg shadow-black/20',
    ghost: 'text-zinc-400 hover:text-white hover:bg-zinc-800/50',
    danger: 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 border border-red-400/20',
    outline: 'bg-transparent border border-zinc-700 text-zinc-300 hover:bg-zinc-800/50 hover:text-white hover:border-zinc-600',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10'
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs gap-1.5',
    sm: 'px-3.5 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
    xl: 'px-8 py-4 text-lg gap-3'
  };

  const renderIcon = () => {
    if (loading) {
      return <Loader2 className={`${size === 'xs' || size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} animate-spin`} />;
    }
    if (Icon) {
      return <Icon className={`${size === 'xs' || size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />;
    }
    return null;
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer effect for primary variant */}
      {variant === 'primary' && !disabled && (
        <div className="absolute inset-0 shimmer opacity-30" />
      )}
      
      {iconPosition === 'left' && renderIcon()}
      <span className="relative">{children}</span>
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
};

export default Button;
