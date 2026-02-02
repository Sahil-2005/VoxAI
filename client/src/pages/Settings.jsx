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
  AlertCircle
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
            <h2 className="text-xl font-bold text-white mb-6">Profile Settings</h2>
            
            <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-xl">
              <div className="flex items-center gap-6 mb-8 p-5 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl hover-lift">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-2xl font-bold border border-zinc-700 shadow-xl">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{user?.name}</h3>
                  <p className="text-zinc-400 text-sm">{user?.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-lg text-xs font-bold uppercase tracking-wider">
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
              />

              <Button type="submit" loading={loading} icon={Save} size="lg">
                Save Changes
              </Button>
            </form>
          </div>
        );

      case 'twilio':
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-white mb-2">Twilio Configuration</h2>
            <p className="text-zinc-400 mb-6 text-sm">Connect your Twilio account to enable voice calls.</p>

            {user?.twilioConfig?.isConfigured && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-semibold">Twilio is configured and ready to use</span>
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

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-400">Auth Token</label>
                <div className="relative group">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-400 transition-colors" />
                  <input
                    type={showTokens ? 'text' : 'password'}
                    value={twilioData.authToken}
                    onChange={(e) => setTwilioData({ ...twilioData, authToken: e.target.value })}
                    placeholder="Your Twilio Auth Token"
                    className="w-full pl-10 pr-12 py-2.5 bg-zinc-900/70 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:bg-zinc-900 focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/50 outline-none transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTokens(!showTokens)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
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

              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-5 border border-zinc-800/50">
                <h4 className="text-sm font-semibold text-white mb-2">Where to find these?</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Log into your <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" className="text-white hover:underline font-medium">Twilio Console</a> and find your Account SID and Auth Token on the dashboard. Your phone number can be found under Phone Numbers → Manage → Active numbers.
                </p>
              </div>

              <Button type="submit" loading={loading} icon={Save} size="lg">
                Save Twilio Config
              </Button>
            </form>
          </div>
        );

      case 'security':
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-lg font-semibold text-white mb-6">Security Settings</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-xl">
              <h3 className="text-white font-medium mb-1 text-sm">Change Password</h3>
              <p className="text-zinc-500 text-xs mb-6">Update your password to keep your account secure.</p>
              
              <form className="space-y-4">
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
            <h2 className="text-lg font-semibold text-white mb-6">Billing & Subscription</h2>
            
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 max-w-xl mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Current Plan</span>
                  <h3 className="text-xl font-bold text-white capitalize mt-1">{user?.subscription?.plan || 'Free'}</h3>
                </div>
                <CreditCard className="w-8 h-8 text-zinc-600" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-zinc-800">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Minutes Used</p>
                  <p className="text-base font-semibold text-white">
                    {user?.subscription?.minutesUsed || 0} <span className="text-zinc-600 font-normal">/ {user?.subscription?.minutesLimit || 100}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Billing Cycle</p>
                  <p className="text-base font-semibold text-white">Monthly</p>
                </div>
              </div>

              <div className="w-full bg-zinc-800 rounded-full h-1.5 mb-6">
                <div 
                  className="bg-white h-1.5 rounded-full"
                  style={{ width: `${((user?.subscription?.minutesUsed || 0) / (user?.subscription?.minutesLimit || 100)) * 100}%` }}
                ></div>
              </div>

              <Button className="w-full" variant="secondary">Upgrade Plan</Button>
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
        <p className="text-zinc-400 mt-1.5 text-base">Manage your account and preferences</p>
      </div>

      {/* Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="flex flex-col gap-1.5 p-2 bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'text-black bg-white shadow-lg'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                }`}
              >
                <tab.icon className="w-[18px] h-[18px]" />
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
