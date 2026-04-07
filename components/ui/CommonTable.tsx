'use client';

import React from 'react';
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Column {
  header: string;
  key: string;
  render?: (item: any) => React.ReactNode;
  className?: string;
}

interface CommonTableProps {
  title: string;
  columns: Column[];
  data: any[];
  loading: boolean;
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  } | null;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  searchValue: string;
  searchPlaceholder?: string;
  actionButton?: React.ReactNode;
}

export default function CommonTable({
  title,
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  onSearchChange,
  searchValue,
  searchPlaceholder = "Search...",
  actionButton
}: CommonTableProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">{title}</h3>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all w-full sm:w-48"
            />
          </div>
          {actionButton}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
              {columns.map((col, i) => (
                <th key={i} className={cn("px-6 py-4", col.className)}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 size={24} className="animate-spin text-indigo-600 mb-2" />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Loading Data...</p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-20 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  No records found
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {data.map((item, idx) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={item.id || item._id || idx} 
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    {columns.map((col, i) => (
                      <td key={i} className={cn("px-6 py-4", col.className)}>
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing {pagination.totalItems === 0 ? 0 : (pagination.currentPage - 1) * pagination.limit + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of {pagination.totalItems} entries
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(Math.max(1, pagination.totalPages))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => onPageChange(i + 1)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-[10px] font-black transition-all",
                    pagination.currentPage === i + 1 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                      : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-600 hover:text-indigo-600"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
