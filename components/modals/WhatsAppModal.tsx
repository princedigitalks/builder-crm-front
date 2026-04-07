'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, User, Phone, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function WhatsAppModal({ 
  isOpen, 
  onClose, 
  formData, 
  setFormData, 
  onSubmit 
}: WhatsAppModalProps) {
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
            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-white/50">
              <div>
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Provision Hub</h2>
                 <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Connect business communication</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                 <Smartphone size={24} />
              </div>
            </div>

            <form onSubmit={onSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Instance Display Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Sales Primary Hub"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Business Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    required
                    type="text" 
                    maxLength={10}
                    pattern="\d{10}"
                    placeholder="9876543210"
                    value={formData.number}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({...formData, number: val});
                    }}
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all tracking-[0.2em]"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                     <span className={cn(
                       "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                       formData.number.length === 10 ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                     )}>
                       {formData.number.length}/10
                     </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                 <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-8 py-4 bg-slate-100 rounded-2xl text-[11px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-200 transition-all"
                 >
                   Dismiss
                 </button>
                 <button 
                  type="submit"
                  className="flex-[2] px-8 py-4 bg-indigo-600 rounded-2xl text-[11px] font-black text-white uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                 >
                   {formData.id ? 'Update Hub' : 'Connect Hub'}
                 </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
