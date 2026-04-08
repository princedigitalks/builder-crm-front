'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Building, 
  Shield, 
  TrendingUp, 
  CheckCircle2, 
  X,
  IndianRupee,
  Star,
  ArrowUpRight,
  Briefcase,
  LayoutGridIcon,
  List
} from 'lucide-react';
import { cn } from '@/lib/utils';
import StaffModal from '@/components/modals/StaffModal';
import CommonTable from '@/components/ui/CommonTable';

const STAFF_MEMBERS = [
  {
    id: 1,
    name: 'Kavya Reddy',
    role: 'Senior Sales Manager',
    email: 'kavya@skylineinfra.com',
    phone: '+91 98765 43210',
    sites: ['Skyline Heights', 'Skyline Grand'],
    performance: 92,
    dealsClosed: 14,
    status: 'online',
    image: null
  },
  {
    id: 2,
    name: 'Nikhil Mehta',
    role: 'Sales Executive',
    email: 'nikhil@skylineinfra.com',
    phone: '+91 98765 43211',
    sites: ['Skyline Heights'],
    performance: 78,
    dealsClosed: 8,
    status: 'offline',
    image: null
  },
  {
    id: 3,
    name: 'Sneha Rao',
    role: 'Relationship Manager',
    email: 'sneha@skylineinfra.com',
    phone: '+91 98765 43212',
    sites: ['Ocean View Residency'],
    performance: 85,
    dealsClosed: 11,
    status: 'online',
    image: null
  },
  {
    id: 4,
    name: 'Rahul Sharma',
    role: 'Sales Lead',
    email: 'rahul@skylineinfra.com',
    phone: '+91 98765 43213',
    sites: ['Skyline Grand', 'Ocean View'],
    performance: 95,
    dealsClosed: 22,
    status: 'away',
    image: null
  }
];

const PerformanceBadge = ({ score }: { score: number }) => {
  const color = score >= 90 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                score >= 80 ? 'text-indigo-600 bg-indigo-50 border-indigo-100' :
                'text-amber-600 bg-amber-50 border-amber-100';
  
  return (
    <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold text-[10px] uppercase tracking-wider", color)}>
      <TrendingUp size={12} />
      {score}% Performance
    </div>
  );
};

const MemberCard = ({ member }: { member: typeof STAFF_MEMBERS[0] }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 flex flex-col gap-6 relative overflow-hidden group"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl border border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all duration-300 shadow-sm">
            {member.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className={cn(
            "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm",
            member.status === 'online' ? "bg-emerald-500" :
            member.status === 'away' ? "bg-amber-500" : "bg-slate-300"
          )} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">{member.name}</h3>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1 flex items-center gap-1.5">
            <Shield size={12} />
            {member.role}
          </p>
        </div>
      </div>
      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
        <MoreVertical size={18} />
      </button>
    </div>

    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Mail size={14} className="text-slate-400" />
        {member.email}
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Phone size={14} className="text-slate-400" />
        {member.phone}
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Building size={14} className="text-slate-400" />
        <div className="flex flex-wrap gap-1">
          {member.sites.map((site, i) => (
            <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md text-[10px] text-slate-600 font-bold">
              {site}
            </span>
          ))}
        </div>
      </div>
    </div>

    <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Deals Closed</p>
        <p className="text-lg font-bold text-slate-900">{member.dealsClosed}</p>
      </div>
      <PerformanceBadge score={member.performance} />
    </div>

    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
       <ArrowUpRight size={20} className="text-slate-200" />
    </div>
  </motion.div>
);

export default function StaffPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMembers = STAFF_MEMBERS.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ITEMS_PER_PAGE = 6;
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const columns = [
    {
      header: 'Member Information',
      key: 'name',
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-[10px] border border-slate-200 uppercase">
            {item.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900 tracking-tight">{item.name}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Role & Status',
      key: 'role',
      render: (item: any) => (
        <div className="space-y-1">
          <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
            <Shield size={10} /> {item.role}
          </div>
          <div className="flex items-center gap-1.5">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              item.status === 'online' ? "bg-emerald-500" :
              item.status === 'away' ? "bg-amber-500" : "bg-slate-300"
            )} />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.status}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Contact',
      key: 'phone',
      render: (item: any) => (
        <div className="text-[11px] font-black text-slate-600 tracking-widest">
          {item.phone}
        </div>
      )
    },
    {
      header: 'Assigned Sites',
      key: 'sites',
      render: (item: any) => (
        <div className="flex flex-wrap gap-1">
          {item.sites.map((site: string, i: number) => (
            <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md text-[9px] text-slate-500 font-black uppercase tracking-tighter">
              {site}
            </span>
          ))}
        </div>
      )
    },
    {
      header: 'Performance',
      key: 'performance',
      render: (item: any) => (
        <div className="flex flex-col gap-1.5 min-w-[100px]">
          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
            <span className="text-slate-400">Score</span>
            <span className="text-indigo-600">{item.performance}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full" 
              style={{ width: `${item.performance}%` }} 
            />
          </div>
        </div>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: () => (
        <button className="p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
          <MoreVertical size={16} />
        </button>
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
              <Users size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Management</h1>
          </div>
          <p className="text-slate-500 font-medium">Manage user roles, site-wise assignments and track performance.</p>
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
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl shadow-indigo-200 uppercase tracking-widest"
          >
            <UserPlus size={20} />
            Add Staff
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Staff', value: `${STAFF_MEMBERS.length} Members`, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Avg Performance', value: '86%', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Active Sites', value: '12 Projects', icon: Building, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Revenue Generated', value: '₹14.2Cr', icon: IndianRupee, color: 'text-blue-600', bg: 'bg-blue-50' },
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
            {paginatedMembers.map(member => (
              <MemberCard key={member.id} member={member} />
            ))}
            
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="h-full min-h-[340px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-all shadow-sm mb-4">
                <UserPlus size={32} />
              </div>
              <p className="text-lg font-black text-slate-400 group-hover:text-indigo-600 transition-all uppercase tracking-tight">Add New Staff</p>
              <p className="text-xs font-bold text-slate-400 mt-1 text-center">Onboard a new sales executive or manager to your staff.</p>
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
              title="Staff Directory"
              columns={columns}
              data={paginatedMembers}
              loading={false}
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              onPageChange={setCurrentPage}
              pagination={{
                totalItems: filteredMembers.length,
                totalPages: Math.ceil(filteredMembers.length / ITEMS_PER_PAGE),
                currentPage: currentPage,
                limit: ITEMS_PER_PAGE
              }}
              searchPlaceholder="Filter workforce..."
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Member Modal */}
      <StaffModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(e) => {
          e.preventDefault();
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
}
