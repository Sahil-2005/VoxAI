import { useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Loader2,
    AlertCircle,
    ArrowRight,
    Mic,
    Phone,
    Bot,
    Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthNavbar from '../components/AuthNavbar';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const containerRef = useRef(null);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Get redirect path from location state or default to dashboard
    const from = location.state?.from?.pathname || '/dashboard';

    // GSAP animations
    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from('.login-visual', {
            opacity: 0,
            x: -50,
            duration: 0.8,
            ease: 'power3.out'
        })
            .from('.login-form', {
                opacity: 0,
                x: 50,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6')
            .from('.form-element', {
                y: 20,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power3.out'
            }, '-=0.4');

        // Floating animation for icons
        gsap.to('.float-icon', {
            y: -10,
            duration: 2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            stagger: 0.3
        });
    }, { scope: containerRef });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                navigate(from, { replace: true });
            } else {
                setError(result.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-zinc-950 flex relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
            </div>

            <AuthNavbar />

            {/* Left Panel - Visual */}
            <div className="login-visual hidden lg:flex flex-1 items-center justify-center p-12 relative">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl" />

                <div className="relative max-w-lg text-center">
                    {/* Floating Icons */}
                    <div className="absolute -top-8 -left-8 float-icon">
                        <div className="p-4 bg-violet-500/20 rounded-2xl border border-violet-500/30 backdrop-blur-xl">
                            <Phone className="w-8 h-8 text-violet-400" />
                        </div>
                    </div>
                    <div className="absolute -top-4 -right-12 float-icon">
                        <div className="p-4 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 backdrop-blur-xl">
                            <Bot className="w-8 h-8 text-emerald-400" />
                        </div>
                    </div>
                    <div className="absolute -bottom-8 left-1/4 float-icon">
                        <div className="p-4 bg-fuchsia-500/20 rounded-2xl border border-fuchsia-500/30 backdrop-blur-xl">
                            <Sparkles className="w-8 h-8 text-fuchsia-400" />
                        </div>
                    </div>

                    <div className="p-8 bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-white/10">
                        <div className="flex items-center justify-center mb-6">
                            <div className="p-4 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-2xl border border-white/10">
                                <Mic className="w-12 h-12 text-violet-400" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-4">
                            VoxAI
                        </h2>
                        <p className="text-zinc-400 text-lg mb-6">
                            Transform your customer calls with intelligent AI voice agents
                        </p>
                        <div className="flex items-center justify-center gap-6 text-sm">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-zinc-100">10M+</p>
                                <p className="text-zinc-500">Calls Handled</p>
                            </div>
                            <div className="w-px h-10 bg-zinc-800" />
                            <div className="text-center">
                                <p className="text-2xl font-bold text-zinc-100">99%</p>
                                <p className="text-zinc-500">Uptime</p>
                            </div>
                            <div className="w-px h-10 bg-zinc-800" />
                            <div className="text-center">
                                <p className="text-2xl font-bold text-zinc-100">2K+</p>
                                <p className="text-zinc-500">Teams</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="login-form flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Form Card */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />

                        <div className="relative bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
                            <div className="form-element mb-8">
                                <h2 className="text-2xl font-bold text-zinc-100 mb-2">Welcome back</h2>
                                <p className="text-zinc-400">Sign in to continue to your dashboard</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="form-element flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                                    >
                                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                        <span className="text-sm text-red-300">{error}</span>
                                    </motion.div>
                                )}

                                {/* Email Input */}
                                <div className="form-element space-y-2">
                                    <label className="text-sm font-semibold text-white">Email</label>
                                    <div className="relative group/input">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within/input:text-violet-400 transition-colors" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            placeholder="Enter your email"
                                            className="w-full pl-12 pr-4 py-3.5 bg-zinc-800/50 border border-white/10 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="form-element space-y-2">
                                    <label className="text-sm font-semibold text-white">Password</label>
                                    <div className="relative group/input">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within/input:text-violet-400 transition-colors" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            placeholder="Enter your password"
                                            className="w-full pl-12 pr-12 py-3.5 bg-zinc-800/50 border border-white/10 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Forgot Password */}
                                <div className="form-element flex justify-end">
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="form-element w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/30"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            {/* Register Link */}
                            <div className="form-element mt-8 pt-6 border-t border-white/5 text-center">
                                <p className="text-zinc-400">
                                    Don't have an account?{' '}
                                    <Link
                                        to="/register"
                                        className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                                    >
                                        Create one
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
