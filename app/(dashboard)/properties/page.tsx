'use client';

import React, { useState } from 'react';
import { 
  Building, 
  Plus, 
  Search, 
  MapPin, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Eye, 
  IndianRupee, 
  Info, 
  Home, 
  Image as ImageIcon,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import PropertyModal from '@/components/modals/PropertyModal';

// Premium Mock Data for Properties
const mockProperties = [
  { 
    id: 1, 
    name: 'Unit 104 - Sunset Tower', 
    site: 'Skyline Hub',
    type: 'Office',
    price: '₹1.5Cr',
    location: 'Sector 15, Navi Mumbai',
    description: 'Corner office with panoramic city views and private cabin.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069'
  },
  { 
    id: 2, 
    name: 'Villa B-22 Ocean Breeze', 
    site: 'Green Valley Villas',
    type: 'Plot',
    price: '₹3.2Cr',
    location: 'Lonavala Road, Pune',
    description: 'Spacious east-facing plot near the clubhouse.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064'
  },
  { 
    id: 3, 
    name: 'Apt 1202 - Sea Crest', 
    site: 'Oceanview Heights',
    type: '2BHK',
    price: '₹5.8Cr',
    location: 'Marine Drive, Mumbai',
    description: 'High-floor apartment with unobstructed Arabian Sea view.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070'
  },
];

const propertyTypes = ['2BHK', '3BHK', '4BHK', 'Office', 'Plot', 'Penthouse', 'Studio'];
const mockSites = ['Skyline Hub', 'Green Valley Villas', 'Oceanview Heights'];

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  
  const [formData, setFormData] = useState<any>({
    name: '',
    site: '',
    type: '2BHK',
    price: '',
    location: '',
    description: '',
    image: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting Property:', formData);
    setIsModalOpen(false);
    setFormData({ name: '', site: '', type: '2BHK', price: '', location: '', description: '', image: '' });
  };

  const handleEdit = (property: any) => {
    setFormData(property);
    setIsModalOpen(true);
  };

  const handleView = (property: any) => {
    setSelectedProperty(property);
    setIsViewModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 px-6 pt-5">
      {/* High-Density Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Inventory Assets</h1>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
            <Layout size={12} className="text-indigo-500" />
            Individual Property Management & Tracking
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors pointer-events-none" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-slate-300 transition-all w-48 sm:w-64"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setFormData({ name: '', site: '', type: '2BHK', price: '', location: '', description: '', image: '' });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 px-6 py-2.5 rounded-xl text-[10px] font-black text-white tracking-widest transition-all shadow-lg shadow-indigo-100 uppercase"
          >
            <Plus size={14} strokeWidth={4} />
            New Property
          </motion.button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-5">Property</th>
                  <th className="px-6 py-5">Associated Site</th>
                  <th className="px-6 py-5">Type</th>
                  <th className="px-6 py-5">Price</th>
                  <th className="px-6 py-5">Location</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence>
                  {mockProperties.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((property) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={property.id} 
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                               <img src={property.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 text-sm tracking-tight block">{property.name}</span>
                              <span className="text-[10px] text-slate-400 font-medium truncate max-w-[150px] block">{property.description}</span>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                           <Building size={12} className="text-indigo-400" />
                           <span className="text-xs font-black text-indigo-600">{property.site}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[9px] font-black bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full uppercase tracking-widest border border-slate-200/50">
                          {property.type}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1 font-black text-slate-900">
                           <IndianRupee size={12} className="text-slate-400" />
                           <span className="text-xs">{property.price}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1 text-slate-500">
                           <MapPin size={12} />
                           <span className="text-[10px] font-bold">{property.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => handleView(property)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-hover"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleEdit(property)}
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

      {/* New/Edit Property Modal */}
      <PropertyModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        mockSites={mockSites}
        propertyTypes={propertyTypes}
      />

      {/* View Property Details Modal */}

      {/* View Property Details Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedProperty && (
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
              <div className="relative h-64 bg-slate-200">
                <img src={selectedProperty.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"
                >
                  <Plus size={20} className="rotate-45" />
                </button>
                <div className="absolute bottom-8 left-10">
                   <div className="flex items-center gap-2 mb-2">
                     <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-full border border-white/20">
                       {selectedProperty.type}
                     </span>
                     <span className="px-3 py-1 bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                       {selectedProperty.site}
                     </span>
                   </div>
                   <h2 className="text-3xl font-black text-white tracking-tight">{selectedProperty.name}</h2>
                </div>
              </div>

              <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="col-span-2 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Info size={16} />
                      </div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Description</span>
                    </div>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed pl-4 border-l-4 border-indigo-100">
                      {selectedProperty.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <IndianRupee size={16} />
                      </div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Selling Price</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">
                      {selectedProperty.price}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                        <MapPin size={16} />
                      </div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Asset Location</span>
                    </div>
                    <p className="text-sm font-black text-slate-900">
                      {selectedProperty.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-10 pb-10 flex gap-4">
                 <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="flex-1 py-4 bg-slate-100 rounded-[1.5rem] text-[11px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-200 transition-all"
                 >
                   Dismiss
                 </button>
                 <button 
                  className="flex-1 py-4 bg-slate-900 rounded-[1.5rem] text-[11px] font-black text-white uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                 >
                   Enquire Now
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
