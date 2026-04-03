'use client';

import React from 'react';
import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';

export default function PlaceholderPage() {
  const pathname = usePathname();
  const pageName = pathname.split('/').pop();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl border border-slate-100 shadow-sm"
    >
      <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
        <span className="text-2xl font-bold uppercase">{pageName?.charAt(0)}</span>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 capitalize mb-2">{pageName} Module</h2>
      <p className="text-slate-500 font-medium">This module is currently under development.</p>
    </motion.div>
  );
}
