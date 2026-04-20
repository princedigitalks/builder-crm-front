'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Tag, CheckCircle2, Home, IndianRupee, Settings } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchRequirementTypes, createRequirementType, updateRequirementType, deleteRequirementType } from '@/redux/slices/requirementTypeSlice';
import { fetchPropertyTypes, createPropertyType, updatePropertyType, deletePropertyType } from '@/redux/slices/propertyTypeSlice';
import { fetchBudgets, createBudget, updateBudget, deleteBudget } from '@/redux/slices/budgetSlice';
import { toast } from 'react-hot-toast';
import CommonDialog from '@/components/ui/CommonDialog';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type MasterType = 'requirement' | 'property' | 'budget';

export default function MastersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { requirementTypes, loading: reqLoading } = useSelector((state: RootState) => state.requirementType);
  const { propertyTypes, loading: propLoading } = useSelector((state: RootState) => state.propertyType);
  const { budgets, loading: budgetLoading } = useSelector((state: RootState) => state.budget);

  const [activeTab, setActiveTab] = useState<MasterType>('requirement');
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

  const tabs = [
    { id: 'requirement' as MasterType, label: 'Requirement Types', icon: Tag },
    { id: 'property' as MasterType, label: 'Property Types', icon: Home },
    { id: 'budget' as MasterType, label: 'Budget Ranges', icon: IndianRupee },
  ];

  const activeTabConfig = tabs.find(t => t.id === activeTab)!;

  const currentItems = activeTab === 'requirement' ? requirementTypes : activeTab === 'property' ? propertyTypes : budgets;
  const currentLoading = activeTab === 'requirement' ? reqLoading : activeTab === 'property' ? propLoading : budgetLoading;

  return (
    <div className="mx-auto space-y-4 pb-20 px-6 pt-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight leading-none mb-1">Masters</h1>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <Settings size={12} className="text-indigo-500" />
            Configure requirement types, property types and budget ranges
          </p>
        </div>
        <button
          onClick={() => openAdd(activeTab)}
          className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-md shadow-indigo-100 hover:bg-indigo-700"
        >
          <Plus size={14} />
          Add {activeTab === 'budget' ? 'Range' : 'Type'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all',
                isActive ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              )}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 text-sm">{activeTabConfig.label}</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="px-5 py-3">#</th>
                {activeTab === 'budget' ? (
                  <>
                    <th className="px-5 py-3">Label</th>
                    <th className="px-5 py-3">Range</th>
                  </>
                ) : (
                  <th className="px-5 py-3">Name</th>
                )}
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentLoading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 size={20} className="animate-spin text-indigo-600 mb-2" />
                      <p className="text-sm font-medium text-slate-400">Loading...</p>
                    </div>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center text-slate-400 text-sm font-medium">
                    No records found
                  </td>
                </tr>
              ) : (
                currentItems.map((item: any, idx: number) => (
                  <tr key={item._id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-5 py-3.5 text-sm text-slate-400 font-medium">{idx + 1}</td>
                    {activeTab === 'budget' ? (
                      <>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                              <IndianRupee size={13} />
                            </div>
                            <span className="text-sm font-medium text-slate-900">{item.label}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-slate-600">
                          ₹{item.minAmount.toLocaleString()} – ₹{item.maxAmount.toLocaleString()}
                        </td>
                      </>
                    ) : (
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                            {activeTab === 'property' ? <Home size={13} /> : <Tag size={13} />}
                          </div>
                          <span className="text-sm font-medium text-slate-900">{item.name}</span>
                        </div>
                      </td>
                    )}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(item, activeTab)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, activeTab)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
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

      {/* Modal */}
      <CommonDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          masterType === 'budget'
            ? formData._id ? 'Edit Budget Range' : 'Add Budget Range'
            : masterType === 'property'
            ? formData._id ? 'Edit Property Type' : 'Add Property Type'
            : formData._id ? 'Edit Requirement Type' : 'Add Requirement Type'
        }
        maxWidth="max-w-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-5 pt-3">
          {masterType === 'budget' ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Label</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 50L - 1Cr"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Min Amount</label>
                  <input
                    required
                    type="number"
                    min={0}
                    placeholder="5000000"
                    value={formData.minAmount}
                    onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Max Amount</label>
                  <input
                    required
                    type="number"
                    min={0}
                    placeholder="10000000"
                    value={formData.maxAmount}
                    onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Name</label>
              <input
                required
                autoFocus
                type="text"
                placeholder={masterType === 'property' ? 'e.g. Villa, Apartment' : 'e.g. Commercial, Residential'}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
              />
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 bg-slate-100 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] px-4 py-2 bg-indigo-600 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={15} />
              {formData._id ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </CommonDialog>
    </div>
  );
}
