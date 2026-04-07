'use client';

import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { GripVertical, Plus, Trash2, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Status {
  id: string;
  label: string;
  color: string;
}

const INITIAL_STAGES: Status[] = [
  { id: 'New', label: 'New Lead', color: 'bg-indigo-500' },
  { id: 'Contacted', label: 'Contacted', color: 'bg-blue-500' },
  { id: 'Interested', label: 'Interested', color: 'bg-cyan-500' },
  { id: 'Site Visit', label: 'Site Visit', color: 'bg-emerald-500' },
  { id: 'Negotiation', label: 'Negotiation', color: 'bg-amber-500' },
  { id: 'Closed Won', label: 'Closed Won', color: 'bg-green-600' },
];

export default function StatusPage() {
  const [stages, setStages] = useState<Status[]>(INITIAL_STAGES);

  return (
    <div className="space-y-8 mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Status</h1>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
            Lead Kanban Stage Order
          </p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-200 active:scale-95">
          <Plus size={16} strokeWidth={4} />
          Add Status
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Pipeline Statuses</h3>
          <div className="flex items-center gap-2 text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/50">
            <Info size={10} />
            Drag to reorder
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                <th className="px-6 py-4">Status Name</th>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <Reorder.Group
              as="tbody"
              axis="y"
              values={stages}
              onReorder={setStages}
              className="divide-y divide-slate-50"
            >
              {stages.map((stage) => (
                <Reorder.Item
                  key={stage.id}
                  value={stage}
                  as="tr"
                  className="hover:bg-slate-50/50 transition-colors group bg-white"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="p-1 text-slate-300 group-hover:text-indigo-400 cursor-grab active:cursor-grabbing transition-colors">
                        <GripVertical size={18} />
                      </div>
                      <div className={cn("w-3 h-3 rounded-full shadow-sm shrink-0", stage.color)} />
                      <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{stage.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-black text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
                      {stages.indexOf(stage) + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </table>
        </div>

        <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex justify-end gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
            Reset Defaults
          </button>
          <button className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-2">
            <CheckCircle2 size={16} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
