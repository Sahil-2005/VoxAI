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
  ChevronRight,
  Sparkles,
  Bell,
  Search
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Button from '../components/Button';
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search agents, calls, settings..."
            className="w-full pl-11 pr-4 py-2.5 bg-zinc-900/50 border border-zinc-800/80 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 text-zinc-400 hover:text-white bg-zinc-900/50 border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-violet-500 rounded-full" />
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-zinc-500">{getGreeting()}</span>
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-zinc-400">
            Here's what's happening with your voice agents today.
          </p>
        </div>
        <Link to="/dashboard/agents">
          <Button icon={Plus}>
            Create Agent
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
        <StatCard 
          icon={Phone} 
          label="Total Calls" 
          value={stats.totalCalls.toLocaleString()} 
          trend={12}
          type="blue" 
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
          type="violet" 
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
        <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent p-8">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-500/20 rounded-full text-violet-300 text-xs font-semibold mb-4">
                <Zap className="w-3.5 h-3.5" />
                <span>Quick Setup Required</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Configure Your Twilio Account</h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
                Connect your Twilio credentials to start making and receiving calls with your AI voice agents. It only takes a few minutes.
              </p>
            </div>
            <Link to="/dashboard/settings">
              <Button icon={ArrowRight} iconPosition="right">
                Connect Twilio
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 p-6 min-h-[320px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              <p className="text-sm text-zinc-500">Your latest call logs</p>
            </div>
            <div className="p-2 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
              <Activity className="w-5 h-5 text-zinc-400" />
            </div>
          </div>
          
          {stats.totalCalls === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="w-16 h-16 bg-zinc-800/30 rounded-2xl flex items-center justify-center mb-4 border border-zinc-700/50">
                <Phone className="w-7 h-7 text-zinc-600" />
              </div>
              <p className="text-zinc-400 font-medium mb-1">No calls yet</p>
              <p className="text-sm text-zinc-600">Create your first voice agent to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-zinc-500 text-sm text-center py-4">Activity will appear here</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
              <p className="text-sm text-zinc-500">Common tasks at your fingertips</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { icon: Bot, label: 'Create New Agent', desc: 'Build a custom voice AI', path: '/dashboard/agents', color: 'violet' },
              { icon: Phone, label: 'Make Test Call', desc: 'Try your agent live', path: '/dashboard/calls', color: 'blue' },
              { icon: TrendingUp, label: 'View Analytics', desc: 'Check performance metrics', path: '/dashboard', color: 'emerald' }
            ].map((action, i) => (
              <Link
                key={i}
                to={action.path}
                className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800/50 hover:bg-zinc-800/30 hover:border-zinc-700/50 transition-all group"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                  action.color === 'violet' ? 'bg-violet-500/10 border border-violet-500/20 text-violet-400' :
                  action.color === 'blue' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' :
                  'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                }`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white group-hover:text-zinc-100">{action.label}</p>
                  <p className="text-xs text-zinc-500">{action.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
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
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900 text-white pl-64">
      <Sidebar />
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/agents/*" element={<VoiceAgents />} />
          <Route path="/calls" element={<CallHistory />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;