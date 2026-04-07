'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, Search, PhoneCall, MessageCircle, Clock, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import CommonTable from '@/components/ui/CommonTable';

const mockReminders = [
  { id: 1, lead: 'Rahul Sharma', project: 'Skyline Hub', type: 'Call', time: '10:30 AM', status: 'Pending', priority: 'High' },
  { id: 2, lead: 'Priya Patel', project: 'Green Valley', type: 'WhatsApp', time: '11:15 AM', status: 'Pending', priority: 'Medium' },
  { id: 3, lead: 'Amit Kumar', project: 'Oceanview Heights', type: 'Call', time: '02:00 PM', status: 'Completed', priority: 'High' },
  { id: 4, lead: 'Sneha Gupta', project: 'Skyline Hub', type: 'WhatsApp', time: '04:45 PM', status: 'Pending', priority: 'Low' },
];

export default function RemindersPage() {
  const [activeTab, setActiveTab] = useState('Today');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReminders = mockReminders.filter(r => 
    r.lead.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Action',
      key: 'status',
      className: 'w-12',
      render: (reminder: any) => (
        <button className={cn(
          "w-5 h-5 rounded border flex items-center justify-center transition-colors",
          reminder.status === 'Completed' 
            ? "bg-emerald-500 border-emerald-500 text-white" 
            : "border-slate-300 hover:border-slate-400 text-transparent hover:text-slate-200"
        )}>
           <CheckCircle2 size={12} fill="currentColor" className={reminder.status === 'Completed' ? "text-white" : "text-slate-300"} />
        </button>
      )
    },
    {
      header: 'Lead Information',
      key: 'lead',
      render: (reminder: any) => (
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
      )
    },
    {
      header: 'Project',
      key: 'project',
      render: (reminder: any) => (
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md">
           {reminder.project}
        </span>
      )
    },
    {
      header: 'Schedule',
      key: 'time',
      render: (reminder: any) => (
        <div className="flex items-center gap-1.5 text-slate-600 font-bold text-xs bg-slate-50 px-2 py-1 w-fit rounded border border-slate-100">
           <Clock size={12} className="text-slate-400" />
           {reminder.time}
        </div>
      )
    },
    {
      header: 'Options',
      key: 'options',
      className: 'text-right',
      render: () => (
        <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ml-1">
          <MoreHorizontal size={14} />
        </button>
      )
    }
  ];

  return (
    <div className=" mx-auto space-y-6 pb-20 px-6">
      {/* High-Density Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">Follow-ups</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Daily Task Management</p>
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

      <CommonTable 
        title="Daily Tasks"
        columns={columns}
        data={filteredReminders}
        loading={false}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search leads..."
        pagination={{
          totalItems: filteredReminders.length,
          totalPages: 1,
          currentPage: 1,
          limit: 10
        }}
        onPageChange={() => {}}
      />
    </div>
  );
}
