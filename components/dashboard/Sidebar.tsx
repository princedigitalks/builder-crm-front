'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  href,
  badge 
}: { 
  icon: any, 
  label: string, 
  href: string,
  badge?: string | number
}) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
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
    </Link>
  );
};

export default function Sidebar() {
  return (
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
            <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" />
          </div>
        </div>

        <div>
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Core</p>
          <div className="space-y-1">
            <SidebarItem icon={Users} label="Leads" href="/leads" badge={47} />
            <SidebarItem icon={GitMerge} label="Pipeline" href="/pipeline" />
            <SidebarItem icon={Bell} label="Reminders" href="/reminders" badge={8} />
          </div>
        </div>

        <div>
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Projects</p>
          <div className="space-y-1">
            <SidebarItem icon={Building2} label="Sites" href="/sites" />
            <SidebarItem icon={Home} label="Properties" href="/properties" />
          </div>
        </div>

        <div>
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Communication</p>
          <div className="space-y-1">
            <SidebarItem icon={MessageSquare} label="WhatsApp Bot" href="/whatsapp" />
            <SidebarItem icon={FileText} label="Templates" href="/templates" />
          </div>
        </div>

        <div>
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Admin</p>
          <div className="space-y-1">
            <SidebarItem icon={Users2} label="Team" href="/team" />
            <SidebarItem icon={BarChart3} label="Reports" href="/reports" />
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
  );
}
