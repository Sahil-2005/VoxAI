import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Lock, Mail, ArrowRight, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login({ email, password });
      if (response.success) {
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex w-[55%] bg-[#0a0a0f] text-white flex-col justify-between p-14 relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-violet-600/30 to-transparent rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-30%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-fuchsia-600/25 to-transparent rounded-full blur-[100px]"></div>
          <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-[80px]"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-20"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-500/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">VoxAI</span>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <span className="text-sm font-medium text-violet-400 tracking-wide uppercase">AI-Powered Platform</span>
            </div>
            
            <h1 className="text-6xl font-bold leading-[1.1] mb-8">
              <span className="text-white">Intelligent</span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">Voice Agents</span>
              <br />
              <span className="text-white">at Scale</span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-lg leading-relaxed mb-12">
              Deploy AI-powered voice agents in minutes. Automate calls, enhance customer experience, and scale your operations effortlessly.
            </p>
          </motion.div>

          {/* Feature Pills */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            {[
              { label: 'Natural Conversations', icon: '💬' },
              { label: '24/7 Availability', icon: '🌐' },
              { label: 'Multi-language', icon: '🗣️' },
              { label: 'Real-time Analytics', icon: '📊' }
            ].map((feature, i) => (
              <motion.span 
                key={i} 
                className="px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-slate-300 flex items-center gap-2 hover:bg-white/10 hover:border-violet-500/30 transition-all cursor-default"
                whileHover={{ scale: 1.02 }}
              >
                <span>{feature.icon}</span>
                {feature.label}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="relative z-10 flex items-center justify-between text-sm text-slate-500"
        >
          <span>© 2026 VoxAI Inc.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 bg-[#0f0f14]">
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-11 h-11 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">VoxAI</span>
          </div>

          {/* Form Container */}
          <div className="bg-[#16161d] p-10 rounded-3xl border border-white/5 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
              <p className="text-slate-500">Sign in to continue to your dashboard</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2.5">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5 group-focus-within:text-violet-400 transition-colors" />
                  <input 
                    type="email" 
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#1c1c24] border border-white/5 text-white placeholder:text-slate-600 focus:border-violet-500/50 focus:bg-[#1e1e28] outline-none transition-all"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2.5">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5 group-focus-within:text-violet-400 transition-colors" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-12 pr-12 py-4 rounded-xl bg-[#1c1c24] border border-white/5 text-white placeholder:text-slate-600 focus:border-violet-500/50 focus:bg-[#1e1e28] outline-none transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-[#1c1c24] text-violet-500 focus:ring-violet-500 focus:ring-offset-0" />
                  <span className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">Forgot password?</a>
              </div>

              <motion.button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-violet-500/20 hover:shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center">
              <span className="text-slate-500">Don't have an account? </span>
              <Link to="/register" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">
                Create one
              </Link>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex items-center justify-center gap-6 text-slate-600 text-xs">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
              Secure Login
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              256-bit Encryption
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;