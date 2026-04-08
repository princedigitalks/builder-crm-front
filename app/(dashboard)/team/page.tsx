'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GitMerge, 
  Plus, 
  Search, 
  MoreVertical, 
  Users, 
  User, 
  Building, 
  TrendingUp, 
  ArrowUpRight,
  LayoutGridIcon,
  List,
  Edit3,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import TeamModal from '@/components/modals/TeamModal';
import CommonTable from '@/components/ui/CommonTable';

// Mock Staff Data (should eventually come from a shared source or API)
const STAFF_MEMBERS = [
  { id: '1', name: 'Kavya Reddy' },
  { id: '2', name: 'Nikhil Mehta' },
  { id: '3', name: 'Sneha Rao' },
  { id: '4', name: 'Rahul Sharma' }
];

const MOCK_TEAMS = [
  {
    id: '1',
    name: 'North Sales Elite',
    description: 'Focusing on luxury residential projects in North Mumbai.',
    leadId: '4',
    members: ['1', '4'],
    projectCount: 3,
    performance: 94
  },
  {
    id: '2',
    name: 'Commercial Taskforce',
    description: 'Dedicated team for commercial leasing and sales.',
    leadId: '2',
    members: ['2', '3'],
    projectCount: 5,
    performance: 82
  }
];

export default function TeamsPage() {
  const [isModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    leadId: '',
    members: [] as string[]
  });

  const filteredTeams = MOCK_TEAMS.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ITEMS_PER_PAGE = 6;
  const paginatedTeams = filteredTeams.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (team: any) => {
    setFormData({
      id: team.id,
      name: team.name,
      description: team.description,
      leadId: team.leadId,
      members: [...team.members]
    });
    setIsAddModalOpen(true);
  };

  const columns = [
    {
      header: 'Team Details',
      key: 'name',
      render: (team: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/50 shadow-sm">
            <GitMerge size={20} />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 tracking-tight">{team.name}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[200px]">{team.description}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Team Lead',
      key: 'leadId',
      render: (team: any) => {
        const lead = STAFF_MEMBERS.find(s => s.id === team.leadId);
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black text-[8px] uppercase">
              {lead?.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="text-xs font-bold text-slate-700">{lead?.name || 'Unassigned'}</span>
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
            {team.members.slice(0, 3).map((mid: string) => {
              const m = STAFF_MEMBERS.find(s => s.id === mid);
              return (
                <div key={mid} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 uppercase" title={m?.name}>
                  {m?.name.split(' ').map(n => n[0]).join('')}
                </div>
              );
            })}
            {team.members.length > 3 && (
              <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[8px] font-black text-slate-400">
                +{team.members.length - 3}
              </div>
            )}
          </div>
          <span className="ml-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {team.members.length} Members
          </span>
        </div>
      )
    },
    {
      header: 'Projects',
      key: 'projectCount',
      render: (team: any) => (
        <div className="flex items-center gap-1.5 text-slate-600 font-bold text-xs">
          <Building size={14} className="text-slate-400" />
          {team.projectCount} Active
        </div>
      )
    },
    {
      header: 'Performance',
      key: 'performance',
      render: (team: any) => (
        <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 w-fit">
          <TrendingUp size={12} />
          {team.performance}%
        </div>
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
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all"
          >
            <Edit3 size={16} />
          </button>
          <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all">
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <GitMerge size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Teams</h1>
          </div>
          <p className="text-slate-500 font-medium">Organize staff into teams for direct project assignment.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2.5 rounded-lg transition-all",
                viewMode === 'grid' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutGridIcon size={18} />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={cn(
                "p-2.5 rounded-lg transition-all",
                viewMode === 'table' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <List size={18} />
            </button>
          </div>

          <button 
            onClick={() => {
              setFormData({ id: '', name: '', description: '', leadId: '', members: [] });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl shadow-indigo-200 uppercase tracking-widest"
          >
            <Plus size={20} />
            Create Team
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Teams', value: `${MOCK_TEAMS.length} Teams`, icon: GitMerge, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Avg Team Size', value: '4.2 Members', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Collective Projects', value: '18 Sites', icon: Building, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
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
            {paginatedTeams.map(team => {
              const lead = STAFF_MEMBERS.find(s => s.id === team.leadId);
              return (
                <motion.div 
                  key={team.id}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 flex flex-col gap-6 relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                        <GitMerge size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 leading-tight">{team.name}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {team.members.length} Active Members
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

                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {team.description}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Lead</span>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-[8px] font-black uppercase">
                          {lead?.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{lead?.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance</span>
                      <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                        <TrendingUp size={12} />
                        {team.performance}%
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {team.members.map((mid: string) => {
                        const m = STAFF_MEMBERS.find(s => s.id === mid);
                        return (
                          <div key={mid} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 uppercase" title={m?.name}>
                            {m?.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-1.5 text-indigo-600 font-black text-[10px] uppercase tracking-widest bg-indigo-50 px-2.5 py-1.5 rounded-xl border border-indigo-100">
                      <Building size={12} />
                      {team.projectCount} Sites
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <ArrowUpRight size={20} className="text-slate-200" />
                  </div>
                </motion.div>
              );
            })}
            
            <button 
              onClick={() => {
                setFormData({ id: '', name: '', description: '', leadId: '', members: [] });
                setIsAddModalOpen(true);
              }}
              className="h-full min-h-[300px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-all shadow-sm mb-4">
                <Plus size={32} />
              </div>
              <p className="text-lg font-black text-slate-400 group-hover:text-indigo-600 transition-all uppercase tracking-tight">Create Team</p>
              <p className="text-xs font-bold text-slate-400 mt-1 text-center px-4">Group your staff to manage project assignments more effectively.</p>
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
              data={paginatedTeams}
              loading={false}
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              onPageChange={setCurrentPage}
              pagination={{
                totalItems: filteredTeams.length,
                totalPages: Math.ceil(filteredTeams.length / ITEMS_PER_PAGE),
                currentPage: currentPage,
                limit: ITEMS_PER_PAGE
              }}
              searchPlaceholder="Filter teams..."
            />
          </motion.div>
        )}
      </AnimatePresence>

      <TeamModal 
        isOpen={isModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(e) => {
          e.preventDefault();
          setIsAddModalOpen(false);
        }}
        staffMembers={STAFF_MEMBERS}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}
