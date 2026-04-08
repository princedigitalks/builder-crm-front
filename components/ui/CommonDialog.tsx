'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

export default function CommonDialog({ 
  isOpen, 
  onClose, 
  title, 
  children,
  maxWidth = 'max-w-lg',
  className
}: CommonDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" 
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              "relative w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 flex flex-col",
              maxWidth,
              className
            )}
          >
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-50 flex justify-between items-center bg-white">
              <div className="flex flex-col">
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">{title}</h3>
                <div className="h-0.5 w-6 bg-indigo-600 rounded-full mt-1" />
              </div>
              <button 
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 py-4 overflow-y-auto max-h-[85vh]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
