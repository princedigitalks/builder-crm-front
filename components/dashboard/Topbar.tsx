'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LeadModal from '@/components/modals/LeadModal';

export default function Topbar() {
  const pathname = usePathname();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getPageTitle = () => {
    const parts = pathname.split('/');
    const last = parts[parts.length - 1];
    if (last === 'dashboard') return 'Overview';
    return last.charAt(0).toUpperCase() + last.slice(1);
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
        <div>
          <h2 className="text-lg font-bold text-slate-900 capitalize tracking-tight">{getPageTitle()}</h2>
          <p className="text-[11px] text-slate-500 font-medium">Skyline Infra — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-64"
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-100"
          >
            <Plus size={18} />
            Add Lead
          </button>
        </div>
      </header>

      {/* Add Lead Modal */}
      <LeadModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(e) => {
          e.preventDefault();
          console.log('Lead created');
          setIsAddModalOpen(false);
        }}
      />
    </>
  );
}
