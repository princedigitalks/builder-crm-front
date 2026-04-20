'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CommonDialog from '@/components/ui/CommonDialog';
import { Building2, MapPin, IndianRupee, Smartphone, GitMerge, UploadCloud, Trash2, Tag, Plus, X, Check, Video, FileText, Link } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { motion } from "framer-motion";
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface SiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  mockWhatsAppNumbers: any[];
  mockStaff: any[];
  mockTeams?: any[];
  requirementTypes?: any[];
  propertyTypes?: any[];
  budgets?: any[];
  cities?: string[];
  areas?: string[];
  onCityChange?: (city: string) => void;
  onAddCityArea?: (city: string, area?: string) => void;
  onAddBudget?: (data: { label: string; minAmount: number; maxAmount: number }) => Promise<any>;
  isLoading?: boolean;
}

function AutocompleteInput({
  value, onChange, onSelect, onAddNew, suggestions, placeholder, icon, disabled = false,
}: {
  value: string;
  onChange: (val: string) => void;
  onSelect: (val: string) => void;
  onAddNew?: (val: string) => void;
  suggestions: string[];
  placeholder: string;
  icon: React.ReactNode;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase()));
  const exactMatch = suggestions.some((s) => s.toLowerCase() === value.toLowerCase());
  const showAddNew = value.trim().length > 0 && !exactMatch && onAddNew;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const inputCls = "w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all";

  return (
    <div ref={ref} className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none">{icon}</span>
      <input
        required type="text" placeholder={placeholder} value={value} disabled={disabled}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        className={inputCls + (disabled ? ' opacity-50 cursor-not-allowed' : '')}
        autoComplete="off"
      />
      {open && (filtered.length > 0 || showAddNew) && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          {filtered.map((s) => (
            <button key={s} type="button" onMouseDown={() => { onSelect(s); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
              {s}
            </button>
          ))}
          {showAddNew && (
            <button type="button" onMouseDown={() => { onAddNew!(value.trim()); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-indigo-600 font-semibold hover:bg-indigo-50 flex items-center gap-2 border-t border-slate-100">
              <Plus size={13} />Add "{value.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function SiteModal({
  isOpen, onClose, formData, setFormData, onSubmit,
  mockWhatsAppNumbers, mockStaff, mockTeams = [], requirementTypes = [], propertyTypes = [],
  budgets = [], cities = [], areas = [], onCityChange, onAddCityArea, onAddBudget,
  isLoading = false
}: SiteModalProps) {

  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [budgetForm, setBudgetForm] = useState({ label: '', minAmount: '', maxAmount: '' });
  const [budgetSaving, setBudgetSaving] = useState(false);

  const toggle = (field: string, id: string) => {
    const current: string[] = formData[field] || [];
    const updated = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    setFormData({ ...formData, [field]: updated });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => ({ file, preview: URL.createObjectURL(file) }));
      setFormData({ ...formData, images: [...(formData.images || []), ...newImages] });
    }
  };

  const handleBrochureFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
       setFormData({ ...formData, brochureFile: file });
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...formData.images];
    if (updatedImages[index].preview) URL.revokeObjectURL(updatedImages[index].preview);
    updatedImages.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleCitySelect = (city: string) => {
    setFormData({ ...formData, city, area: '' });
    onCityChange?.(city);
  };

  const handleCityAddNew = (city: string) => {
    setFormData({ ...formData, city, area: '' });
    onAddCityArea?.(city);
    onCityChange?.(city);
  };

  const handleAreaAddNew = (area: string) => {
    setFormData({ ...formData, area });
    if (formData.city) onAddCityArea?.(formData.city, area);
  };

  const handleSaveBudget = async () => {
    if (!budgetForm.label.trim() || !budgetForm.minAmount || !budgetForm.maxAmount) return;
    setBudgetSaving(true);
    try {
      const newBudget = await onAddBudget?.({
        label: budgetForm.label.trim(),
        minAmount: Number(budgetForm.minAmount),
        maxAmount: Number(budgetForm.maxAmount),
      });
      if (newBudget?._id) {
        setFormData({ ...formData, budgets: [...(formData.budgets || []), newBudget._id] });
      }
      setBudgetForm({ label: '', minAmount: '', maxAmount: '' });
      setShowBudgetForm(false);
    } finally {
      setBudgetSaving(false);
    }
  };

  const selectCls = "w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-indigo-400 transition-all appearance-none cursor-pointer";
  const labelCls = "text-xs font-semibold text-slate-500 ml-1";
  const chipBase = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all";
  const chipSelected = "bg-indigo-600 text-white border-indigo-600";
  const chipUnselected = "bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300";
  const miniInput = "w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 transition-all";

  return (
    <CommonDialog isOpen={isOpen} onClose={onClose} title={formData._id ? 'Edit Project' : 'Add Project'} maxWidth="max-w-2xl">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">

          <div className="col-span-2 space-y-1">
            <label className={labelCls}>Project Name</label>
            <div className="relative group">
              <Building2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input required type="text" placeholder="e.g. Skyline Heights" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all" />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelCls}>City</label>
            <AutocompleteInput
              value={formData.city || ''}
              onChange={(val) => { setFormData({ ...formData, city: val, area: '' }); onCityChange?.(val); }}
              onSelect={handleCitySelect}
              onAddNew={handleCityAddNew}
              suggestions={cities}
              placeholder="e.g. Mumbai"
              icon={<MapPin size={14} />}
            />
          </div>

          <div className="space-y-1">
            <label className={labelCls}>Area / Landmark</label>
            <AutocompleteInput
              value={formData.area || ''}
              onChange={(val) => setFormData({ ...formData, area: val })}
              onSelect={(area) => setFormData({ ...formData, area })}
              onAddNew={handleAreaAddNew}
              suggestions={areas}
              placeholder="e.g. Bandra West"
              icon={<MapPin size={14} />}
              disabled={!formData.city}
            />
          </div>
          <div className="col-span-2 space-y-1">
            <label className={labelCls}>Detailed Address</label>
            <div className="relative group">
              <MapPin size={14} className="absolute left-4 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <textarea 
                placeholder="Full address of the project site..." 
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all resize-none" 
              />
            </div>
          </div>

          <div className="col-span-2 space-y-1">
            <label className={labelCls}>Google Maps Link</label>
            <div className="relative group">
              <Link size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="url"
                placeholder="https://maps.google.com/..."
                value={formData.mapUrl || ''}
                onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
              />
            </div>
          </div>

          <div className="col-span-2 space-y-1">
            <label className={labelCls}>Project Description</label>
            <div className="quill-wrapper rounded-xl overflow-hidden border border-slate-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
              <ReactQuill
                theme="snow"
                value={formData.description || ''}
                onChange={(val) => setFormData({ ...formData, description: val })}
                placeholder="Brief overview of the project..."
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['clean'],
                  ],
                }}
              />
            </div>
          </div>

          <div className="col-span-2 space-y-1">
            <label className={labelCls}>Property Types</label>
            {propertyTypes.length === 0 ? (
              <p className="text-xs text-slate-400 ml-1">No property types found. Add from Masters.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {propertyTypes.map((pt) => (
                  <button key={pt._id} type="button" onClick={() => toggle('propertyTypes', pt._id)}
                    className={`${chipBase} ${(formData.propertyTypes || []).includes(pt._id) ? chipSelected : chipUnselected}`}>
                    <Building2 size={11} />{pt.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-2 space-y-1">
            <label className={labelCls}>Requirement Types</label>
            {requirementTypes.length === 0 ? (
              <p className="text-xs text-slate-400 ml-1">No requirement types found. Add from Masters.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {requirementTypes.map((rt) => (
                  <button key={rt._id} type="button" onClick={() => toggle('requirementTypes', rt._id)}
                    className={`${chipBase} ${(formData.requirementTypes || []).includes(rt._id) ? chipSelected : chipUnselected}`}>
                    <Tag size={11} />{rt.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <label className={labelCls}>Budget Range</label>
              {!showBudgetForm && (
                <button type="button" onClick={() => setShowBudgetForm(true)}
                  className="flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                  <Plus size={12} />Add New
                </button>
              )}
            </div>

            {budgets.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {budgets.map((b) => (
                  <button key={b._id} type="button" onClick={() => toggle('budgets', b._id)}
                    className={`${chipBase} ${(formData.budgets || []).includes(b._id) ? chipSelected : chipUnselected}`}>
                    <IndianRupee size={11} />{b.label}
                  </button>
                ))}
              </div>
            )}

            {budgets.length === 0 && !showBudgetForm && (
              <p className="text-xs text-slate-400 ml-1">No budget ranges found.
                <button type="button" onClick={() => setShowBudgetForm(true)} className="text-indigo-500 font-semibold ml-1 hover:underline">Add one now</button>
              </p>
            )}

            {showBudgetForm && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <input type="text" placeholder="Label (e.g. 50L - 1Cr)" value={budgetForm.label}
                  onChange={(e) => setBudgetForm({ ...budgetForm, label: e.target.value })}
                  className={miniInput} />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" min={0} placeholder="Min Amount (₹)" value={budgetForm.minAmount}
                    onChange={(e) => setBudgetForm({ ...budgetForm, minAmount: e.target.value })}
                    className={miniInput} />
                  <input type="number" min={0} placeholder="Max Amount (₹)" value={budgetForm.maxAmount}
                    onChange={(e) => setBudgetForm({ ...budgetForm, maxAmount: e.target.value })}
                    className={miniInput} />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setShowBudgetForm(false); setBudgetForm({ label: '', minAmount: '', maxAmount: '' }); }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-all">
                    <X size={11} />Cancel
                  </button>
                  <button type="button" onClick={handleSaveBudget} disabled={budgetSaving || !budgetForm.label || !budgetForm.minAmount || !budgetForm.maxAmount}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 rounded-lg text-xs font-semibold text-white hover:bg-indigo-700 transition-all disabled:opacity-50">
                    <Check size={11} />{budgetSaving ? 'Saving...' : 'Save & Select'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className={labelCls}>WhatsApp Hub</label>
            <div className="relative group">
              <Smartphone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
              <select required value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })} className={selectCls}>
                <option value="">Link Number</option>
                {mockWhatsAppNumbers.map(num => <option key={num.id} value={num.name}>{num.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelCls}>Assigned Team</label>
            <div className="relative group">
              <GitMerge size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
              <select required value={formData.teamId}
                onChange={(e) => setFormData({ ...formData, teamId: e.target.value })} className={selectCls}>
                <option value="">Select Team</option>
                {mockTeams.map(team => <option key={team._id || team.id} value={team._id || team.id}>{team.teamName || team.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelCls}>Current Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all appearance-none cursor-pointer">
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
            </select>
          </div>

          <div className="col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <label className={labelCls}>YouTube Videos</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, videoUrls: [...(formData.videoUrls || []), ''] })}
                className="flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
              >
                <Plus size={12} /> Add Link
              </button>
            </div>
            {(formData.videoUrls || []).length === 0 && (
              <p className="text-xs text-slate-400 ml-1">No videos added yet.</p>
            )}
            {(formData.videoUrls || []).map((url: string, idx: number) => (
              <div key={idx} className="relative group">
                <Video size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="https://youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => {
                    const updated = [...(formData.videoUrls || [])];
                    updated[idx] = e.target.value;
                    setFormData({ ...formData, videoUrls: updated });
                  }}
                  className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = (formData.videoUrls || []).filter((_: string, i: number) => i !== idx);
                    setFormData({ ...formData, videoUrls: updated });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="col-span-2 space-y-2">
            <label className={labelCls}>Project Brochure (PDF)</label>
            <div className="flex flex-col gap-2">
              {formData.brochureUrl && !formData.brochureFile && (
                <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-indigo-600" />
                    <span className="text-xs font-semibold text-indigo-700 truncate max-w-[200px]">Existing Brochure</span>
                  </div>
                  <a href={`${process.env.NEXT_PUBLIC_IMAGE_URL}${formData.brochureUrl}`} target="_blank" className="text-[10px] font-black uppercase text-indigo-600 hover:underline">View</a>
                </div>
              )}
              {formData.brochureFile && (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-700 truncate max-w-[200px]">{formData.brochureFile.name}</span>
                  </div>
                  <button type="button" onClick={() => setFormData({ ...formData, brochureFile: null })} className="text-rose-500"><X size={14} /></button>
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 transition-all">
                <input type="file" accept=".pdf" className="hidden" onChange={handleBrochureFileChange} />
                <UploadCloud size={16} className="text-slate-400" />
                <span className="text-sm text-slate-500">Upload new PDF brochure</span>
              </label>
              {!formData.brochureFile && !formData.brochureUrl && (
                <div className="relative group mt-1">
                   <FileText size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                     type="text" 
                     placeholder="Or paste external PDF URL..." 
                     value={formData.brochureUrl || ''}
                     onChange={(e) => setFormData({ ...formData, brochureUrl: e.target.value })}
                     className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-indigo-400 transition-all"
                   />
                </div>
              )}
            </div>
          </div>

          <div className="col-span-2 space-y-2">
            <label className={labelCls}>Amenities</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(formData.amenities || []).map((amenity: string, idx: number) => (
                <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-100 group">
                  {amenity}
                  <button type="button" onClick={() => {
                    const updated = [...formData.amenities];
                    updated.splice(idx, 1);
                    setFormData({ ...formData, amenities: updated });
                  }} className="hover:text-rose-500 transition-colors">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                id="amenity-input"
                placeholder="Add amenity (e.g. Swimming Pool)" 
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-indigo-400 transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.currentTarget;
                    const val = input.value.trim();
                    if (val && !(formData.amenities || []).includes(val)) {
                      setFormData({ ...formData, amenities: [...(formData.amenities || []), val] });
                      input.value = '';
                    }
                  }
                }}
              />
              <button 
                type="button"
                onClick={() => {
                  const input = document.getElementById('amenity-input') as HTMLInputElement;
                  const val = input.value.trim();
                  if (val && !(formData.amenities || []).includes(val)) {
                    setFormData({ ...formData, amenities: [...(formData.amenities || []), val] });
                    input.value = '';
                  }
                }}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-semibold hover:bg-slate-900 transition-all"
              >
                Add
              </button>
            </div>
          </div>

          <div className="col-span-2 space-y-2 mt-2">
            <label className={labelCls}>Project Media</label>
            <div className="grid grid-cols-4 gap-3">
              <AnimatePresence>
                {formData.images?.map((img: any, idx: number) => (
                  <motion.div key={idx} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={typeof img === 'string' ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${img}` : img.preview} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 w-6 h-6 bg-rose-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg">
                      <Trash2 size={12} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <label className="relative aspect-square rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all group">
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                <UploadCloud size={20} className="text-slate-400 group-hover:text-indigo-500 mb-1" />
                <span className="text-xs text-slate-400 group-hover:text-indigo-600">Upload</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose}
            className="flex-1 px-6 py-2.5 bg-slate-100 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-200 transition-all active:scale-95">
            Cancel
          </button>
          <button type="submit"
            className="flex-[2] px-6 py-2.5 bg-indigo-600 rounded-xl text-sm font-semibold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95">
            {formData._id ? 'Save Changes' : 'Confirm Project'}
          </button>
        </div>
      </form>
    </CommonDialog>
  );
}
