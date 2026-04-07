'use client';

import React, { useState } from 'react';
import { Building2, Plus, Search, MapPin, MoreVertical, Edit3, Trash2, Eye, LayoutGrid, IndianRupee, Info, Smartphone, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock Data for UI demonstration
const mockWhatsAppNumbers = [
  { id: 1, name: 'Sales Main (9876543210)' },
  { id: 2, name: 'Support Desk (9123456780)' },
  { id: 3, name: 'Marketing Hub (8877665544)' }
];

const mockStaff = [
  { id: 1, name: 'Amit Sharma' },
  { id: 2, name: 'Kavya Reddy' },
  { id: 3, name: 'Nikhil Mehta' }
];

const mockSites = [
  { 
    id: 1, 
    name: 'Skyline Hub', 
    location: 'Navi Mumbai, Sector 15', 
    description: 'A modern commercial complex with state-of-the-art facilities.',
    propertyTypes: 'Office, Retail',
    priceRange: '₹1.2Cr - ₹5.5Cr',
    whatsappNumber: 'Sales Main (9876543210)',
    staff: 'Amit Sharma',
    status: 'Active' 
  },
  { 
    id: 2, 
    name: 'Green Valley Villas', 
    location: 'Pune West, Lonavala Road', 
    description: 'Luxury villas surrounded by nature with premium amenities.',
    propertyTypes: 'Villa, Plot',
    priceRange: '₹2.5Cr - ₹8.0Cr',
    whatsappNumber: 'Support Desk (9123456780)',
    staff: 'Kavya Reddy',
    status: 'Planning' 
  },
  { 
    id: 3, 
    name: 'Oceanview Heights', 
    location: 'South Mumbai, Marine Drive', 
    description: 'Premium sea-facing residential apartments.',
    propertyTypes: '2BHK, 3BHK, 4BHK',
    priceRange: '₹4.5Cr - ₹12.0Cr',
    whatsappNumber: 'Marketing Hub (8877665544)',
    staff: 'Nikhil Mehta',
    status: 'Active' 
  },
];

export default function SitesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<any>(null);
  
  const [formData, setFormData] = useState<any>({
    id: undefined,
    name: '',
    location: '',
    description: '',
    propertyTypes: '',
    priceRange: '',
    whatsappNumber: '',
    staff: '',
    status: 'Planning'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting Site:', formData);
    setIsModalOpen(false);
    setFormData({ name: '', location: '', description: '', propertyTypes: '', priceRange: '', whatsappNumber: '', staff: '', status: 'Planning' });
  };

  const handleEdit = (site: any) => {
    setFormData(site);
    setIsModalOpen(true);
  };

  const handleView = (site: any) => {
    setSelectedSite(site);
    setIsViewModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 px-6 pt-5">
      {/* High-Density Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Project Portfolio</h1>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
            <LayoutGrid size={12} className="text-indigo-500" />
            Site & Inventory Management
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors pointer-events-none" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-slate-300 transition-all w-48 sm:w-64"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setFormData({ name: '', location: '', description: '', propertyTypes: '', priceRange: '', status: 'Planning' });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 px-6 py-2.5 rounded-xl text-[10px] font-black text-white tracking-widest transition-all shadow-lg shadow-indigo-100 uppercase"
          >
            <Plus size={14} strokeWidth={4} />
            New Site
          </motion.button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-5">Project Details</th>
                  <th className="px-6 py-5">Location</th>
                  <th className="px-6 py-5">Property Types</th>
                  <th className="px-6 py-5">Price Range</th>
                  <th className="px-6 py-5">Communication</th>
                  <th className="px-6 py-5">Site Manager</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence>
                  {mockSites.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((site) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={site.id} 
                      className="hover:bg-slate-50/50 transition-colors group text-[10px] uppercase font-black"
                    >
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
                               <Building2 size={18} />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 text-sm tracking-tight block normal-case">{site.name}</span>
                              <span className="text-[10px] text-slate-400 font-medium truncate max-w-[200px] block normal-case">{site.description}</span>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5 text-slate-600">
                           <MapPin size={12} className="text-slate-400" />
                           <span className="text-xs font-bold leading-none">{site.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-indigo-600">
                               <Smartphone size={10} />
                               <span>{site.whatsappNumber.split(' (')[0]}</span>
                            </div>
                            <span className="text-[9px] text-slate-400">+{site.whatsappNumber.split('(')[1].replace(')', '')}</span>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-[10px]">
                               {site.staff.charAt(0)}
                            </div>
                            <span className="text-slate-700">{site.staff}</span>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border",
                          site.status === 'Active' 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", site.status === 'Active' ? "bg-emerald-500" : "bg-amber-500")} />
                          {site.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => handleView(site)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-hover"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleEdit(site)}
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-white rounded-xl transition-all shadow-hover"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-hover">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
      </div>

      {/* New/Edit Site Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl z-[101] overflow-hidden border border-slate-100"
            >
              <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {formData.id ? 'Refine Project Details' : 'Onboard New Project'}
                   </h2>
                   <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Initialize site parameters & configurations</p>
                </div>
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600">
                   <Building2 size={24} />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                   <div className="col-span-2 space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Skyline Heights Phase 1"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
                      />
                   </div>

                   <div className="col-span-2 space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Location Address</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input 
                          required
                          type="text" 
                          placeholder="Full address or area..."
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
                        />
                      </div>
                   </div>

                   <div className="col-span-2 space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Description</label>
                      <textarea 
                        required
                        placeholder="Brief overview of the project..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all resize-none"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Types</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 2BHK, 3BHK, Plots"
                        value={formData.propertyTypes}
                        onChange={(e) => setFormData({...formData, propertyTypes: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Price Range</label>
                      <div className="relative">
                        <IndianRupee size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input 
                          type="text" 
                          placeholder="e.g. 1.2Cr - 2.5Cr"
                          value={formData.priceRange}
                          onChange={(e) => setFormData({...formData, priceRange: e.target.value})}
                          className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
                        />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Hub</label>
                      <div className="relative">
                        <Smartphone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        <select 
                          required
                          value={formData.whatsappNumber}
                          onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                          className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:bg-white focus:border-indigo-400 transition-all appearance-none cursor-pointer"
                        >
                           <option value="">Link Number</option>
                           {mockWhatsAppNumbers.map(num => <option key={num.id} value={num.name}>{num.name}</option>)}
                        </select>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Site Manager</label>
                      <div className="relative">
                        <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        <select 
                          required
                          value={formData.staff}
                          onChange={(e) => setFormData({...formData, staff: e.target.value})}
                          className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:bg-white focus:border-indigo-400 transition-all appearance-none cursor-pointer"
                        >
                           <option value="">Assign Staff</option>
                           {mockStaff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                      </div>
                   </div>

                   <div className="col-span-2 space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Status</label>
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all appearance-none cursor-pointer"
                      >
                         <option>Planning</option>
                         <option>Launching Soon</option>
                         <option>Under Construction</option>
                         <option>Ready to Move</option>
                         <option>Active</option>
                         <option>Completed</option>
                      </select>
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-4 bg-slate-100 rounded-2xl text-[11px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-200 hover:text-slate-600 transition-all"
                   >
                     Cancel
                   </button>
                   <button 
                    type="submit"
                    className="flex-[2] px-8 py-4 bg-indigo-600 rounded-2xl text-[11px] font-black text-white uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
                   >
                     {formData.id ? 'Update Project' : 'Deploy Project'}
                   </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* View Site Details Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedSite && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsViewModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl z-[101] overflow-hidden border border-slate-100"
            >
              <div className="relative h-48 bg-indigo-600 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070')] bg-cover bg-center mix-blend-overlay opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent" />
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"
                >
                  <Plus size={20} className="rotate-45" />
                </button>
                <div className="absolute bottom-8 left-10">
                   <h2 className="text-3xl font-black text-white tracking-tight">{selectedSite.name}</h2>
                   <div className="flex items-center gap-2 mt-2 text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em]">
                      <MapPin size={12} />
                      {selectedSite.location}
                   </div>
                </div>
              </div>

              <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Info size={16} />
                      </div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Description</span>
                    </div>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed italic border-l-4 border-indigo-100 pl-4">
                      "{selectedSite.description}"
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <IndianRupee size={16} />
                      </div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Price Range</span>
                    </div>
                    <p className="text-xl font-black text-slate-900 tracking-tight">
                      {selectedSite.priceRange}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                        <LayoutGrid size={16} />
                      </div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Property Types</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedSite.propertyTypes.split(',').map((type: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-900 text-[10px] font-black rounded-xl border border-slate-100 uppercase tracking-widest">
                          {type.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 rounded-full bg-indigo-600" />
                      </div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                    </div>
                    <span className={cn(
                        "inline-flex items-center gap-2 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border shadow-sm",
                        selectedSite.status === 'Active' 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      )}>
                        {selectedSite.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-10 pb-10">
                 <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="w-full py-4 bg-slate-900 rounded-[1.5rem] text-[11px] font-black text-white uppercase tracking-widest hover:bg-slate-800 transition-all"
                 >
                   Close Details
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
