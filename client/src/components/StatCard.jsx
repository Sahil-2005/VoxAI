import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, trend, color = 'violet' }) => {
  const colorClasses = {
    violet: 'from-violet-500 to-fuchsia-500 shadow-violet-500/25',
    blue: 'from-blue-500 to-cyan-500 shadow-blue-500/25',
    emerald: 'from-emerald-500 to-teal-500 shadow-emerald-500/25',
    amber: 'from-amber-500 to-orange-500 shadow-amber-500/25'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-2">{label}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {trend && (
            <p className={`text-xs mt-2 ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
