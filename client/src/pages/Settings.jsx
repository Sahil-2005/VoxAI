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
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">Profile Settings</h2>
            
            <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-xl">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-violet-500/25">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{user?.name}</h3>
                  <p className="text-slate-400">{user?.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-xs font-medium capitalize">
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
                className="opacity-60"
              />

              <Button type="submit" loading={loading} icon={Save}>
                Save Changes
              </Button>
            </form>
          </motion.div>
        );

      case 'twilio':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-semibold text-white mb-2">Twilio Configuration</h2>
            <p className="text-slate-400 mb-6">Connect your Twilio account to enable voice calls.</p>

            {user?.twilioConfig?.isConfigured && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400">Twilio is configured and ready to use</span>
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
                <label className="block text-sm font-medium text-slate-300">Auth Token</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type={showTokens ? 'text' : 'password'}
                    value={twilioData.authToken}
                    onChange={(e) => setTwilioData({ ...twilioData, authToken: e.target.value })}
                    placeholder="Your Twilio Auth Token"
                    className="w-full pl-10 pr-12 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTokens(!showTokens)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showTokens ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <h4 className="text-sm font-medium text-white mb-2">Where to find these?</h4>
                <p className="text-sm text-slate-400">
                  Log into your <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">Twilio Console</a> and find your Account SID and Auth Token on the dashboard. Your phone number can be found under Phone Numbers → Manage → Active numbers.
                </p>
              </div>

              <Button type="submit" loading={loading} icon={Save}>
                Save Twilio Config
              </Button>
            </form>
          </motion.div>
        );

      case 'security':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">Security Settings</h2>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 max-w-xl">
              <h3 className="text-white font-medium mb-4">Change Password</h3>
              <p className="text-slate-400 text-sm mb-6">Update your password to keep your account secure.</p>
              
              <form className="space-y-4">
                <Input label="Current Password" type="password" placeholder="••••••••" />
                <Input label="New Password" type="password" placeholder="••••••••" />
                <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                <Button type="submit">Update Password</Button>
              </form>
            </div>
          </motion.div>
        );

      case 'billing':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">Billing & Subscription</h2>
            
            <div className="bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 rounded-2xl p-6 border border-violet-500/30 max-w-xl mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm text-violet-300">Current Plan</span>
                  <h3 className="text-2xl font-bold text-white capitalize">{user?.subscription?.plan || 'Free'}</h3>
                </div>
                <CreditCard className="w-10 h-10 text-violet-400" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-slate-400">Minutes Used</p>
                  <p className="text-lg font-semibold text-white">
                    {user?.subscription?.minutesUsed || 0} / {user?.subscription?.minutesLimit || 100}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Billing Cycle</p>
                  <p className="text-lg font-semibold text-white">Monthly</p>
                </div>
              </div>

              <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 rounded-full"
                  style={{ width: `${((user?.subscription?.minutesUsed || 0) / (user?.subscription?.minutesLimit || 100)) * 100}%` }}
                ></div>
              </div>

              <Button className="w-full">Upgrade Plan</Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
        <p className="text-slate-400">Manage your account and preferences</p>
      </motion.div>

      {/* Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
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
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-64 flex-shrink-0"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-white bg-violet-600'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
