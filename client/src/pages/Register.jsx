import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Eye, EyeOff, Loader2, Sparkles, Check } from 'lucide-react';
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

  const features = [
    'Unlimited AI voice agents',
    'Real-time call analytics',
    'Custom voice personalities',
    'API access included'
  ];

  return (
    <div className="min-h-screen w-full bg-zinc-950 relative overflow-hidden flex">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[128px]" />
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative z-10">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-3 group w-fit">
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">VoxAI</span>
        </Link>

        {/* Features */}
        <div className="max-w-md">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start building voice agents in minutes
          </h2>
          <p className="text-zinc-400 mb-8">
            Join thousands of developers using VoxAI to create intelligent voice experiences.
          </p>
          <div className="space-y-4">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <span className="text-zinc-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6">
          <p className="text-zinc-300 mb-4 leading-relaxed">
            "VoxAI transformed how we handle customer calls. Setup was incredibly fast and the AI quality is remarkable."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500" />
            <div>
              <p className="text-sm font-semibold text-white">Sarah Chen</p>
              <p className="text-xs text-zinc-500">CTO at TechFlow</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative z-10">
        {/* Mobile Header */}
        <header className="lg:hidden p-6">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">VoxAI</span>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[420px]"
          >
            {/* Card */}
            <div className="relative bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-8 shadow-2xl">
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
              
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full text-emerald-300 text-xs font-semibold mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Free to Start</span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Create your account</h1>
                <p className="text-zinc-400 text-sm">Start building voice agents in minutes</p>
              </div>

              <div className="space-y-6">
                {/* Error Message */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
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

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-300">Password</label>
                    <div className="relative group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm"
                        placeholder="Min. 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
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
                    className="w-full"
                    size="lg"
                    icon={!loading ? ArrowRight : undefined}
                    iconPosition="right"
                  >
                    Create account
                  </Button>
                </form>

                {/* Terms */}
                <p className="text-xs text-zinc-500 text-center">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="text-zinc-400 hover:text-white transition-colors">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-zinc-400 hover:text-white transition-colors">Privacy Policy</Link>
                </p>
              </div>
            </div>

            {/* Sign In Link */}
            <p className="mt-8 text-center text-zinc-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Register;