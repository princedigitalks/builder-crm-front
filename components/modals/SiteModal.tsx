'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
                  {formData.id ? 'Refine Project Details' : 'Onboard New Project'}
                 </h2>
                 <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Initialize site parameters & configurations</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600">
                 <Building2 size={24} />
              </div>
            </div>

            <form onSubmit={onSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <div className="col-span-2 space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Skyline Heights Phase 1"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all font-outfit"
                    />
                 </div>

                 <div className="col-span-2 space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Location Address</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input 
                        required
                        type="text" 
                        placeholder="Full address or area..."
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all font-outfit"
                      />
                    </div>
                 </div>

                 <div className="col-span-2 space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Description</label>
                    <textarea 
                      required
                      placeholder="Brief overview of the project..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all resize-none font-outfit"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Types</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 2BHK, 3BHK, Plots"
                      value={formData.propertyTypes}
                      onChange={(e) => setFormData({...formData, propertyTypes: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all font-outfit"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Price Range</label>
                    <div className="relative">
                      <IndianRupee size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input 
                        type="text" 
                        placeholder="e.g. 1.2Cr - 2.5Cr"
                        value={formData.priceRange}
                        onChange={(e) => setFormData({...formData, priceRange: e.target.value})}
                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all font-outfit"
                      />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Hub</label>
                    <div className="relative">
                      <Smartphone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                      <select 
                        required
                        value={formData.whatsappNumber}
                        onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:bg-white focus:border-indigo-400 transition-all appearance-none cursor-pointer font-outfit uppercase"
                      >
                         <option value="">Link Number</option>
                         {mockWhatsAppNumbers.map(num => <option key={num.id} value={num.name}>{num.name}</option>)}
                      </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Site Manager</label>
                    <div className="relative">
                      <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                      <select 
                        required
                        value={formData.staff}
                        onChange={(e) => setFormData({...formData, staff: e.target.value})}
                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:bg-white focus:border-indigo-400 transition-all appearance-none cursor-pointer font-outfit uppercase"
                      >
                         <option value="">Assign Staff</option>
                         {mockStaff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                      </select>
                    </div>
                 </div>

                 <div className="col-span-2 space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all appearance-none cursor-pointer font-outfit uppercase"
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

              <div className="flex gap-4 pt-4">
                 <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-8 py-4 bg-slate-100 rounded-2xl text-[11px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-200 hover:text-slate-600 transition-all"
                 >
                   Cancel
                 </button>
                 <button 
                  type="submit"
                  className="flex-[2] px-8 py-4 bg-indigo-600 rounded-2xl text-[11px] font-black text-white uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
                 >
                   {formData.id ? 'Save Changes' : 'Confirm Project'}
                 </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
