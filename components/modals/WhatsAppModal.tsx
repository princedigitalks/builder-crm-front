'use client';

import React from 'react';
import CommonDialog from '@/components/ui/CommonDialog';
import { Smartphone, User, Phone } from 'lucide-react';
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
    <CommonDialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={formData.id ? 'Refine Hub' : 'Provision Hub'}
      maxWidth="max-w-md"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Instance Display Name</label>
          <div className="relative group">
            <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              required
              type="text" 
              placeholder="e.g. Sales Primary Hub"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all uppercase"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Business Number</label>
          <div className="relative group">
            <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              required
              type="text" 
              maxLength={10}
              placeholder="9876543210"
              value={formData.number}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                setFormData({...formData, number: val});
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all tracking-[0.2em]"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
               <span className={cn(
                 "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md",
                 formData.number.length === 10 ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
               )}>
                 {formData.number.length}/10
               </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
          >
            Dismiss
          </button>
          <button 
            type="submit"
            className="flex-[2] px-6 py-3 bg-indigo-600 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            {formData.id ? 'Update Hub' : 'Connect Hub'}
          </button>
        </div>
      </form>
    </CommonDialog>
  );
}
