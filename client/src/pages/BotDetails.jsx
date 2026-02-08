import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Bot,
    ArrowLeft,
    Edit,
    Trash2,
    Phone,
    Play,
    Pause,
    Volume2,
    Calendar,
    Clock,
    TrendingUp,
    FileText,
    Mic,
    Loader2,
    MessageSquare,
    CheckCircle,
    XCircle
} from 'lucide-react';
import axios from 'axios';
import TriggerCall from '../components/TriggerCall';
import CreateBot from './CreateBot';

const API_BASE = 'http://localhost:5000/api';
const CALLENGINE_BASE = 'http://localhost:8000';

export default function BotDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bot, setBot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [playingAudio, setPlayingAudio] = useState(null);
    const [audioElements, setAudioElements] = useState({});
    const [callLogs, setCallLogs] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchBotDetails();
    }, [id]);

    const fetchBotDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE}/bots/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBot(response.data.data.bot);

            // Fetch call logs
            fetchCallLogs();
        } catch (error) {
            console.error('Error fetching bot:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCallLogs = async () => {
        try {
            setLoadingLogs(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE}/calls/bot/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCallLogs(response.data.data?.calls || []);
        } catch (error) {
            console.error('Error fetching call logs:', error);
        } finally {
            setLoadingLogs(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this bot?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE}/bots/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Error deleting bot:', error);
        }
    };

    const playAudio = (key) => {
        // Stop currently playing audio
        if (playingAudio && audioElements[playingAudio]) {
            audioElements[playingAudio].pause();
            audioElements[playingAudio].currentTime = 0;
        }

        if (playingAudio === key) {
            setPlayingAudio(null);
            return;
        }

        // Create or get audio element
        if (!audioElements[key]) {
            const audio = new Audio(`${CALLENGINE_BASE}/static/${bot.slug}/${key}.mp3`);
            audio.onended = () => setPlayingAudio(null);
            setAudioElements(prev => ({ ...prev, [key]: audio }));
            audio.play();
        } else {
            audioElements[key].play();
        }

        setPlayingAudio(key);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-violet-950/20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
            </div>
        );
    }

    if (!bot) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-violet-950/20 flex items-center justify-center">
                <p className="text-zinc-400">Bot not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-violet-950/20">
            {/* Header */}
            <div className="border-b border-white/10 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-zinc-400" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-zinc-100">{bot.name}</h1>
                                <p className="text-sm text-zinc-400">{bot.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex gap-1 mb-6 border-b border-white/10">
                    {['Overview', 'Script Flow', 'Audio Files', 'Analytics', 'Test Call'].map((tab, index) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(index)}
                            className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === index
                                ? 'text-violet-400'
                                : 'text-zinc-400 hover:text-zinc-300'
                                }`}
                        >
                            {tab}
                            {activeTab === index && (
                                <motion.div
                                    layoutId="activeDetailTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {/* Overview Tab */}
                    {activeTab === 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Stats Cards */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 bg-zinc-900/50 border border-white/10 rounded-xl"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <Phone className="w-5 h-5 text-violet-400" />
                                    <h3 className="text-lg font-medium text-zinc-100">Call Statistics</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-zinc-400">Total Calls</p>
                                        <p className="text-2xl font-bold text-zinc-100">{bot.stats?.totalCalls || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-400">Total Minutes</p>
                                        <p className="text-2xl font-bold text-zinc-100">{bot.stats?.totalMinutes || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-400">Avg Duration</p>
                                        <p className="text-2xl font-bold text-zinc-100">{bot.stats?.avgDuration || 0}s</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-400">Success Rate</p>
                                        <p className="text-2xl font-bold text-zinc-100">{bot.stats?.successRate || 0}%</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Bot Configuration */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="p-6 bg-zinc-900/50 border border-white/10 rounded-xl"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <Bot className="w-5 h-5 text-violet-400" />
                                    <h3 className="text-lg font-medium text-zinc-100">Configuration</h3>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-zinc-400">Voice Type</p>
                                        <p className="text-zinc-100 capitalize">{bot.voiceType}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-400">Language</p>
                                        <p className="text-zinc-100">{bot.language}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-400">Personality</p>
                                        <p className="text-zinc-100 capitalize">{bot.personality}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-400">Status</p>
                                        <span className={`px-2 py-1 rounded text-xs ${bot.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {bot.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Script Flow Tab */}
                    {activeTab === 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 bg-zinc-900/50 border border-white/10 rounded-xl"
                        >
                            <h3 className="text-lg font-medium text-zinc-100 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-violet-400" />
                                Script Flow ({bot.scriptFlow?.length || 0} items)
                            </h3>
                            {bot.scriptFlow && bot.scriptFlow.length > 0 ? (
                                <div className="space-y-3">
                                    {bot.scriptFlow.map((item, index) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-zinc-800/50 border border-white/5 rounded-lg"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs rounded">
                                                            {item.is_question ? 'Question' : 'Statement'}
                                                        </span>
                                                        <span className="text-xs text-zinc-500">{item.key}</span>
                                                    </div>
                                                    <p className="text-zinc-200">{item.text}</p>
                                                    {item.hints && (
                                                        <p className="text-sm text-zinc-400 mt-2">
                                                            Hints: {item.hints}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-zinc-400 text-center py-8">No script flow defined</p>
                            )}
                        </motion.div>
                    )}

                    {/* Audio Files Tab */}
                    {activeTab === 2 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 bg-zinc-900/50 border border-white/10 rounded-xl"
                        >
                            <h3 className="text-lg font-medium text-zinc-100 mb-4 flex items-center gap-2">
                                <Mic className="w-5 h-5 text-violet-400" />
                                Generated Audio Files
                            </h3>
                            {bot.hasAudioGenerated ? (
                                <div className="space-y-2">
                                    {bot.scriptFlow?.filter(item => item.is_question).map((item, index) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-zinc-800/50 border border-white/5 rounded-lg flex items-center justify-between"
                                        >
                                            <div className="flex-1">
                                                <p className="text-zinc-200 font-medium">{item.key}.mp3</p>
                                                <p className="text-sm text-zinc-400 mt-1">{item.text}</p>
                                            </div>
                                            <button
                                                onClick={() => playAudio(item.key)}
                                                className="p-3 bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 rounded-lg transition-colors"
                                            >
                                                {playingAudio === item.key ? (
                                                    <Pause className="w-5 h-5" />
                                                ) : (
                                                    <Play className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Volume2 className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                                    <p className="text-zinc-400">No audio files generated yet</p>
                                    <p className="text-sm text-zinc-500 mt-1">Go to the Test Call tab to generate audio</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 3 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 bg-zinc-900/50 border border-white/10 rounded-xl"
                        >
                            <h3 className="text-lg font-medium text-zinc-100 mb-4 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-violet-400" />
                                Call Analytics ({callLogs.length} calls)
                            </h3>
                            {loadingLogs ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                                </div>
                            ) : callLogs.length > 0 ? (
                                <div className="space-y-4">
                                    {callLogs.map((call, index) => (
                                        <div
                                            key={call._id || index}
                                            className="p-4 bg-zinc-800/50 border border-white/5 rounded-lg"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-zinc-200 font-medium">
                                                            {call.phoneNumber}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded text-xs ${call.status === 'completed'
                                                            ? 'bg-green-500/20 text-green-400'
                                                            : call.status === 'failed'
                                                                ? 'bg-red-500/20 text-red-400'
                                                                : 'bg-yellow-500/20 text-yellow-400'
                                                            }`}>
                                                            {call.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {call.duration ? `${call.duration}s` : 'N/A'}
                                                        </span>
                                                        <span>
                                                            {new Date(call.createdAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                {call.status === 'completed' ? (
                                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                                ) : call.status === 'failed' ? (
                                                    <XCircle className="w-5 h-5 text-red-400" />
                                                ) : null}
                                            </div>

                                            {/* Call Conversation */}
                                            {call.responses && Object.keys(call.responses).length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-white/5">
                                                    <p className="text-xs font-medium text-zinc-400 mb-3 flex items-center gap-1">
                                                        <MessageSquare className="w-3 h-3" />
                                                        Conversation ({Object.keys(call.responses).length} responses)
                                                    </p>
                                                    <div className="space-y-3">
                                                        {Object.entries(call.responses).map(([key, value]) => {
                                                            // Find the question text from script flow
                                                            const question = bot.scriptFlow?.find(item => item.key === key);
                                                            return (
                                                                <div key={key} className="bg-zinc-900/50 p-3 rounded-lg">
                                                                    <p className="text-xs text-violet-400 mb-1">
                                                                        Q: {question?.text || key}
                                                                    </p>
                                                                    <p className="text-sm text-zinc-200">
                                                                        A: {value}
                                                                    </p>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                                    <p className="text-zinc-400">No call logs yet</p>
                                    <p className="text-sm text-zinc-500 mt-1">Make test calls to see analytics here</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Test Call Tab */}
                    {activeTab === 4 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <TriggerCall
                                botId={bot._id}
                                botName={bot.name}
                                hasScriptFlow={bot.scriptFlow && bot.scriptFlow.length > 0}
                                hasAudioGenerated={bot.hasAudioGenerated}
                            />
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Edit Bot Modal */}
            <CreateBot
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={() => {
                    setIsEditModalOpen(false);
                    fetchBotDetails(); // Refresh bot data
                }}
                editBot={bot}
            />
        </div>
    );
}
