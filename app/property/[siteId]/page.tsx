'use client';

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  MapPin, IndianRupee, Tag, Home, Building2, ChevronLeft, ChevronRight,
  X, ZoomIn, ArrowLeft, Video, FileText, CheckCircle2, Share2, Download,
  Info, Facebook, Instagram, Linkedin, Twitter, Youtube, Phone
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { toast, Toaster } from 'react-hot-toast';
import { cn } from '@/lib/utils';

/* ─── Hero Slider ─────────────────────────────────────────── */
function HeroSlider({ images, siteName }: { images: string[]; siteName: string }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (images.length > 1) {
      timerRef.current = setInterval(() => setCurrent(c => (c + 1) % images.length), 4500);
    }
  }, [images.length]);

  useEffect(() => { startTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [startTimer]);

  const go = (dir: 1 | -1) => {
    setCurrent(c => (c + dir + images.length) % images.length);
    startTimer();
  };

  if (!images.length) return (
    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
      <Building2 size={64} className="text-slate-600" />
    </div>
  );

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current]}
          alt={`${siteName} ${current + 1}`}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Gradient overlay - Removed as requested */}

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button onClick={() => go(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition-all z-10">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => go(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition-all z-10">
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <button key={i} onClick={() => { setCurrent(i); startTimer(); }}
              className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'}`} />
          ))}
        </div>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium z-10">
          {current + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

/* ─── Lightbox ────────────────────────────────────────────── */
function Lightbox({ images, index, onClose }: { images: string[]; index: number; onClose: () => void }) {
  const [current, setCurrent] = useState(index);

  const prev = useCallback(() => setCurrent(c => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent(c => (c + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next, onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}>
      <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10">
        <X size={20} />
      </button>

      <div className="max-w-5xl max-h-[85vh] w-full px-16" onClick={e => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.img key={current} src={images[current]} alt=""
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full object-contain rounded-xl max-h-[80vh]" />
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <>
          <button onClick={e => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <ChevronLeft size={22} />
          </button>
          <button onClick={e => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <ChevronRight size={22} />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setCurrent(i); }}
                className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/30 hover:bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
export default function PropertyViewPage() {
  const { siteId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromBuilder = searchParams.get('from');

  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!siteId) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/sites/${siteId}`)
      .then(res => setSite(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [siteId]);

  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL || '';
  const allImages: string[] = (site?.images || []).map((img: string) => `${imageUrl}${img}`);

  const embedUrls = useMemo(() => {
    if (!site) return [];
    const urls: string[] = site.videoUrls?.length ? site.videoUrls : site.videoUrl ? [site.videoUrl] : [];
    return urls.map((url: string) => {
      if (!url || !url.trim()) return null;
      let id = '';
      if (url.includes('v=')) id = url.split('v=')[1].split('&')[0];
      else if (url.includes('youtu.be/')) id = url.split('youtu.be/')[1].split('?')[0];
      else if (url.includes('/embed/')) id = url.split('/embed/')[1].split('?')[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }).filter(Boolean) as string[];
  }, [site]);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as any;
    setSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/public/inquiry`, {
        name: target.name.value,
        phone: target.phone.value,
        message: target.message.value,
        siteId: site._id,
        builderId: site.builderId._id,
      });
      toast.success('Request sent! Our team will contact you shortly.');
      target.reset();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
        <span className="text-sm text-slate-400">Loading project...</span>
      </div>
    </div>
  );

  if (notFound || !site) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <Building2 size={24} className="text-slate-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Project not found</h2>
        <p className="text-sm text-slate-400 mt-1">This project may have been removed or relocated.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-center" toastOptions={{ style: { borderRadius: '12px', fontSize: '14px' } }} />

      {/* Hero Slider */}
      {/* Navigation Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-[50]">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => fromBuilder ? router.push(`/builder/${fromBuilder}`) : router.back()}
              className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-all border border-slate-200"
            >
              <ArrowLeft size={18} />
            </button>
            {site.builderId?.companyName && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Building2 size={14} className="text-indigo-600" />
                </div>
                <span className="text-sm font-bold text-slate-800">{site.builderId.companyName}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
              className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-6">
        {/* Hero Slider Container with Border Radius */}
        <div className="relative w-full h-[50vh] min-h-[400px] rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50">
          <HeroSlider images={allImages} siteName={site.name} />
          
          <div className="absolute top-6 right-6 z-20 flex gap-2">
            <span className={cn(
              "text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border shadow-lg backdrop-blur-md",
              site.status === 'Active' ? "bg-emerald-500/90 text-white border-emerald-400" : "bg-amber-500/90 text-white border-amber-400"
            )}>
              {site.status === 'Active' ? 'Active' : 'Deactive'}
            </span>
          </div>
        </div>

        {/* Project Identity Section (Below Image) */}
        <div className="mt-8 mb-4">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {embedUrls.length > 0 && (
              <span className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center gap-1.5 uppercase tracking-widest">
                <Video size={12} /> Video tour available
              </span>
            )}
            {/* Movied Requirement Types here instead of separate section */}
            {(site.requirementTypes || []).map((rt: any, i: number) => (
              <span key={i} className="text-[10px] font-black px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 uppercase tracking-widest">
                {rt.name}
              </span>
            ))}
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 leading-tight mb-4 tracking-tight">{site.name}</h1>
          <div className="flex items-center gap-2 text-slate-500 bg-slate-100 w-fit px-4 py-2 rounded-2xl border border-slate-200/50">
            <MapPin size={16} className="text-indigo-500" />
            <span className="text-sm font-bold">{site.area}, {site.city}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 space-y-8">

        {/* Quick Info Bar */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-6">
              {site.budgets?.[0] && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">Starting Price</p>
                  <div className="flex items-center gap-1 font-semibold text-slate-800">
                    <IndianRupee size={14} className="text-emerald-500" />
                    {site.budgets[0].label}
                  </div>
                </div>
              )}
              {site.propertyTypes?.[0] && (
                <>
                  <div className="w-px h-8 bg-slate-100 hidden sm:block" />
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Property Type</p>
                    <div className="flex items-center gap-1 font-semibold text-slate-800">
                      <Home size={14} className="text-indigo-500" />
                      {site.propertyTypes[0].name}
                    </div>
                  </div>
                </>
              )}
              {allImages.length > 0 && (
                <>
                  <div className="w-px h-8 bg-slate-100 hidden sm:block" />
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Photos</p>
                    <p className="font-semibold text-slate-800">{allImages.length} images</p>
                  </div>
                </>
              )}
              <>
                <div className="w-px h-8 bg-slate-100 hidden sm:block" />
                <div>
                  <p className="text-xs text-slate-400 mb-1">Location</p>
                  <div className="flex items-center gap-1 font-semibold text-slate-800">
                    <MapPin size={14} className="text-amber-500" />
                    {site.area}, {site.city}
                  </div>
                </div>
              </>
            </div>
            <div className="flex items-center gap-2">
              {site.brochureUrl && (
                <a href={site.brochureUrl.startsWith('http') ? site.brochureUrl : `${imageUrl}${site.brochureUrl}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
                  <Download size={15} /> Brochure
                </a>
              )}
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
                className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Map embed inside info bar */}
          <div className="mt-5 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-amber-500" />
                <span className="text-sm font-medium text-slate-700">
                  {site.address || `${site.area}, ${site.city}`}
                </span>
              </div>
              <a
                href={site.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.address || ''} ${site.area} ${site.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors shrink-0"
              >
                <ZoomIn size={12} /> Open in Maps
              </a>
            </div>
            <div className="w-full h-52 rounded-xl overflow-hidden border border-slate-100">
              <iframe
                title="Project Location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${site.address || ''} ${site.area} ${site.city}`)}&output=embed&z=15`}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description */}
            {site.description && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Info size={15} className="text-indigo-600" />
                  </div>
                  <h2 className="font-semibold text-slate-800">About this Project</h2>
                </div>
                <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: site.description }} />
              </div>
            )}

            {/* Gallery */}
            {allImages.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                      <ZoomIn size={15} className="text-purple-600" />
                    </div>
                    <h2 className="font-semibold text-slate-800">Photo Gallery</h2>
                  </div>
                  <span className="text-xs text-slate-400">{allImages.length} photos</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {allImages.map((img, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.02 }}
                      className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group border border-slate-100"
                      onClick={() => setLightboxIndex(i)}>
                      <img src={img} alt={`${site.name} ${i + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all flex items-center justify-center">
                        <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {embedUrls.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                    <Video size={15} className="text-red-500" />
                  </div>
                  <h2 className="font-semibold text-slate-800">Video Tour</h2>
                </div>
                <div className="space-y-4">
                  {embedUrls.map((url, i) => (
                    <div key={i} className="aspect-video rounded-xl overflow-hidden border border-slate-100">
                      <iframe src={url} className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Configs only */}
            {/* {site.requirementTypes?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Tag size={15} className="text-emerald-500" />
                  </div>
                  <h2 className="font-semibold text-slate-800">Configurations</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {site.requirementTypes.map((rt: any, i: number) => (
                    <span key={i} className="text-xs font-medium px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg border border-slate-100">{rt.name}</span>
                  ))}
                </div>
              </div>
            )} */}
          </div>

          {/* Right sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-6">
            {/* Inquiry Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                  <Phone size={16} />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800 text-sm">Get a Callback</h2>
                  <p className="text-xs text-slate-400">Our team will reach out to you</p>
                </div>
              </div>
              <form onSubmit={handleInquiry} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">Your Name</label>
                  <input required name="name" type="text" placeholder="Rahul Sharma"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-indigo-400 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">Phone Number</label>
                  <input required name="phone" type="tel" placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-indigo-400 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">Message (optional)</label>
                  <textarea name="message" rows={3} placeholder="I'm interested in this project..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-indigo-400 transition-all resize-none" />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                  {submitting ? 'Sending...' : 'Request Callback'}
                </button>
              </form>
            </div>

            {/* Amenities */}
            {site.amenities?.length > 0 && (
              <div className="bg-slate-900 rounded-2xl p-6 text-white">
                <h2 className="text-sm font-semibold text-white mb-4">Amenities</h2>
                <div className="space-y-3">
                  {site.amenities.map((a: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={14} className="text-indigo-400" />
                      </div>
                      <span className="text-sm text-slate-300">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Developer */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-400 mb-4">Developer</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                  <Building2 size={22} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">{site.builderId?.companyName || 'Premium Builder'}</h3>
                  <p className="text-xs text-slate-400">Verified Developer</p>
                </div>
              </div>
              {fromBuilder && (
                <button onClick={() => router.push(`/builder/${fromBuilder}`)}
                  className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
                  View All Projects
                </button>
              )}
            </div>
          </aside>
        </div>

        {/* Footer */}
        <div className="pt-6 pb-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} {site.builderId?.companyName}. All rights reserved.</span>
          <span>Powered by builderscrm.in</span>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox images={allImages} index={lightboxIndex} onClose={() => setLightboxIndex(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
