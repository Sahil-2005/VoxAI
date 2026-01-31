import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend, type = 'default' }) => {
  const typeStyles = {
    default: {
      iconBg: 'bg-zinc-800/80',
      iconColor: 'text-zinc-400',
      glow: ''
    },
    emerald: {
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
      glow: 'shadow-emerald-500/5'
    },
    violet: {
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-400',
      glow: 'shadow-violet-500/5'
    },
    purple: {
      iconBg: 'bg-fuchsia-500/10',
      iconColor: 'text-fuchsia-400',
      glow: 'shadow-fuchsia-500/5'
    },
    blue: {
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      glow: 'shadow-blue-500/5'
    }
  };

  const style = typeStyles[type] || typeStyles.default;

  return (
    <div className={`relative group bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 hover:border-zinc-700/80 transition-all duration-300 ${style.glow} shadow-xl`}>
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 ${style.iconBg} rounded-xl border border-zinc-700/30`}>
            <Icon className={`w-5 h-5 ${style.iconColor}`} />
          </div>
          {trend !== undefined && trend !== null && (
            <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg ${
              trend > 0 
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' 
                : trend < 0 
                  ? 'text-red-400 bg-red-500/10 border border-red-500/20'
                  : 'text-zinc-400 bg-zinc-800/50 border border-zinc-700/50'
            }`}>
              {trend > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : trend < 0 ? (
                <TrendingDown className="w-3 h-3" />
              ) : null}
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
        <div>
          <p className="text-zinc-500 text-sm font-medium mb-1.5">{label}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
