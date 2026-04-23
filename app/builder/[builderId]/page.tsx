'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Building2, ArrowLeft, Phone, Mail, Facebook, Instagram, Linkedin, Twitter, Youtube, ExternalLink, Globe, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { motion } from 'motion/react';

export default function BuilderPublicPage() {
  const { builderId } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!builderId) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/builders/${builderId}`)
      .then(res => setData(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [builderId]);

  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL || '';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
        <span className="text-sm text-slate-400">Loading portfolio...</span>
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
        <button onClick={() => router.push('/')} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium">
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

  const socials = [
    { icon: Facebook, key: 'facebook', color: 'hover:bg-blue-600' },
    { icon: Instagram, key: 'instagram', color: 'hover:bg-pink-600' },
    { icon: Linkedin, key: 'linkedIn', color: 'hover:bg-blue-700' },
    { icon: Twitter, key: 'twitter', color: 'hover:bg-sky-500' },
    { icon: Youtube, key: 'youtube', color: 'hover:bg-red-600' },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors">
              <ArrowLeft size={16} className="text-slate-500" />
            </button>
            <div className="flex items-center gap-2.5">
              {logoSrc
                ? <img src={logoSrc} alt="" className="h-8 w-8 object-contain rounded-lg border border-slate-100" />
                : <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">{builder.companyName?.[0]}</div>
              }
              <span className="font-semibold text-slate-800 text-sm">{builder.companyName}</span>
            </div>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Verified Builder
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img src={heroSrc} alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-6 pb-12">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-indigo-300 text-sm font-medium mb-3">Builder Portfolio</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4 max-w-3xl">
              {builder.websiteDetails?.tagline || 'Redefining Urban Excellence'}
            </h1>
            <p className="text-slate-300 text-base max-w-xl leading-relaxed">
              {builder.websiteDetails?.heroSubtitle || 'Premium real estate developments crafted for modern living.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center gap-8">
          <div className="text-center">
            <p className="text-2xl font-bold">{sites.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">Active Projects</p>
          </div>
          <div className="w-px h-10 bg-slate-700 hidden sm:block" />
          {builder.address && (
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <MapPin size={14} className="text-indigo-400 shrink-0" />
              <span>{builder.address}</span>
            </div>
          )}
          {builder.websiteDetails?.phone && (
            <>
              <div className="w-px h-10 bg-slate-700 hidden sm:block" />
              <a href={`tel:${builder.websiteDetails.phone}`} className="flex items-center gap-2 text-slate-300 text-sm hover:text-white transition-colors">
                <Phone size={14} className="text-emerald-400 shrink-0" />
                {builder.websiteDetails.phone}
              </a>
            </>
          )}
        </div>
      </div>

      {/* About */}
      {builder.websiteDetails?.about && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-indigo-600 text-sm font-semibold mb-3">About Us</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-5 leading-tight">Who We Are</h2>
              <p className="text-slate-500 leading-relaxed">{builder.websiteDetails.about}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Projects', value: sites.length + '+' },
                { label: 'Years Active', value: new Date().getFullYear() - 2018 + '+' },
                { label: 'Cities', value: [...new Set(sites.map((s: any) => s.city))].length + '+' },
                { label: 'Happy Clients', value: '500+' },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-100">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-indigo-600 text-sm font-semibold mb-2">Our Portfolio</p>
            <h2 className="text-3xl font-bold text-slate-900">Featured Projects</h2>
          </div>
          <span className="text-sm text-slate-400">{sites.length} project{sites.length !== 1 ? 's' : ''}</span>
        </div>

        {sites.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
            <Building2 size={40} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No projects listed yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site: any, i: number) => {
              const mainImage = site.images?.[0] ? `${imageUrl}${site.images[0]}` : null;
              return (
                <motion.div
                  key={site._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  onClick={() => router.push(`/property/${site._id}?from=${builderId}`)}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-slate-200/60 overflow-hidden cursor-pointer transition-all duration-300"
                >
                  <div className="relative h-52 bg-slate-100 overflow-hidden">
                    {mainImage
                      ? <img src={mainImage} alt={site.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center"><Building2 size={40} className="text-indigo-200" /></div>
                    }
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${site.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-amber-900'}`}>
                        {site.status}
                      </span>
                    </div>
                    {site.images?.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg font-medium">
                        +{site.images.length - 1} photos
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-900 text-base leading-tight group-hover:text-indigo-600 transition-colors">{site.name}</h3>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 shrink-0 mt-0.5 transition-colors" />
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-400">
                      <MapPin size={13} className="text-indigo-400 shrink-0" />
                      <span className="truncate">{site.area}, {site.city}</span>
                    </div>
                    {site.budgets?.[0] && (
                      <p className="mt-3 text-sm font-semibold text-slate-700">₹{site.budgets[0].label}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-8">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {logoSrc
                  ? <img src={logoSrc} alt="" className="h-10 w-10 object-contain rounded-xl bg-white p-1.5" />
                  : <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center"><Building2 size={20} className="text-white" /></div>
                }
                <div>
                  <h3 className="font-semibold text-white">{builder.companyName}</h3>
                  <p className="text-xs text-indigo-400">Verified Builder</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                {builder.websiteDetails?.about?.substring(0, 120) || 'Delivering quality spaces that redefine modern living.'}
                {builder.websiteDetails?.about?.length > 120 ? '...' : ''}
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Contact</h4>
              <div className="space-y-3">
                {builder.address && (
                  <div className="flex items-start gap-2.5 text-sm text-slate-400">
                    <MapPin size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                    {builder.address}
                  </div>
                )}
                {builder.websiteDetails?.phone && (
                  <a href={`tel:${builder.websiteDetails.phone}`} className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors">
                    <Phone size={14} className="text-emerald-400 shrink-0" />
                    {builder.websiteDetails.phone}
                  </a>
                )}
                {builder.websiteDetails?.email && (
                  <a href={`mailto:${builder.websiteDetails.email}`} className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors">
                    <Mail size={14} className="text-indigo-400 shrink-0" />
                    {builder.websiteDetails.email}
                  </a>
                )}
              </div>
            </div>

            {/* Social */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Follow Us</h4>
              {builder.websiteDetails?.socialLinks ? (
                <div className="flex flex-wrap gap-2">
                  {socials.map(({ icon: Icon, key, color }) =>
                    builder.websiteDetails.socialLinks[key] ? (
                      <a key={key} href={builder.websiteDetails.socialLinks[key]} target="_blank" rel="noopener noreferrer"
                        className={`w-9 h-9 bg-white/10 ${color} text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all`}>
                        <Icon size={15} />
                      </a>
                    ) : null
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-500 text-sm"><Globe size={14} /> No social links added</div>
              )}
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
            <span>© {new Date().getFullYear()} {builder.companyName}. All rights reserved.</span>
            <span>Powered by builderscrm.in</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
