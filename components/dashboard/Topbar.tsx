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
      <header className="h-14 bg-white border-b border-slate-50 flex items-center justify-between px-6 sticky top-0 z-40">
        <div>
          <h2 className="text-sm font-semibold text-slate-800 capitalize tracking-tight">{getPageTitle()}</h2>
          <p className="text-[10px] text-slate-400 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 pr-4 border-r border-slate-50">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/50">
              <span className="text-xs font-semibold">BF</span>
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
