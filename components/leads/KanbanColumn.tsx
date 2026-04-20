'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Edit3, MoreVertical, MapPin, Loader2, MessageSquare, Eye, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchLeads } from '@/redux/slices/leadSlice';
import axios from '@/lib/axios';

interface KanbanColumnProps {
  stage: any;
  filters: any;
  activeTab: string;
  onEdit: (lead: any) => void;
  onDelete: (lead: any) => void;
  onDragStart: (e: React.DragEvent, leadId: string) => void;
  onDrop: (e: React.DragEvent, stageId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onAddLead: (stageName: string) => void;
  onAddFollowup: (lead: any) => void;
  onViewFollowups: (lead: any) => void;
}

export default function KanbanColumn({
  stage,
  filters,
  activeTab,
  onEdit,
  onDelete,
  onDragStart,
  onDrop,
  onDragOver,
  onAddLead,
  onAddFollowup,
  onViewFollowups
}: KanbanColumnProps) {
  const [leads, setLeads] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastLeadElementRef = useCallback((node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const loadLeads = async (pageNum: number, isNew: boolean = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', pageNum.toString());
      params.append('limit', '10');
      params.append('status', stage._id);
      
      if (filters.source !== 'all') params.append('source', filters.source);
      if (filters.agent !== 'all') params.append('agent', filters.agent);
      
      const filterType = activeTab !== 'all' ? activeTab : (user?.role === 'STAFF' ? 'all' : undefined);
      if (filterType) params.append('filterType', filterType);
      
      const response = await axios.get(`/lead?${params.toString()}`);
      const newLeads = response.data.data;
      
      if (isNew) {
        setLeads(newLeads);
      } else {
        setLeads(prev => [...prev, ...newLeads]);
      }
      
      setHasMore(newLeads.length === 10);
      setLoading(false);
    } catch (error) {
      console.error('Error loading leads for column:', error);
      setLoading(false);
    }
  };

  // Reload when filters or tab change
  useEffect(() => {
    setPage(1);
    loadLeads(1, true);
  }, [filters, activeTab, stage._id]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      loadLeads(page);
    }
  }, [page]);

  const handleDragOverInternal = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
    onDragOver(e);
  };

  const handleDragLeaveInternal = (e: React.DragEvent) => {
    setIsDragOver(false);
  };

  const handleDropInternal = (e: React.DragEvent) => {
    setIsDragOver(false);
    onDrop(e, stage._id);
  };

  return (
    <div className="min-w-[300px] max-w-[300px] flex flex-col gap-4">
      <div className="flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color || '#cbd5e1' }} />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{stage.name}</h3>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {leads.length}{hasMore ? '+' : ''}
          </span>
        </div>
        <button
          onClick={() => onAddLead(stage.name)}
          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      <div 
        onDragOver={handleDragOverInternal}
        onDragLeave={handleDragLeaveInternal}
        onDrop={handleDropInternal}
        className={`flex-1 space-y-4 p-3 rounded-[2rem] border transition-all duration-300 min-h-[500px] overflow-y-auto max-h-[calc(100vh-250px)] scrollbar-hide ${
          isDragOver 
            ? "bg-indigo-50/50 border-indigo-200 shadow-inner" 
            : "bg-slate-50 border-slate-100/50"
        }`}
      >
        <AnimatePresence>
        {leads.map((lead, index) => (
          <div 
            key={lead._id} 
            ref={index === leads.length - 1 ? lastLeadElementRef : null}
          >
            <motion.div
              layout
              layoutId={lead._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              draggable
              onDragStart={(e: any) => onDragStart(e, lead._id)}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 cursor-grab active:cursor-grabbing group relative overflow-hidden"
            >
              {/* Drag Indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start mb-2 relative">
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{lead.name}</h4>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
                  >
                    <Edit3 size={14} />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdownId(openDropdownId === lead._id ? null : lead._id)}
                      className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                    >
                      <MoreVertical size={14} />
                    </button>
                    
                    <AnimatePresence>
                      {openDropdownId === lead._id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)} />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 5 }}
                            className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden"
                          >
                            <button
                              onClick={() => { onAddFollowup(lead); setOpenDropdownId(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <MessageSquare size={12} className="text-indigo-500" />
                              Add Followup
                            </button>
                            <button
                              onClick={() => { onViewFollowups(lead); setOpenDropdownId(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <Eye size={12} className="text-amber-500" />
                              View Followups
                            </button>
                            <div className="h-px bg-slate-50" />
                            <button
                              onClick={() => { onDelete(lead); setOpenDropdownId(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 size={12} />
                              Delete Lead
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wider">{lead.source}</span>
                <span className="text-[10px] font-bold text-slate-900">{lead.budget}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <MapPin size={10} />
                  {lead.site}
                </div>
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[8px] font-bold text-indigo-700 border border-white shadow-sm">
                  {lead?.agent && lead.agent !== 'Unassigned' ? lead.agent.split(' ').map((n: string) => n[0]).join('') : 'U'}
                </div>
              </div>
            </motion.div>
          </div>
        ))}
        
        </AnimatePresence>
        
        {loading && (
          <div className="py-4 text-center">
            <Loader2 size={20} className="animate-spin text-indigo-500 mx-auto" />
          </div>
        )}

        {leads.length === 0 && !loading && (
          <div className="h-44 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-2 bg-white/50">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
               <Plus size={16} className="text-slate-300" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Drop Lead Here</p>
          </div>
        )}
      </div>
    </div>
  );
}
