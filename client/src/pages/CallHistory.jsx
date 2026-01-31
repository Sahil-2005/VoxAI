import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Clock, ArrowUpRight, ArrowDownLeft, CheckCircle, XCircle, AlertCircle, Search, Filter, Download, Calendar } from 'lucide-react';
import Button from '../components/Button';

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
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Call History</h1>
          <p className="text-zinc-400 mt-1">View and analyze your voice agent calls</p>
        </div>
        <Button variant="secondary" icon={Download}>
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by phone number..."
            className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-zinc-800/80 rounded-xl text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2.5 bg-zinc-900/50 border border-zinc-800/80 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-700 transition-all flex items-center gap-2 text-sm font-medium">
            <Calendar className="w-4 h-4" />
            Date Range
          </button>
          <button className="px-4 py-2.5 bg-zinc-900/50 border border-zinc-800/80 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-700 transition-all flex items-center gap-2 text-sm font-medium">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {calls.length === 0 ? (
        <div className="text-center py-20 border border-zinc-800/80 rounded-2xl bg-gradient-to-br from-zinc-900/50 to-zinc-950/50">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
            <Phone className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No calls yet</h3>
          <p className="text-zinc-500 mb-8 max-w-md mx-auto">
            When your voice agents make or receive calls, they'll appear here with full analytics.
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border border-zinc-800/80 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800/80 bg-zinc-900/50">
                <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Direction</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Phone Number</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Agent</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Duration</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {calls.map((call, i) => (
                <motion.tr 
                  key={call._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-zinc-800/30 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      call.direction === 'outbound' 
                        ? 'bg-blue-500/10 border-blue-500/20' 
                        : 'bg-violet-500/10 border-violet-500/20'
                    }`}>
                      {call.direction === 'outbound' ? (
                        <ArrowUpRight className="w-5 h-5 text-blue-400" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5 text-violet-400" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-semibold text-white">{call.phoneNumber}</span>
                  </td>
                  <td className="py-4 px-6 text-sm text-zinc-400">{call.bot?.name || 'Unknown'}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Clock className="w-4 h-4 text-zinc-600" />
                      {Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize ${getStatusColor(call.status)}`}>
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
