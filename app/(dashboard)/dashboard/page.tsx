'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  MapPin,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  Clock,
  Phone,
  Building2,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';

const FUNNEL_COLORS = [
  'bg-indigo-500', 'bg-blue-500', 'bg-cyan-500',
  'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
];

const MetricCard = ({ label, value, sub, trend, icon: Icon, color }: any) => (
  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
      <div className={cn('p-1.5 rounded-lg shadow-sm', color)}>
        <Icon size={14} className="text-white" />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-semibold text-slate-900 tracking-tight leading-none">{value}</span>
      {sub && (
        <div className={cn('flex items-center gap-1 mt-1 text-[10px] font-medium',
          trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-slate-400'
        )}>
          {trend === 'up' ? <TrendingUp size={12} /> : trend === 'down' ? <TrendingDown size={12} /> : null}
          {sub}
        </div>
      )}
    </div>
  </div>
);

export default function DashboardOverview() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/lead/dashboard-stats');
      setStats(res.data.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const planExpiry = stats?.planExpiry;
  const daysLeft = planExpiry?.daysLeft ?? null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

      {/* Plan Expiry Banner */}
      {/* {planExpiry && !planExpiry.isExpired && daysLeft <= 30 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium',
            daysLeft <= 7
              ? 'bg-rose-50 border-rose-200 text-rose-700'
              : 'bg-amber-50 border-amber-200 text-amber-700'
          )}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>
              <span className="font-bold">{planExpiry.planName}</span> plan expires in{' '}
              <span className="font-bold">{daysLeft} day{daysLeft !== 1 ? 's' : ''}</span>
              {' '}— on {new Date(planExpiry.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <button
            onClick={() => router.push('/subscriptions')}
            className={cn(
              'text-[11px] font-bold px-3 py-1 rounded-lg border transition-colors',
              daysLeft <= 7
                ? 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700'
                : 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600'
            )}
          >
            Renew Now
          </button>
        </motion.div>
      )} */}

      {planExpiry?.isExpired && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-4 py-3 rounded-xl border bg-rose-50 border-rose-300 text-rose-700"
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle size={16} />
            <span>Your <span className="font-bold">{planExpiry.planName}</span> plan has expired. Please renew to continue.</span>
          </div>
          <button
            onClick={() => router.push('/subscriptions')}
            className="text-[11px] font-bold px-3 py-1 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors"
          >
            Renew Now
          </button>
        </motion.div>
      )}


      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm animate-pulse h-24" />
          ))
        ) : (
          <>
            <MetricCard
              label="Total Leads"
              value={stats?.totalLeads ?? '—'}
              sub={stats?.thisWeekLeads != null ? `${stats.weekChange >= 0 ? '+' : ''}${stats.weekChange}% vs last week` : undefined}
              trend={stats?.weekChange >= 0 ? 'up' : 'down'}
              icon={Users}
              color="bg-indigo-500"
            />
            <MetricCard
              label="This Week"
              value={stats?.thisWeekLeads ?? '—'}
              sub="New leads this week"
              trend="up"
              icon={TrendingUp}
              color="bg-emerald-500"
            />
            <MetricCard
              label="Today's Follow-ups"
              value={stats?.todayFollowups?.length ?? '—'}
              sub="Scheduled for today"
              trend="neutral"
              icon={Clock}
              color="bg-amber-500"
            />
            <MetricCard
              label="Lead Stages"
              value={stats?.funnel?.length ?? '—'}
              sub="Active pipeline stages"
              trend="neutral"
              icon={CheckCircle2}
              color="bg-indigo-600"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Follow-ups */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">Today&apos;s Follow-ups</h3>
            <div className="flex items-center gap-2">
              <button onClick={fetchStats} className="text-slate-400 hover:text-indigo-600 transition-colors">
                <RefreshCw size={12} />
              </button>
              <button onClick={() => router.push('/reminders')} className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">View All</button>
            </div>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : stats?.todayFollowups?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <CheckCircle2 size={32} className="mb-2 text-slate-200" />
              <p className="text-xs font-medium">No follow-ups scheduled for today</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {(stats?.todayFollowups || []).map((item: any, i: number) => (
                <div key={i} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-[10px] border border-slate-200">
                      {item.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {item.phone && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Phone size={9} /> {item.phone}
                          </span>
                        )}
                        {item.site && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Building2 size={9} /> {item.site}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold text-slate-900">{item.time}</p>
                    {item.budget && (
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-100">
                        {item.budget}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lead Funnel */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <h3 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-4">Lead Funnel</h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 bg-slate-50 rounded animate-pulse" />
              ))}
            </div>
          ) : stats?.funnel?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <MapPin size={28} className="mb-2 text-slate-200" />
              <p className="text-xs font-medium">No lead data yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(stats?.funnel || []).map((stage: any, i: number) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    <span className="truncate max-w-[120px]">{stage.label}</span>
                    <span>{stage.count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.percent}%` }}
                      transition={{ duration: 0.8, delay: i * 0.08 }}
                      className={cn('h-full rounded-full shadow-sm', FUNNEL_COLORS[i % FUNNEL_COLORS.length])}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Source Distribution */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-center">
          <h3 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-8 self-start">Source Distribution</h3>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Large Circle Representation */}
              <div className="relative w-56 h-56 flex-shrink-0 mb-10">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  {stats?.sources?.map((s: any, i: number) => {
                    const total = stats.totalLeads || 1;
                    const percent = (s.count / total) * 100;
                    const offset = stats.sources.slice(0, i).reduce((acc: number, curr: any) => acc + (curr.count / total) * 100, 0);
                    return (
                      <circle
                        key={i}
                        cx="18" cy="18" r="16"
                        fill="transparent"
                        stroke={['#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'][i % 6]}
                        strokeWidth="4.5"
                        strokeDasharray={`${percent} ${100 - percent}`}
                        strokeDashoffset={-offset}
                        className="transition-all duration-1000"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-900 leading-none">{stats?.totalLeads}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Leads</span>
                </div>
              </div>

              <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-50">
                {(stats?.sources || []).map((source: any, i: number) => (
                  <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className={cn("w-3 h-3 rounded-full shrink-0", FUNNEL_COLORS[i % FUNNEL_COLORS.length])} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-bold text-slate-700 truncate leading-tight">{source.label}</span>
                      <span className="text-[10px] font-black text-indigo-600">{Math.round((source.count / (stats?.totalLeads || 1)) * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Staff Performance - Scalable List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <h3 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-8">Team Productivity</h3>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {(stats?.staffStats || []).map((staff: any, i: number) => {
                const total = stats.totalLeads || 1;
                const percent = (staff.count / total) * 100;
                return (
                  <div key={i} className="group p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:text-indigo-600 border border-slate-100 transition-colors">
                           {staff.label.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                         </div>
                         <span className="text-xs font-bold text-slate-700">{staff.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-slate-900">{staff.count} <span className="text-[10px] text-slate-400 font-bold ml-0.5">Leads</span></span>
                        <span className="text-[10px] font-black text-indigo-500 w-8 text-right">{Math.round(percent)}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 1, delay: i * 0.05 }}
                        className="h-full bg-indigo-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
              {stats?.staffStats?.length === 0 && (
                <div className="py-20 text-center">
                   <Users size={32} className="mx-auto text-slate-200 mb-4" />
                   <p className="text-xs font-medium text-slate-400 italic">No productivity data</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Plan Expiry - Small Floating Widget at Bottom Right */}
      {planExpiry && (
        <div className="fixed bottom-6 right-6 z-40">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={cn(
              'flex items-center gap-4 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md',
              planExpiry.isExpired ? 'bg-rose-50/90 border-rose-100' : daysLeft <= 7 ? 'bg-rose-50/90 border-rose-100' : daysLeft <= 30 ? 'bg-amber-50/90 border-amber-100' : 'bg-white/90 border-slate-100'
            )}
          >
            <div className={cn(
              'p-2 rounded-xl',
              planExpiry.isExpired ? 'bg-rose-100' : daysLeft <= 7 ? 'bg-rose-100' : daysLeft <= 30 ? 'bg-amber-100' : 'bg-indigo-50'
            )}>
              <Calendar size={18} className={cn(
                planExpiry.isExpired ? 'text-rose-600' : daysLeft <= 7 ? 'text-rose-600' : daysLeft <= 30 ? 'text-amber-600' : 'text-indigo-600'
              )} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                {planExpiry.isExpired ? 'Expired Plan' : 'Active Plan'}
              </p>
              <p className="text-xs font-bold text-slate-800 leading-none mb-1.5">{planExpiry.planName}</p>
              <div className="flex items-center gap-2">
                <p className={cn(
                  'text-lg font-black leading-none tracking-tighter',
                  planExpiry.isExpired ? 'text-rose-600' : daysLeft <= 7 ? 'text-rose-600' : daysLeft <= 30 ? 'text-amber-600' : 'text-indigo-600'
                )}>
                  {planExpiry.isExpired ? '0' : daysLeft}
                  <span className="text-[10px] font-bold ml-1 uppercase">{planExpiry.isExpired ? 'Days' : 'Days left'}</span>
                </p>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-100 mx-1" />
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Expires</p>
              <p className="text-[10px] text-slate-700 font-black">
                {new Date(planExpiry.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
