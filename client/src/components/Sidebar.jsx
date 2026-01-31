import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Bot, 
  Settings, 
  Phone,
  LogOut,
  Zap,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: LayoutGrid, label: 'Overview', exact: true },
    { path: '/dashboard/agents', icon: Bot, label: 'Voice Agents' },
    { path: '/dashboard/calls', icon: Phone, label: 'Call History' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="w-64 bg-gradient-to-b from-zinc-950 to-zinc-950/95 border-r border-zinc-800/50 flex flex-col fixed left-0 top-0 h-full z-50">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-800/50">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/30 transition-shadow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">VoxAI</span>
            <span className="block text-[10px] text-zinc-500 font-medium tracking-wider uppercase">Voice Platform</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6">
        <div className="text-[10px] font-semibold text-zinc-500 px-3 mb-3 uppercase tracking-widest">
          Main Menu
        </div>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active 
                    ? 'text-white bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-r-full" />
                )}
                <div className={`p-1.5 rounded-lg ${active ? 'bg-violet-500/20' : 'bg-zinc-800/50 group-hover:bg-zinc-800'} transition-colors`}>
                  <item.icon className={`w-4 h-4 ${active ? 'text-violet-400' : ''}`} />
                </div>
                <span>{item.label}</span>
                {active && (
                  <ChevronRight className="w-4 h-4 ml-auto text-zinc-600" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Pro Badge */}
        <div className="mt-6 mx-3 p-4 rounded-xl bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-violet-500/10 border border-violet-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-semibold text-white">Upgrade to Pro</span>
          </div>
          <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">Get unlimited agents and priority support</p>
          <button className="w-full py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity">
            Upgrade Now
          </button>
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-zinc-800/50">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50 mb-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-zinc-900 rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-[11px] text-zinc-500 truncate">{user?.email || ''}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 w-full rounded-xl text-sm font-medium transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
