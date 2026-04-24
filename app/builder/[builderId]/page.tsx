'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Building2, ArrowLeft, Phone, Mail, Facebook, Instagram, Linkedin, Twitter, Youtube, ExternalLink, Globe, ChevronRight, UserCheck, Star, Zap, Building } from 'lucide-react';
import axios from 'axios';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function BuilderPublicPage() {
  const { builderId } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [subscriptionExpired, setSubscriptionExpired] = useState(false);

  useEffect(() => {
    if (!builderId) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/builders/${builderId}`)
      .then(res => setData(res.data.data))
      .catch((err) => {
        if (err.response?.status === 403 && err.response?.data?.type === 'SUBSCRIPTION_EXPIRED') {
          setSubscriptionExpired(true);
        } else {
          setNotFound(true);
        }
      })
      .finally(() => setLoading(false));
  }, [builderId]);

  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL || '';

  const handleGlobalRedirect = () => {
    window.location.href = 'https://builderscrm.in';
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
        <span className="text-sm text-slate-400">Loading portfolio...</span>
      </div>
    </div>
  );

  if (subscriptionExpired) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-100/50 border border-indigo-100">
          <Globe size={32} className="text-indigo-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 leading-tight mb-4 tracking-tight">Portfolio Under Maintenance</h2>
        <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8">
          This builder's portfolio is currently offline for subscription updates. Please try again later or visit another project.
        </p>
        <button 
          onClick={handleGlobalRedirect}
          className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  if (notFound || !data?.builder) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <Building2 size={28} className="text-slate-300" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Portfolio not found</h2>
        <p className="text-sm text-slate-400 mt-1 mb-6">This builder profile doesn't exist or has been removed.</p>
        <button onClick={handleGlobalRedirect} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium">
          Back to Home
        </button>
      </div>
    </div>
  );

  const { builder, sites } = data;
  const logoSrc = builder.websiteDetails?.logo
    ? (builder.websiteDetails.logo.startsWith('http') ? builder.websiteDetails.logo : `${imageUrl}${builder.websiteDetails.logo}`)
    : null;
  const heroSrc = builder.websiteDetails?.heroImage
    ? (builder.websiteDetails.heroImage.startsWith('http') ? builder.websiteDetails.heroImage : `${imageUrl}${builder.websiteDetails.heroImage}`)
    : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070';

  const stats = [
    { label: 'Projects', value: sites.length + '+', icon: Building },
    { label: 'Years Active', value: builder.websiteDetails?.yearsActive || '0+', icon: Zap },
    { label: 'Cities', value: builder.websiteDetails?.cities || '0+', icon: MapPin },
    { label: 'Happy Clients', value: builder.websiteDetails?.happyClients || '0+', icon: UserCheck },
  ];

  const socials = [
    { icon: Facebook, key: 'facebook', color: 'hover:bg-blue-600' },
    { icon: Instagram, key: 'instagram', color: 'hover:bg-pink-600' },
    { icon: Linkedin, key: 'linkedIn', color: 'hover:bg-blue-700' },
    { icon: Twitter, key: 'twitter', color: 'hover:bg-sky-500' },
    { icon: Youtube, key: 'youtube', color: 'hover:bg-red-600' },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar - Higher, Centered Logo, No Back Button */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-center">
            <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={handleGlobalRedirect}>
              {logoSrc
                ? <img src={logoSrc} alt={builder.companyName} className="h-14 w-auto object-contain" />
                : <div className="h-14 px-6 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100 uppercase tracking-tighter">{builder.companyName}</div>
              }
            </div>
        </div>
      </header>

      {/* Hero - Full Image, No Overlay Text */}
      <section className="relative h-[65vh] min-h-[450px] overflow-hidden">
        <img src={heroSrc} alt="Portfolio Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/10" />
      </section>

      {/* Statistics Section - Floating Bar Below Hero */}
      <div className="relative z-10 -mt-12 max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 items-center">
                {stats.map((stat, i) => (
                    <div key={i} className="flex flex-col items-center text-center space-y-2 border-r border-slate-50 last:border-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-600 mb-1">
                            <stat.icon size={20} />
                        </div>
                        <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* About Section */}
      {builder.websiteDetails?.about && (
        <section className="max-w-4xl mx-auto px-6 py-24 text-center">
            <div className="w-12 h-1.5 bg-indigo-600 rounded-full mx-auto mb-8" />
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">Our Philosophy</h2>
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-medium italic">
                "{builder.websiteDetails.about}"
            </p>
        </section>
      )}

      {/* Projects Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">Featured Projects</h2>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Excellence in every square foot</p>
          </div>
          <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
             <span className="text-sm font-black text-slate-600 uppercase tracking-widest">{sites.length} Active Sites</span>
          </div>
        </div>

        {sites.length === 0 ? (
          <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-slate-100 border-dashed">
            <Building2 size={48} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Innovation in progress</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sites.map((site: any, i: number) => {
              const mainImage = site.images?.[0] ? `${imageUrl}${site.images[0]}` : null;
              return (
                <motion.div
                  key={site._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  onClick={() => router.push(`/property/${site._id}?from=${builderId}`)}
                  className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/80 cursor-pointer transition-all duration-500"
                >
                  <div className="relative h-64 overflow-hidden">
                    {mainImage
                      ? <img src={mainImage} alt={site.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      : <div className="w-full h-full bg-slate-50 flex items-center justify-center"><Building2 size={40} className="text-slate-200" /></div>
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute top-4 right-4">
                        <span className={cn(
                            "text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest backdrop-blur-md shadow-lg",
                            site.status === 'Active' ? "bg-emerald-500/90 text-white" : "bg-amber-400/90 text-white"
                        )}>
                            {site.status}
                        </span>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                             <Building2 size={14} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{site.area}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-4">{site.name}</h3>
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-500">
                            <MapPin size={14} className="text-indigo-500" />
                            <span className="text-xs font-bold">{site.city}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                            <ChevronRight size={16} />
                        </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer - Professional Redirection */}
      <footer className="bg-slate-950 text-white overflow-hidden relative">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 relative z-10">
            <div className="space-y-6">
                {logoSrc ? (
                    <div className="flex flex-col items-start gap-2">
                        <img src={logoSrc} alt={builder.companyName} className="h-14 w-auto object-contain max-w-[200px]" />
                        <div className="h-0.5 w-8 bg-indigo-500 rounded-full" />
                    </div>
                ) : (
                    <div className="text-2xl font-black tracking-tighter uppercase text-white">{builder.companyName}</div>
                )}
                <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                    {builder.websiteDetails?.about?.substring(0, 150) || 'Crafting iconic landmarks and sustainable communities that stand the test of time.'}...
                </p>
                <div className="flex gap-3">
                    {socials.map(({ icon: Icon, key, color }) =>
                        builder.websiteDetails?.socialLinks?.[key] ? (
                            <a key={key} href={builder.websiteDetails.socialLinks[key]} target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:bg-white/10 hover:text-white transition-all">
                                <Icon size={16} />
                            </a>
                        ) : null
                    )}
                </div>
            </div>

            <div className="space-y-8">
                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400">Direct Contact</h4>
                <div className="space-y-6">
                    <div className="flex items-start gap-4 group">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                            <MapPin size={18} />
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed pt-2">{builder.address || 'Corporate Headquarters'}</p>
                    </div>
                    {builder.websiteDetails?.phone && (
                        <a href={`tel:${builder.websiteDetails.phone}`} className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-emerald-400 transition-colors">
                                <Phone size={18} />
                            </div>
                            <span className="text-sm text-slate-400 font-bold">{builder.websiteDetails.phone}</span>
                        </a>
                    )}
                </div>
            </div>

            <div className="space-y-8">
                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400">Newsletter</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Stay updated with our latest luxury developments and market insights.</p>
                <div className="relative group">
                    <input 
                        type="email" 
                        placeholder="your@email.com" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 transition-all">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
          </div>

          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">
                © {new Date().getFullYear()} {builder.companyName} — Architectural Excellence
            </p>
            <div 
                onClick={handleGlobalRedirect}
                className="group cursor-pointer flex items-center gap-2"
            >
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                    Powered by <span className="text-indigo-500 group-hover:text-indigo-400 transition-colors">builderscrm.in</span>
                </span>
                <ExternalLink size={10} className="text-slate-700 group-hover:text-indigo-400 transition-colors" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
