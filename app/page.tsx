'use client';

import React from 'react';
import { 
  Building2, 
  Users, 
  Target, 
  Zap, 
  MessageSquare, 
  BarChart3, 
  ShieldCheck, 
  ChevronRight,
  Plus,
  ArrowRight,
  Star,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => (
  <header className="fixed top-0 left-0 right-0 z-[100] px-6 py-4">
    <nav className="max-w-7xl mx-auto flex items-center justify-between p-2 px-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white/20 shadow-lg shadow-indigo-500/5">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200">
          BF
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900">BuildFlow</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        {['Features', 'Pricing', 'Company', 'Support'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
            {item}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors">Log In</Link>
        <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-100">
          Get Started
        </Link>
      </div>
    </nav>
  </header>
);

const FeatureCard = ({ icon: Icon, title, description, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
  >
    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", color)}>
      <Icon size={28} className="text-white" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-snug">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const PricingCard = ({ name, price, description, features, featured, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={cn(
      "relative p-8 rounded-[2.5rem] border flex flex-col h-full",
      featured 
        ? "bg-slate-900 border-slate-800 text-white shadow-2xl shadow-indigo-500/20" 
        : "bg-white border-slate-100 text-slate-900"
    )}
  >
    {featured && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold px-4 py-1 rounded-full tracking-widest leading-none">
        MOST POPULAR
      </div>
    )}
    <div className="mb-8">
      <h3 className="font-bold text-lg mb-2">{name}</h3>
      <p className={cn("text-sm", featured ? "text-slate-400" : "text-slate-500")}>{description}</p>
    </div>
    <div className="mb-10 flex items-baseline gap-1">
      <span className="text-4xl font-bold tracking-tight">{price}</span>
      <span className={cn("text-xs font-semibold", featured ? "text-slate-400" : "text-slate-500")}>/mo</span>
    </div>
    <div className="space-y-4 mb-10 flex-1">
      {features.map((feature: string, i: number) => (
        <div key={i} className="flex items-start gap-3 text-sm font-medium">
          <div className={cn("mt-0.5 rounded-full p-0.5 shrink-0", featured ? "bg-indigo-500/20 text-indigo-400" : "bg-emerald-100 text-emerald-600")}>
            <Check size={12} />
          </div>
          <span className={featured ? "text-slate-300" : "text-slate-600"}>{feature}</span>
        </div>
      ))}
    </div>
    <button className={cn(
      "py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2",
      featured 
        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30" 
        : "bg-slate-100 hover:bg-slate-200 text-slate-900"
    )}>
      Subscribe Now
      <ArrowRight size={16} />
    </button>
  </motion.div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
          {/* Abstract Background Blobs */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[1000px] h-[1000px] bg-indigo-500/10 blur-[150px] rounded-full -z-10 animate-pulse" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] rounded-full -z-10" />

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 border border-indigo-100 text-indigo-600 text-xs font-bold mb-8 shadow-sm">
                  <Star size={14} className="fill-indigo-600" />
                  Trusted by 500+ Real Estate Builders
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-8">
                  The <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Powerhouse CRM</span> for Modern Builders
                </h1>
                <p className="text-lg text-slate-500 leading-relaxed max-w-xl mb-12">
                  Streamline lead capturing, automate WhatsApp follow-ups, and visualize your entire property pipeline in one intelligent dashboard. Designed specifically for the Indian real estate landscape.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link href="/dashboard" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 group text-lg">
                    Start Your 14-Day Free Trial
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold transition-all text-lg">
                    Book a Demo
                  </button>
                </div>

                <div className="mt-12 flex items-center gap-8 grayscale opacity-50">
                  <Building2 size={32} />
                  <Target size={32} />
                  <Zap size={32} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl blur-[100px] opacity-20 -z-10 scale-90" />
                <div className="relative bg-white/40 backdrop-blur-sm p-4 rounded-[3rem] border border-white/50 shadow-2xl">
                   {/* Here we'd output the generated image in a production setting */}
                   <div className="aspect-[4/3] rounded-[2rem] bg-indigo-50 border border-indigo-100 overflow-hidden relative shadow-inner">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-indigo-200 animate-pulse">
                           <LayoutDashboard size={120} strokeWidth={1} />
                        </div>
                      </div>
                      {/* Floating UI Elements */}
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-10 right-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-50"
                      >
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                              <Users size={20} />
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Leads</p>
                              <p className="text-lg font-bold text-slate-900">+124</p>
                           </div>
                         </div>
                      </motion.div>
                   </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 px-6 bg-white relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4">Core Ecosystem</h2>
              <h3 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">Everything you need to sell property faster</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Users} 
                title="Lead Centralization" 
                description="Import leads automatically from WhatsApp, Facebook, Websites, and Portals like MagicBricks or Housing.com."
                color="bg-indigo-600"
              />
              <FeatureCard 
                icon={MessageSquare} 
                title="Automated WhatsApp" 
                description="Send instant welcome messages and personalized follow-ups without lifting a finger. Built-in WhatsApp API."
                color="bg-emerald-600"
              />
              <FeatureCard 
                icon={Target} 
                title="Sales Pipeline" 
                description="Visual kanban board to track deals from inquiry to registration. Never lose track of high-intent prospects."
                color="bg-amber-500"
              />
              <FeatureCard 
                icon={Building2} 
                title="Inventory Tracking" 
                description="Real-time availability of units across all your projects. Sync site engineers with sales teams instantly."
                color="bg-purple-600"
              />
              <FeatureCard 
                icon={BarChart3} 
                title="Advanced Analytics" 
                description="Detailed reports on agent performance, site visit conversions, and marketing ROI at your fingertips."
                color="bg-blue-600"
              />
              <FeatureCard 
                icon={ShieldCheck} 
                title="Enterprise Security" 
                description="Role-based access controls and encrypted data storage. Your precious leads are always protected."
                color="bg-slate-900"
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6 bg-slate-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4">Investment Plans</h2>
              <h3 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">Choose the perfect scale for your vision</h3>
              <p className="text-slate-500 font-medium">Simple, transparent pricing. Risk-free for 14 days.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <PricingCard 
                name="Starter"
                price="₹4,999"
                description="For growing individual builders"
                delay={0}
                features={[
                  "Up to 5 User Seats",
                  "1 WhatsApp API Number",
                  "500 Leads / mo",
                  "2 Real Estate Projects",
                  "Standard Support"
                ]}
              />
              <PricingCard 
                name="Growth"
                price="₹12,499"
                description="Perfect for mid-sized firms"
                featured={true}
                delay={0.1}
                features={[
                  "Up to 20 User Seats",
                  "3 WhatsApp API Numbers",
                  "5,000 Leads / mo",
                  "10 Real Estate Projects",
                  "Custom Lead Sources",
                  "Priority Support"
                ]}
              />
              <PricingCard 
                name="Enterprise"
                price="₹29,999"
                description="Global scale for market leaders"
                delay={0.2}
                features={[
                  "Unlimited User Seats",
                  "10 WhatsApp API Numbers",
                  "Unlimited Lead Ingestion",
                  "Unlimited Projects",
                  "Dedicated Account Manager",
                  "24/7 Priority Concierge"
                ]}
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white py-16 px-6 border-t border-slate-100">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-indigo-200 shadow-lg">
                BF
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">BuildFlow</span>
            </div>
            <p className="text-slate-400 text-sm mb-12 text-center max-w-md leading-relaxed">
              Leading the digital transformation of Indian Real Estate with cutting-edge CRM technology. Designed and built with ❤️ in India.
            </p>
            <div className="flex gap-8 text-slate-500 font-bold text-xs uppercase tracking-widest mb-12">
              <a href="#" className="hover:text-indigo-600">Terms</a>
              <a href="#" className="hover:text-indigo-600">Privacy</a>
              <a href="#" className="hover:text-indigo-600">Security</a>
              <a href="#" className="hover:text-indigo-600">Contact</a>
            </div>
            <div className="text-slate-300 text-[10px] font-bold tracking-widest uppercase">
              &copy; 2026 BuildFlow CRM. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

const LayoutDashboard = ({ size, className, strokeWidth }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth || 2} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);
