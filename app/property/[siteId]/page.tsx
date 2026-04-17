'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { MapPin, IndianRupee, Tag, Home, Building2, ChevronLeft, ChevronRight, X, ZoomIn, ArrowLeft, Video, FileText, CheckCircle2, Share2, Download, Info } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';

export default function PropertyViewPage() {
  const { siteId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromBuilder = searchParams.get('from');
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  useEffect(() => {
    if (!siteId) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/sites/${siteId}`)
      .then(res => setSite(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [siteId]);

  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL || '';
  const images: string[] = site?.images || [];
  const allImages = images.map((img: string) => `${imageUrl}${img}`);

  const openLightbox = (index: number) => setLightbox({ open: true, index });
  const closeLightbox = () => setLightbox({ open: false, index: 0 });

  const prev = useCallback(() =>
    setLightbox(lb => ({ ...lb, index: (lb.index - 1 + allImages.length) % allImages.length })),
    [allImages.length]);

  const next = useCallback(() =>
    setLightbox(lb => ({ ...lb, index: (lb.index + 1) % allImages.length })),
    [allImages.length]);

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
    else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  useEffect(() => {
    if (!lightbox.open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox.open, prev, next]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <span className="text-sm text-slate-400 font-medium">Discovering luxury...</span>
      </div>
    </div>
  );

  if (notFound || !site) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <Building2 size={28} className="text-slate-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Project Not Found</h2>
        <p className="text-sm text-slate-400">This project may have been relocated or archived.</p>
      </div>
    </div>
  );

  const embedUrl = getYoutubeEmbedUrl(site.videoUrl);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Hero Section */}
      <div className="relative w-full h-[65vh] bg-slate-900 overflow-hidden">
        {allImages[0] ? (
          <img src={allImages[0]} alt={site.name} className="w-full h-full object-cover opacity-90 scale-105" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#475569]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-80" />

        <div className="absolute top-6 left-6 flex items-center gap-2">
          <button
            onClick={() => fromBuilder ? router.push(`/builder/${fromBuilder}`) : router.back()}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 flex items-center justify-center transition-all active:scale-90"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2">
            <Building2 size={14} className="text-indigo-300" />
            <span className="text-xs font-bold text-white tracking-wide uppercase">{site.builderId?.companyName || 'Premium Builder'}</span>
          </div>
        </div>

        <div className="absolute bottom-10 left-6 right-6 max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg ${site.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-amber-950'}`}>
              Project Status: {site.status}
            </span>
            {site.videoUrl && (
              <span className="text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest bg-white/10 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5">
                <Video size={12} className="text-red-400" /> Visual Tour Available
              </span>
            )}
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] mb-3 drop-shadow-2xl">{site.name}</h1>
          <div className="flex items-center gap-2 text-white/80 text-base font-medium">
            <MapPin size={18} className="text-indigo-400" />
            <span>{site.area}, {site.city}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 -mt-8 relative z-10 space-y-8">

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex gap-4">
            {(site.budgets || []).length > 0 && (
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Starting Range</p>
                <div className="flex items-center gap-1.5 text-slate-900 font-black text-lg">
                  <IndianRupee size={16} className="text-emerald-500" />
                  {site.budgets[0].label}
                </div>
              </div>
            )}
            <div className="w-px h-10 bg-slate-100 mx-2 hidden sm:block" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Project Type</p>
              <div className="flex items-center gap-1.5 text-slate-900 font-black text-lg">
                <Home size={16} className="text-indigo-500" />
                {site.propertyTypes?.[0]?.name || 'Residential'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {site.brochureUrl && (
              <a 
                href={site.brochureUrl.startsWith('http') ? site.brochureUrl : `${imageUrl}${site.brochureUrl}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-black transition-all shadow-lg shadow-indigo-200 active:scale-95"
              >
                <Download size={16} /> Download Brochure
              </a>
            )}
            <button className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all active:scale-95 border border-slate-100">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {site.description && (
              <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Info size={16} className="text-indigo-600" />
                  </div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Architectural Overview</h2>
                </div>
                <div
                  className="prose prose-slate max-w-none text-slate-600 leading-relaxed [&_*]:break-words [&_*]:overflow-wrap-anywhere"
                  dangerouslySetInnerHTML={{ __html: site.description }}
                />
              </section>
            )}

            {/* Video Section */}
            {embedUrl && (
              <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                    <Video size={16} className="text-red-500" />
                  </div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Cinematic Tour</h2>
                </div>
                <div className="aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
                  <iframe 
                    src={embedUrl} 
                    className="w-full h-full" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
                </div>
              </section>
            )}

            {/* Details Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
               {/* Location / Address */}
               <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                    <MapPin size={16} className="text-amber-500" />
                  </div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Site Location</h2>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                   {site.address || `${site.area}, ${site.city}`}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50/50 w-fit px-3 py-1.5 rounded-lg border border-indigo-100/50 cursor-pointer hover:bg-indigo-100/50 transition-all">
                   <ZoomIn size={12} /> View on Google Maps
                </div>
              </section>

              {/* Requirement Types */}
              {(site.requirementTypes || []).length > 0 && (
                <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Tag size={16} className="text-emerald-500" />
                    </div>
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Configurations</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {site.requirementTypes.map((rt: any, i: number) => (
                      <span key={i} className="text-xs font-bold px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl border border-slate-100">
                        {rt.name}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Gallery */}
            {allImages.length > 0 && (
              <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                      <ZoomIn size={16} className="text-purple-500" />
                    </div>
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Visual Portfolio</h2>
                  </div>
                  <span className="text-xs text-slate-400 font-bold tracking-widest font-mono">{allImages.length} SHOTS</span>
                </div>
                <div className="columns-2 sm:columns-3 gap-4 space-y-4">
                  {allImages.map((img, i) => (
                    <motion.div
                      whileHover={{ y: -4 }}
                      key={i}
                      className="break-inside-avoid relative rounded-2xl overflow-hidden cursor-pointer group shadow-sm border border-slate-100"
                      onClick={() => openLightbox(i)}
                    >
                      <img
                        src={img}
                        alt={`${site.name} showcase ${i + 1}`}
                        className="w-full h-auto block"
                      />
                      <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/20 transition-all duration-300 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                           <ZoomIn size={16} className="text-white" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-8">
            {/* Amenities Section */}
            {(site.amenities || []).length > 0 && (
              <section className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-900/20 text-white">
                <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-8">Project Amenities</h2>
                <div className="grid grid-cols-1 gap-6">
                  {site.amenities.map((amenity: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                        <CheckCircle2 size={18} className="text-indigo-400" />
                      </div>
                      <span className="text-sm font-bold text-slate-200">{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Builder Profile */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
               <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Developer Details</h2>
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-inner">
                   <Building2 size={32} className="text-indigo-600" />
                 </div>
                 <div>
                   <h3 className="font-black text-slate-900 leading-tight mb-1">{site.builderId?.companyName || 'Premium Builder'}</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Project Developer</p>
                 </div>
               </div>
               <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
                  Contact Developer
               </button>
            </section>
          </aside>
        </div>

        {/* Footer */}
        <div className="pt-12 border-t border-slate-200/60 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            &copy; 2026 {site.builderId?.companyName} &bull; Powered by Antigravity CRM
          </p>
        </div>
      </div>

      {/* Lightbox - Same logic but with premium styling */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/98 flex items-center justify-center backdrop-blur-xl"
          onClick={closeLightbox}
        >
          <button className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-all" onClick={closeLightbox}>
            <X size={24} className="text-white" />
          </button>
          
          <div className="max-w-6xl max-h-[80vh] w-full px-12" onClick={e => e.stopPropagation()}>
             <img src={allImages[lightbox.index]} alt="" className="w-full h-full object-contain rounded-2xl shadow-2xl" />
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 px-6">
             {allImages.map((_, i) => (
               <button key={i} onClick={e => { e.stopPropagation(); setLightbox(lb => ({ ...lb, index: i })); }}
                 className={`w-2 h-2 rounded-full transition-all ${i === lightbox.index ? 'bg-indigo-500 w-8' : 'bg-white/20 hover:bg-white/40'}`} />
             ))}
          </div>
        </div>
      )}
    </div>
  );
}


