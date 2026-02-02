import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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
    <div className="min-h-screen w-full bg-black relative overflow-hidden flex flex-col">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="p-6 lg:p-8 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-white/20 transition-all">
            <Zap className="w-6 h-6 text-black fill-black" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">VoxAI</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px]"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Create your account</h1>
            <p className="text-zinc-400 text-base">Start building voice agents in minutes</p>
          </div>

          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Full name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                label="Email address"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-400">Password</label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="w-full px-3 py-2.5 bg-zinc-900/70 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:bg-zinc-900 focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/50 outline-none transition-all text-sm"
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Input
                label="Confirm password"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <Button 
                type="submit"
                loading={loading}
                className="w-full mt-2"
                size="lg"
                icon={!loading ? ArrowRight : undefined}
                iconPosition="right"
              >
                Create account
              </Button>
            </form>

            <div className="text-center space-y-4">
              <p className="text-zinc-500 text-xs text-center px-4">
                By signing up, you agree to our{' '}
                <a href="#" className="text-zinc-400 hover:text-white transition-colors underline font-medium">Terms</a>
                {' '}and{' '}
                <a href="#" className="text-zinc-400 hover:text-white transition-colors underline font-medium">Privacy Policy</a>
              </p>

              <div className="pt-2 border-t border-zinc-800">
                <p className="text-zinc-500 text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-white font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="p-6 lg:p-8 text-center">
        <p className="text-zinc-600 text-sm">© {new Date().getFullYear()} VoxAI Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Register;