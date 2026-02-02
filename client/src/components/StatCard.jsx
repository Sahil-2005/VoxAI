import React from 'react';

const StatCard = ({ icon: Icon, label, value, trend, type = 'default' }) => {
  const typeStyles = {
    default: 'bg-gradient-to-br from-zinc-900 to-zinc-900/50 border-zinc-800 hover:border-zinc-700',
    emerald: 'bg-gradient-to-br from-emerald-900/20 to-zinc-900/50 border-emerald-500/20 hover:border-emerald-500/30',
    purple: 'bg-gradient-to-br from-purple-900/20 to-zinc-900/50 border-purple-500/20 hover:border-purple-500/30',
    blue: 'bg-gradient-to-br from-blue-900/20 to-zinc-900/50 border-blue-500/20 hover:border-blue-500/30'
  };

  const iconColors = {
    default: 'text-zinc-400',
    emerald: 'text-emerald-400',
    purple: 'text-purple-400',
    blue: 'text-blue-400'
  };

  return (
    <div className={`border rounded-xl p-6 transition-all duration-300 hover-lift group ${typeStyles[type]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 bg-zinc-800/70 rounded-lg border border-zinc-700/50 group-hover:bg-zinc-800 transition-colors">
          <Icon className={`w-5 h-5 ${iconColors[type]} transition-colors`} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
            trend > 0 
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
              : 'text-red-400 bg-red-500/10 border-red-500/20'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div>
        <p className="text-zinc-400 text-sm font-medium mb-1.5">{label}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
