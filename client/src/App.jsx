import { useState } from 'react'
import './App.css'
import Settings from './pages/Settings'
import CreateBot from './pages/CreateBot'
import BotCard from './components/BotCard'

// Sample bot data for demonstration
const sampleBots = [
  {
    _id: '1',
    name: 'Customer Support Agent',
    description: 'Handles customer inquiries and support tickets',
    voiceType: 'female',
    personality: 'professional',
    systemPrompt: 'You are a helpful customer support agent...',
    greeting: 'Hello! How can I assist you today?',
    isActive: true,
    stats: {
      totalCalls: 1247,
      totalMinutes: 3820,
      avgDuration: 3.06,
      successRate: 94.2,
      callHistory: [65, 72, 68, 80, 95, 88, 102, 98, 115, 120, 108, 125]
    }
  },
  {
    _id: '2',
    name: 'Sales Assistant',
    description: 'Qualifies leads and schedules demos',
    voiceType: 'male',
    personality: 'friendly',
    systemPrompt: 'You are a friendly sales assistant...',
    greeting: 'Hi there! Thanks for reaching out!',
    isActive: true,
    stats: {
      totalCalls: 856,
      totalMinutes: 2140,
      avgDuration: 2.5,
      successRate: 87.5,
      callHistory: [45, 52, 48, 60, 75, 68, 82, 78, 95, 100, 88, 105]
    }
  },
  {
    _id: '3',
    name: 'Appointment Scheduler',
    description: 'Books and manages appointments',
    voiceType: 'neutral',
    personality: 'formal',
    systemPrompt: 'You are a professional appointment scheduler...',
    greeting: 'Good day! How may I help you schedule your appointment?',
    isActive: false,
    stats: {
      totalCalls: 423,
      totalMinutes: 845,
      avgDuration: 2.0,
      successRate: 91.8,
      callHistory: [25, 32, 28, 40, 55, 48, 62, 58, 75, 80, 68, 85]
    }
  }
]

function App() {
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'settings'
  const [isCreateBotOpen, setIsCreateBotOpen] = useState(false)
  const [editingBot, setEditingBot] = useState(null)
  const [bots, setBots] = useState(sampleBots)

  const handleEdit = (bot) => {
    setEditingBot(bot)
    setIsCreateBotOpen(true)
  }

  const handleDelete = (botId) => {
    if (confirm('Are you sure you want to delete this bot?')) {
      setBots(prev => prev.filter(b => b._id !== botId))
    }
  }

  const handleTestCall = (bot) => {
    alert(`Initiating test call for: ${bot.name}`)
  }

  const handleToggleActive = (botId, isActive) => {
    setBots(prev => prev.map(b =>
      b._id === botId ? { ...b, isActive } : b
    ))
  }

  const handleCreateSuccess = () => {
    setIsCreateBotOpen(false)
    setEditingBot(null)
    // In real app, refetch bots from API
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                VoxAI
              </h1>
              <div className="flex items-center gap-1 p-1 bg-zinc-900/50 rounded-xl">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'dashboard'
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-400 hover:text-zinc-100'
                    }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings'
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-400 hover:text-zinc-100'
                    }`}
                >
                  Settings
                </button>
              </div>
            </div>

            {activeTab === 'dashboard' && (
              <button
                onClick={() => {
                  setEditingBot(null)
                  setIsCreateBotOpen(true)
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white text-sm font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/25"
              >
                + Create Bot
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {activeTab === 'dashboard' ? (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-100 mb-2">Your Voice Bots</h2>
            <p className="text-zinc-400">Manage and monitor your AI voice assistants</p>
          </div>

          {/* Bot Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots.map((bot) => (
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

          {bots.length === 0 && (
            <div className="text-center py-16">
              <p className="text-zinc-400 mb-4">No bots created yet</p>
              <button
                onClick={() => setIsCreateBotOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all"
              >
                Create Your First Bot
              </button>
            </div>
          )}
        </div>
      ) : (
        <Settings />
      )}

      {/* Create/Edit Bot Drawer */}
      <CreateBot
        isOpen={isCreateBotOpen}
        onClose={() => {
          setIsCreateBotOpen(false)
          setEditingBot(null)
        }}
        onSuccess={handleCreateSuccess}
        editBot={editingBot}
      />
    </div>
  )
}

export default App
