import { Link } from 'react-router-dom';
import { Mic, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthNavbar = () => {
    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute top-0 left-0 w-full z-50 px-6 py-6 lg:px-12"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 group"
                >
                    <div className="p-2 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl border border-white/10 group-hover:border-white/20 transition-colors">
                        <Mic className="w-5 h-5 text-violet-400" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                        VoxAI
                    </span>
                </Link>

                {/* Back Link */}
                <Link
                    to="/"
                    className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to website</span>
                </Link>
            </div>
        </motion.nav>
    );
};

export default AuthNavbar;
