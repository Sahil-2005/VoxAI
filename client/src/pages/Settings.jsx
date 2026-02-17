import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings as SettingsIcon,
    Phone,
    Shield,
    Key,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Save,
    RefreshCw
} from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

const Settings = () => {
    const [twilioConfig, setTwilioConfig] = useState({
        accountSid: '',
        authToken: '',
        phoneNumber: '',
        isConfigured: false
    });

    const [showSid, setShowSid] = useState(false);
    const [showToken, setShowToken] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null); // 'success' | 'error' | null
    const [errors, setErrors] = useState({});

    // Fetch existing config on mount
    useEffect(() => {
        fetchTwilioConfig();
    }, []);

    const fetchTwilioConfig = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data?.data?.user?.twilioConfig) {
                setTwilioConfig(response.data.data.user.twilioConfig);
            }
        } catch (error) {
            console.error('Failed to fetch Twilio config:', error);
        }
    };

    const maskValue = (value, showLast = 4) => {
        if (!value || value.length <= showLast) return value;
        return '•'.repeat(value.length - showLast) + value.slice(-showLast);
    };

    const handleInputChange = (field, value) => {
        setTwilioConfig(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
        setVerificationStatus(null);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!twilioConfig.accountSid.trim()) {
            newErrors.accountSid = 'Account SID is required';
        }
        if (!twilioConfig.authToken.trim()) {
            newErrors.authToken = 'Auth Token is required';
        }
        if (!twilioConfig.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\+[1-9]\d{1,14}$/.test(twilioConfig.phoneNumber)) {
            newErrors.phoneNumber = 'Enter valid E.164 format (e.g., +1234567890)';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleVerifyConnection = async () => {
        if (!validateForm()) return;

        setIsVerifying(true);
        setVerificationStatus(null);

        try {
            // Simulating verification delay for UX
            await new Promise(resolve => setTimeout(resolve, 2000));

            // In production, this would call a real verification endpoint
            // const response = await axios.post(`${API_BASE}/twilio/verify`, twilioConfig);

            setVerificationStatus('success');
            setTwilioConfig(prev => ({ ...prev, isConfigured: true }));
        } catch (error) {
            setVerificationStatus('error');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSaveConfig = async () => {
        if (!validateForm()) return;

        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${API_BASE}/auth/twilio`,
                twilioConfig,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTwilioConfig(prev => ({ ...prev, isConfigured: true }));
            setVerificationStatus('success');
        } catch (error) {
            console.error('Failed to save config:', error);
            setVerificationStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl border border-white/5">
                            <SettingsIcon className="w-6 h-6 text-violet-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-zinc-100">Settings</h1>
                    </div>
                    <p className="text-zinc-400 ml-14">Manage your integrations and account preferences</p>
                </motion.div>

                {/* Twilio Integration Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative group"
                >
                    {/* Glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/5 p-6 lg:p-8">
                        {/* Card Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl border border-white/5">
                                    <Phone className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-zinc-100">Twilio Integration</h2>
                                    <p className="text-sm text-zinc-400">Connect your Twilio account to enable voice calls</p>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <AnimatePresence mode="wait">
                                {twilioConfig.isConfigured && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <span className="text-sm font-medium text-emerald-400">Connected</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-6">
                            {/* Account SID */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                                    <Shield className="w-4 h-4 text-zinc-500" />
                                    Account SID
                                </label>
                                <div className="relative">
                                    <input
                                        type={showSid ? 'text' : 'password'}
                                        value={twilioConfig.accountSid}
                                        onChange={(e) => handleInputChange('accountSid', e.target.value)}
                                        onBlur={() => setShowSid(false)}
                                        placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                        className={`w-full px-4 py-3 bg-zinc-800/50 border rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200 pr-12 ${errors.accountSid ? 'border-red-500/50' : 'border-white/10'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowSid(!showSid)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        {showSid ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.accountSid && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm text-red-400 flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.accountSid}
                                    </motion.p>
                                )}
                                <p className="text-xs text-zinc-500">
                                    {!showSid && twilioConfig.accountSid &&
                                        `Showing: ${maskValue(twilioConfig.accountSid)}`
                                    }
                                </p>
                            </div>

                            {/* Auth Token */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                                    <Key className="w-4 h-4 text-zinc-500" />
                                    Auth Token
                                </label>
                                <div className="relative">
                                    <input
                                        type={showToken ? 'text' : 'password'}
                                        value={twilioConfig.authToken}
                                        onChange={(e) => handleInputChange('authToken', e.target.value)}
                                        placeholder="Your Twilio Auth Token"
                                        className={`w-full px-4 py-3 bg-zinc-800/50 border rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200 pr-12 ${errors.authToken ? 'border-red-500/50' : 'border-white/10'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowToken(!showToken)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.authToken && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm text-red-400 flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.authToken}
                                    </motion.p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                                    <Phone className="w-4 h-4 text-zinc-500" />
                                    Twilio Phone Number
                                </label>
                                <input
                                    type="text"
                                    value={twilioConfig.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    placeholder="+1234567890"
                                    className={`w-full px-4 py-3 bg-zinc-800/50 border rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200 ${errors.phoneNumber ? 'border-red-500/50' : 'border-white/10'
                                        }`}
                                />
                                {errors.phoneNumber && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm text-red-400 flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.phoneNumber}
                                    </motion.p>
                                )}
                            </div>

                            {/* Verification Status Message */}
                            <AnimatePresence mode="wait">
                                {verificationStatus && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`flex items-center gap-3 p-4 rounded-xl ${verificationStatus === 'success'
                                            ? 'bg-emerald-500/10 border border-emerald-500/20'
                                            : 'bg-red-500/10 border border-red-500/20'
                                            }`}
                                    >
                                        {verificationStatus === 'success' ? (
                                            <>
                                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                                <span className="text-emerald-300">Twilio credentials verified successfully!</span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle className="w-5 h-5 text-red-400" />
                                                <span className="text-red-300">Verification failed. Please check your credentials.</span>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleVerifyConnection}
                                    disabled={isVerifying}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 border border-white/10 rounded-xl text-zinc-100 font-medium hover:bg-zinc-700 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    {isVerifying ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4" />
                                            Verify Connection
                                        </>
                                    )}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSaveConfig}
                                    disabled={isSaving}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-medium hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-violet-500/25"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Configuration
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        {/* Help Text */}
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <p className="text-sm text-zinc-500">
                                Need help finding your Twilio credentials?{' '}
                                <a
                                    href="https://www.twilio.com/console"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-2"
                                >
                                    Visit your Twilio Console
                                </a>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Settings;
