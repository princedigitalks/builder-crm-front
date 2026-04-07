'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Phone, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Smartphone,
  User,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import WhatsAppModal from '@/components/modals/WhatsAppModal';
import CommonTable from '@/components/ui/CommonTable';

// Mock Data
const mockNumbers = [
  { id: 1, name: 'Sales Main', number: '9876543210', status: 'Active' },
  { id: 2, name: 'Support Desk', number: '9123456780', status: 'Active' },
  { id: 3, name: 'Marketing Hub', number: '8877665544', status: 'Inactive' },
];

export default function WhatsAppPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    id: undefined,
    name: '',
    number: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.number.length !== 10) {
      alert('Phone number must be exactly 10 digits.');
      return;
    }
    console.log('Submitting WhatsApp Number:', formData);
    setIsModalOpen(false);
    setFormData({ id: undefined, name: '', number: '' });
  };

  const handleEdit = (num: any) => {
    setFormData(num);
    setIsModalOpen(true);
  };

  const filteredNumbers = mockNumbers.filter(n => 
    n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Instance Info',
      key: 'name',
      render: (num: any) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100/50">
             <MessageSquare size={18} />
          </div>
          <div>
            <span className="font-black text-slate-900 text-sm tracking-tight block normal-case">{num.name}</span>
            <span className="text-[10px] text-slate-400 font-bold tracking-widest leading-none mt-1">+91 {num.number}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Account Status',
      key: 'status',
      render: (num: any) => (
        <span className={cn(
          "inline-flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border",
          num.status === 'Active' 
            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
            : "bg-amber-50 text-amber-600 border-amber-100"
        )}>
          <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", num.status === 'Active' ? "bg-emerald-500" : "bg-amber-500")} />
          {num.status}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (num: any) => (
        <div className="flex items-center justify-end gap-1">
          <button 
            onClick={() => handleEdit(num)}
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">WhatsApp Hub</h1>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
            <Smartphone size={12} className="text-indigo-500" />
            Provisioned Business Instances
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setFormData({ id: undefined, name: '', number: '' });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 px-6 py-2.5 rounded-xl text-[10px] font-black text-white tracking-widest transition-all shadow-lg shadow-indigo-100 uppercase"
          >
            <Plus size={14} strokeWidth={4} />
            Connect Hub
          </motion.button>
        </div>
      </div>

      {/* Stats Quick Look */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Active Hubs', count: 2, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
           { label: 'Unassigned', count: 0, icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-50' },
           { label: 'Daily Outbound', count: '1.2k', icon: Phone, color: 'text-indigo-500', bg: 'bg-indigo-50' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                 <stat.icon size={20} className={stat.color} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">{stat.count}</h3>
              </div>
           </div>
         ))}
      </div>

      <CommonTable 
        title="WhatsApp Hub"
        columns={columns}
        data={filteredNumbers}
        loading={false}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search numbers..."
        pagination={{
          totalItems: filteredNumbers.length,
          totalPages: 1,
          currentPage: 1,
          limit: 10
        }}
        onPageChange={() => {}}
      />

      {/* Connect Number Modal */}
      <WhatsAppModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
