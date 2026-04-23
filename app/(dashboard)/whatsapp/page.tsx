'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Smartphone,
  Phone,
  CheckCircle2,
  Edit3,
  Trash2,
  LayoutGridIcon,
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchWhatsapp, addWhatsapp, updateWhatsapp, deleteWhatsapp } from '@/redux/slices/whatsappSlice';
import { toast } from 'react-hot-toast';
import WhatsAppModal from '@/components/modals/WhatsAppModal';
import CommonTable from '@/components/ui/CommonTable';

const NumberCard = ({ num, onEdit, onDelete }: { num: any, onEdit: (n: any) => void, onDelete: (id: string) => void }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-4 relative overflow-hidden group"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold text-lg border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
           <MessageSquare size={20} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 leading-tight">{num.name}</h3>
          <p className="text-[10px] font-medium text-indigo-600 mt-1 flex items-center gap-1.5 uppercase tracking-wider">
            <Smartphone size={10} />
            Business Hub
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(num)}
          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
        >
          <Edit3 size={14} />
        </button>
        <button 
          onClick={() => onDelete(num._id)}
          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Phone size={12} className="text-slate-400 shrink-0" />
        <span className="tracking-wider">+91 {num.number}</span>
      </div>
    </div>

    <div className="pt-3 mt-auto border-t border-slate-50 flex items-center justify-between">
      <div>
        <p className="text-[9px] font-medium text-slate-400 mb-0.5 uppercase tracking-wider">Status</p>
        <span className={cn(
          "inline-flex items-center gap-1.5 text-[9px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider border",
          num.isActive ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-slate-400 bg-slate-50 border-slate-100"
        )}>
          <span className={cn("w-1 h-1 rounded-full", num.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
          {num.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  </motion.div>
);

export default function WhatsAppPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { whatsappList, loading, pagination } = useSelector((state: RootState) => state.whatsapp);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNumber, setEditingNumber] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const currentLimit = 6;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchWhatsapp({ page: currentPage, limit: currentLimit, search: debouncedSearch }));
  }, [dispatch, currentPage, debouncedSearch]);

  const handleOpenModal = (num: any = null) => {
    setEditingNumber(num);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNumber(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingNumber) {
        const resultAction = await dispatch(updateWhatsapp({ id: editingNumber._id, data }));
        if (updateWhatsapp.fulfilled.match(resultAction)) {
          toast.success("WhatsApp number updated successfully!");
          handleCloseModal();
          dispatch(fetchWhatsapp({ page: currentPage, limit: currentLimit, search: debouncedSearch }));
        } else {
          toast.error(resultAction.payload as string || "Failed to update WhatsApp number");
        }
      } else {
        const resultAction = await dispatch(addWhatsapp(data));
        if (addWhatsapp.fulfilled.match(resultAction)) {
          toast.success("WhatsApp number added successfully!");
          handleCloseModal();
          dispatch(fetchWhatsapp({ page: currentPage, limit: currentLimit, search: debouncedSearch }));
        } else {
          toast.error(resultAction.payload as string || "Failed to add WhatsApp number");
        }
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this WhatsApp number?")) {
      try {
        const resultAction = await dispatch(deleteWhatsapp(id));
        if (deleteWhatsapp.fulfilled.match(resultAction)) {
          toast.success("WhatsApp number deleted successfully!");
          dispatch(fetchWhatsapp({ page: currentPage, limit: currentLimit, search: debouncedSearch }));
        } else {
          toast.error(resultAction.payload as string || "Failed to delete WhatsApp number");
        }
      } catch (err) {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      const resultAction = await dispatch(updateWhatsapp({ id, data: { isActive: newStatus } }));
      if (updateWhatsapp.fulfilled.match(resultAction)) {
        toast.success(`Hub ${newStatus ? 'activated' : 'deactivated'} successfully!`);
        dispatch(fetchWhatsapp({ page: currentPage, limit: currentLimit, search: debouncedSearch }));
      } else {
        toast.error(resultAction.payload as string || "Failed to update status");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  const columns = [
    {
      header: 'Number Name',
      key: 'name',
      render: (num: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/50">
             <MessageSquare size={14} />
          </div>
          <span className="font-semibold text-slate-900 text-sm block">{num.name}</span>
        </div>
      )
    },
    {
      header: 'Phone Number',
      key: 'number',
      render: (num: any) => (
        <div className="text-sm text-slate-600">
          {num.number}
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (num: any) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 min-w-[70px]">
            <div className={cn(
              "w-1 h-1 rounded-full",
              num.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
            )} />
            <span className={cn(
              "text-sm",
              num.isActive ? "text-emerald-600" : "text-slate-400"
            )}>
              {num.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <button 
            onClick={() => handleStatusToggle(num._id, num.isActive)}
            className={cn(
              "relative w-8 h-4.5 rounded-full transition-colors duration-200 focus:outline-none",
              num.isActive ? "bg-emerald-500" : "bg-slate-200"
            )}
          >
            <div className={cn(
              "absolute top-0.5 left-0.5 bg-white w-3.5 h-3.5 rounded-full transition-transform duration-200",
              num.isActive ? "translate-x-3.5" : "translate-x-0"
            )} />
          </button>
        </div>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (num: any) => (
        <div className="flex items-center justify-end gap-1">
          <button 
            onClick={() => handleOpenModal(num)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
          >
            <Edit3 size={14} />
          </button>
          <button 
            onClick={() => handleDelete(num._id)}
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
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight leading-none mb-1">WhatsApp Numbers</h1>
          {/* <p className="text-xs text-slate-400 flex items-center gap-2">
            <MessageSquare size={12} className="text-indigo-500" />
            Business Communication Management
          </p> */}
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
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-md shadow-indigo-100"
          >
            <Plus size={14} />
            New Hub
          </motion.button>
        </div>
      </div>

      {/* Grid or Table View */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10"
          >
            {whatsappList.map((num: any) => (
              <NumberCard 
                key={num._id} 
                num={num} 
                onEdit={handleOpenModal} 
                onDelete={handleDelete} 
              />
            ))}
            
            <button 
              onClick={() => handleOpenModal()}
              className="h-full min-h-[220px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-all shadow-sm mb-4">
                <Plus size={32} />
              </div>
              <p className="text-lg font-black text-slate-400 group-hover:text-indigo-600 transition-all uppercase tracking-widest">Connect New Hub</p>
              <p className="text-xs font-bold text-slate-400 mt-1 text-center">Add another business number for communication.</p>
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
              title="WhatsApp Directory"
              columns={columns}
              data={whatsappList}
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
              searchPlaceholder="Filter instances..."
            />
          </motion.div>
        )}
      </AnimatePresence>

      <WhatsAppModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        loading={loading}
        initialData={editingNumber}
      />
    </div>
  );
}
