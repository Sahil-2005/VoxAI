import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import {
    Phone,
    Clock,
    TrendingUp,
    CheckCircle2,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

const StatsCard = ({
    title,
    value,
    change,
    changeType = 'positive', // 'positive' | 'negative' | 'neutral'
    icon: Icon,
    gradient = 'from-violet-500 to-fuchsia-500',
    delay = 0
}) => {
    const cardRef = useRef(null);
    const valueRef = useRef(null);

    useGSAP(() => {
        // Card entrance animation
        gsap.from(cardRef.current, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: delay * 0.1,
            ease: 'power3.out'
        });

        // Counter animation
        const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
        if (!isNaN(numericValue) && valueRef.current) {
            const suffix = value.replace(/[0-9.,]/g, '');
            const counter = { val: 0 };

            gsap.to(counter, {
                val: numericValue,
                duration: 1.5,
                delay: delay * 0.1 + 0.3,
                ease: 'power2.out',
                onUpdate: () => {
                    if (valueRef.current) {
                        if (numericValue >= 1000) {
                            valueRef.current.textContent = Math.floor(counter.val).toLocaleString() + suffix;
                        } else if (numericValue % 1 !== 0) {
                            valueRef.current.textContent = counter.val.toFixed(1) + suffix;
                        } else {
                            valueRef.current.textContent = Math.floor(counter.val) + suffix;
                        }
                    }
                }
            });
        }
    }, [value, delay]);

    const changeColors = {
        positive: 'text-emerald-400 bg-emerald-500/10',
        negative: 'text-red-400 bg-red-500/10',
        neutral: 'text-zinc-400 bg-zinc-500/10'
    };

    const ChangeIcon = changeType === 'positive' ? ArrowUpRight : changeType === 'negative' ? ArrowDownRight : null;

    return (
        <motion.div
            ref={cardRef}
            whileHover={{ y: -4, scale: 1.02 }}
            className="relative group"
        >
            {/* Glow effect */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

            <div className="relative bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${gradient} bg-opacity-20 rounded-xl`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>

                    {change && (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${changeColors[changeType]}`}>
                            {ChangeIcon && <ChangeIcon className="w-3 h-3" />}
                            <span className="text-xs font-medium">{change}</span>
                        </div>
                    )}
                </div>

                <p ref={valueRef} className="text-3xl font-bold text-zinc-100 mb-1">
                    {value}
                </p>
                <p className="text-sm text-zinc-400">{title}</p>

                {/* Sparkline placeholder */}
                <div className="mt-4 h-8 flex items-end gap-0.5">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className={`flex-1 bg-gradient-to-t ${gradient} rounded-sm opacity-30`}
                            initial={{ height: 4 }}
                            animate={{ height: 8 + Math.random() * 24 }}
                            transition={{
                                duration: 0.5,
                                delay: i * 0.02,
                                ease: 'easeOut'
                            }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default StatsCard;
