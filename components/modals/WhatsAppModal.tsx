'use client';

import React, { useState, useEffect } from 'react';
import CommonDialog from '@/components/ui/CommonDialog';
import { User, Phone, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
  initialData?: any;
}

export default function WhatsAppModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  loading = false,
  initialData 
}: WhatsAppModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
  });

  useEffect(() => {
    if (initialData) {
      // Strip 91 prefix for the UI if it exists
      const displayNum = initialData.number ? initialData.number.replace(/^91/, '') : '';
      setFormData({
        name: initialData.name || '',
        number: displayNum,
      });
    } else {
      setFormData({
        name: '',
        number: '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'number') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      if (onlyNums.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: onlyNums }));
      }
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.number) {
      toast.error("Please fill all required fields");
      return;
    }
    if (formData.number.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }
    await onSubmit(formData);
  };

  return (
    <CommonDialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? "Edit WhatsApp Number" : "Connect WhatsApp Number"} 
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 ml-1">Instance Display Name</label>
            <div className="relative group">
              <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                required
                name="name"
                type="text" 
                placeholder="e.g. Sales Primary Hub" 
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all placeholder:text-slate-300" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 ml-1">WhatsApp Business Number</label>
            <div className="relative group">
              <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                required
                name="number"
                type="tel" 
                placeholder="10-digit Phone Number" 
                maxLength={10}
                value={formData.number}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all placeholder:text-slate-300" 
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2 disabled:bg-indigo-400"
            disabled={loading}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={16} />
                {initialData ? 'Update Number' : 'Connect Number'}
              </>
            )}
          </button>
        </div>
      </form>
    </CommonDialog>
  );
}
