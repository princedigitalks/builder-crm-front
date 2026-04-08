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
  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
      <div className={cn("p-1.5 rounded-lg shadow-sm", color)}>
        <Icon size={14} className="text-white" />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-semibold text-slate-900 tracking-tight leading-none">{value}</span>
      <div className={cn("flex items-center gap-1 mt-1 text-[10px] font-medium", trend === 'up' ? "text-emerald-600" : "text-rose-600")}>
        {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
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
      className="space-y-6"
    >
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Leads" value="3,240" change="↑ 124 this week" trend="up" icon={Users} color="bg-indigo-500" />
        <MetricCard label="Active Leads" value="841" change="↑ 14% vs last week" trend="up" icon={TrendingUp} color="bg-emerald-500" />
        <MetricCard label="Site Visits" value="12" change="8 confirmed tomorrow" trend="up" icon={MapPin} color="bg-amber-500" />
        <MetricCard label="Closed (MTD)" value="38" change="14.2% conversion" trend="up" icon={CheckCircle2} color="bg-indigo-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Follow-ups */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">Today&apos;s Follow-ups</h3>
            <button className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">View All</button>
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { name: 'Amit Sharma', site: 'Skyline Heights', budget: '₹80L', time: '10:30 AM', status: 'High Priority' },
              { name: 'Pooja Verma', site: 'Skyline Grand', budget: '₹1.2Cr', time: '11:45 AM', status: 'Site Visit' },
              { name: 'Ravi Gupta', site: 'Skyline Heights', budget: '₹65L', time: '02:15 PM', status: 'Negotiation' },
              { name: 'Sunita Patel', site: 'Skyline Grand', budget: '₹90L', time: '04:00 PM', status: 'Follow-up' },
            ].map((item, i) => (
              <div key={i} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-[10px] border border-slate-200">
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{item.site} · {item.budget}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold text-slate-900">{item.time}</p>
                  <span className={cn(
                    "text-[9px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider border",
                    item.status === 'High Priority' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-500 border-slate-100"
                  )}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Funnel */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <h3 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-4">Lead Funnel</h3>
          <div className="space-y-3">
            {[
              { label: 'New', count: 268, percent: 100, color: 'bg-indigo-500' },
              { label: 'Contacted', count: 220, percent: 82, color: 'bg-blue-500' },
              { label: 'Interested', count: 162, percent: 60, color: 'bg-cyan-500' },
              { label: 'Site Visit', count: 107, percent: 40, color: 'bg-emerald-500' },
              { label: 'Negotiation', count: 68, percent: 25, color: 'bg-amber-500' },
              { label: 'Closed Won', count: 38, percent: 14, color: 'bg-green-600' },
            ].map((stage, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  <span>{stage.label}</span>
                  <span>{stage.count}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.percent}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={cn("h-full rounded-full shadow-sm", stage.color)} 
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
