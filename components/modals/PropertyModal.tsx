'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Building, IndianRupee, MapPin, Image as ImageIcon } from 'lucide-react';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  mockSites: string[];
  propertyTypes: string[];
}

export default function PropertyModal({ 
  isOpen, 
  onClose, 
  formData, 
  setFormData, 
  onSubmit,
  mockSites,
  propertyTypes 
}: PropertyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl z-[101] overflow-hidden border border-slate-100"
          >
            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div>
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {formData.id ? 'Refine Asset' : 'Register New Asset'}
                 </h2>
                 <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configure property specifications & pricing</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600">
                 <Home size={24} />
              </div>
            </div>

            <form onSubmit={onSubmit} className="p-10 space-y-5 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-5">
                 <div className="col-span-2 space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Unit 402 - Building A"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all uppercase"
                    />
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Associated Site</label>
                    <select 
                      required
                      value={formData.site}
                      onChange={(e) => setFormData({...formData, site: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:bg-white focus:border-indigo-400 transition-all appearance-none cursor-pointer uppercase"
                    >
                       <option value="">Select Site</option>
                       {mockSites.map(site => <option key={site} value={site}>{site}</option>)}
                    </select>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Type</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:bg-white focus:border-indigo-400 transition-all appearance-none cursor-pointer uppercase"
                    >
                       {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Listing Price</label>
                    <div className="relative">
                      <IndianRupee size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. 1.5Cr"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 transition-all uppercase"
                      />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Location / Area</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Navi Mumbai"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 transition-all uppercase"
                      />
                    </div>
                 </div>

                 <div className="col-span-2 space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Description</label>
                    <textarea 
                      required
                      placeholder="Detailed specifications and highlights..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all resize-none"
                    />
                 </div>

                 <div className="col-span-2 space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Image URL</label>
                    <div className="relative">
                      <ImageIcon size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input 
                        type="text" 
                        placeholder="https://images.unsplash.com/..."
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 transition-all"
                      />
                    </div>
                 </div>
              </div>

              <div className="flex gap-4 pt-4">
                 <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-8 py-4 bg-slate-100 rounded-2xl text-[11px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-200 transition-all"
                 >
                   Cancel
                 </button>
                 <button 
                  type="submit"
                  className="flex-[2] px-8 py-4 bg-indigo-600 rounded-2xl text-[11px] font-black text-white uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
                 >
                   {formData.id ? 'Save Changes' : 'Confirm Asset'}
                 </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
