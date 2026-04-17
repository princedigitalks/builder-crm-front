'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Plus,
  Bell,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LeadModal from '@/components/modals/LeadModal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchNotifications, markNotificationRead, addNotification } from '@/redux/slices/notificationSlice';
import { getSocket } from '@/lib/socket';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function Topbar() {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const { notifications, unreadCount } = useSelector((state: RootState) => state.notification);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchNotifications());

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const socket = getSocket();
    
    const handleNewNotification = (data: any) => {
      const newNotif = data.notification || data;
      dispatch(addNotification(newNotif));
      toast.success(newNotif.title + ": " + newNotif.message);

      // Browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(newNotif.title, {
          body: newNotif.message,
          icon: '/favicon.ico' // Or any relevant icon
        });
      }
    };

    socket.on('newLeadAssigned', handleNewNotification);
    socket.on('leadReassigned', handleNewNotification);
    socket.on('admin_notification', handleNewNotification);

    return () => {
      socket.off('newLeadAssigned', handleNewNotification);
      socket.off('leadReassigned', handleNewNotification);
      socket.off('admin_notification', handleNewNotification);
    };
  }, [dispatch]);

  const getPageTitle = () => {
    const parts = pathname.split('/');
    const last = parts[parts.length - 1];
    if (last === 'dashboard') return 'Overview';
    return last.charAt(0).toUpperCase() + last.slice(1);
  };

  const getUserInitials = () => {
    if (!user?.fullName) return 'U';
    return user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
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

        <div className="flex items-center gap-4">
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
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsNotificationsOpen(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {unreadCount} New
                      </span>
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
                            onClick={() => {
                              if (!notif.isRead) dispatch(markNotificationRead(notif._id));
                            }}
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

      {/* Add Lead Modal */}
      <LeadModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(e) => {
          e.preventDefault();
          console.log('Lead created');
          setIsAddModalOpen(false);
        }}
      />
    </>
  );
}
