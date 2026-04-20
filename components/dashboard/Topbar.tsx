'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, Clock, Phone, Building2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LeadModal from '@/components/modals/LeadModal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchNotifications, markNotificationRead, addNotification } from '@/redux/slices/notificationSlice';
import { searchLeads } from '@/redux/slices/leadSlice';
import { getSocket } from '@/lib/socket';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const searchRef = useRef<HTMLDivElement>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { notifications, unreadCount } = useSelector((state: RootState) => state.notification);
  const { searchResults, searchLoading } = useSelector((state: RootState) => state.lead);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchNotifications());
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [dispatch]);

  useEffect(() => {
    if (user?._id) {
      const socket = getSocket();
      socket.emit('join', user._id);
    }
  }, [user]);

  useEffect(() => {
    const socket = getSocket();
    const handleNewNotification = (data: any) => {
      const newNotif = data.notification || data;
      dispatch(addNotification(newNotif));
      toast.success(newNotif.title + ': ' + newNotif.message);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(newNotif.title, { body: newNotif.message, icon: '/favicon.ico' });
      }
    };
    socket.on('newLeadAssigned', handleNewNotification);
    socket.on('leadReassigned', handleNewNotification);
    socket.on('admin_notification', handleNewNotification);
    socket.on('reminder_alert', (data: any) => {
      const reminderId = data.notification?._id || data.leadId;
      if (data.notification) dispatch(addNotification(data.notification));
      toast(data.message, {
        id: `reminder-${reminderId}`, icon: '⏰', duration: 8000,
        style: { borderRadius: '12px', background: '#1e293b', color: '#fff', border: '1px solid #334155', fontSize: '13px', fontWeight: 'bold' },
      });
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Followup Alert', { tag: `reminder-${reminderId}`, body: data.message, icon: '/favicon.ico' });
      }
    });
    return () => {
      socket.off('newLeadAssigned', handleNewNotification);
      socket.off('leadReassigned', handleNewNotification);
      socket.off('admin_notification', handleNewNotification);
      socket.off('reminder_alert');
    };
  }, [dispatch]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(() => {
      dispatch(searchLeads(searchQuery));
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getPageTitle = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts[0] === 'dashboard') return 'Overview';
    // If last segment looks like a MongoDB ObjectId (24 hex chars), use parent segment
    const last = parts[parts.length - 1];
    const isId = /^[a-f0-9]{24}$/i.test(last);
    const segment = isId && parts.length > 1 ? parts[parts.length - 2] : last;
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const getUserInitials = () => {
    if (!user?.fullName) return 'U';
    return user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleSelectLead = (leadId: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(`/leads/${leadId}`);
  };

  return (
    <>
      <header className="h-14 bg-white border-b border-slate-50 flex items-center justify-between px-6 sticky top-0 z-40">
        <div>
          <h2 className="text-sm font-semibold text-slate-800 capitalize tracking-tight">{getPageTitle()}</h2>
          <p className="text-[10px] text-slate-400 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Global Search */}
          <div ref={searchRef} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              <input
                type="text"
                placeholder="Search leads by name or phone..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
                onFocus={() => { if (searchQuery.trim()) setIsSearchOpen(true); }}
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-300 transition-all w-64"
              />
              {searchLoading && (
                <Loader2 size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />
              )}
            </div>

            <AnimatePresence>
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-full mt-2 left-0 w-80 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  {searchLoading ? (
                    <div className="px-4 py-6 text-center">
                      <Loader2 size={18} className="animate-spin text-indigo-500 mx-auto mb-2" />
                      <p className="text-xs text-slate-400 font-medium">Searching...</p>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <p className="text-xs text-slate-400 font-medium">No leads found for "{searchQuery}"</p>
                    </div>
                  ) : (
                    <div>
                      <div className="px-4 py-2.5 border-b border-slate-50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</p>
                      </div>
                      {searchResults.map((lead: any) => (
                        <button
                          key={lead._id}
                          onClick={() => handleSelectLead(lead._id)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold text-xs border border-indigo-100 shrink-0">
                            {lead.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{lead.name}</p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Phone size={10} /> {lead.phone}
                              </span>
                              {lead.siteName && (
                                <span className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                                  <Building2 size={10} /> {lead.siteName}
                                </span>
                              )}
                            </div>
                          </div>
                          {lead.stageName && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 shrink-0">
                              {lead.stageName}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all relative"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Bell size={20} className="text-slate-300" />
                          </div>
                          <p className="text-xs text-slate-400 font-medium">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notif: any) => (
                          <div
                            key={notif._id}
                            onClick={() => { if (!notif.isRead) dispatch(markNotificationRead(notif._id)); }}
                            className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${!notif.isRead ? 'bg-indigo-50/30' : ''}`}
                          >
                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notif.isRead ? 'bg-indigo-500' : 'bg-transparent'}`} />
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-slate-900 leading-tight">{notif.title}</p>
                              <p className="text-[11px] text-slate-500 leading-normal">{notif.message}</p>
                              <div className="flex items-center gap-1 text-[9px] text-slate-300 font-medium pt-1">
                                <Clock size={10} />
                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button className="w-full py-3 text-[11px] font-bold text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all border-t border-slate-50">
                        View All Notifications
                      </button>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 pr-4 border-r border-slate-50">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/50">
              <span className="text-xs font-semibold">{getUserInitials()}</span>
            </div>
            {user && (
              <div className="hidden md:block">
                <p className="text-[11px] font-bold text-slate-900 leading-none mb-0.5">{user.fullName}</p>
                <p className="text-[9px] text-slate-400 font-medium leading-none uppercase tracking-tighter">{user.role}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <LeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}
      />
    </>
  );
}
