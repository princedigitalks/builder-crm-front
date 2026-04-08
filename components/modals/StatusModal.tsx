'use client';

import React from 'react';
import CommonDialog from '@/components/ui/CommonDialog';
import { Settings2, CheckCircle2, Palette } from 'lucide-react';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: any;
  setFormData: (data: any) => void;
}

export default function StatusModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  formData,
  setFormData
}: StatusModalProps) {
  return (
    <CommonDialog isOpen={isOpen} onClose={onClose} title={formData._id ? "Edit Status" : "Add Status"} maxWidth="max-w-xl">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 font-black tracking-tight uppercase">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Status Name</label>
            <div className="relative group">
              <Settings2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                required
                type="text" 
                placeholder="e.g. Contacted" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all font-black uppercase placeholder:text-slate-300" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Status Color</label>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
              <input 
                type="color" 
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-12 h-8 cursor-pointer border-none bg-transparent"
              />
              <span className="text-[10px] font-black text-slate-500">{formData.color.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-black transition-all active:scale-95 text-[10px] tracking-widest uppercase"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black transition-all shadow-lg shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase"
          >
            <CheckCircle2 size={16} />
            {formData._id ? 'Update Status' : 'Add Status'}
          </button>
        </div>
      </form>
    </CommonDialog>
  );
}
