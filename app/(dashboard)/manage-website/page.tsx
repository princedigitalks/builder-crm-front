'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { Save, ExternalLink, Globe, Phone, Mail, FileText, Info, Facebook, Instagram, Linkedin, Twitter, Youtube, Share2, UploadCloud, X, Smartphone, Image as ImageIcon } from 'lucide-react';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';

export default function ManageWebsitePage() {
  const dispatch = useDispatch();
  const { builder } = useSelector((state: RootState) => state.auth);
  const builderId = builder?._id;

  const [form, setForm] = useState({ 
    companyName: '',
    address: '',
    tagline: '', 
    heroSubtitle: '',
    about: '', 
    phone: '', 
    email: '', 
    logo: '',
    heroImage: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      linkedIn: '',
      twitter: '',
      youtube: ''
    }
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!builderId) return;
    axios.get(`/builder/${builderId}/website`)
      .then(res => {
        const b = res.data.data || {};
        const wd = b.websiteDetails || {};
        const sl = wd.socialLinks || {};
        setForm({
          companyName: b.companyName || '',
          address: b.address || '',
          tagline: wd.tagline || '',
          heroSubtitle: wd.heroSubtitle || '',
          about: wd.about || '',
          phone: wd.phone || '',
          email: wd.email || '',
          logo: wd.logo || '',
          heroImage: wd.heroImage || '',
          socialLinks: {
            facebook: sl.facebook || '',
            instagram: sl.instagram || '',
            linkedIn: sl.linkedIn || '',
            twitter: sl.twitter || '',
            youtube: sl.youtube || ''
          }
        });
        if (wd.logo) {
          setLogoPreview(wd.logo.startsWith('http') ? wd.logo : `${process.env.NEXT_PUBLIC_IMAGE_URL}${wd.logo}`);
        }
        if (wd.heroImage) {
          setHeroPreview(wd.heroImage.startsWith('http') ? wd.heroImage : `${process.env.NEXT_PUBLIC_IMAGE_URL}${wd.heroImage}`);
        }
      })
      .finally(() => setLoading(false));
  }, [builderId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [e.target.name]: e.target.value }
    }));
    setSaved(false);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setSaved(false);
    }
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroFile(file);
      setHeroPreview(URL.createObjectURL(file));
      setSaved(false);
    }
  };

  const handleSave = async () => {
    if (!builderId) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('companyName', form.companyName);
      formData.append('address', form.address);
      formData.append('tagline', form.tagline);
      formData.append('heroSubtitle', form.heroSubtitle);
      formData.append('about', form.about);
      formData.append('phone', form.phone);
      formData.append('email', form.email);
      
      // Handle Logo
      if (logoFile) {
        formData.append('logo', logoFile);
      } else {
        formData.append('logo', form.logo);
      }

      // Handle Hero Image
      if (heroFile) {
        formData.append('heroImage', heroFile);
      } else {
        formData.append('heroImage', form.heroImage);
      }

      formData.append('socialLinks', JSON.stringify(form.socialLinks));

      const res = await axios.put(`/builder/${builderId}/website`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const updatedData = res.data.data || {};
      const wd = updatedData.websiteDetails || {};
      
      // Update Redux state so the sidebar and other components reflect the new company name immediately
      import('@/redux/slices/authSlice').then(({ updateBuilder }) => {
         dispatch(updateBuilder(updatedData));
      });

      setForm(prev => ({ ...prev, logo: wd.logo, heroImage: wd.heroImage }));
      setLogoFile(null);
      setHeroFile(null);
      setSaved(true);
      toast.success('Website details updated!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-none">Manage Public Presence</h1>
          <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">Control your dynamic builder profile</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const url = `${window.location.origin}/builder/${builderId}`;
              navigator.clipboard.writeText(url);
              toast.success('Profile link copied!');
            }}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 bg-slate-100 px-4 py-2.5 rounded-xl transition-all"
          >
            <Share2 size={13} />
            Copy Link
          </button>
          <a
            href={`/builder/${builderId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 px-4 py-2.5 rounded-xl transition-all border border-indigo-100 hover:border-indigo-600"
          >
            <ExternalLink size={13} />
            Live Preview
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Visual Branding Section */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <ImageIcon size={14} />
            </div>
            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Visual Branding</span>
          </div>
                    <div className="p-6 space-y-8">
            {/* Company Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Name</label>
                  <input
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Shantiniketan Group"
                    className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-900"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Address</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="e.g. 101, Corporate Hub, Satellite"
                    className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-900"
                  />
               </div>
            </div>

            <div className="h-px bg-slate-50" />

            {/* Logo & Hero Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Logo Upload */}
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Logo</label>
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                       <div className="relative group shrink-0">
                         <img src={logoPreview} alt="" className="h-24 w-24 rounded-2xl object-contain border border-slate-100 p-2 bg-white" />
                         <button onClick={() => { setLogoPreview(''); setLogoFile(null); setForm(prev => ({ ...prev, logo: '' })); }} className="absolute -top-2 -right-2 w-7 h-7 bg-rose-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg scale-75 group-hover:scale-100">
                           <X size={14} />
                         </button>
                       </div>
                    ) : (
                      <label className="h-24 w-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer hover:bg-white hover:border-indigo-400 transition-all group shrink-0">
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                        <UploadCloud size={24} className="text-slate-300 group-hover:text-indigo-500" />
                      </label>
                    )}
                    <div className="space-y-1">
                      <p className="text-[11px] text-slate-500 font-bold leading-snug max-w-[120px]">Upload brand logo (PNG/JPG).</p>
                      <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest cursor-pointer hover:underline inline-block mt-1">Change<input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} /></label>
                    </div>
                  </div>
               </div>

               {/* Hero Image Upload */}
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hero Banner Image</label>
                  <div className="flex items-center gap-4">
                    {heroPreview ? (
                       <div className="relative group shrink-0">
                         <img src={heroPreview} alt="" className="h-24 w-40 rounded-2xl object-cover border border-slate-100 bg-white" />
                         <button onClick={() => { setHeroPreview(''); setHeroFile(null); setForm(prev => ({ ...prev, heroImage: '' })); }} className="absolute -top-2 -right-2 w-7 h-7 bg-rose-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg scale-75 group-hover:scale-100">
                           <X size={14} />
                         </button>
                       </div>
                    ) : (
                      <label className="h-24 w-40 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer hover:bg-white hover:border-indigo-400 transition-all group shrink-0">
                        <input type="file" accept="image/*" className="hidden" onChange={handleHeroChange} />
                        <UploadCloud size={24} className="text-slate-300 group-hover:text-indigo-500" />
                      </label>
                    )}
                    <div className="space-y-1">
                      <p className="text-[11px] text-slate-500 font-bold leading-snug max-w-[120px]">Main banner for public page.</p>
                      <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest cursor-pointer hover:underline inline-block mt-1">Replace Image<input type="file" accept="image/*" className="hidden" onChange={handleHeroChange} /></label>
                    </div>
                  </div>
               </div>
            </div>

            <div className="h-px bg-slate-50" />

            {/* Tagline & About */}
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hero Title (Tagline)</label>
                    <input
                      name="tagline"
                      value={form.tagline}
                      onChange={handleChange}
                      placeholder="e.g. Elevating Urban Living"
                      className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hero Subtitle</label>
                    <input
                      name="heroSubtitle"
                      value={form.heroSubtitle}
                      onChange={handleChange}
                      placeholder="e.g. We specialize in high-concept architecture..."
                      className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-900"
                    />
                  </div>
               </div>
               
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">About / Footer Description</label>
                  <textarea
                    name="about"
                    value={form.about}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your legacy, mission, and achievements..."
                    className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-600 resize-none leading-relaxed"
                  />
               </div>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
             <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Phone size={14} />
             </div>
            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Contact Information</span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Public Phone Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="contact@yourcompany.com"
                className="w-full text-sm px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold"
              />
            </div>
          </div>
        </div>

        {/* Social Presence */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
             <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Share2 size={14} />
             </div>
            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Social Matrix</span>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'facebook', icon: Facebook, placeholder: 'Facebook URL' },
                { name: 'instagram', icon: Instagram, placeholder: 'Instagram URL' },
                { name: 'linkedIn', icon: Linkedin, placeholder: 'LinkedIn URL' },
                { name: 'twitter', icon: Twitter, placeholder: 'Twitter URL' },
                { name: 'youtube', icon: Youtube, placeholder: 'YouTube URL' },
              ].map((social) => (
                <div key={social.name} className="relative group">
                  <social.icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    name={social.name}
                    value={(form.socialLinks as any)[social.name]}
                    onChange={handleSocialChange}
                    placeholder={social.placeholder}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Save Button */}
      <div className="sticky bottom-8 left-0 right-0 z-50 flex justify-center">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`group flex items-center gap-3 px-12 py-5 rounded-[2.5rem] text-xs font-black uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95 ${saved ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-slate-900 hover:bg-black text-white shadow-slate-900/40'} disabled:opacity-50`}
        >
          <Save size={18} />
          {saving ? 'Processing Engine...' : saved ? 'Architecture Saved' : 'Update Global Presence'}
        </button>
      </div>
    </div>
  );
}
