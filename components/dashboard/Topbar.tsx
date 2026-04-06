'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function Topbar() {
  const pathname = usePathname();

  const getPageTitle = () => {
    const parts = pathname.split('/');
    const last = parts[parts.length - 1];
    if (last === 'dashboard') return 'Overview';
    return last.charAt(0).toUpperCase() + last.slice(1);
  };

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
      <div>
        <h2 className="text-xl font-bold text-slate-900 capitalize tracking-tight">{getPageTitle()}</h2>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Skyline Infra — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 pr-6 border-r border-slate-100">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <span className="text-sm font-bold">JD</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-slate-900">John Doe</p>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Administrator</p>
          </div>
        </div>
        
        <button className="relative p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all group">
          <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-1 ring-rose-500/20 group-hover:scale-110 transition-transform" />
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        </button>
      </div>
    </header>
  );
}
