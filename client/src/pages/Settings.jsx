import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone as PhoneIcon, 
  Key, 
  Shield, 
  CreditCard,
  Save,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import Button from '../components/Button';
import Input from '../components/Input';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showTokens, setShowTokens] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [twilioData, setTwilioData] = useState({
    accountSid: user?.twilioConfig?.accountSid || '',
    authToken: user?.twilioConfig?.authToken || '',
    phoneNumber: user?.twilioConfig?.phoneNumber || ''
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'twilio', label: 'Twilio Setup', icon: PhoneIcon },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await authService.updateProfile(profileData);
      if (response.success) {
        updateUser(response.data.user);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleTwilioSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await authService.updateTwilioConfig(twilioData);
      if (response.success) {
        updateUser(response.data.user);
        setMessage({ type: 'success', text: 'Twilio configuration saved successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save Twilio configuration' });
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-2">Profile Settings</h2>
              <p className="text-zinc-500 text-sm">Manage your personal information</p>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-xl">
              <div className="flex items-center gap-6 p-5 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-zinc-800/80 rounded-2xl">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-violet-500/20">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{user?.name}</h3>
                  <p className="text-zinc-500 text-sm">{user?.email}</p>
                  <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-violet-500/10 text-violet-300 border border-violet-500/20 rounded-lg text-xs font-semibold">
                    <Sparkles className="w-3 h-3" />
                    {user?.subscription?.plan || 'Free'} Plan
                  </span>
                </div>
              </div>

              <Input
                label="Full Name"
                icon={User}
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                placeholder="Your full name"
              />

              <Input
                label="Email Address"
                icon={Mail}
                type="email"
                value={profileData.email}
                disabled
                className="opacity-60 cursor-not-allowed"
                helperText="Email cannot be changed"
              />

              <Button type="submit" loading={loading} icon={Save}>
                Save Changes
              </Button>
            </form>
          </div>
        );

      case 'twilio':
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-2">Twilio Configuration</h2>
              <p className="text-zinc-500 text-sm">Connect your Twilio account to enable voice calls</p>
            </div>

            {user?.twilioConfig?.isConfigured && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6 flex items-center gap-3 max-w-xl">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-emerald-400 font-semibold">Twilio Connected</span>
                  <p className="text-emerald-400/60 text-xs mt-0.5">Your account is configured and ready</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleTwilioSubmit} className="space-y-6 max-w-xl">
              <Input
                label="Account SID"
                icon={Key}
                value={twilioData.accountSid}
                onChange={(e) => setTwilioData({ ...twilioData, accountSid: e.target.value })}
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Auth Token</label>
                <div className="relative group">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
                  <input
                    type={showTokens ? 'text' : 'password'}
                    value={twilioData.authToken}
                    onChange={(e) => setTwilioData({ ...twilioData, authToken: e.target.value })}
                    placeholder="Your Twilio Auth Token"
                    className="w-full pl-10 pr-12 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTokens(!showTokens)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showTokens ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Input
                label="Twilio Phone Number"
                icon={PhoneIcon}
                value={twilioData.phoneNumber}
                onChange={(e) => setTwilioData({ ...twilioData, phoneNumber: e.target.value })}
                placeholder="+1234567890"
              />

              <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800/80">
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-violet-400" />
                  Where to find these credentials?
                </h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Log into your <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 transition-colors">Twilio Console</a> and find your Account SID and Auth Token on the dashboard. Your phone number can be found under Phone Numbers → Manage → Active numbers.
                </p>
              </div>

              <Button type="submit" loading={loading} icon={Save}>
                Save Twilio Config
              </Button>
            </form>
          </div>
        );

      case 'security':
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-2">Security Settings</h2>
              <p className="text-zinc-500 text-sm">Keep your account secure</p>
            </div>
            
            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 max-w-xl">
              <h3 className="text-white font-semibold mb-1">Change Password</h3>
              <p className="text-zinc-500 text-sm mb-6">Update your password to keep your account secure.</p>
              
              <form className="space-y-5">
                <Input label="Current Password" type="password" placeholder="••••••••" />
                <Input label="New Password" type="password" placeholder="••••••••" />
                <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                <Button type="submit" variant="secondary">Update Password</Button>
              </form>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-2">Billing & Subscription</h2>
              <p className="text-zinc-500 text-sm">Manage your plan and billing</p>
            </div>
            
            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 rounded-2xl p-6 border border-zinc-800/80 max-w-xl mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Current Plan</span>
                  <h3 className="text-2xl font-bold text-white capitalize mt-1">{user?.subscription?.plan || 'Free'}</h3>
                </div>
                <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center border border-violet-500/20">
                  <CreditCard className="w-6 h-6 text-violet-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-zinc-800/80">
                <div>
                  <p className="text-xs text-zinc-500 mb-1.5">Minutes Used</p>
                  <p className="text-lg font-bold text-white">
                    {user?.subscription?.minutesUsed || 0} <span className="text-zinc-600 font-normal text-sm">/ {user?.subscription?.minutesLimit || 100}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1.5">Billing Cycle</p>
                  <p className="text-lg font-bold text-white">Monthly</p>
                </div>
              </div>

              <div className="w-full bg-zinc-800/50 rounded-full h-2 mb-6 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(((user?.subscription?.minutesUsed || 0) / (user?.subscription?.minutesLimit || 100)) * 100, 100)}%` }}
                ></div>
              </div>

              <Button className="w-full" icon={Sparkles}>
                Upgrade to Pro
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-center gap-3 text-sm max-w-xl ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{message.text}</span>
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border border-zinc-800/80 rounded-2xl p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-white bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20'
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-violet-400' : ''}`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-[500px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
