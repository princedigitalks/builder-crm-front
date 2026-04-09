'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, MapPin, MoreVertical, Edit3, Trash2, Eye, LayoutGrid, IndianRupee, Info, Smartphone, User, GitMerge } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { getSocket } from '@/lib/socket';
import SiteModal from '@/components/modals/SiteModal';
import CommonTable from '@/components/ui/CommonTable';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSites, createSite, updateSite, deleteSite, getSiteById, syncSiteStatus } from '@/redux/slices/siteSlice';
import { fetchTeams, fetchStaffDropdown } from '@/redux/slices/teamSlice';
import { fetchWhatsapp } from '@/redux/slices/whatsappSlice';
import { RootState, AppDispatch } from '@/redux/store';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

// Note: WhatsApp numbers, staff, and teams are now fetched dynamically from API

export default function SitesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { sites, pagination, loading } = useSelector((state: RootState) => state.site);
  const { teams, staffDropdown } = useSelector((state: RootState) => state.team);
  const { whatsappList } = useSelector((state: RootState) => state.whatsapp);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState<any>({
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
    images: [],
    originalImages: [] // Track original images for comparison
  });

  useEffect(() => {
    setMounted(true);
    dispatch(fetchSites({ page: 1, limit: 10, search: searchTerm }));
    dispatch(fetchTeams({ page: 1, limit: 100 })); // Fetch all teams
    dispatch(fetchStaffDropdown());
    dispatch(fetchWhatsapp({ page: 1, limit: 100 })); // Fetch all WhatsApp numbers

    const socket = getSocket();
    socket.on('site_status_update', (update: { siteId: string; whatsappStatus: string; chatbotStatus: string }) => {
      dispatch(syncSiteStatus(update));
    });

    return () => {
      socket.off('site_status_update');
    };
  }, [dispatch, searchTerm]);


  const { builder } = useSelector((state: RootState) => state.auth);
  const siteLimit = builder?.currentLimits?.noOfSites || 0;
  const currentSiteCount = pagination.totalRecords;
  const isLimitReached = currentSiteCount >= siteLimit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Add text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'images' && key !== 'originalImages' && key !== '_id') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Handle images for update vs create
      if (formData._id) {
        // Update mode
        const currentImages = formData.images || [];
        const originalImages = formData.originalImages || [];

        // Find which original images are still present (strings)
        const keptImages = currentImages.filter((img: any) => typeof img === 'string');
        // Find new images to upload (file objects)
        const newImages = currentImages.filter((img: any) => img.file);

        // Send kept images as JSON string
        formDataToSend.append('keptImages', JSON.stringify(keptImages));

        // Add new image files
        newImages.forEach((img: any) => {
          formDataToSend.append('images', img.file);
        });
      } else {
        // Create mode - just add all images
        if (formData.images && formData.images.length > 0) {
          formData.images.forEach((img: any) => {
            if (img.file) {
              formDataToSend.append('images', img.file);
            }
          });
        }
      }

      if (formData._id) {
        // Update
        await dispatch(updateSite({ id: formData._id, data: formDataToSend })).unwrap();
        toast.success('Site updated successfully');
      } else {
        // Create
        if (isLimitReached) {
          toast.error(`Site limit reached! You can only create ${siteLimit} sites.`);
          return;
        }
        await dispatch(createSite(formDataToSend)).unwrap();
        toast.success('Site created successfully');
      }

      setIsModalOpen(false);
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
        images: [],
        originalImages: []
      });
    } catch (error: any) {
      toast.error(error || 'Failed to submit site');
    }
  };

  const handleEdit = (site: any) => {
    setFormData({
      ...site,
      originalImages: [...(site.images || [])], // Store original images for comparison
      images: [...(site.images || [])] // Initialize images with existing ones
    });
    setIsModalOpen(true);
  };

  const handleView = (site: any) => {
    setSelectedSite(site);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (site: any) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${site.name}"? This will notify the admin to unlink services.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-2xl',
        title: 'text-lg font-bold text-slate-900',
        htmlContainer: 'text-sm text-slate-600',
        confirmButton: 'px-4 py-2 rounded-lg text-sm font-semibold',
        cancelButton: 'px-4 py-2 rounded-lg text-sm font-semibold'
      }
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteSite(site._id)).unwrap();
        toast.success('Site deletion requested');
      } catch (error: any) {
        toast.error(error || 'Failed to request deletion');
      }
    }
  };

  const columns = [
    {
      header: 'Project Details',
      key: 'name',
      render: (site: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/50">
             <Building2 size={14} />
          </div>
          <div>
            <span className="font-semibold text-slate-900 text-xs tracking-tight block normal-case">{site.name}</span>
            <span className="text-[10px] text-slate-400 font-medium truncate max-w-[200px] block normal-case">{site.description}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Location',
      key: 'city',
      render: (site: any) => (
        <div className="flex flex-col gap-0.5 text-slate-600">
           <div className="flex items-center gap-1.5">
              <MapPin size={10} className="text-indigo-500" />
              <span className="text-[11px] font-semibold uppercase tracking-tight">{site.city}</span>
           </div>
           <span className="text-[10px] font-medium text-slate-400 truncate max-w-[150px]">{site.area}</span>
        </div>
      )
    },
    {
      header: 'Property Types',
      key: 'propertyTypes',
      render: (site: any) => (
        <span className="text-xs font-medium text-slate-600">{site.propertyTypes}</span>
      )
    },
    {
      header: 'Price Range',
      key: 'priceRange',
      render: (site: any) => (
        <span className="text-xs font-semibold text-slate-900">{site.priceRange}</span>
      )
    },
    {
      header: 'Connection Health',
      key: 'whatsappStatus',
      render: (site: any) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-indigo-600">
             <Smartphone size={10} />
             <span className="text-[10px] font-semibold">{site.whatsappNumber?.split(' (')[0] || 'N/A'}</span>
          </div>
          <span className={cn(
            "text-[8px] font-black uppercase px-2 py-0.5 rounded-full w-fit",
            site.whatsappStatus === 'connected' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {site.whatsappStatus || 'disconnected'}
          </span>
       </div>
      )
    },
    {
      header: 'Chatbot Engine',
      key: 'chatbotStatus',
      render: (site: any) => (
        <span className={cn(
          "text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border",
          site.chatbotStatus === 'active' ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-400 border-slate-100"
        )}>
          {site.chatbotStatus || 'inactive'}
        </span>
      )
    },
    {
      header: 'Assigned Team',
      key: 'teamId',
      render: (site: any) => {
        const team = teams.find(t => t._id === site.teamId);
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <GitMerge size={10} />
            </div>
            <span className="text-slate-700 text-xs font-medium">{team?.teamName || 'Unassigned'}</span>
          </div>
        );
      }
    },
    {
      header: 'Status',
      key: 'status',
      render: (site: any) => (
        <span className={cn(
          "inline-flex items-center gap-1.5 text-[9px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider border",
          site.status === 'Active' 
            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
            : "bg-amber-50 text-amber-600 border-amber-100"
        )}>
          <span className={cn("w-1 h-1 rounded-full animate-pulse", site.status === 'Active' ? "bg-emerald-500" : "bg-amber-500")} />
          {site.status}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: "text-right",
      render: (site: any) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => handleView(site)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => handleEdit(site)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
          >
            <Edit3 size={14} />
          </button>
           <button
              onClick={() => handleDelete(site)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition-all"
              title="Delete Site"
            >
              <Trash2 size={14} />
            </button>
        </div>
      )
    }
  ];

  return (
    <div className="mx-auto space-y-4 pb-20 px-6 pt-5">
      {/* High-Density Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight leading-none mb-1">Project Portfolio</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest flex items-center gap-2">
              <LayoutGrid size={10} className="text-indigo-500" />
              Site & Inventory Management
            </p>
          </div>
          
          <div className="h-8 w-px bg-slate-100 mx-2" />
          
          {mounted && (
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Usage Limit</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-1000",
                      isLimitReached ? "bg-rose-500" : currentSiteCount / siteLimit > 0.8 ? "bg-amber-500" : "bg-indigo-500"
                    )}
                    style={{ width: `${Math.min((currentSiteCount / siteLimit) * 100, 100)}%` }}
                  />
                </div>
                <span className={cn(
                  "text-[10px] font-black tracking-tighter",
                  isLimitReached ? "text-rose-600" : "text-slate-600"
                )}>
                  {currentSiteCount}/{siteLimit}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={mounted && !isLimitReached ? { scale: 1.02 } : {}}
            whileTap={mounted && !isLimitReached ? { scale: 0.98 } : {}}
            onClick={() => {
              if (isLimitReached) {
                toast.error(`You have reached your limit of ${siteLimit} sites. Please upgrade your plan.`);
                return;
              }
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
                images: [],
                originalImages: []
              });
              setIsModalOpen(true);
            }}
            className={cn(
               "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-md uppercase tracking-wider",
               mounted && isLimitReached 
                ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" 
                : "bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700"
            )}
            title={mounted && isLimitReached ? "Site limit reached" : "Add new site"}
          >
            <Plus size={14} />
            New Site
          </motion.button>
        </div>
      </div>

      <CommonTable
        title="Project Portfolio"
        columns={columns}
        data={sites}
        loading={loading}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search projects..."
        pagination={{
            totalItems: pagination.totalRecords,
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            limit: pagination.limit
        }}
        onPageChange={(page) => dispatch(fetchSites({ page, limit: pagination.limit, search: searchTerm }))}
      />

      {/* New/Edit Site Modal */}
      <SiteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        mockWhatsAppNumbers={whatsappList.filter(w => w.isActive).map(w => ({
          id: w._id,
          name: `${w.name} (${w.number})`
        }))}
        mockStaff={staffDropdown}
        mockTeams={teams}
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
