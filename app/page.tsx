'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GitMerge, 
  Bell, 
  Building2, 
  Home, 
  MessageSquare, 
  FileText, 
  Users2, 
  BarChart3, 
  Search, 
  Plus, 
  MoreVertical, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  ChevronRight,
  Filter,
  Download,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

// --- Types ---
type Page = 'dashboard' | 'leads' | 'pipeline' | 'reminders' | 'sites' | 'properties' | 'whatsapp' | 'team' | 'reports';

interface Lead {
  id: string;
  name: string;
  phone: string;
  site: string;
  source: 'WhatsApp' | 'Facebook' | 'Website' | 'Walk-in' | 'Referral';
  budget: string;
  stage: 'New' | 'Contacted' | 'Interested' | 'Site Visit' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  agent: string;
  createdAt: string;
}

// --- Mock Data ---
const LEADS: Lead[] = [
  { id: '1', name: 'Amit Sharma', phone: '+91 99001 23456', site: 'Skyline Heights', source: 'WhatsApp', budget: '₹80L', stage: 'Interested', agent: 'Kavya R.', createdAt: '2024-03-20' },
  { id: '2', name: 'Pooja Verma', phone: '+91 98102 34567', site: 'Skyline Grand', source: 'Facebook', budget: '₹1.2Cr', stage: 'Site Visit', agent: 'Nikhil M.', createdAt: '2024-03-21' },
  { id: '3', name: 'Ravi Gupta', phone: '+91 97203 45678', site: 'Skyline Heights', source: 'Website', budget: '₹65L', stage: 'Negotiation', agent: 'Kavya R.', createdAt: '2024-03-22' },
  { id: '4', name: 'Sunita Patel', phone: '+91 96304 56789', site: 'Skyline Grand', source: 'WhatsApp', budget: '₹90L', stage: 'Contacted', agent: 'Priya S.', createdAt: '2024-03-23' },
  { id: '5', name: 'Deepak Nair', phone: '+91 95405 67890', site: 'Skyline Heights', source: 'Facebook', budget: '₹55L', stage: 'New', agent: 'Nikhil M.', createdAt: '2024-03-24' },
  { id: '6', name: 'Meera Joshi', phone: '+91 94506 78901', site: 'Skyline Grand', source: 'WhatsApp', budget: '₹1.5Cr', stage: 'Closed Won', agent: 'Kavya R.', createdAt: '2024-03-25' },
];

