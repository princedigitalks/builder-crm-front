'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Phone, 
  Shield, 
  TrendingUp, 
  IndianRupee,
  Star,
  ArrowUpRight,
  Building,
  LayoutGridIcon,
  List
} from 'lucide-react';
import { cn } from '@/lib/utils';
import StaffModal from '@/components/modals/StaffModal';
import StaffPasswordModal from '@/components/modals/StaffPasswordModal';
import CommonTable from '@/components/ui/CommonTable';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchStaff, addStaff, updateStaff, deleteStaff } from '@/redux/slices/staffSlice';
import { toast } from 'react-hot-toast';
import { Edit2, Trash2, Key } from 'lucide-react';

const MemberCard = ({ member, onEdit, onDelete, onChangePassword, onStatusChange }: { member: any, onEdit: (m: any) => void, onDelete: (id: string) => void, onChangePassword: (m: any) => void, onStatusChange: (id: string, currentStatus: string) => void }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 flex flex-col gap-6 relative overflow-hidden group"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl border border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all duration-300 shadow-sm">
            {member.userId.fullName.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div className={cn(
            "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm",
            member.userId.status === 'active' ? "bg-emerald-500" : "bg-slate-300"
          )} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">{member.userId.fullName}</h3>
          <p className="text-xs font-bold text-indigo-600 mt-1 flex items-center gap-1.5">
            <Shield size={12} />
            {member.staffRole}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onChangePassword(member)}
          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
          title="Change Password"
        >
          <Key size={16} />
        </button>
        <button 
          onClick={() => onEdit(member)}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
          title="Edit"
        >
          <Edit2 size={16} />
        </button>
        <button 
          onClick={() => onDelete(member._id)}
          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>

    <div className="space-y-3 font-semibold">
      <div className="flex items-center gap-2 text-xs text-slate-500 font-bold overflow-hidden">
        <Mail size={14} className="text-slate-400 shrink-0" />
        <span className="truncate">{member.userId.email}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
        <Phone size={14} className="text-slate-400 shrink-0" />
        {member.userId.phone}
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
        <Building size={14} className="text-slate-400 shrink-0" />
        <div className="flex flex-wrap gap-1">
           <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md text-[10px] text-slate-600 font-bold">
              All Sites
            </span>
        </div>
      </div>
    </div>

    <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between">
      <div>
        <p className="text-[10px] font-bold text-slate-400 mb-1">Account Status</p>
        <div className="flex items-center gap-2">
           <span className={cn(
             "text-xs font-black",
             member.userId.status === 'active' ? "text-emerald-600" : "text-slate-400"
           )}>
             {member.userId.status === 'active' ? 'Active' : 'Inactive'}
           </span>
        </div>
      </div>
      
      <button 
        onClick={() => onStatusChange(member._id, member.userId.status)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none",
          member.userId.status === 'active' ? "bg-emerald-500" : "bg-slate-200"
        )}
      >
        <div className={cn(
          "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200",
          member.userId.status === 'active' ? "translate-x-5" : "translate-x-0"
        )} />
      </button>
    </div>
  </motion.div>
);

