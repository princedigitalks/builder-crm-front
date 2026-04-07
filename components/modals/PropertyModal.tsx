'use client';

import React from 'react';
import CommonDialog from '@/components/ui/CommonDialog';
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
    <CommonDialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={formData.id ? 'Refine Asset' : 'Register New Asset'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 uppercase font-black tracking-tight">
          <div className="col-span-2 space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Name</label>
            <div className="relative group">
              <Home size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                required
                type="text" 
                placeholder="e.g. Unit 402 - Building A"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all uppercase"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Associated Site</label>
            <div className="relative group">
              <Building size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
              <select 
                required
                value={formData.site}
                onChange={(e) => setFormData({...formData, site: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:bg-white focus:border-indigo-400 transition-all appearance-none cursor-pointer uppercase"
              >
                <option value="">Select Site</option>
                {mockSites.map(site => <option key={site} value={site}>{site}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Type</label>
            <div className="relative group">
              <Home size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:bg-white focus:border-indigo-400 transition-all appearance-none cursor-pointer uppercase"
              >
                {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Listing Price</label>
            <div className="relative group">
              <IndianRupee size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                required
                type="text" 
                placeholder="e.g. 1.5Cr"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 transition-all uppercase"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Location / Area</label>
            <div className="relative group">
              <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                required
                type="text" 
                placeholder="e.g. Navi Mumbai"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 transition-all uppercase"
              />
            </div>
          </div>

          <div className="col-span-2 space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Description</label>
            <textarea 
              required
              placeholder="Detailed specifications and highlights..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={2}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all resize-none"
            />
          </div>

          <div className="col-span-2 space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Image URL</label>
            <div className="relative group">
              <ImageIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-[2] px-6 py-3 bg-indigo-600 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            {formData.id ? 'Save Changes' : 'Confirm Asset'}
          </button>
        </div>
      </form>
    </CommonDialog>
  );
}
