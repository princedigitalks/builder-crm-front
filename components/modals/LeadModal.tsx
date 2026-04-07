'use client';

import React from 'react';
import CommonDialog from '@/components/ui/CommonDialog';
import { User, Phone, Building, Target, IndianRupee, Users } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LeadModal({ 
  isOpen, 
  onClose, 
  onSubmit 
}: LeadModalProps) {
  return (
    <CommonDialog isOpen={isOpen} onClose={onClose} title="Add New Lead" maxWidth="max-w-2xl">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 uppercase font-black tracking-tight">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group">
              <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input type="text" placeholder="e.g. Rahul Sharma" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all uppercase" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative group">
              <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                maxLength={10}
                placeholder="e.g. 9876543210" 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all tracking-[0.1em]" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Site / Project</label>
            <div className="relative group">
              <Building size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
              <select className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all appearance-none uppercase cursor-pointer">
                <option>Skyline Heights</option>
                <option>Skyline Grand</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Source</label>
            <div className="relative group">
              <Target size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
              <select className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all appearance-none uppercase cursor-pointer">
                <option>WhatsApp</option>
                <option>Facebook</option>
                <option>Website</option>
                <option>Walk-in</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Budget Range</label>
            <div className="relative group">
              <IndianRupee size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input type="text" placeholder="e.g. ₹80L - ₹1Cr" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all uppercase" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Agent</label>
            <div className="relative group">
              <Users size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
              <select className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all appearance-none uppercase cursor-pointer">
                <option>Auto Assign (Round Robin)</option>
                <option>Kavya Reddy</option>
                <option>Nikhil Mehta</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-3 flex gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-[2] px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            Create Lead
          </button>
        </div>
      </form>
    </CommonDialog>
  );
}
