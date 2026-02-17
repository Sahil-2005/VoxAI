import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot,
    User,
    Mic,
    Brain,
    Sparkles,
    MessageSquare,
    Save,
    X,
    ChevronDown,
    Check,
    Loader2,
    AlertCircle,
    Wand2,
    FileText,
    Phone
} from 'lucide-react';
import axios from 'axios';
import ScriptBuilder from '../components/ScriptBuilder';
import TriggerCall from '../components/TriggerCall';

const API_BASE = import.meta.env.VITE_API_URL;

const voiceTypes = [
    { value: 'male', label: 'Male', icon: User, description: 'Deep, authoritative tone' },
    { value: 'female', label: 'Female', icon: User, description: 'Clear, warm tone' },
    { value: 'neutral', label: 'Neutral', icon: Mic, description: 'Balanced, versatile tone' }
];

const personalities = [
    { value: 'professional', label: 'Professional', color: 'from-blue-500 to-cyan-500' },
    { value: 'friendly', label: 'Friendly', color: 'from-emerald-500 to-teal-500' },
    { value: 'casual', label: 'Casual', color: 'from-orange-500 to-amber-500' },
    { value: 'formal', label: 'Formal', color: 'from-violet-500 to-purple-500' }
];

const CreateBot = ({ isOpen, onClose, onSuccess, editBot = null }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        voiceType: 'female',
        personality: 'professional',
        systemPrompt: '',
        greeting: 'Hello! How can I assist you today?',
        recognitionLanguage: 'en-US',
        scriptFlow: []
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPersonalityDropdown, setShowPersonalityDropdown] = useState(false);

    // Initialize form when editing
    useEffect(() => {
        if (editBot) {
            setFormData({
                name: editBot.name || '',
                description: editBot.description || '',
                voiceType: editBot.voiceType || 'female',
                personality: editBot.personality || 'professional',
                systemPrompt: editBot.systemPrompt || '',
                greeting: editBot.greeting || 'Hello! How can I assist you today?',
                recognitionLanguage: editBot.recognitionLanguage || 'en-US',
                scriptFlow: editBot.scriptFlow || []
            });
        } else {
            // Reset form for new bot
            setFormData({
                name: '',
                description: '',
                voiceType: 'female',
                personality: 'professional',
                systemPrompt: '',
                greeting: 'Hello! How can I assist you today?',
                recognitionLanguage: 'en-US',
                scriptFlow: []
            });
        }
        setErrors({});
        setActiveTab(0);
    }, [editBot, isOpen]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Bot name is required';
        } else if (formData.name.length > 50) {
            newErrors.name = 'Name cannot exceed 50 characters';
        }

        if (formData.description.length > 500) {
            newErrors.description = 'Description cannot exceed 500 characters';
        }

        if (!formData.systemPrompt.trim()) {
            newErrors.systemPrompt = 'System prompt is required';
        } else if (formData.systemPrompt.length > 5000) {
            newErrors.systemPrompt = 'System prompt cannot exceed 5000 characters';
        }

        if (formData.greeting.length > 500) {
            newErrors.greeting = 'Greeting cannot exceed 500 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isFormValid = () => {
        return (
            formData.name.trim() &&
            formData.name.length <= 50 &&
            formData.systemPrompt.trim() &&
            formData.systemPrompt.length <= 5000 &&
            formData.description.length <= 500 &&
            formData.greeting.length <= 500
        );
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            console.log('Submitting bot data:', formData);

            if (editBot) {
                await axios.put(`${API_BASE}/bots/${editBot._id}`, formData, { headers });
            } else {
                await axios.post(`${API_BASE}/bots`, formData, { headers });
            }

            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Failed to save bot:', error);
            setErrors({ submit: error.response?.data?.message || 'Failed to save bot' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGeneratePrompt = () => {
        // Placeholder for AI generation feature
        alert('AI Generation feature coming soon!');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                {/* Slide-over Panel */}
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative h-full w-full max-w-2xl bg-zinc-950 border-l border-white/5 overflow-hidden"
                >
                    {/* Glow Effect */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-violet-500/10 to-transparent pointer-events-none" />

                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl border border-white/5">
                                    <Bot className="w-5 h-5 text-violet-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-zinc-100">
                                        {editBot ? 'Edit Bot' : 'Create New Bot'}
                                    </h2>
                                    <p className="text-sm text-zinc-400">Configure your AI voice assistant</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="sticky top-[73px] z-10 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 px-6">
                        <div className="flex gap-1">
                            {['Basic Info', 'Voice & Personality', 'Script Flow', 'AI Behavior', 'Test Call'].map((tab, index) => (
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
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="overflow-y-auto h-[calc(100vh-220px)] px-6 py-6">
                        <div className="space-y-8">
                            {/* Tab 0: Basic Info Section */}
                            {activeTab === 0 && (
                                <section>
                                    <h3 className="flex items-center gap-2 text-lg font-medium text-zinc-100 mb-4">
                                        <Sparkles className="w-5 h-5 text-violet-400" />
                                        Basic Information
                                    </h3>

                                    <div className="space-y-4">
                                        {/* Name Input */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-medium text-zinc-300">Bot Name</label>
                                                <span className={`text-xs ${formData.name.length > 50 ? 'text-red-400' : 'text-zinc-500'}`}>
                                                    {formData.name.length}/50
                                                </span>
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                placeholder="e.g., Customer Support Agent"
                                                className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all ${errors.name ? 'border-red-500/50' : 'border-white/10'
                                                    }`}
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-400 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Description Input */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-medium text-zinc-300">Description</label>
                                                <span className={`text-xs ${formData.description.length > 500 ? 'text-red-400' : 'text-zinc-500'}`}>
                                                    {formData.description.length}/500
                                                </span>
                                            </div>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                placeholder="Describe what this bot does..."
                                                rows={3}
                                                className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all resize-none ${errors.description ? 'border-red-500/50' : 'border-white/10'
                                                    }`}
                                            />
                                            {errors.description && (
                                                <p className="text-sm text-red-400 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errors.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Tab 1: Voice Settings Section */}
                            {activeTab === 1 && (
                                <section>
                                    <h3 className="flex items-center gap-2 text-lg font-medium text-zinc-100 mb-4">
                                        <Mic className="w-5 h-5 text-violet-400" />
                                        Voice Settings
                                    </h3>

                                    <div className="space-y-4">
                                        {/* Voice Type Cards */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-300">Voice Type</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {voiceTypes.map((voice) => {
                                                    const Icon = voice.icon;
                                                    const isSelected = formData.voiceType === voice.value;
                                                    return (
                                                        <motion.button
                                                            key={voice.value}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => handleInputChange('voiceType', voice.value)}
                                                            className={`relative p-4 rounded-xl border transition-all ${isSelected
                                                                ? 'bg-violet-500/10 border-violet-500/50 shadow-lg shadow-violet-500/10'
                                                                : 'bg-zinc-900/50 border-white/10 hover:border-white/20'
                                                                }`}
                                                        >
                                                            {isSelected && (
                                                                <div className="absolute top-2 right-2">
                                                                    <Check className="w-4 h-4 text-violet-400" />
                                                                </div>
                                                            )}
                                                            <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-violet-400' : 'text-zinc-400'}`} />
                                                            <p className={`text-sm font-medium ${isSelected ? 'text-zinc-100' : 'text-zinc-300'}`}>
                                                                {voice.label}
                                                            </p>
                                                            <p className="text-xs text-zinc-500 mt-1">{voice.description}</p>
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Personality Dropdown */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-300">Personality</label>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPersonalityDropdown(!showPersonalityDropdown)}
                                                    className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-zinc-100 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                                                >
                                                    <span className="flex items-center gap-3">
                                                        <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${personalities.find(p => p.value === formData.personality)?.color
                                                            }`} />
                                                        {personalities.find(p => p.value === formData.personality)?.label}
                                                    </span>
                                                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${showPersonalityDropdown ? 'rotate-180' : ''}`} />
                                                </button>

                                                <AnimatePresence>
                                                    {showPersonalityDropdown && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            className="absolute z-20 w-full mt-2 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-xl"
                                                        >
                                                            {personalities.map((personality) => (
                                                                <button
                                                                    key={personality.value}
                                                                    onClick={() => {
                                                                        handleInputChange('personality', personality.value);
                                                                        setShowPersonalityDropdown(false);
                                                                    }}
                                                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors ${formData.personality === personality.value ? 'bg-zinc-800' : ''
                                                                        }`}
                                                                >
                                                                    <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${personality.color}`} />
                                                                    <span className="text-zinc-100">{personality.label}</span>
                                                                    {formData.personality === personality.value && (
                                                                        <Check className="w-4 h-4 text-violet-400 ml-auto" />
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        {/* Bot Language Dropdown */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-300">Bot Language</label>
                                            <p className="text-xs text-zinc-500 mb-2">Language the bot speaks in (text-to-speech)</p>
                                            <select
                                                value={formData.language}
                                                onChange={(e) => handleInputChange('language', e.target.value)}
                                                className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                            >
                                                <option value="en-US">English (US)</option>
                                                <option value="en-GB">English (UK)</option>
                                                <option value="hi-IN">Hindi (India)</option>
                                                <option value="es-ES">Spanish (Spain)</option>
                                                <option value="fr-FR">French (France)</option>
                                                <option value="de-DE">German (Germany)</option>
                                                <option value="ja-JP">Japanese (Japan)</option>
                                                <option value="zh-CN">Chinese (Simplified)</option>
                                            </select>
                                        </div>

                                        {/* Recognition Language Dropdown */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-300">Recognition Language</label>
                                            <p className="text-xs text-zinc-500 mb-2">Language for speech-to-text (what language users speak in)</p>
                                            <select
                                                value={formData.recognitionLanguage}
                                                onChange={(e) => handleInputChange('recognitionLanguage', e.target.value)}
                                                className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                            >
                                                <option value="en-US">English (US)</option>
                                                <option value="en-GB">English (UK)</option>
                                                <option value="hi-IN">Hindi (India)</option>
                                                <option value="es-ES">Spanish (Spain)</option>
                                                <option value="fr-FR">French (France)</option>
                                                <option value="de-DE">German (Germany)</option>
                                                <option value="ja-JP">Japanese (Japan)</option>
                                                <option value="zh-CN">Chinese (Simplified)</option>
                                            </select>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Tab 2: Script Flow Section */}
                            {activeTab === 2 && (
                                <section>
                                    <h3 className="flex items-center gap-2 text-lg font-medium text-zinc-100 mb-4">
                                        <FileText className="w-5 h-5 text-violet-400" />
                                        Script Flow
                                    </h3>
                                    <ScriptBuilder
                                        questions={formData.scriptFlow}
                                        setQuestions={(flow) => handleInputChange('scriptFlow', flow)}
                                    />
                                </section>
                            )}

                            {/* Tab 3: AI Behavior Section */}
                            {activeTab === 3 && (
                                <section>
                                    <h3 className="flex items-center gap-2 text-lg font-medium text-zinc-100 mb-4">
                                        <Brain className="w-5 h-5 text-violet-400" />
                                        AI Behavior
                                    </h3>

                                    <div className="space-y-4">
                                        {/* System Prompt */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-medium text-zinc-300">System Prompt</label>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-xs ${formData.systemPrompt.length > 5000 ? 'text-red-400' : 'text-zinc-500'}`}>
                                                        {formData.systemPrompt.length}/5000
                                                    </span>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={handleGeneratePrompt}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 rounded-lg text-xs font-medium text-violet-300 hover:from-violet-600/30 hover:to-fuchsia-600/30 transition-colors"
                                                    >
                                                        <Wand2 className="w-3 h-3" />
                                                        Generate with AI
                                                    </motion.button>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <textarea
                                                    value={formData.systemPrompt}
                                                    onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
                                                    placeholder="You are a helpful AI assistant specialized in..."
                                                    rows={8}
                                                    className={`w-full px-4 py-3 bg-zinc-900 border rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all resize-none font-mono text-sm ${errors.systemPrompt ? 'border-red-500/50' : 'border-white/10'
                                                        }`}
                                                />
                                                {/* Code editor style line numbers visual hint */}
                                                <div className="absolute left-0 top-0 bottom-0 w-10 bg-zinc-950/50 rounded-l-xl pointer-events-none border-r border-white/5" />
                                            </div>
                                            {errors.systemPrompt && (
                                                <p className="text-sm text-red-400 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errors.systemPrompt}
                                                </p>
                                            )}
                                        </div>

                                        {/* Greeting */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                                                    <MessageSquare className="w-4 h-4 text-zinc-500" />
                                                    Greeting Message
                                                </label>
                                                <span className={`text-xs ${formData.greeting.length > 500 ? 'text-red-400' : 'text-zinc-500'}`}>
                                                    {formData.greeting.length}/500
                                                </span>
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.greeting}
                                                onChange={(e) => handleInputChange('greeting', e.target.value)}
                                                placeholder="Hello! How can I assist you today?"
                                                className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all ${errors.greeting ? 'border-red-500/50' : 'border-white/10'
                                                    }`}
                                            />
                                            {errors.greeting && (
                                                <p className="text-sm text-red-400 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errors.greeting}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Tab 4: Test Call Section */}
                            {activeTab === 4 && (
                                <section>
                                    <h3 className="flex items-center gap-2 text-lg font-medium text-zinc-100 mb-4">
                                        <Phone className="w-5 h-5 text-violet-400" />
                                        Test Call
                                    </h3>
                                    {editBot ? (
                                        <TriggerCall
                                            botId={editBot._id}
                                            botName={editBot.name}
                                            hasScriptFlow={formData.scriptFlow && formData.scriptFlow.length > 0}
                                            hasAudioGenerated={editBot.hasAudioGenerated}
                                        />
                                    ) : (
                                        <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-xl">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-amber-300">Save Bot First</p>
                                                    <p className="text-xs text-amber-400/70 mt-1">
                                                        You need to save the bot before you can test calls. Click "Create Bot" below to save.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* Submit Error */}
                            {errors.submit && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                    <span className="text-red-300">{errors.submit}</span>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="sticky bottom-0 bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 px-6 py-4">
                        <div className="flex items-center justify-end gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="px-6 py-2.5 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit}
                                disabled={!isFormValid() || isSubmitting}
                                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-medium hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/25"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {editBot ? 'Updating...' : 'Deploying...'}
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        {editBot ? 'Update Bot' : 'Deploy Bot'}
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence >
    );
};

export default CreateBot;
