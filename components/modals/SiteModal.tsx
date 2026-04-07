'use client';

import React from 'react';
import CommonDialog from '@/components/ui/CommonDialog';
import { Building2, MapPin, IndianRupee, Smartphone, User } from 'lucide-react';

interface SiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  mockWhatsAppNumbers: any[];
  mockStaff: any[];
}

export default function SiteModal({ 
  isOpen, 
  onClose, 
  formData, 
  setFormData, 
  onSubmit,
  mockWhatsAppNumbers,
  mockStaff 
}: SiteModalProps) {
  return (
    <CommonDialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={formData.id ? 'Refine Project Details' : 'Onboard New Project'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 uppercase font-black tracking-tight">
          <div className="col-span-2 sm:col-span-1 space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Name</label>
            <div className="relative group">
              <Building2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                required
                type="text" 
                placeholder="e.g. Skyline Heights"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all uppercase"
              />
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Location Address</label>
            <div className="relative group">
              <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                required
                type="text" 
                placeholder="Full address or area..."
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all uppercase"
              />
            </div>
          </div>

          <div className="col-span-2 space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Description</label>
            <textarea 
              required
              placeholder="Brief overview of the project..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={2}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Types</label>
            <div className="relative group">
              <Building2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="e.g. 2BHK, 3BHK"
                value={formData.propertyTypes}
                onChange={(e) => setFormData({...formData, propertyTypes: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all uppercase"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Price Range</label>
            <div className="relative group">
              <IndianRupee size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="e.g. 1.2Cr - 2.5Cr"
                value={formData.priceRange}
                onChange={(e) => setFormData({...formData, priceRange: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all uppercase"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Hub</label>
            <div className="relative group">
              <Smartphone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
              <select 
                required
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:bg-white focus:border-indigo-400 transition-all appearance-none cursor-pointer uppercase"
              >
                <option value="">Link Number</option>
                {mockWhatsAppNumbers.map(num => <option key={num.id} value={num.name}>{num.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Site Manager</label>
            <div className="relative group">
              <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
              <select 
                required
                value={formData.staff}
                onChange={(e) => setFormData({...formData, staff: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:bg-white focus:border-indigo-400 transition-all appearance-none cursor-pointer uppercase"
              >
                <option value="">Assign Staff</option>
                {mockStaff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div className="col-span-2 space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Status</label>
            <div className="relative group">
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all appearance-none cursor-pointer uppercase"
              >
                <option>Planning</option>
                <option>Launching Soon</option>
                <option>Under Construction</option>
                <option>Ready to Move</option>
                <option>Active</option>
                <option>Completed</option>
              </select>
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
            {formData.id ? 'Save Changes' : 'Confirm Project'}
          </button>
        </div>
      </form>
    </CommonDialog>
  );
}
