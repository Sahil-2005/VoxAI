import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Bot, 
  Clock, 
  Plus, 
  TrendingUp,
  Zap,
  ArrowRight,
  Activity
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { botService } from '../services/botService';
import VoiceAgents from './VoiceAgents';
import Settings from './Settings';
import CallHistory from './CallHistory';

const HomeView = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCalls: 0,
    activeBots: 0,
    totalMinutes: 0,
    totalBots: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await botService.getDashboardStats();
        if (response.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-8">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-slate-400">Here's what's happening with your voice agents today.</p>
        </div>
        <motion.button 
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" /> New Agent
        </motion.button>
      </motion.header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={Phone} 
          label="Total Calls" 
          value={stats.totalCalls.toLocaleString()} 
          trend={12}
          color="blue" 
        />
        <StatCard 
          icon={Bot} 
          label="Active Agents" 
          value={stats.activeBots} 
          color="emerald" 
        />
        <StatCard 
          icon={Clock} 
          label="Minutes Used" 
          value={`${stats.totalMinutes}m`} 
          trend={8}
          color="amber" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="Success Rate" 
          value="98.5%" 
          trend={3}
          color="violet" 
        />
      </div>

      {/* CTA Card - Twilio Setup */}
      {!user?.twilioConfig?.isConfigured && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-violet-600 via-violet-700 to-fuchsia-700 rounded-2xl p-8 relative overflow-hidden mb-8"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-violet-200 text-sm font-medium mb-3">
                <Zap className="w-4 h-4" />
                <span>Quick Setup</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Configure Your Twilio Account</h2>
              <p className="text-violet-200 mb-6 leading-relaxed">
                Connect your Twilio credentials to start making and receiving calls. It only takes a minute to set up.
              </p>
              <motion.button 
                className="bg-white text-violet-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-violet-50 transition-colors shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Connect Twilio <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
            
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <Phone className="w-16 h-16 text-white/80" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <Activity className="w-5 h-5 text-slate-500" />
          </div>
          
          {stats.totalCalls === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400 mb-2">No calls yet</p>
              <p className="text-sm text-slate-500">Create your first voice agent to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Activity items would go here */}
              <p className="text-slate-400 text-center py-4">Activity will appear here</p>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
          
          <div className="space-y-3">
            {[
              { icon: Bot, label: 'Create New Agent', desc: 'Build a custom voice AI' },
              { icon: Phone, label: 'Make Test Call', desc: 'Try your agent' },
              { icon: TrendingUp, label: 'View Analytics', desc: 'Check performance' }
            ].map((action, i) => (
              <motion.button
                key={i}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/50 hover:border-violet-500/30 transition-all text-left group"
                whileHover={{ x: 4 }}
              >
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/30 transition-colors">
                  <action.icon className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{action.label}</p>
                  <p className="text-sm text-slate-500">{action.desc}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 ml-auto group-hover:text-violet-400 transition-colors" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 pl-72">
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/agents/*" element={<VoiceAgents />} />
        <Route path="/calls" element={<CallHistory />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
};

export default Dashboard;