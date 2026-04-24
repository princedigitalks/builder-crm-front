'use client';

import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Building2, Users, CheckCircle2,
  PhoneCall, Target, Download, RefreshCw,
  ArrowUpRight, ArrowDownRight, AlertCircle,
  BarChart3, PieChart, Activity
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchReportStats } from '@/redux/slices/reportSlice';
import { cn } from '@/lib/utils';
import { format, subDays } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DATE_FILTERS = [
  { id: 'today', label: 'Today' },
  { id: '7days', label: '7 Days' },
  { id: '30days', label: '30 Days' },
  { id: 'custom', label: 'Custom' },
];

const COLORS = {
  stage: [
    { bar: 'bg-violet-500', light: 'bg-violet-50', text: 'text-violet-600' },
    { bar: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600' },
    { bar: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600' },
    { bar: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-600' },
    { bar: 'bg-rose-500', light: 'bg-rose-50', text: 'text-rose-600' },
    { bar: 'bg-sky-500', light: 'bg-sky-50', text: 'text-sky-600' },
  ],
};

function SkeletonBar() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="flex justify-between">
        <div className="h-3 bg-slate-100 rounded w-28" />
        <div className="h-3 bg-slate-100 rounded w-10" />
      </div>
      <div className="h-2 bg-slate-100 rounded-full w-full" />
    </div>
  );
}

export default function ReportsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { summary, stageCounts, sourceCounts, agentCounts, sitePerformance, loading } =
    useSelector((state: RootState) => state.report);

  const [dateFilter, setDateFilter] = React.useState('30days');
  const [customRange, setCustomRange] = React.useState({
    start: '',
    end: '',
  });
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    setCustomRange({
      start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
      end: format(new Date(), 'yyyy-MM-dd'),
    });
  }, []);

  const loadData = useCallback(() => {
    dispatch(fetchReportStats({
      filter: dateFilter,
      startDate: dateFilter === 'custom' ? customRange.start : undefined,
      endDate: dateFilter === 'custom' ? customRange.end : undefined,
    }));
  }, [dispatch, dateFilter, customRange]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Header Mesh/Gradient feel
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, 210, 50, 'F');
    
    // Accent Line
    doc.setFillColor(79, 70, 229); // Indigo 600
    doc.rect(0, 48, 210, 2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('BUSINESS AUDIT REPORT', 14, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text('PERFORMANCE ANALYTICS & PIPELINE METRICS', 14, 33);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(`Generated: ${format(new Date(), 'PPP p')}`, 14, 42);
    doc.text(`Period: ${dateFilter.toUpperCase()}${dateFilter === 'custom' ? ` (${customRange.start} to ${customRange.end})` : ''}`, 140, 42);

    // Summary Section
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Performance Indicators', 14, 65);
    
    autoTable(doc, {
      startY: 70,
      head: [['Metric', 'Value', 'Status']],
      body: [
        ['Total Leads Generated', summary.totalLeads.toString(), summary.leadChange >= 0 ? 'Trending Up' : 'Trending Down'],
        ['Lead Conversion Rate', `${summary.conversionRate}%`, summary.conversionRate > 20 ? 'High' : 'Normal'],
        ['Followup Engagement', `${summary.followupRate}%`, 'Active'],
        ['Staff Productivity', summary.totalStaff.toString(), 'Stable'],
        ['Project Footprint', summary.activeSites.toString(), 'Operational'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 4 },
      columnStyles: { 1: { fontStyle: 'bold' } }
    });

    // Lead Pipeline
    const pipelineY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('Lead Pipeline Distribution', 14, pipelineY);
    
    autoTable(doc, {
      startY: pipelineY + 5,
      head: [['Sales Stage', 'Lead Count', 'Market Share']],
      body: stageCounts.map(s => [
        s.label, 
        s.count.toString(), 
        `${summary.totalLeads > 0 ? Math.round((s.count / summary.totalLeads) * 100) : 0}%`
      ]),
      theme: 'striped',
      headStyles: { fillColor: [51, 65, 85] },
      styles: { fontSize: 9 }
    });

    // Project Performance
    const projectY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('Site Performance Analysis', 14, projectY);
    
    autoTable(doc, {
      startY: projectY + 5,
      head: [['Project Name', 'Leads', 'Status']],
      body: sitePerformance.map(s => [s.label, s.count.toString(), s.status || 'Active']),
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
      styles: { fontSize: 9 }
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount} `, 105, 290, { align: 'center' });
    }

    doc.save(`Audit_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const maxStage = stageCounts[0]?.count || 1;
  const maxSite = sitePerformance[0]?.count || 1;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Audit Intelligence</h1>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-2 mt-1">
              <Activity size={12} className="text-indigo-500" />
              Performance analytics and pipeline audit log
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Date filter tabs */}
            <div className="flex bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
              {DATE_FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setDateFilter(f.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-xs font-semibold transition-all',
                    dateFilter === f.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {dateFilter === 'custom' && (
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
                <input
                  type="date"
                  value={customRange.start}
                  onChange={e => setCustomRange(p => ({ ...p, start: e.target.value }))}
                  className="text-xs text-slate-700 bg-transparent focus:outline-none"
                />
                <span className="text-slate-300">–</span>
                <input
                  type="date"
                  value={customRange.end}
                  onChange={e => setCustomRange(p => ({ ...p, end: e.target.value }))}
                  className="text-xs text-slate-700 bg-transparent focus:outline-none"
                />
              </div>
            )}

            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 shadow-sm transition-all"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95"
            >
              <Download size={13} /> Export PDF
            </button>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Leads',
              value: summary.totalLeads,
              icon: TrendingUp,
              iconBg: 'bg-indigo-100',
              iconColor: 'text-indigo-600',
              trend: summary.leadChange,
            },
            {
              label: 'Active Sites',
              value: summary.activeSites,
              icon: Building2,
              iconBg: 'bg-emerald-100',
              iconColor: 'text-emerald-600',
            },
            {
              label: 'Total Staff',
              value: summary.totalStaff,
              icon: Users,
              iconBg: 'bg-amber-100',
              iconColor: 'text-amber-600',
            },
            {
              label: 'Conversion Rate',
              value: `${summary.conversionRate}%`,
              icon: CheckCircle2,
              iconBg: 'bg-rose-100',
              iconColor: 'text-rose-600',
            },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', card.iconBg)}>
                  <card.icon size={17} className={card.iconColor} />
                </div>
                {card.trend !== undefined && (
                  <span className={cn(
                    'flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full',
                    card.trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  )}>
                    {card.trend >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                    {Math.abs(card.trend)}%
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-slate-900">{loading ? '—' : card.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Followup Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Total Followups', value: summary.totalFollowups, icon: PhoneCall, color: 'text-sky-600', bg: 'bg-sky-100', border: 'border-sky-100' },
            { label: 'Completed', value: summary.completedFollowups, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-100' },
            // { label: 'Completion Rate', value: `${summary.followupRate}%`, icon: Target, color: 'text-violet-600', bg: 'bg-violet-100', border: 'border-violet-100' },
          ].map(item => (
            <div key={item.label} className={cn('bg-white rounded-xl border p-4 shadow-sm flex items-center gap-4', item.border)}>
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', item.bg)}>
                <item.icon size={18} className={item.color} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{loading ? '—' : item.value}</p>
                <p className="text-xs text-slate-500">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Lead Pipeline — 3 cols */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
              <BarChart3 size={15} className="text-indigo-500" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Lead Pipeline</h3>
                <p className="text-xs text-slate-400">By sales stage</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {loading
                ? [1, 2, 3, 4].map(i => <SkeletonBar key={i} />)
                : stageCounts.length > 0
                  ? stageCounts.map((s, idx) => {
                      const pct = Math.round((s.count / maxStage) * 100);
                      const displayPct = summary.totalLeads > 0 ? Math.round((s.count / summary.totalLeads) * 100) : 0;
                      const c = COLORS.stage[idx % COLORS.stage.length];
                      return (
                        <div key={s.label}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className={cn('w-2 h-2 rounded-full flex-shrink-0', c.bar)} />
                              <span className="text-sm text-slate-700 font-medium">{s.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900">{s.count}</span>
                              <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', c.light, c.text)}>
                                {displayPct}%
                              </span>
                            </div>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.7, delay: idx * 0.07, ease: 'easeOut' }}
                              className={cn('h-full rounded-full', c.bar)}
                            />
                          </div>
                        </div>
                      );
                    })
                  : (
                    <div className="py-16 flex flex-col items-center text-slate-300">
                      <AlertCircle size={32} strokeWidth={1.5} />
                      <p className="text-sm mt-2 font-medium">No data for this period</p>
                    </div>
                  )
              }
            </div>
          </div>

          {/* Source Distribution — 2 cols */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
              <PieChart size={15} className="text-violet-500" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Lead Sources</h3>
                <p className="text-xs text-slate-400">Where leads come from</p>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {loading
                ? [1, 2, 3].map(i => <SkeletonBar key={i} />)
                : sourceCounts.length > 0
                  ? sourceCounts.map((s, idx) => {
                      const pct = summary.totalLeads > 0 ? Math.round((s.count / summary.totalLeads) * 100) : 0;
                      const c = COLORS.stage[idx % COLORS.stage.length];
                      return (
                        <div key={s.label} className="flex items-center gap-3">
                          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold', c.light, c.text)}>
                            {s.label.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-medium text-slate-700 truncate">{s.label}</span>
                              <span className="text-xs font-bold text-slate-900 ml-2">{s.count}</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.7, delay: idx * 0.07 }}
                                className={cn('h-full rounded-full', c.bar)}
                              />
                            </div>
                          </div>
                          <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0', c.light, c.text)}>
                            {pct}%
                          </span>
                        </div>
                      );
                    })
                  : (
                    <div className="py-16 flex flex-col items-center text-slate-300">
                      <AlertCircle size={28} strokeWidth={1.5} />
                      <p className="text-xs mt-2 font-medium">No source data</p>
                    </div>
                  )
              }
            </div>
          </div>
        </div>

        {/* ── Bottom Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Site Performance */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
              <Building2 size={15} className="text-emerald-500" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Site Performance</h3>
                <p className="text-xs text-slate-400">Leads per project</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {loading
                ? [1, 2, 3].map(i => <SkeletonBar key={i} />)
                : sitePerformance.length > 0
                  ? sitePerformance.map((site, idx) => {
                      const pct = Math.round((site.count / maxSite) * 100);
                      return (
                        <div key={site.label}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
                                <Building2 size={11} className="text-emerald-600" />
                              </div>
                              <span className="text-sm text-slate-700 font-medium truncate max-w-[160px]">{site.label}</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900">{site.count} leads</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.7, delay: idx * 0.07 }}
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                            />
                          </div>
                        </div>
                      );
                    })
                  : (
                    <div className="py-12 flex flex-col items-center text-slate-300">
                      <AlertCircle size={28} strokeWidth={1.5} />
                      <p className="text-xs mt-2 font-medium">No site data</p>
                    </div>
                  )
              }
            </div>
          </div>

          {/* Agent Performance */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
              <Activity size={15} className="text-amber-500" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Agent Performance</h3>
                <p className="text-xs text-slate-400">Leads handled per agent</p>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {loading
                ? (
                  <div className="p-6 space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-3 bg-slate-100 rounded w-32" />
                          <div className="h-2 bg-slate-100 rounded w-full" />
                        </div>
                        <div className="h-3 bg-slate-100 rounded w-8" />
                      </div>
                    ))}
                  </div>
                )
                : agentCounts.length > 0
                  ? agentCounts.map((agent, idx) => {
                      const pct = summary.totalLeads > 0 ? Math.round((agent.count / summary.totalLeads) * 100) : 0;
                      const avatarColors = [
                        'bg-indigo-100 text-indigo-700',
                        'bg-violet-100 text-violet-700',
                        'bg-amber-100 text-amber-700',
                        'bg-rose-100 text-rose-700',
                        'bg-sky-100 text-sky-700',
                      ];
                      return (
                        <div key={agent.label} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 transition-colors">
                          <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0', avatarColors[idx % avatarColors.length])}>
                            {agent.label[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-slate-800 truncate">{agent.label}</span>
                              <span className="text-xs font-bold text-slate-900 ml-2">{agent.count}</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.7, delay: idx * 0.07 }}
                                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                              />
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-400 w-8 text-right flex-shrink-0">{pct}%</span>
                        </div>
                      );
                    })
                  : (
                    <div className="py-12 flex flex-col items-center text-slate-300">
                      <AlertCircle size={28} strokeWidth={1.5} />
                      <p className="text-xs mt-2 font-medium">No agent data</p>
                    </div>
                  )
              }
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
