import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Bot,
    User,
    Mic,
    Edit3,
    Trash2,
    Phone,
    MoreVertical,
    TrendingUp,
    Power
} from 'lucide-react';

const voiceIcons = {
    male: User,
    female: User,
    neutral: Mic
};

const personalityColors = {
    professional: 'from-blue-500 to-cyan-500',
    friendly: 'from-emerald-500 to-teal-500',
    casual: 'from-orange-500 to-amber-500',
    formal: 'from-violet-500 to-purple-500'
};

// Mini sparkline component for call stats
const Sparkline = ({ data = [], height = 32 }) => {
    if (data.length === 0) {
        // Generate sample data for demo
        data = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100));
    }

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg
            viewBox={`0 0 100 ${height}`}
            className="w-full h-8"
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(139, 92, 246)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="rgb(139, 92, 246)" stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* Area fill */}
            <polygon
                points={`0,${height} ${points} 100,${height}`}
                fill="url(#sparklineGradient)"
            />
            {/* Line */}
            <polyline
                points={points}
                fill="none"
                stroke="rgb(139, 92, 246)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

const BotCard = ({
    bot,
    onEdit,
    onDelete,
    onTestCall,
    onToggleActive
}) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const VoiceIcon = voiceIcons[bot.voiceType] || Mic;
    const personalityGradient = personalityColors[bot.personality] || personalityColors.professional;

    const handleToggleActive = async () => {
        if (isToggling) return;
        setIsToggling(true);
        try {
            await onToggleActive?.(bot._id, !bot.isActive);
        } finally {
            setIsToggling(false);
        }
    };

    const handleCardClick = (e) => {
        // Don't navigate if clicking on buttons or interactive elements
        if (e.target.closest('button')) return;
        navigate(`/bots/${bot._id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ y: -4 }}
            className="relative group"
        >
            {/* Glow effect on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div
                onClick={handleCardClick}
                className="relative bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300 cursor-pointer"
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 bg-gradient-to-br ${personalityGradient} bg-opacity-10 rounded-xl border border-white/5`}>
                            <Bot className="w-5 h-5 text-zinc-100" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-zinc-100 truncate max-w-[180px]">
                                {bot.name}
                            </h3>
                            <p className="text-sm text-zinc-500 truncate max-w-[180px]">
                                {bot.description || 'No description'}
                            </p>
                        </div>
                    </div>

                    {/* Menu Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowMenu(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute right-0 top-full mt-1 z-20 w-40 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-xl"
                                >
                                    <button
                                        onClick={() => {
                                            onEdit?.(bot);
                                            setShowMenu(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            onTestCall?.(bot);
                                            setShowMenu(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                                    >
                                        <Phone className="w-4 h-4" />
                                        Test Call
                                    </button>
                                    <button
                                        onClick={() => {
                                            onDelete?.(bot._id);
                                            setShowMenu(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </div>
                </div>

                {/* Voice & Personality Tags */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800/50 rounded-lg">
                        <VoiceIcon className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="text-xs text-zinc-300 capitalize">{bot.voiceType}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r ${personalityGradient} bg-opacity-10 rounded-lg`}>
                        <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${personalityGradient}`} />
                        <span className="text-xs text-zinc-300 capitalize">{bot.personality}</span>
                    </div>
                </div>

                {/* Stats with Sparkline */}
                <div className="bg-zinc-800/30 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-zinc-500">Total Calls</span>
                        <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                            <span className="text-sm font-semibold text-zinc-100">
                                {bot.stats?.totalCalls?.toLocaleString() || 0}
                            </span>
                        </div>
                    </div>
                    <Sparkline data={bot.stats?.callHistory} />
                </div>

                {/* Footer with Status Toggle */}
                <div className="flex items-center justify-between">
                    {/* Active/Inactive Toggle */}
                    <button
                        onClick={handleToggleActive}
                        disabled={isToggling}
                        className="flex items-center gap-2 group/toggle"
                    >
                        <div
                            className={`relative w-10 h-5 rounded-full transition-colors ${bot.isActive ? 'bg-emerald-500/20' : 'bg-zinc-700'
                                }`}
                        >
                            <motion.div
                                animate={{ x: bot.isActive ? 20 : 2 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className={`absolute top-0.5 w-4 h-4 rounded-full transition-colors ${bot.isActive ? 'bg-emerald-400' : 'bg-zinc-500'
                                    }`}
                            />
                        </div>
                        <span className={`text-sm font-medium transition-colors ${bot.isActive ? 'text-emerald-400' : 'text-zinc-500'
                            }`}>
                            {bot.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </button>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-1">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onTestCall?.(bot)}
                            className="p-2 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                            title="Test Call"
                        >
                            <Phone className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onEdit?.(bot)}
                            className="p-2 text-zinc-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Edit3 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onDelete?.(bot._id)}
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BotCard;
