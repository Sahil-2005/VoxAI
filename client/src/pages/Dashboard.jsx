import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import {
    Plus,
    Bot,
    Search,
    Phone,
    Clock,
    TrendingUp,
    CheckCircle2,
    Activity,
    Users,
    Zap
} from 'lucide-react';
import BotCard from '../components/BotCard';
import StatsCard from '../components/StatsCard';
import CreateBot from './CreateBot';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [bots, setBots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateBotOpen, setIsCreateBotOpen] = useState(false);
    const [editingBot, setEditingBot] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const headerRef = useRef(null);

    useGSAP(() => {
        // Header animation
        gsap.from(headerRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.6,
            ease: 'power3.out'
        });
    }, []);

    useEffect(() => {
        fetchBots();
    }, []);

    const fetchBots = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/bots');
            if (response.data.success) {
                setBots(response.data.data.bots || []);
            }
        } catch (error) {
            console.error('Failed to fetch bots:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (bot) => {
        setEditingBot(bot);
        setIsCreateBotOpen(true);
    };

    const handleDelete = async (botId) => {
        if (!confirm('Are you sure you want to delete this bot?')) return;

        try {
            await api.delete(`/bots/${botId}`);
            setBots(prev => prev.filter(b => b._id !== botId));
        } catch (error) {
            console.error('Failed to delete bot:', error);
        }
    };

    const handleTestCall = (bot) => {
        alert(`Initiating test call for: ${bot.name}`);
    };

    const handleToggleActive = async (botId, isActive) => {
        try {
            await api.put(`/bots/${botId}`, { isActive });
            setBots(prev => prev.map(b =>
                b._id === botId ? { ...b, isActive } : b
            ));
        } catch (error) {
            console.error('Failed to toggle bot status:', error);
        }
    };

    const handleCreateSuccess = () => {
        setIsCreateBotOpen(false);
        setEditingBot(null);
        fetchBots();
    };

    const filteredBots = bots.filter(bot =>
        bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bot.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate stats from bots
    const stats = {
        totalCalls: bots.reduce((acc, bot) => acc + (bot.stats?.totalCalls || 0), 0),
        totalMinutes: bots.reduce((acc, bot) => acc + (bot.stats?.totalMinutes || 0), 0),
        avgDuration: bots.length > 0
            ? (bots.reduce((acc, bot) => acc + (bot.stats?.avgDuration || 0), 0) / bots.length).toFixed(1)
            : '0',
        successRate: bots.length > 0
            ? (bots.reduce((acc, bot) => acc + (bot.stats?.successRate || 0), 0) / bots.length).toFixed(1)
            : '0',
        activeBots: bots.filter(b => b.isActive).length
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 mb-2"
                    >
                        <span className="text-zinc-400">Welcome back,</span>
                        <span className="text-zinc-100 font-medium">{user?.name || 'User'}</span>
                        <motion.span
                            animate={{ rotate: [0, 14, -8, 14, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                            className="text-xl"
                        >
                            👋
                        </motion.span>
                    </motion.div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-zinc-100">Dashboard</h1>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        setEditingBot(null);
                        setIsCreateBotOpen(true);
                    }}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/25"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Create Bot
                </motion.button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard
                    title="Total Calls"
                    value={stats.totalCalls.toLocaleString()}
                    change="+12.5%"
                    changeType="positive"
                    icon={Phone}
                    gradient="from-violet-500 to-purple-500"
                    delay={0}
                />
                <StatsCard
                    title="Minutes Used"
                    value={`${stats.totalMinutes.toLocaleString()}`}
                    change="+8.2%"
                    changeType="positive"
                    icon={Clock}
                    gradient="from-blue-500 to-cyan-500"
                    delay={1}
                />
                <StatsCard
                    title="Success Rate"
                    value={`${stats.successRate}%`}
                    change="+2.1%"
                    changeType="positive"
                    icon={CheckCircle2}
                    gradient="from-emerald-500 to-teal-500"
                    delay={2}
                />
                <StatsCard
                    title="Active Bots"
                    value={`${stats.activeBots}/${bots.length}`}
                    change={stats.activeBots === bots.length ? 'All active' : null}
                    changeType="neutral"
                    icon={Bot}
                    gradient="from-amber-500 to-orange-500"
                    delay={3}
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative group bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-2xl border border-violet-500/20 p-5 cursor-pointer"
                    onClick={() => setIsCreateBotOpen(true)}
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-violet-500/20 rounded-xl">
                            <Zap className="w-6 h-6 text-violet-400" />
                        </div>
                        <div>
                            <h3 className="text-zinc-100 font-medium">Quick Create</h3>
                            <p className="text-sm text-zinc-500">Deploy a new AI agent in minutes</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative group bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-500/20 p-5 cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/20 rounded-xl">
                            <Activity className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-zinc-100 font-medium">View Analytics</h3>
                            <p className="text-sm text-zinc-500">Deep dive into call metrics</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-500/20 p-5 cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-zinc-100 font-medium">Team Settings</h3>
                            <p className="text-sm text-zinc-500">Manage team members</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bots Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-zinc-100">Your Voice Agents</h2>
                    <p className="text-sm text-zinc-500">Manage and monitor your AI assistants</p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search bots..."
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                    />
                </div>
            </div>

            {/* Bot Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/5 p-6"
                        >
                            <div className="animate-pulse">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-zinc-800 rounded-xl" />
                                    <div className="flex-1">
                                        <div className="h-5 bg-zinc-800 rounded w-3/4 mb-2" />
                                        <div className="h-4 bg-zinc-800 rounded w-1/2" />
                                    </div>
                                </div>
                                <div className="h-24 bg-zinc-800 rounded-xl mb-4" />
                                <div className="flex justify-between">
                                    <div className="h-8 bg-zinc-800 rounded w-24" />
                                    <div className="h-8 bg-zinc-800 rounded w-20" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : filteredBots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBots.map((bot, index) => (
                        <motion.div
                            key={bot._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <BotCard
                                bot={bot}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onTestCall={handleTestCall}
                                onToggleActive={handleToggleActive}
                            />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                >
                    <motion.div
                        animate={{
                            y: [0, -8, 0],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="inline-flex items-center justify-center w-24 h-24 bg-zinc-900/50 rounded-2xl border border-white/5 mb-6"
                    >
                        <Bot className="w-12 h-12 text-zinc-600" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                        {searchTerm ? 'No bots found' : 'Create your first AI agent'}
                    </h3>
                    <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                        {searchTerm
                            ? 'Try adjusting your search terms'
                            : 'Deploy intelligent voice bots that handle calls 24/7 with human-like conversations.'
                        }
                    </p>
                    {!searchTerm && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsCreateBotOpen(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/25"
                        >
                            <Plus className="w-5 h-5" />
                            Create Your First Agent
                        </motion.button>
                    )}
                </motion.div>
            )}

            {/* Create/Edit Bot Drawer */}
            <CreateBot
                isOpen={isCreateBotOpen}
                onClose={() => {
                    setIsCreateBotOpen(false);
                    setEditingBot(null);
                }}
                onSuccess={handleCreateSuccess}
                editBot={editingBot}
            />
        </div>
    );
};

export default Dashboard;
