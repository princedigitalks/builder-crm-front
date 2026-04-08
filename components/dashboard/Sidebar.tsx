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
  CreditCard
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

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const fetchProfile = async () => {
      // Only fetch if we are missing the critical company information 
      // AND we have a user session. This prevents unnecessary API calls.
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

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const name = mounted && user?.fullName ? user.fullName : "User";
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  const company = mounted && builder?.companyName ? builder.companyName : "Loading...";

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-50">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200">
            BF
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-bold text-slate-900 leading-tight">BuildFlow</h1>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-1.5 py-0.5 rounded block truncate">
              {company}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-8 overflow-y-auto custom-scrollbar">
        {mounted && user?.role && user.role !== 'STAFF' && (
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Overview</p>
            <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" />
          </div>
        )}

        <div>
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Core</p>
          <div className="space-y-1">
            <SidebarItem icon={Users} label="Leads" href="/leads" badge={47} />
            <SidebarItem icon={Bell} label="Reminders" href="/reminders" badge={8} />
          </div>
        </div>

        {mounted && user?.role && (user.role === 'BUILDER' || user.role === 'ADMIN') && (
          <>
            <div>
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Projects</p>
              <div className="space-y-1">
                <SidebarItem icon={Building2} label="Sites" href="/sites" />
              </div>
            </div>

            <div>
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Communication</p>
              <div className="space-y-1">
                <SidebarItem icon={MessageSquare} label="WhatsApp Numbers" href="/whatsapp" />
              </div>
            </div>

            <div>
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Admin</p>
              <div className="space-y-1">
                <SidebarItem icon={Users2} label="Staff" href="/staff" />
                <SidebarItem icon={GitMerge} label="Teams" href="/team" />
                <SidebarItem icon={BarChart3} label="Reports" href="/reports" />
                <SidebarItem icon={CreditCard} label="Billing & Plans" href="/subscriptions" />
                <SidebarItem icon={Activity} label="Status" href="/status" />
              </div>
            </div>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-xl group relative">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shadow-sm">
            {mounted ? initials : "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">
              {mounted ? name : "User"}
            </p>
            <p className="text-[10px] font-medium text-slate-500 truncate">
              {mounted 
                ? `${user?.role === 'STAFF' ? 'Staff' : 'Builder'} · ${company}`
                : "Builder · Loading..."
              }
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 mr-[-8px] text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
