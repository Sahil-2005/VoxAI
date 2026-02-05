import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    Loader2,
    AlertCircle,
    ArrowRight,
    ArrowLeft,
    Mic,
    Check,
    Shield,
    Zap,
    Phone
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthNavbar from '../components/AuthNavbar';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const containerRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const passwordRequirements = [
        { label: 'At least 6 characters', met: formData.password.length >= 6 },
        { label: 'Passwords match', met: formData.password && formData.password === formData.confirmPassword }
    ];

    // GSAP animations
    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from('.register-form', {
            opacity: 0,
            x: -50,
            duration: 0.8,
            ease: 'power3.out'
        })
            .from('.register-visual', {
                opacity: 0,
                x: 50,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6')
            .from('.form-element', {
                y: 20,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power3.out'
            }, '-=0.4');

        // Feature cards animation
        gsap.from('.feature-item', {
            scrollTrigger: {
                trigger: '.register-visual',
                start: 'top 80%'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out'
        });
    }, { scope: containerRef });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setError('');

        try {
            const result = await register(formData.name, formData.email, formData.password);

            if (result.success) {
                navigate('/dashboard', { replace: true });
            } else {
                setError(result.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        { icon: Phone, title: 'AI Voice Agents', description: 'Deploy 24/7 intelligent call handlers' },
        { icon: Zap, title: 'Instant Setup', description: 'Go live in under 5 minutes' },
        { icon: Shield, title: 'Enterprise Security', description: 'SOC 2 compliant, encrypted data' }
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-zinc-950 flex relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-fuchsia-500/5 via-transparent to-violet-500/5" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
            </div>

            <AuthNavbar />

            {/* Left Panel - Form */}
            <div className="register-form flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Form Card */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />

                        <div className="relative bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
                            <div className="form-element mb-6">
                                <h2 className="text-2xl font-bold text-zinc-100 mb-2">Create your account</h2>
                                <p className="text-zinc-400">Start your 14-day free trial today</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
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

                                {/* Name Input */}
                                <div className="form-element space-y-2">
                                    <label className="text-sm font-semibold text-white">Full Name</label>
                                    <div className="relative group/input">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within/input:text-violet-400 transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Enter your full name"
                                            className="w-full pl-12 pr-4 py-3.5 bg-zinc-800/50 border border-white/10 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                        />
                                    </div>
                                </div>

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
                                            placeholder="Create a password"
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

                                {/* Confirm Password Input */}
                                <div className="form-element space-y-2">
                                    <label className="text-sm font-semibold text-white">Confirm Password</label>
                                    <div className="relative group/input">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within/input:text-violet-400 transition-colors" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                            placeholder="Confirm your password"
                                            className="w-full pl-12 pr-12 py-3.5 bg-zinc-800/50 border border-white/10 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Password Requirements */}
                                <div className="form-element flex gap-4">
                                    {passwordRequirements.map((req, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <motion.div
                                                animate={{
                                                    scale: req.met ? [1, 1.2, 1] : 1,
                                                    backgroundColor: req.met ? 'rgba(52, 211, 153, 0.2)' : 'rgba(63, 63, 70, 1)'
                                                }}
                                                className="w-5 h-5 rounded-full flex items-center justify-center"
                                            >
                                                {req.met && <Check className="w-3 h-3 text-emerald-400" />}
                                            </motion.div>
                                            <span className={`text-xs transition-colors ${req.met ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                                {req.label}
                                            </span>
                                        </div>
                                    ))}
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
                                            Creating account...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </motion.button>

                                {/* Terms */}
                                <p className="form-element text-xs text-zinc-500 text-center">
                                    By creating an account, you agree to our{' '}
                                    <a href="#" className="text-violet-400 hover:underline">Terms of Service</a>
                                    {' '}and{' '}
                                    <a href="#" className="text-violet-400 hover:underline">Privacy Policy</a>
                                </p>
                            </form>

                            {/* Login Link */}
                            <div className="form-element mt-6 pt-6 border-t border-white/5 text-center">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Already have an account? <span className="text-violet-400">Sign in</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Visual */}
            <div className="register-visual hidden lg:flex flex-1 items-center justify-center p-12 relative">
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />

                <div className="relative max-w-lg">
                    <div className="p-8 bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-white/10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl border border-white/10">
                                <Mic className="w-8 h-8 text-violet-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-zinc-100">VoxAI</h2>
                                <p className="text-zinc-500">AI Voice Platform</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className="feature-item flex items-start gap-4 p-4 bg-zinc-800/30 rounded-xl border border-white/5"
                                    >
                                        <div className="p-2 bg-violet-500/20 rounded-lg">
                                            <Icon className="w-5 h-5 text-violet-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-zinc-100">{feature.title}</h3>
                                            <p className="text-sm text-zinc-500">{feature.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {['A', 'B', 'C'].map((letter, i) => (
                                        <div
                                            key={i}
                                            className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 border-2 border-zinc-900 flex items-center justify-center text-white text-xs font-medium"
                                        >
                                            {letter}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-zinc-400">
                                    Join <span className="text-zinc-100 font-medium">2,000+</span> teams already using VoxAI
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
