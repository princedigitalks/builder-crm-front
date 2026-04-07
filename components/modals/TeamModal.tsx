'use client';

import React from 'react';
import CommonDialog from '@/components/ui/CommonDialog';
import { Users, Mail, Shield, Phone, Building, CheckCircle2 } from 'lucide-react';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function TeamModal({ 
  isOpen, 
  onClose, 
  onSubmit 
}: TeamModalProps) {
  return (
    <CommonDialog isOpen={isOpen} onClose={onClose} title="Add Team Member" maxWidth="max-w-2xl">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 uppercase font-black tracking-tight">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group">
              <Users size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input type="text" placeholder="e.g. Rahul Sharma" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all font-bold uppercase placeholder:text-slate-300" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
            <div className="relative group">
              <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input type="email" placeholder="rahul@skylineinfra.com" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all font-bold placeholder:text-slate-300" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Role</label>
            <div className="relative group">
              <Shield size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
              <select className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold appearance-none outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all uppercase cursor-pointer">
                <option>Sales Manager</option>
                <option>Sales Executive</option>
                <option>Relationship Manager</option>
                <option>Project Admin</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative group">
              <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input type="text" placeholder="+91 98765 43210" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all font-bold placeholder:text-slate-300" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-black transition-all active:scale-95 uppercase text-[10px] tracking-widest"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black transition-all shadow-lg shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest"
          >
            <CheckCircle2 size={16} />
            Onboard Member
          </button>
        </div>
      </form>
    </CommonDialog>
  );
}
