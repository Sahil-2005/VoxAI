import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Clock, ArrowUpRight, ArrowDownLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const CallHistory = () => {
  // Mock data - in production, this would come from API
  const calls = [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-amber-500/20 text-amber-400';
    }
  };

  return (
    <div className="p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-1">Call History</h1>
        <p className="text-slate-400">View and analyze your voice agent calls</p>
      </motion.div>

      {calls.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Phone className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No calls yet</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            When your voice agents make or receive calls, they'll appear here.
          </p>
        </motion.div>
      ) : (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Direction</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Phone Number</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Agent</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Duration</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call, i) => (
                <motion.tr 
                  key={call._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${call.direction === 'outbound' ? 'bg-blue-500/20' : 'bg-violet-500/20'}`}>
                      {call.direction === 'outbound' ? (
                        <ArrowUpRight className="w-4 h-4 text-blue-400" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4 text-violet-400" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-white font-medium">{call.phoneNumber}</td>
                  <td className="py-4 px-6 text-slate-300">{call.bot?.name || 'Unknown'}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="w-4 h-4 text-slate-500" />
                      {Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(call.status)}`}>
                      {getStatusIcon(call.status)}
                      {call.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400 text-sm">
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
