'use client';

import React, { useState, useEffect } from 'react';
import CommonDialog from '@/components/ui/CommonDialog';
import { User, Phone, Building, Target, IndianRupee, Users } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchSiteTeamMembers } from '@/redux/slices/leadSlice';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading?: boolean;
  initialData?: any;
  leadStatuses?: any[];
  sitesDropdown?: any[];
}

export default function LeadModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  initialData = null,
  leadStatuses = [],
  sitesDropdown = []
}: LeadModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { siteTeamMembers } = useSelector((state: RootState) => state.lead);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    siteId: '',
    source: 'WhatsApp',
    budget: '',
    stageId: '',
    agentId: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        phone: initialData.phone || '',
        siteId: initialData.siteId || '',
        source: initialData.source || 'WhatsApp',
        budget: initialData.budget || '',
        stageId: initialData.stageId || '',
        agentId: initialData.agentId || '',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        siteId: '',
        source: 'WhatsApp',
        budget: '',
        stageId: '',
        agentId: '',
        notes: ''
      });
    }
  }, [initialData, isOpen]);

  // Fetch team members when site changes and auto-select team leader
  useEffect(() => {
    if (formData.siteId && isOpen) {
      dispatch(fetchSiteTeamMembers(formData.siteId));
    }
  }, [formData.siteId, dispatch, isOpen]);

  // Auto-select team leader when team members are loaded
  useEffect(() => {
    if (siteTeamMembers.leader && !formData.agentId && isOpen) {
      setFormData(prev => ({
        ...prev,
        agentId: siteTeamMembers.leader._id
      }));
    }
  }, [siteTeamMembers.leader, formData.agentId, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <CommonDialog
      isOpen={isOpen}
      onClose={onClose}
      title={initialData && !initialData.isNewWithPreSelect ? "Edit Lead" : "Add New Lead"}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 uppercase font-black tracking-tight">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group">
              <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all uppercase"
                required
              />
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
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all tracking-[0.1em]"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Site / Project</label>
            <div className="relative group">
              <Building size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
              <select
                value={formData.siteId}
                onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all appearance-none uppercase cursor-pointer"
                required
              >
                <option value="">Select Site</option>
                {sitesDropdown.map(site => (
                  <option key={site._id} value={site._id}>{site.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Source</label>
            <div className="relative group">
              <Target size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all appearance-none uppercase cursor-pointer"
                required
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Facebook">Facebook</option>
                <option value="Website">Website</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Budget Range</label>
            <div className="relative group">
              <IndianRupee size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="e.g. ₹80L - ₹1Cr"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all uppercase"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Stage</label>
            <div className="relative group">
              <Users size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
              <select
                value={formData.stageId}
                onChange={(e) => setFormData({ ...formData, stageId: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all appearance-none uppercase cursor-pointer"
                required
              >
                <option value="">Select Stage</option>
                {leadStatuses.map(status => (
                  <option key={status._id} value={status._id}>{status.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Agent</label>
            <div className="relative group">
              <Users size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
              <select
                value={formData.agentId}
                onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all appearance-none uppercase cursor-pointer"
              >
                <option value="">Unassigned</option>
                {siteTeamMembers.leader && (
                  <option key={siteTeamMembers.leader._id} value={siteTeamMembers.leader._id}>
                    {siteTeamMembers.leader.name} (Team Leader)
                  </option>
                )}
                {siteTeamMembers.members.map(member => (
                  <option key={member._id} value={member._id}>
                    {member.name} (Team Member)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Notes (Optional)</label>
          <textarea
            placeholder="Any additional notes about this lead..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all resize-none"
          />
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
            disabled={loading}
            className="flex-[2] px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            {loading ? 'Saving...' : (initialData && !initialData.isNewWithPreSelect ? 'Update Lead' : 'Create Lead')}
          </button>
        </div>
      </form>
    </CommonDialog>
  );
}
