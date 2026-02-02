import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { 
  Phone, 
  Bot, 
  Clock, 
  Plus, 
  TrendingUp,
  Zap,
  ArrowRight,
  Activity,
  ChevronRight
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
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Overview
          </h1>
          <p className="text-zinc-400 mt-1.5 text-base">
            Welcome back, <span className="text-white font-medium">{user?.name?.split(' ')[0] || 'User'}</span>. Here's your daily summary.
          </p>
        </div>
        <Link 
          to="/dashboard/agents"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-100 hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95"
        >
          <Plus className="w-4 h-4" /> 
          New Agent
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Phone} 
          label="Total Calls" 
          value={stats.totalCalls.toLocaleString()} 
          trend={12}
          type="default" 
        />
        <StatCard 
          icon={Bot} 
          label="Active Agents" 
          value={stats.activeBots} 
          type="emerald" 
        />
        <StatCard 
          icon={Clock} 
          label="Minutes Used" 
          value={`${stats.totalMinutes}m`} 
          trend={8}
          type="default" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="Success Rate" 
          value="98.5%" 
          trend={3}
          type="purple" 
        />
      </div>

      {/* CTA Card - Twilio Setup */}
      {!user?.twilioConfig?.isConfigured && (
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 p-8 hover-lift">
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3">
                <div className="p-1.5 bg-white/10 rounded-md">
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
                <span>Quick Setup</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Configure Your Twilio Account</h2>
              <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                Connect your Twilio credentials to start making and receiving calls effectively with your AI agents.
              </p>
              <Link to="/dashboard/settings" 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-sm font-semibold hover:bg-zinc-100 hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95"
              >
                Connect Twilio <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm p-6 min-h-[320px] hover-lift">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <div className="p-2 bg-zinc-800/50 rounded-lg">
              <Activity className="w-4 h-4 text-zinc-400" />
            </div>
          </div>
          
          {stats.totalCalls === 0 ? (
            <div className="flex flex-col items-center justify-center h-56 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-zinc-700/50 shadow-lg">
                <Phone className="w-7 h-7 text-zinc-500" />
              </div>
              <p className="text-zinc-300 text-base font-medium mb-1">No calls yet</p>
              <p className="text-xs text-zinc-500 max-w-xs">Create your first voice agent to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-zinc-500 text-sm text-center py-4">Activity will appear here</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm p-6 hover-lift">
          <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
          
          <div className="space-y-2.5">
            {[
              { icon: Bot, label: 'Create New Agent', desc: 'Build a custom voice AI', path: '/dashboard/agents', gradient: 'from-violet-500 to-purple-500' },
              { icon: Phone, label: 'Make Test Call', desc: 'Try your agent', path: '/dashboard/calls', gradient: 'from-blue-500 to-cyan-500' },
              { icon: TrendingUp, label: 'View Analytics', desc: 'Check performance', path: '/dashboard', gradient: 'from-emerald-500 to-teal-500' }
            ].map((action, i) => (
              <Link
                key={i}
                to={action.path}
                className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all group"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} bg-opacity-10 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white group-hover:text-zinc-100">{action.label}</p>
                  <p className="text-xs text-zinc-500">{action.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black text-white pl-64">
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