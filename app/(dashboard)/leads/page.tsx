'use client';

import React, { useState, useEffect } from 'react';
import {
  Filter,
  Download,
  MoreVertical,
  Edit3,
  Plus,
  Search,
  X,
  Phone,
  Building,
  Target,
  IndianRupee,
  User,
  Calendar,
  LayoutGrid,
  List,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchLeads,
  fetchLeadStatuses,
  fetchStaffDropdown,
  fetchSitesDropdown,
  createLead,
  updateLead,
  deleteLead
} from '@/redux/slices/leadSlice';
import LeadModal from '@/components/modals/LeadModal';
import CommonTable from '@/components/ui/CommonTable';

// Define Lead interface for TypeScript
interface Lead {
  _id: string;
  name: string;
  phone: string;
  site: string;
  siteId: string;
  source: 'WhatsApp' | 'Facebook' | 'Website' | 'Walk-in' | 'Referral';
  budget: string;
  stage: string;
  stageId: string;
  agent: string;
  agentId: string;
  createdAt: string;
  notes?: string;
}
import Swal from 'sweetalert2';

export default function LeadsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    leads,
    leadStatuses,
    staffDropdown,
    sitesDropdown,
    pagination,
    loading
  } = useSelector((state: RootState) => state.lead);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const currentLimit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchLeads({ page: currentPage, limit: currentLimit, search: debouncedSearch }));
  }, [dispatch, currentPage, debouncedSearch]);

  useEffect(() => {
    dispatch(fetchLeadStatuses());
    dispatch(fetchStaffDropdown());
    dispatch(fetchSitesDropdown());
  }, [dispatch]);

  const columns = [
    {
      header: 'Lead Information',
      key: 'name',
      render: (lead: Lead) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-xs border border-slate-200">
            {lead.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-xs">{lead.name}</div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Calendar size={10} />
              {lead.createdAt}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Phone',
      key: 'phone',
      render: (lead: Lead) => (        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <Phone size={12} className="text-slate-400" />
          {lead.phone}
        </div>
      )
    },
    {
      header: 'Site / Project',
      key: 'site',
      render: (lead: Lead) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <Building size={12} className="text-slate-400" />
          {lead.site}
        </div>
      )
    },
    {
      header: 'Source',
      key: 'source',
      render: (lead: Lead) => (
        <span className={cn(
          "text-[9px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 w-fit",
          lead.source === 'WhatsApp' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
          lead.source === 'Facebook' ? "bg-blue-50 text-blue-600 border border-blue-100" :
          "bg-purple-50 text-purple-600 border border-purple-100"
        )}>
          <Target size={10} />
          {lead.source}
        </span>
      )
    },
    {
      header: 'Budget',
      key: 'budget',
      render: (lead: Lead) => (
        <div className="flex items-center gap-0.5 text-xs font-semibold text-slate-800">
          <IndianRupee size={12} className="text-slate-400" />
          {lead.budget}
        </div>
      )
    },
    {
      header: 'Current Stage',
      key: 'stage',
      render: (lead: any) => {
        const status = leadStatuses.find((s: any) => s._id === lead.stageId);
        return (
          <span
            className="text-[9px] font-semibold px-2 py-0.5 rounded-full border"
            style={{
              backgroundColor: status?.color ? `${status.color}20` : '#f3f4f6',
              color: status?.color || '#6b7280',
              borderColor: status?.color ? `${status.color}40` : '#d1d5db'
            }}
          >
            {lead.stage}
          </span>
        );
      }
    },
    {
      header: 'Assigned To',
      key: 'agent',
      render: (lead: any) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium group cursor-pointer">
          <User size={12} className="text-slate-400" />
          <div className="relative w-full">
            <span className="group-hover:hidden block">{lead.agent || 'Unassigned'}</span>
            <select
              value={lead.agentId || ''}
              onChange={(e) => handleAgentChange(lead._id, e.target.value)}
              className="hidden group-hover:block bg-white border border-slate-200 rounded px-1 text-xs font-medium cursor-pointer w-full"
            >
              <option value="">Unassigned</option>
              {/* If lead has a site, show its team members */}
              {lead.siteId && (
                <>
                  {(() => {
                    // Find the site and get its team members
                    const site = sitesDropdown.find((s: any) => s._id === lead.siteId);
                    if (site?.teamId) {
                      // This is simplified - in a real app you'd fetch team members for this specific lead
                      return staffDropdown.map(staff => (
                        <option key={staff._id} value={staff._id}>{staff.name}</option>
                      ));
                    }
                    return null;
                  })()}
                </>
              )}
              {/* Fallback to all staff if no site-specific team */}
              {(!lead.siteId || !sitesDropdown.find((s: any) => s._id === lead.siteId)?.teamId) &&
                staffDropdown.map(staff => (
                  <option key={staff._id} value={staff._id}>{staff.name}</option>
                ))
              }
            </select>
          </div>
        </div>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (lead: any) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => handleOpenModal(lead)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => handleDelete(lead)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition-all"
          >
            <MoreVertical size={14} />
          </button>
        </div>
      )
    }
  ];

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('leadId', leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');

    // Find the status object by name
    const statusObj = leadStatuses.find((s: any) => s.name === stageId);
    if (statusObj) {
      try {
        await dispatch(updateLead({ id: leadId, data: { stageId: statusObj._id } })).unwrap();
      } catch (error) {
        console.error('Error updating lead stage:', error);
      }
    }
  };

  const handleDelete = async (lead: any) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${lead.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-2xl',
        title: 'text-lg font-bold text-slate-900',
        htmlContainer: 'text-sm text-slate-600',
        confirmButton: 'px-4 py-2 rounded-lg text-sm font-semibold',
        cancelButton: 'px-4 py-2 rounded-lg text-sm font-semibold'
      }
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteLead(lead._id)).unwrap();
        Swal.fire({
          title: 'Deleted!',
          text: 'Lead has been deleted successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-2xl',
            title: 'text-lg font-bold text-emerald-600'
          }
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete lead. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          customClass: {
            popup: 'rounded-2xl',
            title: 'text-lg font-bold text-red-600'
          }
        });
      }
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingLead && !editingLead.isNewWithPreSelect) {
        // This is an actual edit operation
        await dispatch(updateLead({ id: editingLead._id, data })).unwrap();
        // Refresh the leads to ensure consistent data
        dispatch(fetchLeads({ page: currentPage, limit: currentLimit, search: debouncedSearch }));
      } else {
        // This is a create operation (either from scratch or with pre-selected status)
        await dispatch(createLead(data)).unwrap();
        // Refresh the leads to ensure the agent name is properly displayed
        dispatch(fetchLeads({ page: currentPage, limit: currentLimit, search: debouncedSearch }));
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting lead:', error);
    }
  };

  const handleOpenModal = (lead: any = null) => {
    setEditingLead(lead);
    setIsAddModalOpen(true);
  };

  const handleOpenModalWithStatus = (statusName: string) => {
    // Find the status object by name
    const statusObj = leadStatuses.find((s: any) => s.name === statusName);
    if (statusObj) {
      // For new lead creation with pre-selected status, pass status info without setting as editingLead
      setEditingLead({
        stageId: statusObj._id,
        stage: statusObj.name,
        isNewWithPreSelect: true // Flag to indicate this is a new lead with pre-selected status
      });
    } else {
      setEditingLead(null);
    }
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingLead(null);
  };

  const handleAgentChange = async (leadId: string, agentId: string) => {
    try {
      await dispatch(updateLead({
        id: leadId,
        data: { agentId: agentId || null }
      })).unwrap();
    } catch (error) {
      console.error('Error updating agent:', error);
    }
  };

  const KanbanCard = ({ lead, onDragStart, onEdit, onDelete }: {
    lead: any,
    onDragStart: (e: React.DragEvent, id: string) => void,
    onEdit: (lead: any) => void,
    onDelete: (lead: any) => void
  }) => (
    <motion.div
      layoutId={lead._id}
      draggable
      onDragStart={(e: any) => onDragStart(e, lead._id)}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-grab active:cursor-grabbing group"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{lead.name}</h4>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(lead)}
            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => onDelete(lead)}
            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition-all"
          >
            <MoreVertical size={14} />
          </button>
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
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
            <button className="px-6 py-2 bg-white text-slate-900 shadow-sm rounded-xl text-sm font-bold transition-all">All Leads</button>
            <button className="px-6 py-2 text-slate-500 hover:text-slate-900 rounded-xl text-sm font-bold transition-all">My Leads</button>
            {/* <button className="px-6 py-2 text-slate-500 hover:text-slate-900 rounded-xl text-sm font-bold transition-all">Unassigned</button> */}
          </div>

          <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block" />

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button   
              onClick={() => setViewMode('table')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'table' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('kanban')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'kanban' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2.5 text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={18} />
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-200"
          >
            <Plus size={18} />
            Add New Lead
          </button>
        </div>
      </div>

      {/* Leads Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'table' ? (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CommonTable
              title="Leads Pipeline"
              columns={columns}
              data={leads}
              loading={loading}
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Search leads by name, phone or site..."
              pagination={{
                totalItems: pagination.totalRecords,
                totalPages: pagination.totalPages,
                currentPage: currentPage,
                limit: currentLimit
              }}
              onPageChange={setCurrentPage}
            />
          </motion.div>
        ) : (
          <motion.div
            key="kanban"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex gap-6 overflow-x-auto pb-8 min-h-[calc(100vh-250px)]"
          >
             {leadStatuses.map((stage: any) => (
               <div
                 key={stage._id}
                 onDragOver={handleDragOver}
                 onDrop={(e) => handleDrop(e, stage.name)}
                 className="min-w-[300px] max-w-[300px] flex flex-col gap-4"
               >
                 <div className="flex items-center justify-between px-3">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color || '#cbd5e1' }} />
                     <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{stage.name}</h3>
                     <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                       {leads.filter(l => l.stageId === stage._id).length}
                     </span>
                   </div>
                    <button
                      onClick={() => handleOpenModalWithStatus(stage.name)}
                      className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                 </div>
                 <div className="flex-1 space-y-4 p-3 bg-slate-50 rounded-[2rem] border border-slate-100/50 min-h-[500px]">
                   {leads.filter(l => l.stageId === stage._id).map(lead => (
                     <KanbanCard
                       key={lead._id}
                       lead={lead}
                       onDragStart={handleDragStart}
                       onEdit={handleOpenModal}
                       onDelete={handleDelete}
                     />
                   ))}
                   {leads.filter(l => l.stageId === stage._id).length === 0 && (
                     <div className="h-32 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center">
                       <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No leads</p>
                     </div>
                   )}
                   </div>
                 </div>
               ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Lead Modal */}
      <LeadModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        loading={loading}
        initialData={editingLead}
        leadStatuses={leadStatuses}
        sitesDropdown={sitesDropdown}
      />
    </div>
  );
}
