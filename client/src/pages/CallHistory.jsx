import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Clock, ArrowUpRight, ArrowDownLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const CallHistory = () => {
  // Mock data - in production, this would come from API
  const calls = [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
      case 'failed':
        return <XCircle className="w-3.5 h-3.5 text-red-400" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Call History</h1>
        <p className="text-zinc-400 mt-1.5 text-base">View and analyze your voice agent calls</p>
      </div>

      {calls.length === 0 ? (
        <div className="text-center py-20 border border-zinc-800/50 rounded-2xl bg-zinc-900/20 backdrop-blur-sm hover-lift">
          <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-zinc-700/50 shadow-xl">
            <Phone className="w-9 h-9 text-zinc-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No calls yet</h3>
          <p className="text-zinc-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            When your voice agents make or receive calls, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="text-left py-3 px-6 text-xs font-medium text-zinc-400 uppercase tracking-wider">Direction</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-zinc-400 uppercase tracking-wider">Phone Number</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-zinc-400 uppercase tracking-wider">Agent</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-zinc-400 uppercase tracking-wider">Duration</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-zinc-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {calls.map((call, i) => (
                <motion.tr 
                  key={call._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                      call.direction === 'outbound' 
                        ? 'bg-blue-500/10 border-blue-500/20' 
                        : 'bg-violet-500/10 border-violet-500/20'
                    }`}>
                      {call.direction === 'outbound' ? (
                        <ArrowUpRight className="w-4 h-4 text-blue-400" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4 text-violet-400" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-white font-medium">{call.phoneNumber}</td>
                  <td className="py-4 px-6 text-sm text-zinc-400">{call.bot?.name || 'Unknown'}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Clock className="w-3.5 h-3.5 text-zinc-600" />
                      {Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border capitalize ${getStatusColor(call.status)}`}>
                      {getStatusIcon(call.status)}
                      {call.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-zinc-500">
                    {new Date(call.createdAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CallHistory;
