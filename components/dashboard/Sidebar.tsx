'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Activity,
  Users,
  GitMerge,
  Bell,
  Building2,
  Home,
  MessageSquare,
  FileText,
  Users2,
  BarChart3,
  CreditCard,
  BookOpen,
  ExternalLink,
  Globe
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
        "w-full flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all duration-200 group",
        active
          ? "bg-indigo-50 text-indigo-600 font-semibold"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <Icon size={16} className={cn(active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
      <span className="text-xs font-medium">{label}</span>
      {badge && (
        <span className={cn(
          "ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-semibold",
          active ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
        )}>
          {badge}
        </span>
      )}
    </Link>
  );
};

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { logout, updateBuilder } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import axios from '@/lib/axios';

export default function Sidebar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, builder } = useSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = React.useState(false);
  const [todayCounts, setTodayCounts] = React.useState({ leads: 0, reminders: 0 });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const fetchProfile = async () => {
      const isMissingData = !builder || !builder.companyName;
      if (mounted && user?._id && isMissingData) {
        try {
          const response = await axios.get(`/builder/profile/${user._id}`);
          if (response.data.success && response.data.data.builder) {
            dispatch(updateBuilder(response.data.data.builder));
          }
        } catch (err) {
          console.error("Failed to fetch builder profile", err);
        }
      }
    };
    fetchProfile();
  }, [mounted, user?._id, builder?.companyName, dispatch]);

  React.useEffect(() => {
    if (!mounted || !user?._id) return;
    axios.get('/lead/today-counts')
      .then(res => setTodayCounts(res.data.data))
      .catch(() => {});
  }, [mounted, user?._id]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const name = mounted && user?.fullName ? user.fullName : "User";
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  const company = mounted && builder?.companyName ? builder.companyName : "Loading...";

  return (
    <aside className="w-56 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-50">
      <div className="p-4 border-b border-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-indigo-100">
            BF
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-semibold text-slate-900 leading-tight text-sm">BuildFlow</h1>
            <span className="text-[9px] font-semibold text-indigo-600 uppercase tracking-wider bg-indigo-50/50 px-1.5 py-0.5 rounded block truncate">
              {company}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-6 overflow-y-auto custom-scrollbar">
        {mounted && user?.role && user.role !== 'STAFF' && (
          <div>
            <p className="px-3 text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Overview</p>
            <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" />
          </div>
        )}

        <div>
          <p className="px-3 text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-2">crm</p>
          <div className="space-y-0.5">
            <SidebarItem icon={Users} label="Leads" href="/leads" badge={todayCounts.leads || undefined} />
            <SidebarItem icon={Bell} label="Reminders" href="/reminders" badge={todayCounts.reminders || undefined} />
          </div>
        </div>

        {mounted && user?.role && (user.role === 'BUILDER' || user.role === 'ADMIN') && (
          <>
            <div>
              <p className="px-3 text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Projects</p>
              <div className="space-y-0.5">
                <SidebarItem icon={Building2} label="Sites / Projects" href="/sites" />
              </div>
            </div>

            <div>
              <p className="px-3 text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Communication</p>
              <div className="space-y-0.5">
                <SidebarItem icon={MessageSquare} label="WhatsApp Numbers" href="/whatsapp" />
              </div>
            </div>

            <div>
              <p className="px-3 text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Admin</p>
              <div className="space-y-0.5">
                <SidebarItem icon={Users2} label="Staff" href="/staff" />
                <SidebarItem icon={GitMerge} label="Teams" href="/team" />
                <SidebarItem icon={BarChart3} label="Reports" href="/reports" />
                <SidebarItem icon={CreditCard} label="Billing & Plans" href="/subscriptions" />
                <SidebarItem icon={Activity} label="Status" href="/status" />
                <SidebarItem icon={BookOpen} label="Masters" href="/masters" />
                <SidebarItem icon={Globe} label="Manage Website" href="/manage-website" />
              </div>
            </div>
          </>
        )}
      </nav>

      <div className="p-3 border-t border-slate-50 space-y-2">
        {mounted && builder?._id && (
          <a
            href={`/builder/${builder._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
          >
            <ExternalLink size={14} />
            <span className="text-xs font-semibold">Visit Website</span>
          </a>
        )}
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50/50 group relative">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs shadow-sm">
            {mounted ? initials : "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {mounted ? name : "User"}
            </p>
            <p className="text-[9px] font-medium text-slate-500 truncate uppercase tracking-tighter">
              {mounted
                ? `${user?.role === 'STAFF' ? 'Staff' : 'Builder'}`
                : "Builder"
              }
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-md transition-all duration-200"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