const STAGES = [
  { id: 'New', label: 'New Lead', color: 'bg-indigo-500' },
  { id: 'Contacted', label: 'Contacted', color: 'bg-blue-500' },
  { id: 'Interested', label: 'Interested', color: 'bg-cyan-500' },
  { id: 'Site Visit', label: 'Site Visit', color: 'bg-emerald-500' },
  { id: 'Negotiation', label: 'Negotiation', color: 'bg-amber-500' },
  { id: 'Closed Won', label: 'Closed Won', color: 'bg-green-600' },
];

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick, 
  badge 
}: { 
  icon: any, 
  label: string, 
  active?: boolean, 
  onClick: () => void,
  badge?: string | number
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
      active 
        ? "bg-indigo-50 text-indigo-600 font-semibold" 
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    )}
  >
    <Icon size={18} className={cn(active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
    <span className="text-sm">{label}</span>
    {badge && (
      <span className={cn(
        "ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold",
        active ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
      )}>
        {badge}
      </span>
    )}
  </button>
);

const MetricCard = ({ label, value, change, trend, icon: Icon, color }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
      <div className={cn("p-2 rounded-xl", color)}>
        <Icon size={18} className="text-white" />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
      <div className={cn("flex items-center gap-1 mt-1 text-xs font-medium", trend === 'up' ? "text-emerald-600" : "text-rose-600")}>
        {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {change}
      </div>
    </div>
  </div>
);

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

export default function CRMApp() {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200">
              BF
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">BuildFlow</h1>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-1.5 py-0.5 rounded">Skyline Infra</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-8 overflow-y-auto">
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Overview</p>
            <div className="space-y-1">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
            </div>
          </div>

          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Core</p>
            <div className="space-y-1">
              <SidebarItem icon={Users} label="Leads" active={activePage === 'leads'} onClick={() => setActivePage('leads')} badge={47} />
              <SidebarItem icon={GitMerge} label="Pipeline" active={activePage === 'pipeline'} onClick={() => setActivePage('pipeline')} />
              <SidebarItem icon={Bell} label="Reminders" active={activePage === 'reminders'} onClick={() => setActivePage('reminders')} badge={8} />
            </div>
          </div>

          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Projects</p>
            <div className="space-y-1">
              <SidebarItem icon={Building2} label="Sites" active={activePage === 'sites'} onClick={() => setActivePage('sites')} />
              <SidebarItem icon={Home} label="Properties" active={activePage === 'properties'} onClick={() => setActivePage('properties')} />
            </div>
          </div>

          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Communication</p>
            <div className="space-y-1">
              <SidebarItem icon={MessageSquare} label="WhatsApp Bot" active={activePage === 'whatsapp'} onClick={() => setActivePage('whatsapp')} />
              <SidebarItem icon={FileText} label="Templates" onClick={() => {}} />
            </div>
          </div>

          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Admin</p>
            <div className="space-y-1">
              <SidebarItem icon={Users2} label="Team" active={activePage === 'team'} onClick={() => setActivePage('team')} />
              <SidebarItem icon={BarChart3} label="Reports" active={activePage === 'reports'} onClick={() => setActivePage('reports')} />
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
              RM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">Raj Mehta</p>
              <p className="text-[10px] font-medium text-slate-500 truncate">Admin · Skyline Infra</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div>
            <h2 className="text-lg font-bold text-slate-900 capitalize tracking-tight">{activePage}</h2>
            <p className="text-[11px] text-slate-500 font-medium">Skyline Infra — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search leads..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-64"
              />
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-100"
            >
              <Plus size={18} />
              Add Lead
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {activePage === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard label="Total Leads" value="3,240" change="↑ 124 this week" trend="up" icon={Users} color="bg-indigo-500" />
                  <MetricCard label="Active Leads" value="841" change="↑ 14% vs last week" trend="up" icon={TrendingUp} color="bg-emerald-500" />
                  <MetricCard label="Site Visits" value="12" change="8 confirmed tomorrow" trend="up" icon={MapPin} color="bg-amber-500" />
                  <MetricCard label="Closed (MTD)" value="38" change="14.2% conversion" trend="up" icon={CheckCircle2} color="bg-indigo-600" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Follow-ups */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-900">Today&apos;s Follow-ups</h3>
                      <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View All</button>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {[
                        { name: 'Amit Sharma', site: 'Skyline Heights', budget: '₹80L', time: '10:30 AM', status: 'High Priority' },
                        { name: 'Pooja Verma', site: 'Skyline Grand', budget: '₹1.2Cr', time: '11:45 AM', status: 'Site Visit' },
                        { name: 'Ravi Gupta', site: 'Skyline Heights', budget: '₹65L', time: '02:15 PM', status: 'Negotiation' },
                        { name: 'Sunita Patel', site: 'Skyline Grand', budget: '₹90L', time: '04:00 PM', status: 'Follow-up' },
                      ].map((item, i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                              {item.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{item.name}</p>
                              <p className="text-[11px] text-slate-500">{item.site} · {item.budget}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-slate-900">{item.time}</p>
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                              item.status === 'High Priority' ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"
                            )}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Funnel */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="font-bold text-slate-900 mb-6">Lead Funnel</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'New', count: 268, percent: 100, color: 'bg-indigo-500' },
                        { label: 'Contacted', count: 220, percent: 82, color: 'bg-blue-500' },
                        { label: 'Interested', count: 162, percent: 60, color: 'bg-cyan-500' },
                        { label: 'Site Visit', count: 107, percent: 40, color: 'bg-emerald-500' },
                        { label: 'Negotiation', count: 68, percent: 25, color: 'bg-amber-500' },
                        { label: 'Closed Won', count: 38, percent: 14, color: 'bg-green-600' },
                      ].map((stage, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-slate-600">
                            <span>{stage.label}</span>
                            <span>{stage.count}</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${stage.percent}%` }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                              className={cn("h-full rounded-full", stage.color)} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activePage === 'leads' && (
              <motion.div
                key="leads"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
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
            )}

            {activePage === 'pipeline' && (
              <motion.div
                key="pipeline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Add New Lead</h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <form className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                    <input type="text" placeholder="e.g. Rahul Sharma" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                    <input type="text" placeholder="+91 98765 43210" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Site / Project</label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none">
                      <option>Skyline Heights</option>
                      <option>Skyline Grand</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Source</label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none">
                      <option>WhatsApp</option>
                      <option>Facebook</option>
                      <option>Website</option>
                      <option>Walk-in</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Budget Range</label>
                    <input type="text" placeholder="e.g. ₹80L - ₹1Cr" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assign Agent</label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none">
                      <option>Auto Assign (Round Robin)</option>
                      <option>Kavya Reddy</option>
                      <option>Nikhil Mehta</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100"
                  >
                    Create Lead
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
