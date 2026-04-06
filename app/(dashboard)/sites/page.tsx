'use client';

import React, { useState } from 'react';
import { Building2, Plus, Search, MapPin, Users, Target, MoreVertical, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// MVP Mock Data for UI demonstration
const mockSites = [
  { id: 1, name: 'Skyline Hub', location: 'Navi Mumbai', status: 'Active', leads: 124, team: 3 },
  { id: 2, name: 'Green Valley Villas', location: 'Pune West', status: 'Planning', leads: 45, team: 1 },
  { id: 3, name: 'Oceanview Heights', location: 'South Mumbai', status: 'Active', leads: 89, team: 4 },
];

export default function SitesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 px-6">
      {/* High-Density Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">Project Portfolio</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Site & Inventory Management</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors pointer-events-none" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-slate-300 transition-all w-48 sm:w-64"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-slate-900 px-5 py-2.5 rounded-xl text-[10px] font-black text-white tracking-widest transition-all shadow-lg shadow-slate-200 uppercase"
          >
            <Plus size={14} strokeWidth={4} />
            New Site
          </motion.button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Project Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Assigned Team</th>
                  <th className="px-6 py-4">Active Leads</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
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
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                               <Building2 size={14} />
                            </div>
                            <span className="font-bold text-slate-900 text-sm tracking-tight">{site.name}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-500">
                           <MapPin size={12} />
                           <span className="text-xs font-bold">{site.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-2 py-1 rounded w-fit border border-slate-100">
                           <Users size={12} />
                           <span className="text-[10px] font-black">{site.team} Members</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <Target size={12} className="text-slate-300" />
                           <span className="text-xs font-black text-slate-900">{site.leads}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest border",
                          site.status === 'Active' 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", site.status === 'Active' ? "bg-emerald-500" : "bg-amber-500")} />
                          {site.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <Edit3 size={14} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ml-1">
                          <MoreVertical size={14} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}
