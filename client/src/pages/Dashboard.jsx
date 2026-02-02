import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Bot, Search, Filter } from 'lucide-react';
import BotCard from '../components/BotCard';
import CreateBot from './CreateBot';
import api from '../services/api';

const Dashboard = () => {
    const [bots, setBots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateBotOpen, setIsCreateBotOpen] = useState(false);
    const [editingBot, setEditingBot] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-zinc-100">Dashboard</h1>
                    <p className="text-zinc-400 mt-1">Manage and monitor your AI voice assistants</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        setEditingBot(null);
                        setIsCreateBotOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/25"
                >
                    <Plus className="w-5 h-5" />
                    Create Bot
                </motion.button>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search bots..."
                        className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                    />
                </div>
            </div>

            {/* Bot Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/5 p-6 animate-pulse">
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
                    ))}
                </div>
            ) : filteredBots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBots.map((bot) => (
                        <BotCard
                            key={bot._id}
                            bot={bot}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onTestCall={handleTestCall}
                            onToggleActive={handleToggleActive}
                        />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-900/50 rounded-2xl border border-white/5 mb-6">
                        <Bot className="w-10 h-10 text-zinc-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                        {searchTerm ? 'No bots found' : 'No bots created yet'}
                    </h3>
                    <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                        {searchTerm
                            ? 'Try adjusting your search terms'
                            : 'Create your first AI voice assistant to get started with automated calls.'
                        }
                    </p>
                    {!searchTerm && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsCreateBotOpen(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/25"
                        >
                            <Plus className="w-5 h-5" />
                            Create Your First Bot
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
