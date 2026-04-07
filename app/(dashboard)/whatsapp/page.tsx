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
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 px-6 pt-5">
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
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors pointer-events-none" />
            <input
              type="text"
              placeholder="Search numbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-slate-300 transition-all w-48 sm:w-64"
            />
          </div>
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

      {/* Numbers Table */}
      <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden text-sm uppercase">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-5">Instance Info</th>
                <th className="px-6 py-5">Account Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {mockNumbers.filter(n => n.name.toLowerCase().includes(searchTerm.toLowerCase())).map((num) => (
                  <motion.tr 
                    layout
                    key={num.id} 
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100/50">
                             <MessageSquare size={18} />
                          </div>
                          <div>
                            <span className="font-black text-slate-900 text-sm tracking-tight block normal-case">{num.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold tracking-widest leading-none mt-1">+91 {num.number}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border",
                        num.status === 'Active' 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", num.status === 'Active' ? "bg-emerald-500" : "bg-amber-500")} />
                        {num.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
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
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
      </div>

      {/* Connect Number Modal */}
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
              <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-white/50">
                <div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Provision Hub</h2>
                   <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Connect business communication</p>
                </div>
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                   <Smartphone size={24} />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Instance Display Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Sales Primary Hub"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Business Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input 
                      required
                      type="text" 
                      maxLength={10}
                      pattern="\d{10}"
                      placeholder="9876543210"
                      value={formData.number}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({...formData, number: val});
                      }}
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all tracking-[0.2em]"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                       <span className={cn(
                         "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                         formData.number.length === 10 ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                       )}>
                         {formData.number.length}/10
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-4 bg-slate-100 rounded-2xl text-[11px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-200 transition-all"
                   >
                     Dismiss
                   </button>
                   <button 
                    type="submit"
                    className="flex-[2] px-8 py-4 bg-indigo-600 rounded-2xl text-[11px] font-black text-white uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                   >
                     {formData.id ? 'Update Hub' : 'Connect Hub'}
                   </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
