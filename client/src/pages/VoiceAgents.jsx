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
  Sparkles
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
          <p className="text-zinc-400 mt-1.5 text-base">Create and manage your AI voice agents</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus} size="lg">
          Create Agent
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search agents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-zinc-900/70 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:bg-zinc-900 focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/50 outline-none transition-all text-sm"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
        </div>
      ) : filteredBots.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 border border-zinc-800/50 rounded-2xl bg-zinc-900/20 backdrop-blur-sm hover-lift">
          <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-zinc-700/50 shadow-xl">
            <Bot className="w-9 h-9 text-zinc-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No agents yet</h3>
          <p className="text-zinc-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            Create your first voice agent to start automating customer conversations.
          </p>
          <Button onClick={() => setIsModalOpen(true)} icon={Plus} size="lg">
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
                className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-5 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all group hover-lift"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl flex items-center justify-center border border-zinc-700/50 shadow-lg group-hover:scale-105 transition-transform">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-base">{bot.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full ${bot.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'}`} />
                        <span className="text-xs text-zinc-500 font-medium">
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
                <p className="text-zinc-400 text-sm mb-4 line-clamp-2 h-10 leading-relaxed">
                  {bot.description || 'No description provided'}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 bg-zinc-900/50 rounded-xl p-3.5 border border-zinc-800/50">
                  <div className="text-center">
                    <p className="text-base font-bold text-white">{bot.stats?.totalCalls || 0}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mt-0.5">Calls</p>
                  </div>
                  <div className="text-center border-l border-zinc-800/50">
                    <p className="text-base font-bold text-white">{bot.stats?.totalMinutes || 0}m</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mt-0.5">Mins</p>
                  </div>
                  <div className="text-center border-l border-zinc-800/50">
                    <p className="text-base font-bold text-white">{bot.stats?.successRate || 0}%</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mt-0.5">Rate</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                  <span className="text-xs text-zinc-500 capitalize font-medium">{bot.personality} • {bot.voiceType}</span>
                  <Link to={`/dashboard/agents/${bot._id}`} className="text-xs font-semibold text-white hover:underline group-hover:text-zinc-200">
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
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Agent Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Sales Assistant"
              required
            />
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-400">Voice Type</label>
              <select
                name="voiceType"
                value={formData.voiceType}
                onChange={handleInputChange}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white px-3 py-2 text-sm focus:border-white/20 focus:ring-1 focus:ring-white/20 outline-none transition-all"
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

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-400">Personality</label>
            <div className="grid grid-cols-4 gap-2">
              {['professional', 'friendly', 'casual', 'formal'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, personality: p })}
                  className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all border ${
                    formData.personality === p 
                      ? 'bg-zinc-100 text-black border-transparent' 
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-400">
              <Sparkles className="w-3.5 h-3.5 inline mr-1 text-zinc-500" />
              System Prompt
            </label>
            <textarea
              name="systemPrompt"
              value={formData.systemPrompt}
              onChange={handleInputChange}
              placeholder="You are a helpful customer service agent..."
              rows={4}
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 px-3 py-2 text-sm focus:border-white/20 focus:ring-1 focus:ring-white/20 outline-none transition-all resize-none"
            />
          </div>

          <Input
            label="Greeting Message"
            name="greeting"
            value={formData.greeting}
            onChange={handleInputChange}
            placeholder="Hello! How can I assist you today?"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" type="button" onClick={closeModal}>
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
