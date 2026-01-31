import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Bot, 
  Settings, 
  Phone,
  LogOut,
  Zap,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/agents', icon: Bot, label: 'Voice Agents' },
    { path: '/dashboard/calls', icon: Phone, label: 'Call History' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight">VoxAI</span>
            <span className="block text-xs text-slate-500 font-medium">Voice Intelligence</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative block"
            >
              <motion.div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group
                  ${active 
                    ? 'text-white bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className={`w-5 h-5 ${active ? 'text-violet-400' : 'text-slate-500 group-hover:text-violet-400'}`} />
                <span>{item.label}</span>
                {active && (
                  <ChevronRight className="w-4 h-4 ml-auto text-violet-400" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
          </div>
        </div>
        
        <motion.button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 w-full rounded-xl font-medium transition-all duration-200"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;
