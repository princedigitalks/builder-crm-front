'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Tag, CheckCircle2, Home, IndianRupee } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchRequirementTypes, createRequirementType, updateRequirementType, deleteRequirementType } from '@/redux/slices/requirementTypeSlice';
import { fetchPropertyTypes, createPropertyType, updatePropertyType, deletePropertyType } from '@/redux/slices/propertyTypeSlice';
import { fetchBudgets, createBudget, updateBudget, deleteBudget } from '@/redux/slices/budgetSlice';
import { toast } from 'react-hot-toast';
import CommonDialog from '@/components/ui/CommonDialog';

type MasterType = 'requirement' | 'property' | 'budget';

export default function MastersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { requirementTypes, loading: reqLoading } = useSelector((state: RootState) => state.requirementType);
  const { propertyTypes, loading: propLoading } = useSelector((state: RootState) => state.propertyType);
  const { budgets, loading: budgetLoading } = useSelector((state: RootState) => state.budget);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [masterType, setMasterType] = useState<MasterType>('requirement');
  const [formData, setFormData] = useState({ _id: '', name: '', label: '', minAmount: '', maxAmount: '' });

  useEffect(() => {
    dispatch(fetchRequirementTypes());
    dispatch(fetchPropertyTypes());
    dispatch(fetchBudgets());
  }, [dispatch]);

  const openAdd = (type: MasterType) => {
    setMasterType(type);
    setFormData({ _id: '', name: '', label: '', minAmount: '', maxAmount: '' });
    setIsModalOpen(true);
  };

  const openEdit = (item: any, type: MasterType) => {
    setMasterType(type);
    setFormData({
      _id: item._id,
      name: item.name || '',
      label: item.label || '',
      minAmount: item.minAmount?.toString() || '',
      maxAmount: item.maxAmount?.toString() || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (masterType === 'requirement') {
        if (formData._id) await dispatch(updateRequirementType({ id: formData._id, name: formData.name })).unwrap();
        else await dispatch(createRequirementType({ name: formData.name })).unwrap();
      } else if (masterType === 'property') {
        if (formData._id) await dispatch(updatePropertyType({ id: formData._id, name: formData.name })).unwrap();
        else await dispatch(createPropertyType({ name: formData.name })).unwrap();
      } else {
        const payload = { label: formData.label, minAmount: Number(formData.minAmount), maxAmount: Number(formData.maxAmount) };
        if (formData._id) await dispatch(updateBudget({ id: formData._id, ...payload })).unwrap();
        else await dispatch(createBudget(payload)).unwrap();
      }
      toast.success(formData._id ? 'Updated successfully' : 'Created successfully');
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err || 'Failed to save');
    }
  };

  const handleDelete = async (id: string, type: MasterType) => {
    if (!confirm('Delete this item?')) return;
    try {
      if (type === 'requirement') await dispatch(deleteRequirementType(id)).unwrap();
      else if (type === 'property') await dispatch(deletePropertyType(id)).unwrap();
      else await dispatch(deleteBudget(id)).unwrap();
      toast.success('Deleted successfully');
    } catch (err: any) {
      toast.error(err || 'Failed to delete');
    }
  };

  const renderTable = (items: any[], type: MasterType, loading: boolean, icon: React.ReactNode, title: string, renderRow: (item: any) => React.ReactNode) => (
    <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <button onClick={() => openAdd(type)}
          className="flex items-center gap-2 bg-indigo-600 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all">
          <Plus size={12} />Add
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="px-6 py-4">#</th>
              {renderRow(null)}
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={10} className="px-6 py-10 text-center text-sm text-slate-400">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={10} className="px-6 py-10 text-center text-sm text-slate-400">No items added yet.</td></tr>
            ) : (
              items.map((item, idx) => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-400">{idx + 1}</td>
                  {renderRow(item)}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(item, type)}
                        className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(item._id, type)}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const formatAmount = (n: number) => n >= 100 ? `${(n / 100).toFixed(0)}L` : `${n}K`;

  return (
    <div className="mx-auto space-y-4 pb-20 px-6 pt-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight leading-none mb-1">Masters</h1>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <Tag size={12} className="text-indigo-500" />
            Manage Requirement Types, Property Types & Budgets
          </p>
        </div>
      </div>

      {renderTable(requirementTypes, 'requirement', reqLoading, <Tag size={13} />, 'Requirement Types', (item) =>
        item === null ? <th className="px-6 py-4">Name</th> : (
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500"><Tag size={13} /></div>
              <span className="text-sm font-semibold text-slate-900">{item.name}</span>
            </div>
          </td>
        )
      )}

      {renderTable(propertyTypes, 'property', propLoading, <Home size={13} />, 'Property Types', (item) =>
        item === null ? <th className="px-6 py-4">Name</th> : (
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500"><Home size={13} /></div>
              <span className="text-sm font-semibold text-slate-900">{item.name}</span>
            </div>
          </td>
        )
      )}

      {renderTable(budgets, 'budget', budgetLoading, <IndianRupee size={13} />, 'Budget Ranges', (item) =>
        item === null ? (
          <><th className="px-6 py-4">Label</th><th className="px-6 py-4">Range</th></>
        ) : (
          <>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600"><IndianRupee size={13} /></div>
                <span className="text-sm font-semibold text-slate-900">{item.label}</span>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                ₹{item.minAmount.toLocaleString()} – ₹{item.maxAmount.toLocaleString()}
              </span>
            </td>
          </>
        )
      )}

      <CommonDialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        title={masterType === 'budget' ? (formData._id ? 'Edit Budget Range' : 'Add Budget Range') : masterType === 'property' ? (formData._id ? 'Edit Property Type' : 'Add Property Type') : (formData._id ? 'Edit Requirement Type' : 'Add Requirement Type')}
        maxWidth="max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          {masterType === 'budget' ? (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 ml-1">Label</label>
                <div className="relative group">
                  <IndianRupee size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input required type="text" placeholder="e.g. 50L - 1Cr" value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 ml-1">Min Amount (₹)</label>
                  <input required type="number" min={0} placeholder="e.g. 5000000" value={formData.minAmount}
                    onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 ml-1">Max Amount (₹)</label>
                  <input required type="number" min={0} placeholder="e.g. 10000000" value={formData.maxAmount}
                    onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all" />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 ml-1">Name</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  {masterType === 'property' ? <Home size={14} /> : <Tag size={14} />}
                </span>
                <input required autoFocus type="text"
                  placeholder={masterType === 'property' ? 'e.g. Apartment, Villa' : 'e.g. 2BHK, Villa, Plot'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all" />
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-200 transition-all">
              Cancel
            </button>
            <button type="submit"
              className="flex-[2] px-4 py-2.5 bg-indigo-600 rounded-xl text-sm font-semibold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
              <CheckCircle2 size={14} />
              {formData._id ? 'Save Changes' : 'Add'}
            </button>
          </div>
        </form>
      </CommonDialog>
    </div>
  );
}
