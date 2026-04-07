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
      <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
        <div>
          <h2 className="text-xl font-bold text-slate-900 capitalize tracking-tight">{getPageTitle()}</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Skyline Infra — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 pr-6 border-r border-slate-100">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <span className="text-sm font-bold">JD</span>
            </div>
           
          </div>
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
