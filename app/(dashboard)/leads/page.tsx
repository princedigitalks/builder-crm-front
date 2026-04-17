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
  MapPin,
  ChevronDown,
  MessageSquare,
  Eye,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatDate } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchLeads,
  fetchLeadStatuses,
  fetchStaffDropdown,
  fetchSitesDropdown,
  createLead,
  updateLead,
  deleteLead,
  createFollowup,
  fetchLeadFollowups,
  exportLeads
} from '@/redux/slices/leadSlice';
import LeadModal from '@/components/modals/LeadModal';
import FollowupModal from '@/components/modals/FollowupModal';
import ViewFollowupsModal from '@/components/modals/ViewFollowupsModal';
import CommonTable from '@/components/ui/CommonTable';
import LeadImportModal from '@/components/modals/LeadImportModal';
import KanbanColumn from '@/components/leads/KanbanColumn';

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

  // Import/Export state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Followup related state
  const [isFollowupModalOpen, setIsFollowupModalOpen] = useState(false);
  const [selectedLeadForFollowup, setSelectedLeadForFollowup] = useState<any>(null);
  const [isViewFollowupsModalOpen, setIsViewFollowupsModalOpen] = useState(false);
  const [selectedLeadForView, setSelectedLeadForView] = useState<any>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Filter states
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'team'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    source: 'all',
    agent: 'all',
    site: 'all'
  });

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchLeads({
      page: currentPage,
      limit: currentLimit,
      search: debouncedSearch,
      status: filters.status !== 'all' ? filters.status : undefined,
      source: filters.source !== 'all' ? filters.source : undefined,
      agent: filters.agent !== 'all' ? filters.agent : undefined,
      site: filters.site !== 'all' ? filters.site : undefined,
      filterType: activeTab !== 'all' ? activeTab : (user?.role === 'STAFF' ? 'all' : undefined)
    }));
  }, [dispatch, currentPage, debouncedSearch, filters, activeTab, user]);

  useEffect(() => {
    dispatch(fetchLeadStatuses());
    dispatch(fetchStaffDropdown());
    dispatch(fetchSitesDropdown());
  }, [dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownId && !(event.target as Element).closest('.dropdown-container')) {
        setOpenDropdownId(null);
      }
      if (isFilterOpen && !(event.target as Element).closest('.filter-container')) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdownId, isFilterOpen]);

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
            <div className="font-semibold text-slate-900 text-sm">{lead.name}</div>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
              <Calendar size={11} />
              {formatDate(lead.createdAt)}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Phone',
      key: 'phone',
      render: (lead: Lead) => (
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <Phone size={13} className="text-slate-400" />
          {lead.phone}
        </div>
      )
    },
    {
      header: 'Site / Project',
      key: 'site',
      render: (lead: Lead) => (
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <Building size={13} className="text-slate-400" />
          {lead.site}
        </div>
      )
    },
    {
      header: 'Source',
      key: 'source',
      render: (lead: Lead) => (
        <span className={cn(
          "text-xs font-medium px-2 py-0.5 rounded-md flex items-center gap-1 w-fit border",
          lead.source === 'WhatsApp' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
          lead.source === 'Facebook' ? "bg-blue-50 text-blue-600 border-blue-100" :
          "bg-purple-50 text-purple-600 border-purple-100"
        )}>
          <Target size={11} />
          {lead.source}
        </span>
      )
    },
    {
      header: 'Budget',
      key: 'budget',
      render: (lead: Lead) => (
        <div className="flex items-center gap-0.5 text-sm font-semibold text-slate-800">
          <IndianRupee size={13} className="text-slate-400" />
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
            className="text-xs font-medium px-2 py-0.5 rounded-full border"
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
        <div className="flex items-center gap-1.5">
          <User size={13} className="text-slate-400 shrink-0" />
          <select
            value={lead.agentId || ''}
            onChange={(e) => handleAgentChange(lead._id, e.target.value)}
            className="bg-transparent text-sm text-slate-600 font-medium cursor-pointer border-0 outline-none focus:ring-0 max-w-[120px] truncate"
          >
            <option value="">Unassigned</option>
            {staffDropdown.map(staff => (
              <option key={staff._id} value={staff._id}>{staff.name}</option>
            ))}
          </select>
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
          <div className="relative dropdown-container">
            <button
              onClick={() => toggleDropdown(lead._id)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
            >
              <MoreVertical size={14} />
            </button>
            {openDropdownId === lead._id && (
              <div className="fixed z-50 w-44 bg-white border border-slate-200 rounded-xl shadow-xl"
                style={{
                  top: (() => {
                    const el = document.querySelector(`[data-lead-id="${lead._id}"]`);
                    if (!el) return 'auto';
                    const rect = el.getBoundingClientRect();
                    const spaceBelow = window.innerHeight - rect.bottom;
                    return spaceBelow < 140 ? `${rect.top - 140}px` : `${rect.bottom + 4}px`;
                  })(),
                  right: '24px'
                }}
              >
                <button
                  onClick={() => { handleOpenFollowupModal(lead); setOpenDropdownId(null); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors rounded-t-xl"
                >
                  <MessageSquare size={14} />
                  Add Followup
                </button>
                <button
                  onClick={() => { handleOpenViewFollowupsModal(lead); setOpenDropdownId(null); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Eye size={14} />
                  View Followups
                </button>
                <button
                  onClick={() => { handleDelete(lead); setOpenDropdownId(null); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors rounded-b-xl"
                >
                  <X size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
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

  const handleExport = async () => {
    setExporting(true);
    await dispatch(exportLeads({
      search: debouncedSearch,
      status: filters.status,
      source: filters.source,
      agent: filters.agent,
    }));
    setExporting(false);
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

  const toggleDropdown = (leadId: string) => {
    setOpenDropdownId(openDropdownId === leadId ? null : leadId);
  };

  const handleOpenFollowupModal = (lead: any) => {
    setSelectedLeadForFollowup(lead);
    setIsFollowupModalOpen(true);
  };

  const handleOpenViewFollowupsModal = (lead: any) => {
    setSelectedLeadForView(lead);
    dispatch(fetchLeadFollowups(lead._id));
    setIsViewFollowupsModalOpen(true);
  };

  const handleFollowupSubmit = async (data: any) => {
    try {
      await dispatch(createFollowup({
        leadId: selectedLeadForFollowup._id,
        followupDate: data.followupDate,
        followupTime: data.followupTime,
        notes: data.notes
      })).unwrap();

      // Close modal and reset state
      setIsFollowupModalOpen(false);
      setSelectedLeadForFollowup(null);

      Swal.fire({
        title: 'Success!',
        text: 'Followup created successfully with reminder set.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error creating followup:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to create followup. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      });
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
          {user?.role === 'STAFF' && (
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
              <button 
                onClick={() => setActiveTab('all')}
                className={cn(
                  "px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all",
                  activeTab === 'all' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
              >
                All
              </button>
              <button 
                onClick={() => setActiveTab('my')}
                className={cn(
                  "px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all",
                  activeTab === 'my' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
              >
                My Leads
              </button>
              <button 
                onClick={() => setActiveTab('team')}
                className={cn(
                  "px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all",
                  activeTab === 'team' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
              >
                Team Leads
              </button>
            </div>
          )}

          {user?.role === 'STAFF' && <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block" />}

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
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2",
                (filters.status !== 'all' || filters.source !== 'all' || filters.agent !== 'all' || filters.site !== 'all') && "border-indigo-300 bg-indigo-50"
              )}
            >
              <Filter size={18} className={(filters.status !== 'all' || filters.source !== 'all' || filters.agent !== 'all' || filters.site !== 'all') ? "text-indigo-600" : "text-slate-500"} />
              {(filters.status !== 'all' || filters.source !== 'all' || filters.agent !== 'all' || filters.site !== 'all') && (
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              )}
            </button>

            {isFilterOpen && (
              <div className="filter-container absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Filters</h3>
                  <button
                    onClick={() => {
                      setFilters({ status: 'all', source: 'all', agent: 'all', site: 'all' });
                      setCurrentPage(1);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                  >
                    Clear all
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Statuses</option>
                      {leadStatuses.map((status: any) => (
                        <option key={status._id} value={status._id}>{status.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Source Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Source</label>
                    <select
                      value={filters.source}
                      onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Sources</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Website">Website</option>
                      <option value="Walk-in">Walk-in</option>
                      <option value="Referral">Referral</option>
                    </select>
                  </div>

                  {/* Site Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Project Site</label>
                    <select
                      value={filters.site}
                      onChange={(e) => setFilters(prev => ({ ...prev, site: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Sites</option>
                      {sitesDropdown.map((site: any) => (
                        <option key={site._id} value={site._id}>{site.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Agent Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Assigned To</label>
                    <select
                      value={filters.agent}
                      onChange={(e) => setFilters(prev => ({ ...prev, agent: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Agents</option>
                      <option value="unassigned">Unassigned</option>
                      {staffDropdown.map((staff: any) => (
                        <option key={staff._id} value={staff._id}>{staff.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsFilterOpen(false);
                      setCurrentPage(1);
                    }}
                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-60"
          >
            <Download size={16} />
            {exporting ? 'Exporting...' : 'Export'}
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <Upload size={16} />
            Import
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
            className="flex gap-6 overflow-x-auto pb-4 min-h-[calc(100vh-250px)]"
          >
            {leadStatuses.map((stage: any) => (
              <KanbanColumn
                key={stage._id}
                stage={stage}
                filters={filters}
                activeTab={activeTab}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                onDragStart={handleDragStart}
                onAddLead={handleOpenModalWithStatus}
                onAddFollowup={handleOpenFollowupModal}
                onViewFollowups={handleOpenViewFollowupsModal}
              />
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

      {/* Add Followup Modal */}
      <FollowupModal
        isOpen={isFollowupModalOpen}
        onClose={() => {
          setIsFollowupModalOpen(false);
          setSelectedLeadForFollowup(null);
        }}
        onSubmit={handleFollowupSubmit}
        loading={loading}
        lead={selectedLeadForFollowup}
      />

      {/* View Followups Modal */}
      <ViewFollowupsModal
        isOpen={isViewFollowupsModalOpen}
        onClose={() => {
          setIsViewFollowupsModalOpen(false);
          setSelectedLeadForView(null);
        }}
        lead={selectedLeadForView}
      />

      {/* Import Leads Modal */}
      <LeadImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
}
