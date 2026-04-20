'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Phone, Building2, MapPin, IndianRupee, User, Tag,
  Calendar, MessageSquare, CheckCircle2, Clock, Plus, Edit3, Loader2, Target
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchLeadById, createFollowup, updateLead, fetchLeadStatuses, fetchStaffDropdown, fetchSitesDropdown } from '@/redux/slices/leadSlice';
import { cn, formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import LeadModal from '@/components/modals/LeadModal';
import FollowupModal from '@/components/modals/FollowupModal';

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { currentLead: lead, loading, leadStatuses, staffDropdown, sitesDropdown } = useSelector((state: RootState) => state.lead);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFollowupOpen, setIsFollowupOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchLeadById(id));
      dispatch(fetchLeadStatuses());
      dispatch(fetchStaffDropdown());
      dispatch(fetchSitesDropdown());
    }
  }, [id, dispatch]);

  const handleEditSubmit = async (data: any) => {
    try {
      await dispatch(updateLead({ id: id!, data })).unwrap();
      toast.success('Lead updated successfully');
      dispatch(fetchLeadById(id!));
      setIsEditOpen(false);
    } catch (err: any) {
      toast.error(err || 'Failed to update lead');
    }
  };

  const handleFollowupSubmit = async (data: any) => {
    try {
      await dispatch(createFollowup({ leadId: id, ...data })).unwrap();
      toast.success('Followup added successfully');
      dispatch(fetchLeadById(id!));
      setIsFollowupOpen(false);
    } catch (err: any) {
      toast.error(err || 'Failed to add followup');
    }
  };

  if (loading || !lead) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin text-indigo-600" />
          <p className="text-sm text-slate-400 font-medium">Loading lead details...</p>
        </div>
      </div>
    );
  }

  const stageColor = lead.stage?.color || '#6366f1';
  const followups = lead.followups || [];
  const completedCount = followups.filter((f: any) => f.isCompleted).length;

  return (
    <div className="mx-auto space-y-5 pb-20 px-6 pt-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight leading-none mb-1">{lead.name}</h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Calendar size={11} />
              Added on {formatDate(lead.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFollowupOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Plus size={14} />
            Add Followup
          </button>
          <button
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
          >
            <Edit3 size={14} />
            Edit Lead
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-5">
        {/* Left — Lead Info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Contact Card */}
          <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg border border-indigo-100">
                {lead.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{lead.name}</p>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: `${stageColor}18`,
                    color: stageColor,
                    borderColor: `${stageColor}35`
                  }}
                >
                  {lead.stage?.name}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                  <Phone size={13} className="text-slate-400" />
                </div>
                <span className="font-medium">{lead.phone}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                  <Building2 size={13} className="text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{lead.site?.name}</p>
                  {lead.site?.city && (
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {lead.site.area}, {lead.site.city}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                  <IndianRupee size={13} className="text-slate-400" />
                </div>
                <span className="font-medium">{lead.budget || '—'}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                  <Target size={13} className="text-slate-400" />
                </div>
                <span className={cn(
                  'text-xs font-semibold px-2 py-0.5 rounded-md border',
                  lead.source === 'WhatsApp' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  lead.source === 'Facebook' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  'bg-purple-50 text-purple-600 border-purple-100'
                )}>
                  {lead.source}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                  <User size={13} className="text-slate-400" />
                </div>
                <span className="font-medium">{lead.agent?.name || 'Unassigned'}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MessageSquare size={12} /> Notes
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">{lead.notes}</p>
            </div>
          )}

          {/* Stats */}
          <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Followup Stats</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                <p className="text-2xl font-bold text-slate-900">{followups.length}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Total</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-100">
                <p className="text-2xl font-bold text-emerald-600">{completedCount}</p>
                <p className="text-[10px] text-emerald-500 font-medium mt-0.5">Completed</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-100 col-span-2">
                <p className="text-2xl font-bold text-amber-600">{followups.length - completedCount}</p>
                <p className="text-[10px] text-amber-500 font-medium mt-0.5">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Followup Timeline */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-100 rounded-xl shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Followup History</h3>
                <p className="text-xs text-slate-400 mt-0.5">{followups.length} total interactions</p>
              </div>
              <button
                onClick={() => setIsFollowupOpen(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <Plus size={13} /> Add
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[calc(100vh-280px)]">
              {followups.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-slate-100">
                    <MessageSquare size={20} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500">No followups yet</p>
                  <p className="text-xs text-slate-400 mt-1">Add the first followup to start tracking</p>
                  <button
                    onClick={() => setIsFollowupOpen(true)}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-xs font-semibold text-white hover:bg-indigo-700 transition-all mx-auto"
                  >
                    <Plus size={13} /> Add Followup
                  </button>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[18px] top-2 bottom-2 w-px bg-slate-100" />

                  <div className="space-y-4">
                    {followups.map((followup: any, idx: number) => (
                      <div key={followup._id} className="flex gap-4 relative">
                        {/* Dot */}
                        <div className={cn(
                          'w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm z-10',
                          followup.isCompleted ? 'bg-emerald-500' : 'bg-indigo-100'
                        )}>
                          {followup.isCompleted
                            ? <CheckCircle2 size={16} className="text-white" />
                            : <Clock size={14} className="text-indigo-500" />
                          }
                        </div>

                        {/* Content */}
                        <div className={cn(
                          'flex-1 rounded-xl p-4 border text-sm mb-1',
                          followup.isCompleted
                            ? 'bg-emerald-50/50 border-emerald-100'
                            : 'bg-white border-slate-100 shadow-sm'
                        )}>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={cn(
                                'text-[10px] font-bold px-2 py-0.5 rounded-full',
                                followup.isCompleted
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-indigo-100 text-indigo-700'
                              )}>
                                {followup.isCompleted ? 'Completed' : 'Pending'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                <Calendar size={10} />
                                {formatDate(followup.followupDate)}
                              </span>
                              {followup.isCompleted && followup.completedAt && (
                                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                                  <CheckCircle2 size={10} />
                                  Completed on {formatDate(followup.completedAt)}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-300 font-medium shrink-0">#{followups.length - idx}</span>
                          </div>

                          {followup.notes && (
                            <p className="text-slate-600 leading-relaxed text-sm">{followup.notes}</p>
                          )}

                          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
                            <User size={10} className="text-slate-300" />
                            <span className="text-[10px] text-slate-400 font-medium">by {followup.createdBy}</span>
                            <span className="text-slate-200 mx-1">·</span>
                            <span className="text-[10px] text-slate-400">{formatDate(followup.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <LeadModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
        loading={loading}
        initialData={lead ? {
          _id: lead._id,
          name: lead.name,
          phone: lead.phone,
          siteId: lead.site?._id,
          source: lead.source,
          budget: lead.budget,
          stageId: lead.stage?._id,
          agentId: lead.agent?._id,
          notes: lead.notes,
        } : null}
        leadStatuses={leadStatuses}
        sitesDropdown={sitesDropdown}
      />

      {/* Followup Modal */}
      <FollowupModal
        isOpen={isFollowupOpen}
        onClose={() => setIsFollowupOpen(false)}
        onSubmit={handleFollowupSubmit}
        loading={loading}
        lead={lead}
      />
    </div>
  );
}
