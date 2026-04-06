'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, Search, PhoneCall, MessageCircle, Clock, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const mockReminders = [
  { id: 1, lead: 'Rahul Sharma', project: 'Skyline Hub', type: 'Call', time: '10:30 AM', status: 'Pending', priority: 'High' },
  { id: 2, lead: 'Priya Patel', project: 'Green Valley', type: 'WhatsApp', time: '11:15 AM', status: 'Pending', priority: 'Medium' },
  { id: 3, lead: 'Amit Kumar', project: 'Oceanview Heights', type: 'Call', time: '02:00 PM', status: 'Completed', priority: 'High' },
  { id: 4, lead: 'Sneha Gupta', project: 'Skyline Hub', type: 'WhatsApp', time: '04:45 PM', status: 'Pending', priority: 'Low' },
];

export default function RemindersPage() {
  const [activeTab, setActiveTab] = useState('Today');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 px-6">
      {/* High-Density Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">Follow-ups</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Daily Task Management</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors pointer-events-none" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-slate-300 transition-all w-48 sm:w-64"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-50 p-1 rounded-xl w-fit mb-6">
        {['Missed', 'Today', 'Upcoming', 'Completed'].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-2 rounded-lg text-[10px] uppercase tracking-widest font-black transition-all flex items-center gap-2",
              activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {tab === 'Missed' && <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4 w-12">Action</th>
                  <th className="px-6 py-4">Lead Information</th>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Schedule</th>
                  <th className="px-6 py-4 text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence>
                  {mockReminders.filter(r => r.lead.toLowerCase().includes(searchTerm.toLowerCase())).map((reminder) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={reminder.id} 
                      className={cn(
                        "hover:bg-slate-50/50 transition-colors group cursor-pointer",
                        reminder.status === 'Completed' && "opacity-60"
                      )}
                    >
                      {/* Checkbox / Status toggle */}
                      <td className="px-6 py-4">
                        <button className={cn(
                          "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                          reminder.status === 'Completed' 
                            ? "bg-emerald-500 border-emerald-500 text-white" 
                            : "border-slate-300 hover:border-slate-400 text-transparent hover:text-slate-200"
                        )}>
                           <CheckCircle2 size={12} fill="currentColor" className={reminder.status === 'Completed' ? "text-white" : "text-slate-300"} />
                        </button>
                      </td>
                      
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              reminder.type === 'Call' ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
                            )}>
                               {reminder.type === 'Call' ? <PhoneCall size={12} /> : <MessageCircle size={12} />}
                            </div>
                            <div>
                               <span className="font-bold text-slate-900 text-sm tracking-tight block">{reminder.lead}</span>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{reminder.type} Follow-up</span>
                            </div>
                         </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md">
                           {reminder.project}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-600 font-bold text-xs bg-slate-50 px-2 py-1 w-fit rounded border border-slate-100">
                           <Clock size={12} className="text-slate-400" />
                           {reminder.time}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ml-1">
                          <MoreHorizontal size={14} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}
