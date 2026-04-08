import React, { useState, useEffect } from 'react';
import CommonDialog from '@/components/ui/CommonDialog';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface StaffPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
  loading?: boolean;
  staffName?: string;
}

export default function StaffPasswordModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  loading = false,
  staffName
}: StaffPasswordModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter a new password");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    await onSubmit(password);
  };

  return (
    <CommonDialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Update Password: ${staffName || 'Staff Member'}`} 
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4 font-black text-slate-900">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 ml-1">New Password</label>
            <div className="relative group">
              <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"} 
                placeholder="New Password" 
                className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all font-bold placeholder:text-slate-300" 
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
                Update Password
              </>
            )}
          </button>
        </div>
      </form>
    </CommonDialog>
  );
}
