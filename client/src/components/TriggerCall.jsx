import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

const TriggerCall = ({ botId, botName, hasScriptFlow, hasAudioGenerated }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isTriggering, setIsTriggering] = useState(false);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error', null

    const handleGenerateAudio = async () => {
        setIsGeneratingAudio(true);
        setStatus(null);

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_BASE}/bots/${botId}/generate-audio`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setStatus({ type: 'success', message: 'Audio files generated successfully!' });
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Failed to generate audio files'
            });
        } finally {
            setIsGeneratingAudio(false);
        }
    };

    const handleTriggerCall = async () => {
        if (!phoneNumber.trim()) {
            setStatus({ type: 'error', message: 'Please enter a phone number' });
            return;
        }

        setIsTriggering(true);
        setStatus(null);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_BASE}/bots/${botId}/trigger-call`,
                { phoneNumber },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setStatus({
                type: 'success',
                message: `Call triggered successfully! Call SID: ${response.data.data.callSid}`
            });
            setPhoneNumber('');
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Failed to trigger call'
            });
        } finally {
            setIsTriggering(false);
        }
    };

    if (!hasScriptFlow) {
        return (
            <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-xl">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-amber-300">Script Flow Required</p>
                        <p className="text-xs text-amber-400/70 mt-1">
                            Add questions to the Script Flow tab before triggering calls.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Audio Generation */}
            {!hasAudioGenerated && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <div className="flex items-start gap-3 mb-3">
                        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-amber-300">Audio Files Not Generated</p>
                            <p className="text-xs text-amber-400/70 mt-1">
                                Generate audio files before making calls
                            </p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGenerateAudio}
                        disabled={isGeneratingAudio}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isGeneratingAudio ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Generating Audio...
                            </>
                        ) : (
                            'Generate Audio Files'
                        )}
                    </motion.button>
                </div>
            )}

            {/* Trigger Call */}
            <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-lg border border-white/5">
                        <Phone className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-zinc-100">Trigger Call</h3>
                        <p className="text-sm text-zinc-400">Make a test call with {botName}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Warning for Free Accounts */}
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-amber-300">Using a Free Twilio Account?</p>
                                <p className="text-xs text-amber-400/80 mt-1 leading-relaxed">
                                    Free trial accounts can <strong className="text-amber-300">only call verified numbers</strong>.
                                    If the call fails immediately, check if the number is verified.
                                </p>
                                <Link
                                    to="/twilio-guide"
                                    className="inline-flex items-center gap-1 text-xs text-amber-300 underline mt-2 hover:text-amber-200"
                                >
                                    View Setup Guide & Get Credentials
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Phone Number Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Phone Number</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+1234567890"
                            className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                        />
                        <p className="text-xs text-zinc-500">
                            Include country code (e.g., +1 for US, +91 for India)
                        </p>
                    </div>

                    {/* Trigger Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleTriggerCall}
                        disabled={isTriggering || !hasAudioGenerated}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-medium hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/25"
                    >
                        {isTriggering ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Calling...
                            </>
                        ) : (
                            <>
                                <Phone className="w-4 h-4" />
                                Make Call
                            </>
                        )}
                    </motion.button>

                    {/* Status Message */}
                    {status && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-start gap-3 p-4 rounded-xl ${status.type === 'success'
                                ? 'bg-emerald-500/10 border border-emerald-500/20'
                                : 'bg-red-500/10 border border-red-500/20'
                                }`}
                        >
                            {status.type === 'success' ? (
                                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            )}
                            <p className={`text-sm ${status.type === 'success' ? 'text-emerald-300' : 'text-red-300'
                                }`}>
                                {status.message}
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TriggerCall;
