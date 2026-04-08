import React, { useState, useEffect } from 'react';
import CommonDialog from '@/components/ui/CommonDialog';
import { Users, Mail, Shield, Phone, Lock, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
  initialData?: any;
}

export default function StaffModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  loading = false,
  initialData
}: StaffModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    staffRole: 'Sales Manager',
    password: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.userId.fullName,
        email: initialData.userId.email,
        phone: initialData.userId.phone,
        staffRole: initialData.staffRole,
        password: ''
      });
    } else {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        staffRole: 'Sales Manager',
        password: ''
      });
    }
    setShowPassword(false);
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
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
    if (!formData.fullName || !formData.email || !formData.phone || (!initialData && !formData.password)) {
      toast.error("Please fill all required fields");
      return;
    }
    if (formData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }
    await onSubmit(formData);
  };

  return (
    <CommonDialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? "Edit Staff Member" : "Add Staff Member"} 
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 font-black text-slate-900">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 ml-1">Full Name</label>
            <div className="relative group">
              <Users size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                type="text" 
                placeholder="e.g. Rahul Sharma" 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all font-bold placeholder:text-slate-300" 
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 ml-1">Work Email</label>
            <div className="relative group">
              <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email" 
                placeholder="rahul@skylineinfra.com" 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all font-bold placeholder:text-slate-300" 
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 ml-1">Select Role</label>
            <div className="relative group">
              <Shield size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
              <select 
                name="staffRole"
                value={formData.staffRole}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold appearance-none outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all cursor-pointer"
              >
                <option value="Sales Manager">Sales Manager</option>
                <option value="Sales Executive">Sales Executive</option>
                <option value="Relationship Manager">Relationship Manager</option>
                <option value="Project Admin">Project Admin</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 ml-1">Phone Number</label>
            <div className="relative group">
              <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel" 
                placeholder="10-digit Phone Number" 
                maxLength={10}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all font-bold placeholder:text-slate-300" 
                required
              />
            </div>
          </div>

          {!initialData && (
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[9px] font-black text-slate-400 ml-1">Password</label>
              <div className="relative group">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all font-bold placeholder:text-slate-300" 
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-3">
          <button 
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-black transition-all active:scale-95 text-[10px] tracking-widest disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black transition-all shadow-lg shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2 text-[10px] tracking-widest disabled:bg-indigo-400"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={16} />
                {initialData ? "Update Staff" : "Onboard Staff"}
              </>
            )}
          </button>
        </div>
      </form>
    </CommonDialog>
  );
}
