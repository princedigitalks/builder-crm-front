'use client';

import React from 'react';
import { 
  Plus, 
  MoreVertical, 
  MapPin 
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { LEADS, STAGES } from '@/lib/mockData';

export default function PipelinePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex gap-6 overflow-x-auto pb-8"
    >
      {STAGES.map(stage => (
        <div key={stage.id} className="min-w-[280px] flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", stage.color)} />
              <h3 className="text-sm font-bold text-slate-900">{stage.label}</h3>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                {LEADS.filter(l => l.stage === stage.id).length}
              </span>
            </div>
            <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors">
              <Plus size={14} />
            </button>
          </div>
          <div className="flex-1 space-y-3 p-2 bg-slate-100/50 rounded-2xl min-h-[500px]">
            {LEADS.filter(l => l.stage === stage.id).map(lead => (
              <div key={lead.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{lead.name}</h4>
                  <MoreVertical size={14} className="text-slate-300 group-hover:text-slate-500" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wider">{lead.source}</span>
                  <span className="text-[10px] font-bold text-slate-900">{lead.budget}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <MapPin size={10} />
                    {lead.site}
                  </div>
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[8px] font-bold text-indigo-700 border border-white">
                    {lead.agent.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
