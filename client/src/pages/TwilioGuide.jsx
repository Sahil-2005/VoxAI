
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Key, Phone, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TwilioGuide() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-violet-950/20 text-zinc-100 p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                        Twilio Setup Guide
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl">
                        A step-by-step guide to getting your Twilio credentials and setting up a phone number for your AI voice agent.
                    </p>
                </motion.div>

                {/* Important Warning */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl"
                >
                    <div className="flex items-start gap-4">
                        <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-amber-300">Important: Free Account Limitation</h3>
                            <p className="text-zinc-300 leading-relaxed">
                                If you are using a <strong>Free Trial Twilio Account</strong>, you can only make calls to <strong className="text-amber-200">Verified Caller IDs</strong>.
                                You must verify any phone number you wish to call in your Twilio console before the call will connect.
                                Upgraded accounts do not have this limitation.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Step 1: Sign Up */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400 font-bold text-xl border border-violet-500/30">1</div>
                        <h2 className="text-2xl font-semibold">Sign Up for Twilio</h2>
                    </div>
                    <div className="ml-14 p-6 bg-zinc-900/50 border border-white/5 rounded-xl space-y-4">
                        <p className="text-zinc-300">
                            Create a free account on Twilio to get started. You'll get a trial balance to test your application.
                        </p>
                        <a
                            href="https://www.twilio.com/try-twilio"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-950 font-bold rounded-lg hover:bg-zinc-200 transition-colors"
                        >
                            Sign Up for Twilio <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </motion.div>

                {/* Step 2: Get a Number */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400 font-bold text-xl border border-violet-500/30">2</div>
                        <h2 className="text-2xl font-semibold">Get a Phone Number</h2>
                    </div>
                    <div className="ml-14 p-6 bg-zinc-900/50 border border-white/5 rounded-xl space-y-4">
                        <p className="text-zinc-300">
                            Once logged in, you need to buy a phone number (it's free with trial credit).
                        </p>
                        <ol className="list-decimal list-inside space-y-3 text-zinc-300 ml-2">
                            <li>Go to the <span className="text-violet-300">Phone Numbers</span> section in the console.</li>
                            <li>Click on <span className="text-violet-300">Manage</span> > <span className="text-violet-300">Buy a number</span>.</li>
                            <li>Search for a number with <strong>Voice</strong> capabilities.</li>
                            <li>Click <span className="text-violet-300">Buy</span> (uses trial credit).</li>
                        </ol>
                        <div className="flex items-center gap-2 text-sm text-zinc-500 bg-black/20 p-3 rounded-lg border border-white/5">
                            <Phone className="w-4 h-4" />
                            <span>Make sure the number has the "Voice" capability enabled.</span>
                        </div>
                    </div>
                </motion.div>

                {/* Step 3: Get Application Credentials */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400 font-bold text-xl border border-violet-500/30">3</div>
                        <h2 className="text-2xl font-semibold">Get Credentials</h2>
                    </div>
                    <div className="ml-14 p-6 bg-zinc-900/50 border border-white/5 rounded-xl space-y-4">
                        <p className="text-zinc-300">
                            You need your <strong>Account SID</strong> and <strong>Auth Token</strong> to connect your application.
                        </p>
                        <ul className="space-y-3 text-zinc-300">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-white">Account SID:</span> Found on your Twilio Console Dashboard. Starts with "AC...".
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-white">Auth Token:</span> Also on the Dashboard. Click "Show" to reveal it.
                                </div>
                            </li>
                        </ul>
                        <div className="p-4 bg-zinc-800/50 rounded-lg border border-white/10 flex items-start gap-3">
                            <Key className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-zinc-300">
                                    Copy these values and paste them into your project's `.env` file or configuration settings.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Step 4: Verify Numbers (Free Account) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400 font-bold text-xl border border-violet-500/30">4</div>
                        <h2 className="text-2xl font-semibold">Verify Caller IDs (Free Account Only)</h2>
                    </div>
                    <div className="ml-14 p-6 bg-zinc-900/50 border border-white/5 rounded-xl space-y-4">
                        <p className="text-zinc-300">
                            To call a number during your trial, you must first verify it.
                        </p>
                        <ol className="list-decimal list-inside space-y-3 text-zinc-300 ml-2">
                            <li>Go to <span className="text-violet-300">Phone Numbers</span> > <span className="text-violet-300">Manage</span> > <span className="text-violet-300">Verified Caller IDs</span>.</li>
                            <li>Click <span className="text-violet-300">Add a new Caller ID</span>.</li>
                            <li>Enter the phone number you want to call (e.g., your personal mobile number).</li>
                            <li>Verify it via SMS or Call.</li>
                        </ol>
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300 text-sm">
                            Once verified, you can make calls to this number using your Twilio trial account.
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