export default function StaffPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { staffList, loading, pagination } = useSelector((state: RootState) => state.staff);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [passwordStaff, setPasswordStaff] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const currentLimit = 6;

  // Debouncing logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchStaff({ page: currentPage, limit: currentLimit, search: debouncedSearch }));
  }, [dispatch, currentPage, debouncedSearch]);

  const handleAddStaff = async (data: any) => {
    try {
      if (editingStaff) {
        const resultAction = await dispatch(updateStaff({ id: editingStaff._id, data }));
        if (updateStaff.fulfilled.match(resultAction)) {
          toast.success("Staff member updated successfully!");
          setIsAddModalOpen(false);
          setEditingStaff(null);
          dispatch(fetchStaff({ page: currentPage, limit: currentLimit, search: debouncedSearch }));
        } else {
          toast.error(resultAction.payload as string || "Failed to update staff member");
        }
        return;
      }

      const resultAction = await dispatch(addStaff(data));
      if (addStaff.fulfilled.match(resultAction)) {
        toast.success("Staff member added successfully!");
        setIsAddModalOpen(false);
        dispatch(fetchStaff({ page: currentPage, limit: currentLimit, search: debouncedSearch }));
      } else {
        toast.error(resultAction.payload as string || "Failed to add staff member");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleEdit = (member: any) => {
    setEditingStaff(member);
    setIsAddModalOpen(true);
  };

  const handlePasswordChangeRequest = (member: any) => {
    setPasswordStaff(member);
    setIsPasswordModalOpen(true);
  };

  const handlePasswordUpdate = async (password: string) => {
    try {
      const resultAction = await dispatch(updateStaff({ id: passwordStaff._id, data: { password } }));
      if (updateStaff.fulfilled.match(resultAction)) {
        toast.success("Password updated successfully!");
        setIsPasswordModalOpen(false);
        setPasswordStaff(null);
      } else {
        toast.error(resultAction.payload as string || "Failed to update password");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const resultAction = await dispatch(updateStaff({ id, data: { status: newStatus } }));
      if (updateStaff.fulfilled.match(resultAction)) {
        toast.success(`Staff member ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
        dispatch(fetchStaff({ page: currentPage, limit: currentLimit, search: debouncedSearch }));
      } else {
        toast.error(resultAction.payload as string || "Failed to update status");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        const resultAction = await dispatch(deleteStaff(id));
        if (deleteStaff.fulfilled.match(resultAction)) {
          toast.success("Staff member deleted successfully!");
          dispatch(fetchStaff({ page: currentPage, limit: currentLimit, search: debouncedSearch }));
        } else {
          toast.error(resultAction.payload as string || "Failed to delete staff member");
        }
      } catch (err) {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const columns = [
    {
      header: 'Member Information',
      key: 'name',
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-[10px] border border-slate-200">
            {item.userId.fullName.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900 tracking-tight">{item.userId.fullName}</div>
            <div className="text-[10px] font-bold text-slate-400">{item.userId.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Staff Role',
      key: 'role',
      render: (item: any) => (
        <div className="text-[10px] font-black text-indigo-600 flex items-center gap-1.5">
          <Shield size={10} /> {item.staffRole}
        </div>
      )
    },
    {
      header: 'Contact',
      key: 'phone',
      render: (item: any) => (
        <div className="text-[11px] font-black text-slate-600 tracking-widest">
          {item.userId.phone}
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              item.userId.status === 'active' ? "bg-emerald-500" : "bg-slate-300"
            )} />
            <span className={cn(
              "text-[9px] font-bold",
              item.userId.status === 'active' ? "text-emerald-600" : "text-slate-400"
            )}>
              {item.userId.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
          <button 
            onClick={() => handleStatusToggle(item._id, item.userId.status)}
            className={cn(
              "relative w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none",
              item.userId.status === 'active' ? "bg-emerald-500" : "bg-slate-200"
            )}
          >
            <div className={cn(
              "absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200",
              item.userId.status === 'active' ? "translate-x-4" : "translate-x-0"
            )} />
          </button>
        </div>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (item: any) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => handlePasswordChangeRequest(item)}
            className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
            title="Change Password"
          >
            <Key size={16} />
          </button>
          <button 
            onClick={() => handleEdit(item)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => handleDelete(item._id)}
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            title="Delete"
          >
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
              <Users size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Management</h1>
          </div>
          <p className="text-slate-500 font-semibold">Manage user roles, site-wise assignments and track performance.</p>
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
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl shadow-indigo-200 active:scale-95"
          >
            <UserPlus size={20} />
            Add Staff
          </button>
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
            {staffList.map((member: any) => (
              <MemberCard 
                key={member._id} 
                member={member} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
                onChangePassword={handlePasswordChangeRequest}
                onStatusChange={handleStatusToggle}
              />
            ))}
            
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="h-full min-h-[340px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-all shadow-sm mb-4">
                <UserPlus size={32} />
              </div>
              <p className="text-lg font-black text-slate-400 group-hover:text-indigo-600 transition-all">Add New Staff</p>
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
              data={staffList}
              loading={loading}
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              onPageChange={setCurrentPage}
              pagination={{
                totalItems: pagination.totalRecords,
                totalPages: pagination.totalPages,
                currentPage: currentPage,
                limit: currentLimit
              }}
              searchPlaceholder="Filter workforce..."
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Member Modal */}
      <StaffModal 
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingStaff(null);
        }}
        onSubmit={handleAddStaff}
        loading={loading}
        initialData={editingStaff}
      />

      <StaffPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPasswordStaff(null);
        }}
        onSubmit={handlePasswordUpdate}
        loading={loading}
        staffName={passwordStaff?.userId?.fullName}
      />
    </div>
  );
}
