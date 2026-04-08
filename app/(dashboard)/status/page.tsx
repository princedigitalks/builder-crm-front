'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { GripVertical, Plus, Trash2, CheckCircle2, Info, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import StatusModal from '@/components/modals/StatusModal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchStatuses, updateStatus, reorderStatuses, createStatus, deleteStatus } from '@/redux/slices/statusSlice';
import { toast } from 'react-hot-toast';

export default function StatusPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { statuses, loading } = useSelector((state: RootState) => state.leadStatus);
  const [localStatuses, setLocalStatuses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    color: '#6366f1'
  });

  useEffect(() => {
    dispatch(fetchStatuses());
  }, [dispatch]);

  useEffect(() => {
    if (statuses.length > 0) {
      setLocalStatuses([...statuses].sort((a, b) => a.order - b.order));
    }
  }, [statuses]);

  const handleReorder = (newItems: any[]) => {
    setLocalStatuses(newItems);
  };

  const handleSaveOrder = async () => {
    const orderings = localStatuses.map((s, idx) => ({
      id: s._id,
      order: idx + 1
    }));
    try {
      await dispatch(reorderStatuses(orderings)).unwrap();
      toast.success('Order Saved Successfully');
    } catch (err: any) {
      toast.error(err || 'Failed to reorder');
    }
  };

  const handleEdit = (status: any) => {
    setFormData({
      _id: status._id,
      name: status.name,
      color: status.color
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, key: string) => {
    if (['NEW', 'WON', 'LOST'].includes(key)) {
      return toast.error('System statuses cannot be deleted');
    }
    if (confirm('Delete this status?')) {
      try {
        await dispatch(deleteStatus(id)).unwrap();
        toast.success('Status Deleted');
      } catch (err: any) {
        toast.error(err || 'Failed to delete');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await dispatch(updateStatus({ id: formData._id, data: formData })).unwrap();
        toast.success('Status Updated');
      } else {
        await dispatch(createStatus(formData)).unwrap();
        toast.success('Status Created');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err || 'Failed to saveStatus');
    }
  };

  return (
    <div className="space-y-8 mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2 uppercase">Status</h1>
          <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">
            Lead Kanban Stage Order
          </p>
        </div>
        <button 
          onClick={() => {
            setFormData({ _id: '', name: '', color: '#6366f1' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-200 active:scale-95"
        >
          <Plus size={16} strokeWidth={4} />
          Add Status
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Pipeline Statuses</h3>
          <div className="flex items-center gap-2 text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/50">
            <Info size={10} />
            Drag to reorder
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                <th className="px-6 py-4">Status Name</th>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <Reorder.Group
              as="tbody"
              axis="y"
              values={localStatuses}
              onReorder={handleReorder}
              className="divide-y divide-slate-50"
            >
              {localStatuses.map((status) => (
                <Reorder.Item
                  key={status._id}
                  value={status}
                  as="tr"
                  className="hover:bg-slate-50/50 transition-colors group bg-white"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="p-1 text-slate-300 group-hover:text-indigo-400 cursor-grab active:cursor-grabbing transition-colors">
                        <GripVertical size={18} />
                      </div>
                      <div className="w-3 h-3 rounded-full shadow-sm shrink-0" style={{ backgroundColor: status.color }} />
                      <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{status.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-black text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg uppercase">
                      {localStatuses.indexOf(status) + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                        onClick={() => handleEdit(status)}
                        className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100"
                      >
                        <Edit3 size={18} />
                      </button>
                      {status.key === 'CUSTOM' && (
                        <button 
                          onClick={() => handleDelete(status._id, status.key)}
                          className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </table>
        </div>

        <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex justify-end gap-3">
          <button 
            onClick={handleSaveOrder}
            className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-2 active:scale-95"
          >
            <CheckCircle2 size={16} />
            Save Changes
          </button>
        </div>
      </div>

      <StatusModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}
