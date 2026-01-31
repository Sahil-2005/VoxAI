import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Lock, Mail, ArrowRight, Eye, EyeOff, Loader2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (response.success) {
        navigate('/dashboard');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-950">
      {/* Left Side - Visuals */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 text-2xl font-bold mb-12"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Zap className="w-7 h-7" />
            </div>
            <span className="tracking-tight">VoxAI</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-5xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Start Building <br/>Your AI Agents
            </h1>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
              Join thousands of businesses using VoxAI to automate customer interactions and scale their operations.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 grid grid-cols-3 gap-6"
          >
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '1M+', label: 'Calls Handled' },
              { value: '99.9%', label: 'Uptime' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative z-10 text-sm text-slate-500"
        >
          © 2026 VoxAI Inc. All rights reserved.
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-950">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">VoxAI</span>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-2">Create account</h2>
            <p className="text-slate-400 mb-8">Start your 14-day free trial</p>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input 
                    type="text"
                    name="name"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input 
                    type="email"
                    name="email"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input 
                    type="password"
                    name="confirmPassword"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <motion.button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Create Account <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            <p className="mt-6 text-center text-slate-500 text-sm">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-violet-400 hover:text-violet-300">Terms</a> and{' '}
              <a href="#" className="text-violet-400 hover:text-violet-300">Privacy Policy</a>
            </p>

            <div className="mt-6 text-center">
              <span className="text-slate-400">Already have an account? </span>
              <Link to="/login" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
