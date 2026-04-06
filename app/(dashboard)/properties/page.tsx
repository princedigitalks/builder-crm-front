'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Layout, 
  Plus, 
  MoreVertical,
  Home,
  ArrowUpRight,
  TrendingUp,
  Users,
  Search,
  Filter,
  X,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PROPERTIES = [
  {
    id: 1,
    name: 'Skyline Heights',
    location: 'Worli, Mumbai',
    type: 'Residential',
    units: 124,
    sold: 85,
    status: 'In Progress',
    price: '₹2.4Cr - ₹5.8Cr',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
    color: 'bg-indigo-500'
  },
  {
    id: 2,
    name: 'Skyline Grand',
    location: 'Bandra West, Mumbai',
    type: 'Commercial',
    units: 42,
    sold: 12,
    status: 'Planned',
    price: '₹8.5Cr - ₹15Cr',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400',
    color: 'bg-emerald-500'
  },
  {
    id: 3,
    name: 'Ocean View Residency',
    location: 'Juhu, Mumbai',
    type: 'Residential',
    units: 88,
    sold: 88,
    status: 'Completed',
    price: '₹4.2Cr - ₹9Cr',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400',
    color: 'bg-amber-500'
  }
];

const PropertyCard = ({ property }: { property: typeof PROPERTIES[0] }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden group"
  >
    <div className="relative h-56 overflow-hidden">
      <img 
        src={property.image} 
        alt={property.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
      <div className="absolute top-4 right-4">
        <span className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md border border-white/20",
          property.status === 'Completed' ? "bg-emerald-500/80" : 
          property.status === 'In Progress' ? "bg-indigo-500/80" : "bg-slate-500/80"
        )}>
          {property.status}
        </span>
      </div>
      <div className="absolute bottom-4 left-6 right-6">
        <h3 className="text-xl font-bold text-white mb-1">{property.name}</h3>
        <div className="flex items-center gap-1.5 text-white/80 text-xs">
          <MapPin size={12} />
          {property.location}
        </div>
      </div>
    </div>
    
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-slate-50 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Units</p>
          <div className="flex items-center gap-2">
            <Layout size={14} className="text-indigo-600" />
            <span className="text-sm font-bold text-slate-900">{property.units} Units</span>
          </div>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sales Progress</p>
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-600" />
            <span className="text-sm font-bold text-slate-900">{Math.round((property.sold/property.units)*100)}% Sold</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Price Range</p>
          <p className="text-sm font-bold text-slate-900">{property.price}</p>
        </div>
        <button className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
          <ArrowUpRight size={18} />
        </button>
      </div>
    </div>
  </motion.div>
);

export default function PropertiesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Project Portfolio</h1>
          <p className="text-slate-500 font-medium mt-1">Manage and track all your real estate developments.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden lg:block">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all w-72 shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={20} />
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-indigo-200"
          >
            <Plus size={20} />
            Add New Project
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Projects', value: '12', icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Total Inventory', value: '842 Units', icon: Home, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Customers', value: '2,480', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROPERTIES.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
        
        {/* Add Project Card Placeholder */}
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
        >
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-all shadow-sm mb-4">
            <Plus size={32} />
          </div>
          <p className="text-lg font-bold text-slate-400 group-hover:text-indigo-600 transition-all">Start New Project</p>
          <p className="text-sm text-slate-400 mt-1 text-center">Add a new site to your portfolio and start tracking leads.</p>
        </button>
      </div>

      {/* Add Project Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">New Project</h3>
                  <p className="text-sm text-slate-400 mt-1">Configure your new real estate project details.</p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form className="p-8 space-y-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Project Name</label>
                      <div className="relative">
                        <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="e.g. Skyline Heights" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Location</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="e.g. Worli, Mumbai" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Project Type</label>
                      <div className="relative">
                        <Layout size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium appearance-none">
                          <option>Residential</option>
                          <option>Commercial</option>
                          <option>Mixed Use</option>
                          <option>Plotting</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Price Range</label>
                      <div className="relative">
                        <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="e.g. ₹2Cr - ₹5Cr" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                      <ImageIcon size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">Project Cover Image</p>
                      <p className="text-xs text-slate-400">Upload a high-quality 3D render or site photo.</p>
                    </div>
                    <button type="button" className="px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
                      Browse
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    Create Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
