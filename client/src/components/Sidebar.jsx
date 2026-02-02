import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Bot, 
  Settings, 
  Phone,
  LogOut,
  Zap,
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
    <div className="w-64 bg-black/95 backdrop-blur-xl border-r border-zinc-800/50 flex flex-col fixed left-0 top-0 h-full z-50">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-900/50">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-white to-zinc-300 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-white/20 transition-all">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">VoxAI</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="text-[10px] font-semibold text-zinc-500 px-3 py-2 uppercase tracking-widest">
          Navigation
        </div>
        {menuItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active 
                  ? 'text-white bg-gradient-to-r from-zinc-900 to-zinc-900/50 border border-zinc-800 shadow-lg' 
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
              }`}
            >
              <item.icon className={`w-[18px] h-[18px] transition-all ${
                active ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
              }`} />
              <span>{item.label}</span>
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-zinc-900/50">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/50 mb-2 backdrop-blur-sm hover:bg-zinc-900 transition-all cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate group-hover:text-zinc-100">{user?.name || 'User'}</p>
            <p className="text-[11px] text-zinc-500 truncate">{user?.email || ''}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center gap-2.5 px-3 py-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 w-full rounded-xl text-sm font-medium transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
