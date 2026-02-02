import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

// Toast types and their styles
const toastStyles = {
    success: {
        icon: CheckCircle2,
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20',
        iconColor: 'text-emerald-400',
        textColor: 'text-emerald-300'
    },
    error: {
        icon: AlertCircle,
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
        iconColor: 'text-red-400',
        textColor: 'text-red-300'
    },
    info: {
        icon: Info,
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        iconColor: 'text-blue-400',
        textColor: 'text-blue-300'
    }
};

// Single toast component
const Toast = ({ id, type = 'info', message, onClose }) => {
    const style = toastStyles[type] || toastStyles.info;
    const Icon = style.icon;

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 4000);

        return () => clearTimeout(timer);
    }, [id, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`flex items-center gap-3 px-4 py-3 ${style.bgColor} ${style.borderColor} border backdrop-blur-xl rounded-xl shadow-xl max-w-md`}
        >
            <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0`} />
            <p className={`text-sm ${style.textColor} flex-1`}>{message}</p>
            <button
                onClick={() => onClose(id)}
                className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

// Toast container component
const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onClose={removeToast}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

// Hook for managing toasts
let toastId = 0;
let addToastGlobal = null;

export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = (type, message) => {
        const id = ++toastId;
        setToasts((prev) => [...prev, { id, type, message }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    // Expose methods
    const toast = {
        success: (message) => addToast('success', message),
        error: (message) => addToast('error', message),
        info: (message) => addToast('info', message)
    };

    // Update global reference
    useEffect(() => {
        addToastGlobal = addToast;
    }, []);

    return {
        toasts,
        toast,
        removeToast,
        ToastContainer: () => <ToastContainer toasts={toasts} removeToast={removeToast} />
    };
};

// Global toast function (for use outside components)
export const toast = {
    success: (message) => addToastGlobal?.('success', message),
    error: (message) => addToastGlobal?.('error', message),
    info: (message) => addToastGlobal?.('info', message)
};

export default ToastContainer;
