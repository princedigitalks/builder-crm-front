'use client';

import React, { useState } from 'react';
import { Building2, Plus, Search, MapPin, MoreVertical, Edit3, Trash2, Eye, LayoutGrid, IndianRupee, Info, Smartphone, User, GitMerge } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import SiteModal from '@/components/modals/SiteModal';
import CommonTable from '@/components/ui/CommonTable';

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

const mockTeams = [
  { id: '1', name: 'North Sales Elite' },
  { id: '2', name: 'Commercial Taskforce' }
];

const mockSites = [
  { 
    id: 1, 
    name: 'Skyline Hub', 
    city: 'Mumbai',
    area: 'Navi Mumbai, Sector 15', 
    description: 'A modern commercial complex with state-of-the-art facilities.',
    propertyTypes: 'Office, Retail',
    priceRange: '₹1.2Cr - ₹5.5Cr',
    whatsappNumber: 'Sales Main (9876543210)',
    staff: 'Amit Sharma',
    teamId: '1',
    status: 'Active',
    images: []
  },
  { 
    id: 2, 
    name: 'Green Valley Villas', 
    city: 'Pune',
    area: 'Pune West, Lonavala Road', 
    description: 'Luxury villas surrounded by nature with premium amenities.',
    propertyTypes: 'Villa, Plot',
    priceRange: '₹2.5Cr - ₹8.0Cr',
    whatsappNumber: 'Support Desk (9123456780)',
    staff: 'Kavya Reddy',
    teamId: '2',
    status: 'Planning',
    images: []
  },
  { 
    id: 3, 
    name: 'Oceanview Heights', 
    city: 'Mumbai',
    area: 'South Mumbai, Marine Drive', 
    description: 'Premium sea-facing residential apartments.',
    propertyTypes: '2BHK, 3BHK, 4BHK',
    priceRange: '₹4.5Cr - ₹12.0Cr',
    whatsappNumber: 'Marketing Hub (8877665544)',
    staff: 'Nikhil Mehta',
    teamId: '1',
    status: 'Active',
    images: []
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
    city: '',
    area: '',
    description: '',
    propertyTypes: '',
    priceRange: '',
    whatsappNumber: '',
    staff: '',
    teamId: '',
    status: 'Planning',
    images: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting Site:', formData);
    setIsModalOpen(false);
    setFormData({ 
      id: undefined, 
      name: '', 
      city: '', 
      area: '', 
      description: '', 
      propertyTypes: '', 
      priceRange: '', 
      whatsappNumber: '', 
      staff: '', 
      teamId: '', 
      status: 'Planning',
      images: []
    });
  };

  const handleEdit = (site: any) => {
    setFormData(site);
    setIsModalOpen(true);
  };

  const handleView = (site: any) => {
    setSelectedSite(site);
    setIsViewModalOpen(true);
  };

  const filteredSites = mockSites.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Project Details',
      key: 'name',
      render: (site: any) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
             <Building2 size={18} />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-sm tracking-tight block normal-case">{site.name}</span>
            <span className="text-[10px] text-slate-400 font-medium truncate max-w-[200px] block normal-case">{site.description}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Location',
      key: 'city',
      render: (site: any) => (
        <div className="flex flex-col gap-1 text-slate-600">
           <div className="flex items-center gap-1.5">
              <MapPin size={12} className="text-indigo-500" />
              <span className="text-xs font-black uppercase tracking-tight">{site.city}</span>
           </div>
           <span className="text-[10px] font-medium text-slate-400 truncate max-w-[150px]">{site.area}</span>
        </div>
      )
    },
    {
      header: 'Property Types',
      key: 'propertyTypes',
      render: (site: any) => (
        <span className="text-xs font-bold text-slate-600">{site.propertyTypes}</span>
      )
    },
    {
      header: 'Price Range',
      key: 'priceRange',
      render: (site: any) => (
        <span className="text-xs font-bold text-slate-900">{site.priceRange}</span>
      )
    },
    {
      header: 'Communication',
      key: 'whatsappNumber',
      render: (site: any) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-indigo-600">
             <Smartphone size={10} />
             <span className="text-[10px] font-bold">{site.whatsappNumber.split(' (')[0]}</span>
          </div>
          <span className="text-[9px] text-slate-400">+{site.whatsappNumber.split('(')[1].replace(')', '')}</span>
       </div>
      )
    },
    {
      header: 'Assigned Team',
      key: 'teamId',
      render: (site: any) => {
        const team = mockTeams.find(t => t.id === site.teamId);
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
               <GitMerge size={12} />
            </div>
            <span className="text-slate-700 text-xs font-bold">{team?.name || 'Unassigned'}</span>
         </div>
        );
      }
    },
    {
      header: 'Status',
      key: 'status',
      render: (site: any) => (
        <span className={cn(
          "inline-flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border",
          site.status === 'Active' 
            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
            : "bg-amber-50 text-amber-600 border-amber-100"
        )}>
          <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", site.status === 'Active' ? "bg-emerald-500" : "bg-amber-500")} />
          {site.status}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (site: any) => (
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
      )
    }
  ];

  return (
    <div className=" mx-auto space-y-6 pb-20 px-6 pt-5">
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
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setFormData({ 
                name: '', 
                city: '', 
                area: '', 
                description: '', 
                propertyTypes: '', 
                priceRange: '', 
                whatsappNumber: '', 
                staff: '', 
                teamId: '', 
                status: 'Planning',
                images: [] 
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 px-6 py-2.5 rounded-xl text-[10px] font-black text-white tracking-widest transition-all shadow-lg shadow-indigo-100 uppercase"
          >
            <Plus size={14} strokeWidth={4} />
            New Site
          </motion.button>
        </div>
      </div>

      <CommonTable 
        title="Project Portfolio"
        columns={columns}
        data={filteredSites}
        loading={false}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search projects..."
        pagination={{
          totalItems: filteredSites.length,
          totalPages: 1,
          currentPage: 1,
          limit: 10
        }}
        onPageChange={() => {}}
      />

      {/* New/Edit Site Modal */}
      <SiteModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        mockWhatsAppNumbers={mockWhatsAppNumbers}
        mockStaff={mockStaff}
        mockTeams={mockTeams}
      />

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
                      {selectedSite.area}, {selectedSite.city}
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
