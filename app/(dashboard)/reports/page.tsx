'use client';

import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Building2, 
  TrendingUp, 
  Calendar, 
  Download, 
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchSites } from '@/redux/slices/siteSlice';
import { fetchLeads } from '@/redux/slices/leadSlice';
import { fetchTeams } from '@/redux/slices/teamSlice';
import { cn } from '@/lib/utils';

export default function ReportsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { sites } = useSelector((state: RootState) => state.site);
  const { leads, loading: leadsLoading } = useSelector((state: RootState) => state.lead);
  const { teams } = useSelector((state: RootState) => state.team);

  useEffect(() => {
    dispatch(fetchSites());
    dispatch(fetchLeads({ page: 1, limit: 1000 })); // Fetch more for reporting
    dispatch(fetchTeams());
  }, [dispatch]);

  // Data Processing
  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const activeSites = sites.filter(s => s.status === 'Active').length;
    const totalStaff = teams.reduce((acc, team) => acc + (team.members?.length || 0), 0);
    
    // Calculate lead status breakdown
    const statusCounts: Record<string, number> = {};
    const sourceCounts: Record<string, number> = {};
    
    leads.forEach(lead => {
      const status = lead.stageName || 'New';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      
      const source = lead.source || 'Direct';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    // Calculate site performance
    const sitePerformance = sites.map(site => ({
      name: site.name,
      leadCount: leads.filter(l => l.siteId?._id === site._id || l.siteId === site._id).length,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    })).sort((a, b) => b.leadCount - a.leadCount).slice(0, 5);

    return {
      totalLeads,
      activeSites,
      totalStaff,
      statusCounts,
      sourceCounts,
      sitePerformance,
      conversionRate: totalLeads > 0 ? Math.round(((statusCounts['Closed'] || 0) / totalLeads) * 100) : 0
    };
  }, [leads, sites, teams]);

  const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-2xl", color)}>
          <Icon size={20} className="text-white" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
            trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 px-4 pt-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Business Intelligence</h1>
          <p className="text-xs text-slate-400 flex items-center gap-2 font-medium">
            <BarChart3 size={12} className="text-indigo-500" />
            Performance metrics and lead distribution analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            <Calendar size={14} /> Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl text-xs font-bold text-white hover:bg-slate-800 transition-all shadow-lg active:scale-95">
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Leads" value={stats.totalLeads} icon={TrendingUp} trend={12} color="bg-indigo-500" />
        <StatCard title="Active Sites" value={stats.activeSites} icon={Building2} color="bg-emerald-500" />
        <StatCard title="Total Staff" value={stats.totalStaff} icon={Users} color="bg-amber-500" />
        <StatCard title="Conversion" value={`${stats.conversionRate}%`} icon={CheckCircle2} trend={-3} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Pipeline */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900">Lead Pipeline Breakdown</h3>
              <p className="text-xs text-slate-400 font-medium">Distribution by sales stage</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
              <Filter size={16} />
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(stats.statusCounts).length > 0 ? (
              Object.entries(stats.statusCounts).map(([status, count], idx) => {
                const percentage = Math.round((count / stats.totalLeads) * 100);
                const colors = [
                  'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-sky-500', 'bg-violet-500'
                ];
                const color = colors[idx % colors.length];

                return (
                  <div key={status} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", color)} />
                        <span className="text-xs font-bold text-slate-700">{status}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-black text-slate-900">{count}</span>
                        <span className="text-[10px] text-slate-400 font-bold">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className={cn("h-full rounded-full shadow-lg shadow-indigo-100", color)}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-300">
                <AlertCircle size={32} strokeWidth={1} className="mb-2" />
                <p className="text-sm font-bold">No lead data available</p>
              </div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-50">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Marketing Source Distribution</h4>
            <div className="flex flex-wrap gap-4">
              {Object.entries(stats.sourceCounts).map(([source, count], idx) => {
                const percentage = Math.round((count / stats.totalLeads) * 100);
                const bgColors = ['bg-blue-50', 'bg-purple-50', 'bg-rose-50', 'bg-amber-50', 'bg-emerald-50'];
                const textColors = ['text-blue-600', 'text-purple-600', 'text-rose-600', 'text-amber-600', 'text-emerald-600'];
                
                return (
                  <div key={source} className={cn("px-4 py-3 rounded-2xl border border-transparent hover:border-slate-100 transition-all cursor-default", bgColors[idx % bgColors.length])}>
                    <p className={cn("text-[10px] font-black uppercase tracking-wider mb-1", textColors[idx % textColors.length])}>{source}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-slate-900">{count}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Site Performance */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -ml-16 -mb-16" />

          <div className="relative z-10">
            <h3 className="text-lg font-black text-white mb-1">Top Projects</h3>
            <p className="text-xs text-slate-400 font-medium mb-8">Performance by lead volume</p>

            <div className="space-y-8">
              {stats.sitePerformance.length > 0 ? (
                stats.sitePerformance.map((site, idx) => (
                  <div key={site.name} className="group cursor-pointer">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{site.name}</span>
                      <span className="text-xs font-black text-white px-2 py-0.5 bg-white/10 rounded-lg">{site.leadCount}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(site.leadCount / stats.totalLeads) * 100}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-20">No site data found</p>
              )}
            </div>

            <button className="w-full mt-10 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
              View Detailed Audit
            </button>
          </div>
        </motion.div>
      </div>

      {/* Team Insights Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">Team Insights</h3>
            <p className="text-xs text-slate-400 font-medium">Lead assignment and activity by team</p>
          </div>
          <button className="text-xs font-black text-indigo-600 hover:underline uppercase tracking-widest">View All Teams</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Name</th>
                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Members</th>
                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Leads</th>
                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {teams.map((team) => {
                const teamLeads = leads.filter(l => l.teamId === team._id || l.teamId === team.id).length;
                const efficiency = teamLeads > 0 ? Math.round((teamLeads / stats.totalLeads) * 100) : 0;
                
                return (
                  <tr key={team._id || team.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-4 font-bold text-slate-900 text-sm">{team.teamName || team.name}</td>
                    <td className="px-8 py-4">
                      <div className="flex -space-x-2">
                        {team.members?.slice(0, 3).map((m: any, i: number) => (
                          <div key={i} className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600">
                            {m.name?.[0] || 'U'}
                          </div>
                        ))}
                        {(team.members?.length || 0) > 3 && (
                          <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                            +{(team.members?.length || 0) - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{teamLeads}</span>
                        <span className="text-[10px] text-slate-400 font-bold">Leads</span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${efficiency}%` }} />
                        </div>
                        <span className="text-[10px] font-black text-slate-500">{efficiency}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        Stable
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
