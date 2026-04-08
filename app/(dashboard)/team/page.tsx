'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GitMerge, 
  Plus, 
  MoreVertical, 
  Users, 
  ArrowUpRight,
  LayoutGridIcon,
  List,
  Edit3,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import TeamModal from '@/components/modals/TeamModal';
import CommonTable from '@/components/ui/CommonTable';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchTeams, fetchStaffDropdown, createTeam, updateTeam, deleteTeam } from '@/redux/slices/teamSlice';
import { toast } from 'react-hot-toast';
import _ from 'lodash';

export default function TeamsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { teams, staffDropdown, pagination, loading } = useSelector((state: RootState) => state.team);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [formData, setFormData] = useState({
    _id: '',
    teamName: '',
    leaderId: '',
    members: [] as string[]
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    _.debounce((term: string) => {
      dispatch(fetchTeams({ page: 1, limit: ITEMS_PER_PAGE, search: term }));
      setCurrentPage(1);
    }, 500),
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchTeams({ page: currentPage, limit: ITEMS_PER_PAGE, search: searchTerm }));
    dispatch(fetchStaffDropdown());
  }, [dispatch, currentPage]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (team: any) => {
    setFormData({
      _id: team._id,
      teamName: team.teamName,
      leaderId: team.leaderId?._id || team.leaderId || '',
      members: team.members?.map((m: any) => m._id || m) || []
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      try {
        await dispatch(deleteTeam(id)).unwrap();
        toast.success('Team deleted successfully');
      } catch (err: any) {
        toast.error(err || 'Failed to delete team');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await dispatch(updateTeam({ id: formData._id, data: formData })).unwrap();
        toast.success('Team updated successfully');
      } else {
        await dispatch(createTeam(formData)).unwrap();
        toast.success('Team created successfully');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err || 'Failed to save team');
    }
  };

  const columns = [
    {
      header: 'Team Details',
      key: 'teamName',
      render: (team: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/50">
             <GitMerge size={14} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-900 tracking-tight">{team.teamName}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Team Lead',
      key: 'leaderId',
      render: (team: any) => {
        const leader = team.leaderId?.userId || team.leaderId;
        const name = leader?.fullName || 'N/A';
        const initials = name.split(' ').map((n: string) => n[0]).join('');
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-[8px]">
              {initials}
            </div>
            <span className="text-xs font-medium text-slate-700">{name}</span>
          </div>
        );
      }
    },
    {
      header: 'Members',
      key: 'members',
      render: (team: any) => (
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {team.members?.slice(0, 3).map((m: any) => {
              const member = m.userId || m;
              const name = member?.fullName || 'N/A';
              const initials = name.split(' ').map((n: string) => n[0]).join('');
              return (
                <div key={m._id || m} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-semibold text-slate-400" title={name}>
                  {initials}
                </div>
              );
            })}
            {team.members?.length > 3 && (
              <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[8px] font-semibold text-slate-400">
                +{team.members.length - 3}
              </div>
            )}
          </div>
          <span className="ml-3 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
            {team.members?.length || 0} Members
          </span>
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (team: any) => (
        <span className={cn(
          "text-[9px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider border",
          team.status === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-600 border-slate-100"
        )}>
          {team.status}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (team: any) => (
        <div className="flex items-center justify-end gap-1">
          <button 
            onClick={() => handleEdit(team)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
          >
            <Edit3 size={14} />
          </button>
          <button 
            onClick={() => handleDelete(team._id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="mx-auto space-y-4 pb-20 px-6 pt-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight leading-none mb-1">Team Management</h1>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest flex items-center gap-2">
            <Users size={10} className="text-indigo-500" />
            Organize staff into teams
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 p-1 rounded-lg border border-slate-100 flex items-center">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === 'grid' ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutGridIcon size={14} />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === 'table' ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <List size={14} />
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setFormData({ _id: '', teamName: '', leaderId: '', members: [] });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all shadow-md shadow-indigo-100 uppercase tracking-wider"
          >
            <Plus size={14} />
            New Team
          </motion.button>
        </div>
      </div>

      {/* Content View Toggle */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10"
          >
            {teams.map(team => {
              const leader = team.leaderId?.userId || team.leaderId;
              const name = leader?.fullName || 'N/A';
              const initials = name.split(' ').map((n: string) => n[0]).join('');
              return (
                <motion.div 
                   key={team._id}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 flex flex-col gap-6 relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                        <GitMerge size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 leading-tight">{team.teamName}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {team.members?.length || 0} Active Members
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleEdit(team)}
                      className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team Lead</span>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-[8px] font-bold">
                          {initials}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{name}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                        <span className={cn(
                          "px-2 py-0.5 rounded",
                          team.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-600"
                        )}>
                          {team.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {team.members?.slice(0, 5).map((m: any) => {
                        const member = m.userId || m;
                        const mName = member?.fullName || 'N/A';
                        const mInitials = mName.split(' ').map((n: string) => n[0]).join('');
                        return (
                          <div key={m._id || m} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400" title={mName}>
                            {mInitials}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-[10px] uppercase tracking-widest bg-indigo-50 px-2.5 py-1.5 rounded-xl border border-indigo-100">
                      <Users size={12} />
                      Team View
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            <button 
              onClick={() => {
                setFormData({ _id: '', teamName: '', leaderId: '', members: [] });
                setIsModalOpen(true);
              }}
              className="h-full min-h-[200px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-all shadow-sm mb-4">
                <Plus size={32} />
              </div>
              <p className="text-lg font-bold text-slate-400 group-hover:text-indigo-600 transition-all uppercase tracking-tight">Create Team</p>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CommonTable 
              title="Team Directory"
              columns={columns}
              data={teams}
              loading={loading}
              searchValue={searchTerm}
              onSearchChange={handleSearch}
              onPageChange={handlePageChange}
              pagination={{
                totalItems: pagination.totalRecords,
                totalPages: pagination.totalPages,
                currentPage: pagination.currentPage,
                limit: pagination.limit
              }}
              searchPlaceholder="Filter teams by name..."
            />
          </motion.div>
        )}
      </AnimatePresence>

      <TeamModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        staffMembers={staffDropdown}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}
