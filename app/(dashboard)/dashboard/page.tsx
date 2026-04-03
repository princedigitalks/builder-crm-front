'use client';

import React from 'react';
import { 
  Users, 
  MapPin, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

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

export default function DashboardOverview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
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
  );
}
