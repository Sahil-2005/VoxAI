import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Power,
  Phone,
  Clock,
  MessageSquare,
  Loader2,
  Sparkles,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';
import { botService } from '../services/botService';
import { Link } from 'react-router-dom';

const VoiceAgents = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBot, setEditingBot] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    systemPrompt: '',
    greeting: 'Hello! How can I assist you today?',
    voiceType: 'female',
    personality: 'professional'
  });

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    try {
      const response = await botService.getBots();
      if (response.success) {
        setBots(response.data.bots);
      }
    } catch (error) {
      console.error('Error fetching bots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (editingBot) {
        const response = await botService.updateBot(editingBot._id, formData);
        if (response.success) {
          setBots(bots.map(b => b._id === editingBot._id ? response.data.bot : b));
        }
      } else {
        const response = await botService.createBot(formData);
        if (response.success) {
          setBots([response.data.bot, ...bots]);
        }
      }
      closeModal();
    } catch (error) {
      console.error('Error saving bot:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (botId) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;
    
    try {
      const response = await botService.deleteBot(botId);
      if (response.success) {
        setBots(bots.filter(b => b._id !== botId));
      }
    } catch (error) {
      console.error('Error deleting bot:', error);
    }
  };

  const handleEdit = (bot) => {
    setEditingBot(bot);
    setFormData({
      name: bot.name,
      description: bot.description || '',
      systemPrompt: bot.systemPrompt,
      greeting: bot.greeting,
      voiceType: bot.voiceType,
      personality: bot.personality
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBot(null);
    setFormData({
      name: '',
      description: '',
      systemPrompt: '',
      greeting: 'Hello! How can I assist you today?',
      voiceType: 'female',
      personality: 'professional'
    });
  };

  const filteredBots = bots.filter(bot => 
    bot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Voice Agents</h1>
          <p className="text-zinc-400 mt-1">Create and manage your AI voice agents</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
          Create Agent
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-zinc-800/80 rounded-xl text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2.5 bg-zinc-900/50 border border-zinc-800/80 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-700 transition-all flex items-center gap-2 text-sm font-medium">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <div className="flex bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
            <p className="text-zinc-500 text-sm">Loading your agents...</p>
          </div>
        </div>
      ) : filteredBots.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 border border-zinc-800/80 rounded-2xl bg-gradient-to-br from-zinc-900/50 to-zinc-950/50">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-violet-500/20">
            <Bot className="w-10 h-10 text-violet-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No agents yet</h3>
          <p className="text-zinc-500 mb-8 max-w-md mx-auto">
            Create your first voice agent to start automating customer conversations.
          </p>
          <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
            Create Your First Agent
          </Button>
        </div>
      ) : (
        /* Bots Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredBots.map((bot, i) => (
              <motion.div
                key={bot._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 hover:border-zinc-700/80 transition-all group"
              >
                {/* Active indicator glow */}
                {bot.isActive && (
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl flex items-center justify-center border border-violet-500/20">
                        <Bot className="w-6 h-6 text-violet-400" />
                      </div>
                      {bot.isActive && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-zinc-900 rounded-full" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{bot.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          bot.isActive 
                            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' 
                            : 'text-zinc-500 bg-zinc-800/50 border border-zinc-700/50'
                        }`}>
                          {bot.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(bot)}
                      className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(bot._id)}
                      className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-zinc-400 text-sm mb-5 line-clamp-2 h-10">
                  {bot.description || 'No description provided'}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="text-center p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                    <p className="text-lg font-bold text-white">{bot.stats?.totalCalls || 0}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Calls</p>
                  </div>
                  <div className="text-center p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                    <p className="text-lg font-bold text-white">{bot.stats?.totalMinutes || 0}m</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Mins</p>
                  </div>
                  <div className="text-center p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                    <p className="text-lg font-bold text-white">{bot.stats?.successRate || 0}%</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Rate</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                  <span className="text-xs text-zinc-500 capitalize flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                    {bot.personality} • {bot.voiceType}
                  </span>
                  <Link to={`/dashboard/agents/${bot._id}`} className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                    View Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={editingBot ? 'Edit Agent' : 'Create New Agent'}
        subtitle={editingBot ? 'Update your agent configuration' : 'Configure your new AI voice agent'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Agent Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Sales Assistant"
              required
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">Voice Type</label>
              <select
                name="voiceType"
                value={formData.voiceType}
                onChange={handleInputChange}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl text-white px-4 py-3 text-sm focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
          </div>

          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of what this agent does..."
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">Personality</label>
            <div className="grid grid-cols-4 gap-2">
              {['professional', 'friendly', 'casual', 'formal'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, personality: p })}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                    formData.personality === p 
                      ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border border-violet-400/20' 
                      : 'bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              System Prompt
            </label>
            <textarea
              name="systemPrompt"
              value={formData.systemPrompt}
              onChange={handleInputChange}
              placeholder="You are a helpful customer service agent..."
              rows={4}
              required
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 px-4 py-3 text-sm focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all resize-none"
            />
          </div>

          <Input
            label="Greeting Message"
            name="greeting"
            value={formData.greeting}
            onChange={handleInputChange}
            placeholder="Hello! How can I assist you today?"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/50">
            <Button variant="secondary" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" loading={formLoading}>
              {editingBot ? 'Update Agent' : 'Create Agent'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VoiceAgents;
