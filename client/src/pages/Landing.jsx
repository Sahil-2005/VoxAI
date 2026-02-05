import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import {
    Mic,
    Phone,
    Zap,
    Shield,
    BarChart3,
    MessageSquare,
    ArrowRight,
    Check,
    Star,
    Sparkles,
    Globe,
    Clock,
    Users,
    Bot,
    Play,
    ChevronRight
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Animated counter component
const AnimatedCounter = ({ end, duration = 2, suffix = '' }) => {
    const counterRef = useRef(null);

    useGSAP(() => {
        const counter = { val: 0 };
        gsap.to(counter, {
            val: end,
            duration,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: counterRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            onUpdate: () => {
                if (counterRef.current) {
                    counterRef.current.textContent = Math.floor(counter.val).toLocaleString() + suffix;
                }
            }
        });
    }, [end]);

    return <span ref={counterRef}>0</span>;
};

const features = [
    {
        icon: Phone,
        title: 'AI Voice Calls',
        description: 'Deploy intelligent voice agents that handle calls 24/7 with human-like conversations.',
        gradient: 'from-violet-500 to-purple-500'
    },
    {
        icon: Zap,
        title: 'Instant Deployment',
        description: 'Go live in minutes with our no-code builder. Connect Twilio and start receiving calls.',
        gradient: 'from-amber-500 to-orange-500'
    },
    {
        icon: Shield,
        title: 'Enterprise Security',
        description: 'SOC 2 compliant with encrypted data storage. Your conversations stay private.',
        gradient: 'from-emerald-500 to-teal-500'
    },
    {
        icon: BarChart3,
        title: 'Real-time Analytics',
        description: 'Track call metrics, success rates, and customer sentiment in your dashboard.',
        gradient: 'from-blue-500 to-cyan-500'
    },
    {
        icon: MessageSquare,
        title: 'Custom Personas',
        description: 'Create unique AI personalities tailored to your brand voice and industry.',
        gradient: 'from-pink-500 to-rose-500'
    },
    {
        icon: Globe,
        title: 'Multi-language',
        description: 'Support customers globally with AI agents fluent in 50+ languages.',
        gradient: 'from-indigo-500 to-violet-500'
    }
];

const pricingPlans = [
    {
        name: 'Starter',
        price: '49',
        description: 'Perfect for small businesses',
        features: ['100 minutes/month', '1 AI Voice Agent', 'Basic Analytics', 'Email Support'],
        cta: 'Start Free Trial',
        popular: false
    },
    {
        name: 'Professional',
        price: '149',
        description: 'For growing teams',
        features: ['1,000 minutes/month', '5 AI Voice Agents', 'Advanced Analytics', 'Priority Support', 'Custom Personas', 'API Access'],
        cta: 'Start Free Trial',
        popular: true
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For large organizations',
        features: ['Unlimited minutes', 'Unlimited Agents', 'White-label Options', 'Dedicated Support', 'SLA Guarantee', 'Custom Integrations'],
        cta: 'Contact Sales',
        popular: false
    }
];

const testimonials = [
    {
        quote: "VoxAI reduced our call center costs by 60% while improving customer satisfaction scores.",
        author: "Sarah Chen",
        role: "VP of Operations, TechScale",
        avatar: "SC"
    },
    {
        quote: "The setup was incredibly easy. We were handling calls with AI agents within an hour.",
        author: "Marcus Johnson",
        role: "Founder, StartupHQ",
        avatar: "MJ"
    },
    {
        quote: "Our AI agents handle 10,000+ calls monthly. The quality is indistinguishable from human agents.",
        author: "Emily Rodriguez",
        role: "CTO, GrowthCorp",
        avatar: "ER"
    }
];

const Landing = () => {
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const statsRef = useRef(null);

    useGSAP(() => {
        // Hero animations
        const heroTl = gsap.timeline();
        heroTl
            .from('.hero-badge', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' })
            .from('.hero-title', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.3')
            .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.4')
            .from('.hero-cta', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.3')
            .from('.hero-visual', { opacity: 0, scale: 0.9, duration: 1, ease: 'power3.out' }, '-=0.5');

        // Floating animation for hero visual
        gsap.to('.hero-float', {
            y: -20,
            duration: 3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });

        // Features scroll animation
        gsap.from('.feature-card', {
            scrollTrigger: {
                trigger: featuresRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 60,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
        });

        // Stats animation
        gsap.from('.stat-item', {
            scrollTrigger: {
                trigger: statsRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 40,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out'
        });
    }, []);

    return (
        <div className="min-h-screen bg-zinc-950 overflow-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl border border-white/10">
                                <Mic className="w-5 h-5 text-violet-400" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                VoxAI
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-white/90 hover:text-white transition-colors font-medium">Features</a>
                            <a href="#pricing" className="text-white/90 hover:text-white transition-colors font-medium">Pricing</a>
                            <a href="#testimonials" className="text-white/90 hover:text-white transition-colors font-medium">Testimonials</a>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-white hover:text-white/80 transition-colors font-semibold">
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg text-white text-sm font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-6">
                {/* Background effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl" />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

                <div className="relative max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="text-center lg:text-left">
                            {/* Badge */}
                            <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-6">
                                <Sparkles className="w-4 h-4 text-violet-400" />
                                <span className="text-sm text-violet-300">AI-Powered Voice Agents</span>
                            </div>

                            {/* Title */}
                            <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-100 leading-tight mb-6">
                                Transform Your
                                <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                                    Customer Calls
                                </span>
                                With AI Agents
                            </h1>

                            {/* Subtitle */}
                            <p className="hero-subtitle text-lg text-zinc-400 max-w-xl mx-auto lg:mx-0 mb-8">
                                Deploy intelligent voice bots that handle calls 24/7. Reduce costs by 60%,
                                increase satisfaction, and scale your customer support instantly.
                            </p>

                            {/* CTAs */}
                            <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    to="/register"
                                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/30"
                                >
                                    Start Free Trial
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-800/50 border border-white/10 rounded-xl text-zinc-100 font-semibold hover:bg-zinc-800 hover:border-white/20 transition-all">
                                    <Play className="w-5 h-5" />
                                    Watch Demo
                                </button>
                            </div>

                            {/* Social Proof */}
                            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start">
                                <div className="flex -space-x-3">
                                    {['E', 'M', 'S', 'J'].map((letter, i) => (
                                        <div
                                            key={i}
                                            className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 border-2 border-zinc-950 flex items-center justify-center text-white text-sm font-medium"
                                        >
                                            {letter}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-zinc-400">
                                        Loved by <span className="text-zinc-100 font-medium">2,000+</span> teams
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Hero Visual */}
                        <div className="hero-visual relative">
                            <div className="hero-float relative">
                                {/* Main Card */}
                                <div className="relative bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
                                    {/* Voice Wave Animation */}
                                    <div className="flex items-center justify-center gap-1 mb-6">
                                        {[...Array(12)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1 bg-gradient-to-t from-violet-500 to-fuchsia-500 rounded-full"
                                                animate={{
                                                    height: [16, 40 + Math.random() * 40, 16],
                                                }}
                                                transition={{
                                                    duration: 0.8 + Math.random() * 0.4,
                                                    repeat: Infinity,
                                                    ease: 'easeInOut',
                                                    delay: i * 0.1
                                                }}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-emerald-500/20 rounded-xl">
                                            <Phone className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-zinc-100 font-medium">Active Call</p>
                                            <p className="text-sm text-zinc-500">Customer Support AI</p>
                                        </div>
                                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full">
                                            Live
                                        </span>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-xl">
                                            <Bot className="w-5 h-5 text-violet-400 mt-0.5" />
                                            <p className="text-zinc-300">"Hello! I'm here to help with your order. How can I assist you today?"</p>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-violet-500/10 rounded-xl ml-6">
                                            <Users className="w-5 h-5 text-fuchsia-400 mt-0.5" />
                                            <p className="text-zinc-300">"I'd like to track my package from last week."</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Stats */}
                                <div className="absolute -top-4 -right-4 bg-zinc-900/80 backdrop-blur-xl rounded-xl border border-white/10 px-4 py-3 shadow-xl">
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-emerald-400" />
                                        <span className="text-emerald-400 font-bold">98.5%</span>
                                        <span className="text-zinc-500 text-sm">Satisfaction</span>
                                    </div>
                                </div>

                                <div className="absolute -bottom-4 -left-4 bg-zinc-900/80 backdrop-blur-xl rounded-xl border border-white/10 px-4 py-3 shadow-xl">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-violet-400" />
                                        <span className="text-violet-400 font-bold">&lt;1s</span>
                                        <span className="text-zinc-500 text-sm">Response</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section ref={statsRef} className="py-20 px-6 border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="stat-item text-center">
                            <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                <AnimatedCounter end={10} suffix="M+" />
                            </p>
                            <p className="text-zinc-400 mt-2">Calls Handled</p>
                        </div>
                        <div className="stat-item text-center">
                            <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                <AnimatedCounter end={60} suffix="%" />
                            </p>
                            <p className="text-zinc-400 mt-2">Cost Reduction</p>
                        </div>
                        <div className="stat-item text-center">
                            <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                                <AnimatedCounter end={2000} suffix="+" />
                            </p>
                            <p className="text-zinc-400 mt-2">Active Teams</p>
                        </div>
                        <div className="stat-item text-center">
                            <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                <AnimatedCounter end={99} suffix="%" />
                            </p>
                            <p className="text-zinc-400 mt-2">Uptime SLA</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" ref={featuresRef} className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
                            Everything You Need to
                            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"> Scale Support</span>
                        </h2>
                        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                            Build, deploy, and manage AI voice agents that handle customer calls with human-like intelligence.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="feature-card group relative bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className={`inline-flex p-3 bg-gradient-to-br ${feature.gradient} bg-opacity-20 rounded-xl mb-4`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-zinc-100 mb-2">{feature.title}</h3>
                                    <p className="text-zinc-400">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 px-6 bg-zinc-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
                            Simple, Transparent
                            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"> Pricing</span>
                        </h2>
                        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                            Start free, then scale as you grow. No hidden fees, cancel anytime.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {pricingPlans.map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative bg-zinc-900/60 backdrop-blur-xl rounded-2xl border p-8 ${plan.popular
                                    ? 'border-violet-500/50 shadow-lg shadow-violet-500/10'
                                    : 'border-white/5'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full text-white text-sm font-medium">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-xl font-semibold text-zinc-100 mb-2">{plan.name}</h3>
                                <p className="text-zinc-500 text-sm mb-4">{plan.description}</p>
                                <div className="mb-6">
                                    {plan.price === 'Custom' ? (
                                        <span className="text-4xl font-bold text-zinc-100">Custom</span>
                                    ) : (
                                        <>
                                            <span className="text-4xl font-bold text-zinc-100">${plan.price}</span>
                                            <span className="text-zinc-500">/month</span>
                                        </>
                                    )}
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-zinc-300">
                                            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to="/register"
                                    className={`block w-full py-3 rounded-xl font-medium text-center transition-all ${plan.popular
                                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500'
                                        : 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-white/10'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
                            Trusted by
                            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"> Industry Leaders</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/5 p-6"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-zinc-300 mb-6">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-medium">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className="text-zinc-100 font-medium">{testimonial.author}</p>
                                        <p className="text-zinc-500 text-sm">{testimonial.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="relative bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 rounded-3xl border border-white/10 p-12 text-center overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
                                Ready to Transform Your Customer Support?
                            </h2>
                            <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
                                Join 2,000+ teams already using VoxAI to handle millions of customer calls with AI.
                            </p>
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/30"
                            >
                                Start Your Free Trial
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                            <p className="text-zinc-500 text-sm mt-4">No credit card required • 14-day free trial</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl border border-white/10">
                                <Mic className="w-5 h-5 text-violet-400" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                VoxAI
                            </span>
                        </div>
                        <div className="flex items-center gap-8 text-sm text-zinc-500">
                            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-zinc-300 transition-colors">Terms</a>
                            <a href="#" className="hover:text-zinc-300 transition-colors">Documentation</a>
                            <a href="#" className="hover:text-zinc-300 transition-colors">Contact</a>
                        </div>
                        <p className="text-zinc-500 text-sm">© 2026 VoxAI. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
