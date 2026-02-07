import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    GripVertical,
    ChevronUp,
    ChevronDown,
    MessageSquare,
    Sparkles
} from 'lucide-react';

const ScriptBuilder = ({ questions, setQuestions }) => {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const addQuestion = () => {
        const newQuestion = {
            id: Date.now(),
            key: `question_${questions.length + 1}`,
            text: '',
            hints: '',
            is_question: true
        };
        setQuestions([...questions, newQuestion]);
        setExpandedIndex(questions.length);
    };

    const updateQuestion = (index, field, value) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], [field]: value };

        // Auto-generate key from text
        if (field === 'text' && value) {
            const autoKey = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '_')
                .substring(0, 30);
            updated[index].key = autoKey || `question_${index + 1}`;
        }

        setQuestions(updated);
    };

    const deleteQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
        if (expandedIndex === index) setExpandedIndex(null);
    };

    const moveQuestion = (index, direction) => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= questions.length) return;

        const updated = [...questions];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        setQuestions(updated);
        setExpandedIndex(newIndex);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-zinc-100">Script Flow</h3>
                    <p className="text-sm text-zinc-400">Build your conversation flow with questions</p>
                </div>
                <span className="text-sm text-zinc-500">{questions.length} questions</span>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
                <AnimatePresence>
                    {questions.map((question, index) => (
                        <motion.div
                            key={question.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden"
                        >
                            {/* Question Header */}
                            <div
                                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
                                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                            >
                                <GripVertical className="w-4 h-4 text-zinc-600" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-violet-400" />
                                        <span className="text-sm font-medium text-zinc-300">
                                            Question {index + 1}
                                        </span>
                                    </div>
                                    {question.text && (
                                        <p className="text-sm text-zinc-500 mt-1 truncate">
                                            {question.text}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Move buttons */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            moveQuestion(index, 'up');
                                        }}
                                        disabled={index === 0}
                                        className="p-1 text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            moveQuestion(index, 'down');
                                        }}
                                        disabled={index === questions.length - 1}
                                        className="p-1 text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    {/* Delete button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteQuestion(index);
                                        }}
                                        className="p-1 text-red-500 hover:text-red-400"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Content */}
                            <AnimatePresence>
                                {expandedIndex === index && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 pt-0 space-y-4 border-t border-white/5">
                                            {/* Question Text */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-zinc-300">
                                                    Question Text *
                                                </label>
                                                <textarea
                                                    value={question.text}
                                                    onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                                                    placeholder="What question should the bot ask?"
                                                    rows={2}
                                                    className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all resize-none"
                                                />
                                            </div>

                                            {/* Hints */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-zinc-300">
                                                    Speech Recognition Hints
                                                </label>
                                                <input
                                                    type="text"
                                                    value={question.hints}
                                                    onChange={(e) => updateQuestion(index, 'hints', e.target.value)}
                                                    placeholder="e.g., yes, no, maybe, tomorrow"
                                                    className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                                />
                                                <p className="text-xs text-zinc-500">
                                                    Comma-separated keywords to improve speech recognition accuracy
                                                </p>
                                            </div>

                                            {/* Auto-generated Key */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-zinc-300">
                                                    Key (Auto-generated)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={question.key}
                                                    readOnly
                                                    className="w-full px-4 py-2 bg-zinc-950 border border-white/5 rounded-lg text-zinc-500 text-sm font-mono cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Add Question Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addQuestion}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 rounded-xl text-violet-300 hover:from-violet-600/30 hover:to-fuchsia-600/30 transition-colors"
            >
                <Plus className="w-4 h-4" />
                Add Question
            </motion.button>

            {/* Info Box */}
            {questions.length === 0 && (
                <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-blue-300">Build Your Script</p>
                        <p className="text-xs text-blue-400/70 mt-1">
                            Add questions to create a conversation flow. The bot will ask each question in order and collect responses.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScriptBuilder;
