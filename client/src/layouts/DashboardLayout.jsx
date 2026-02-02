import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import {
    LayoutDashboard,
    Bot,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Mic,
    User,
    Bell,
    Search,
    Crown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/settings', icon: Settings, label: 'Settings' }
];

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    // GSAP animations
    useGSAP(() => {
        gsap.from('.sidebar-item', {
            opacity: 0,
            x: -20,
            duration: 0.4,
            stagger: 0.08,
            ease: 'power3.out',
            delay: 0.2
        });

        gsap.from('.sidebar-logo', {
            opacity: 0,
            y: -10,
            duration: 0.5,
            ease: 'power3.out'
        });
    }, { scope: sidebarRef });

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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                ref={sidebarRef}
                className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-zinc-900/60 backdrop-blur-2xl border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="sidebar-logo flex items-center justify-between p-6 border-b border-white/5">
                        <Link to="/dashboard" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                                <div className="relative p-2.5 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl border border-white/10">
                                    <Mic className="w-5 h-5 text-violet-400" />
                                </div>
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
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`sidebar-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${isActive
                                            ? 'bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 text-zinc-100'
                                            : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-r-full"
                                        />
                                    )}
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-violet-400' : 'group-hover:text-violet-400'} transition-colors`} />
                                    <span className="font-medium">{item.label}</span>
                                    {isActive && (
                                        <ChevronRight className="w-4 h-4 ml-auto text-violet-400" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Upgrade Banner */}
                    <div className="sidebar-item p-4">
                        <div className="p-4 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-xl border border-violet-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Crown className="w-5 h-5 text-amber-400" />
                                <span className="font-medium text-zinc-100">Upgrade to Pro</span>
                            </div>
                            <p className="text-xs text-zinc-400 mb-3">Unlock unlimited voice agents and advanced analytics</p>
                            <button className="w-full py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg text-sm font-medium text-white hover:from-violet-500 hover:to-fuchsia-500 transition-all">
                                Upgrade Now
                            </button>
                        </div>
                    </div>

                    {/* User Section */}
                    <div className="sidebar-item p-4 border-t border-white/5">
                        <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-xl mb-3 group hover:bg-zinc-800/50 transition-colors cursor-pointer">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5 text-white" />
                                    )}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-zinc-900 rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-zinc-100 truncate">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-zinc-500 truncate">
                                    {user?.subscription?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                                </p>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-500/20"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Sign Out</span>
                        </motion.button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
                    <div className="flex items-center justify-between px-6 py-4">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Search */}
                        <div className="hidden md:flex flex-1 max-w-md mx-4">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 bg-zinc-800/50 border border-white/5 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                />
                                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-zinc-500 bg-zinc-800 rounded border border-white/10">
                                    ⌘K
                                </kbd>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
                            </motion.button>

                            <div className="lg:hidden">
                                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
