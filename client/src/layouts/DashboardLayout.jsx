import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Bot,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Mic,
    User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/settings', icon: Settings, label: 'Settings' }
];

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-zinc-900/40 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl border border-white/5">
                                <Mic className="w-5 h-5 text-violet-400" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                VoxAI
                            </span>
                        </Link>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                            ? 'bg-violet-500/10 text-zinc-100 border border-violet-500/20'
                                            : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-violet-400' : ''}`} />
                                    <span className="font-medium">{item.label}</span>
                                    {isActive && (
                                        <ChevronRight className="w-4 h-4 ml-auto text-violet-400" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-white/5">
                        <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-xl mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5 text-white" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-zinc-100 truncate">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-zinc-500 truncate">
                                    {user?.email || ''}
                                </p>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Sign Out</span>
                        </motion.button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="lg:hidden sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
                    <div className="flex items-center justify-between p-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <Link to="/" className="flex items-center gap-2">
                            <Mic className="w-5 h-5 text-violet-400" />
                            <span className="font-bold text-zinc-100">VoxAI</span>
                        </Link>
                        <div className="w-9" /> {/* Spacer for centering */}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
