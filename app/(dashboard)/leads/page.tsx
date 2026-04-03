'use client';

import React from 'react';
import { 
  Filter, 
  Download, 
  MoreVertical 
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { LEADS, Lead } from '@/lib/mockData';

const LeadRow = ({ lead }: { lead: Lead }) => (
  <tr className="group hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
    <td className="py-4 px-4">
      <div className="font-semibold text-slate-900">{lead.name}</div>
      <div className="text-xs text-slate-500 mt-0.5">{lead.createdAt}</div>
    </td>
    <td className="py-4 px-4 text-sm text-slate-600">{lead.phone}</td>
    <td className="py-4 px-4 text-sm text-slate-600">{lead.site}</td>
    <td className="py-4 px-4">
      <span className={cn(
        "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
        lead.source === 'WhatsApp' ? "bg-emerald-100 text-emerald-700" :
        lead.source === 'Facebook' ? "bg-blue-100 text-blue-700" :
        "bg-purple-100 text-purple-700"
      )}>
        {lead.source}
      </span>
    </td>
    <td className="py-4 px-4 text-sm font-medium text-slate-900">{lead.budget}</td>
    <td className="py-4 px-4">
      <span className={cn(
        "text-[11px] font-bold px-2.5 py-1 rounded-full",
        lead.stage === 'New' ? "bg-indigo-100 text-indigo-700" :
        lead.stage === 'Contacted' ? "bg-blue-100 text-blue-700" :
        lead.stage === 'Interested' ? "bg-cyan-100 text-cyan-700" :
        lead.stage === 'Site Visit' ? "bg-emerald-100 text-emerald-700" :
        lead.stage === 'Negotiation' ? "bg-amber-100 text-amber-700" :
        "bg-green-100 text-green-700"
      )}>
        {lead.stage}
      </span>
    </td>
    <td className="py-4 px-4 text-sm text-slate-600">{lead.agent}</td>
    <td className="py-4 px-4 text-right">
      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
        <MoreVertical size={16} />
      </button>
    </td>
  </tr>
);

export default function LeadsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold">All Leads</button>
          <button className="px-4 py-1.5 text-slate-500 hover:bg-slate-50 rounded-lg text-sm font-bold transition-colors">My Leads</button>
          <button className="px-4 py-1.5 text-slate-500 hover:bg-slate-50 rounded-lg text-sm font-bold transition-colors">Unassigned</button>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100">
            <Filter size={18} />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100">
            <Download size={18} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="py-4 px-4">Lead</th>
              <th className="py-4 px-4">Phone</th>
              <th className="py-4 px-4">Site</th>
              <th className="py-4 px-4">Source</th>
              <th className="py-4 px-4">Budget</th>
              <th className="py-4 px-4">Stage</th>
              <th className="py-4 px-4">Agent</th>
              <th className="py-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {LEADS.map(lead => (
              <LeadRow key={lead.id} lead={lead} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-slate-100 flex items-center justify-between">
        <p className="text-xs text-slate-500">Showing 6 of 3,240 leads</p>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1 text-xs font-bold text-slate-400 cursor-not-allowed">Prev</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 text-xs font-bold">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 text-xs font-bold">3</button>
          <button className="px-3 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg">Next</button>
        </div>
      </div>
    </motion.div>
  );
}
