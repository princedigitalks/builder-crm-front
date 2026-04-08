'use client';

import React from 'react';
import CommonDialog from '@/components/ui/CommonDialog';
import { Users, User, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  staffMembers: any[];
  formData: any;
  setFormData: (data: any) => void;
}

export default function TeamModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  staffMembers,
  formData,
  setFormData
}: TeamModalProps) {
  const toggleMember = (staffId: string) => {
    const members = [...formData.members];
    const index = members.indexOf(staffId);
    if (index > -1) {
      members.splice(index, 1);
    } else {
      members.push(staffId);
    }
    setFormData({ ...formData, members });
  };

  return (
    <CommonDialog isOpen={isOpen} onClose={onClose} title={formData._id ? "Refine Team" : "Create New Team"} maxWidth="max-w-2xl">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 font-bold tracking-tight">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Team Name</label>
            <div className="relative group">
              <Users size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                required
                type="text" 
                placeholder="e.g. West Zone Sales Team" 
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all font-bold placeholder:text-slate-300" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Team Lead</label>
            <div className="relative group">
              <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
              <select 
                value={formData.leaderId}
                onChange={(e) => {
                  const newLeaderId = e.target.value;
                  // If switching leader, ensure they aren't also in members
                  const members = formData.members.filter((m: string) => m !== newLeaderId);
                  setFormData({ ...formData, leaderId: newLeaderId, members });
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold appearance-none outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all cursor-pointer"
              >
                <option value="">Select Team Lead</option>
                {staffMembers.map(staff => (
                  <option key={staff._id} value={staff._id}>{staff.fullName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Members</label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 custom-scrollbar">
              {staffMembers.filter(s => s._id !== formData.leaderId).map(staff => (
                <button
                  key={staff._id}
                  type="button"
                  onClick={() => toggleMember(staff._id)}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border text-left transition-all",
                    formData.members.includes(staff._id)
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                      : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold uppercase",
                    formData.members.includes(staff._id) ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
                  )}>
                    {staff.fullName.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <span className="text-[10px] font-bold truncate">{staff.fullName}</span>
                  {formData.members.includes(staff._id) && (
                    <CheckCircle2 size={12} className="ml-auto text-indigo-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-bold transition-all active:scale-95 text-[10px] tracking-widest"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2 text-[10px] tracking-widest"
          >
            <CheckCircle2 size={16} />
            {formData._id ? 'Save Changes' : 'Create Team'}
          </button>
        </div>
      </form>
    </CommonDialog>
  );
}
