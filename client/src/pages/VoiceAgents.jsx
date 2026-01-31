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
    <div className="p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Voice Agents</h1>
          <p className="text-slate-400">Create and manage your AI voice agents</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
          Create Agent
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
          />
        </div>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        </div>
      ) : filteredBots.length === 0 ? (
        /* Empty State */
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Bot className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No agents yet</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Create your first voice agent to start automating customer conversations.
          </p>
          <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
            Create Your First Agent
          </Button>
        </motion.div>
      ) : (
        /* Bots Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredBots.map((bot, i) => (
              <motion.div
                key={bot._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-violet-500/30 transition-all group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{bot.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${bot.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                        {bot.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(bot)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(bot._id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {bot.description || 'No description provided'}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <Phone className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                    <p className="text-lg font-semibold text-white">{bot.stats?.totalCalls || 0}</p>
                    <p className="text-xs text-slate-500">Calls</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                    <p className="text-lg font-semibold text-white">{bot.stats?.totalMinutes || 0}m</p>
                    <p className="text-xs text-slate-500">Minutes</p>
                  </div>
                  <div className="text-center">
                    <MessageSquare className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                    <p className="text-lg font-semibold text-white">{bot.stats?.successRate || 0}%</p>
                    <p className="text-xs text-slate-500">Success</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <span className="text-xs text-slate-500 capitalize">{bot.personality} • {bot.voiceType}</span>
                  <Button variant="ghost" size="sm">
                    Test <Phone className="w-4 h-4 ml-1" />
                  </Button>
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
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Voice Type</label>
              <select
                name="voiceType"
                value={formData.voiceType}
                onChange={handleInputChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white px-4 py-3 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
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
            <label className="block text-sm font-medium text-slate-300">Personality</label>
            <div className="grid grid-cols-4 gap-3">
              {['professional', 'friendly', 'casual', 'formal'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, personality: p })}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                    formData.personality === p 
                      ? 'bg-violet-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              <Sparkles className="w-4 h-4 inline mr-1 text-violet-400" />
              System Prompt
            </label>
            <textarea
              name="systemPrompt"
              value={formData.systemPrompt}
              onChange={handleInputChange}
              placeholder="You are a helpful customer service agent..."
              rows={4}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 px-4 py-3 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all resize-none"
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
