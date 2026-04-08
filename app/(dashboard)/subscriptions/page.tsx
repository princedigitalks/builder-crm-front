'use client';

import React, { useEffect, useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Calendar, 
  Zap, 
  History, 
  ArrowRight,
  ShieldCheck,
  ZapIcon,
  Package,
  Loader2,
  Users2,
  Home,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchPlans } from '@/redux/slices/planSlice';
import { updateBuilder } from '@/redux/slices/authSlice';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import CommonTable from '@/components/ui/CommonTable';

export default function SubscriptionsPage() {
  const dispatch = useDispatch<any>();
  const { builder, user } = useSelector((state: RootState) => state.auth);
  const { plans, loading: plansLoading } = useSelector((state: RootState) => state.plan);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'plans'>('current');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchPlans());
    fetchLatestBuilder();
  }, [dispatch]);

  const fetchLatestBuilder = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`/builder/profile/${user._id}`);
      if (res.data.success) {
        dispatch(updateBuilder(res.data.data.builder));
      }
    } catch (err) {
      console.error("Failed to refresh builder data", err);
    }
  };

  const handleRenew = async (plan: any) => {
    if (!builder?._id) return;
    setLoading(true);
    try {
      // 1. Create order
      const orderRes = await axios.post('/builder/create-order', {
        amount: plan.price,
        planId: plan._id,
        phone: user.phone
      });

      if (!orderRes.data.success) throw new Error(orderRes.data.message);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: orderRes.data.order.amount,
        currency: orderRes.data.order.currency,
        name: "BuildFlow CRM",
        description: `Renewal for ${plan.planName} Plan`,
        order_id: orderRes.data.order.id,
        handler: async (response: any) => {
          try {
            const verifyRes = await axios.post('/builder/renew-subscription', {
              builderId: builder._id,
              planId: plan._id,
              amountPaid: plan.price,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              toast.success("Subscription Renewed Successfully!");
              fetchLatestBuilder();
              setActiveTab('current');
            }
          } catch (err: any) {
            toast.error(err.response?.data?.message || "Verification Failed");
          }
        },
        prefill: {
          name: user.fullName,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Payment Initialization Failed");
    } finally {
      setLoading(false);
    }
  };

  const activeSub = builder?.subscriptions?.find((s: any) => s.status === 'active');
  const upcomingSubs = builder?.subscriptions?.filter((s: any) => s.status === 'upcoming') || [];
  const historySubs = builder?.subscriptions?.filter((s: any) => s.status !== 'active' && s.status !== 'upcoming') || [];

  const historyColumns = [
    {
      header: 'Plan Detail',
      key: 'planName',
      render: (sub: any) => (
        <div>
          <p className="text-xs font-semibold text-slate-900">{sub.planName}</p>
          <p className="text-[10px] text-slate-400 font-medium">{sub.razorpayPaymentId}</p>
        </div>
      )
    },
    {
      header: 'Period',
      key: 'startDate',
      render: (sub: any) => (
        <span className="text-[11px] font-medium text-slate-600">
           {new Date(sub.startDate).toLocaleDateString()} - {new Date(sub.endDate).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Amount',
      key: 'amountPaid',
      render: (sub: any) => (
        <span className="text-xs font-semibold text-slate-900">
           ₹{sub.amountPaid.toLocaleString()}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      className: 'text-right',
      render: (sub: any) => (
        <span className={cn(
          "text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border",
          sub.status === 'expired' ? "bg-slate-50 text-slate-400 border-slate-100" : "bg-rose-50 text-rose-600 border-rose-100"
        )}>
          {sub.status}
        </span>
      )
    }
  ];

  if (!mounted) return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
       <Loader2 className="animate-spin text-slate-200" size={48} />
    </div>
  );

  return (
    <div className="mx-auto space-y-4 pb-20 px-6 pt-5">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight leading-none mb-1">Billing & Subscription</h1>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest flex items-center gap-2">
            <CreditCard size={10} className="text-indigo-500" />
            Manage your plan & billing
          </p>
        </div>
        <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
           {[
             { id: 'current', label: 'My Plan', icon: Package },
             { id: 'plans', label: 'Upgrade/Renew', icon: Zap },
             { id: 'history', label: 'History', icon: History }
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={cn(
                 "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                 activeTab === tab.id 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-slate-400 hover:text-slate-600"
               )}
             >
               <tab.icon size={14} />
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'current' && (
          <motion.div 
            key="current"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Plan Card */}
              <div className="lg:col-span-2 space-y-6">
                {!activeSub ? (
                  <div className="bg-white rounded-2xl border border-slate-100 p-20 text-center flex flex-col items-center">
                     <Package size={48} className="text-slate-200 mb-4" />
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-loose">
                        No active subscription found.<br />Please upgrade to start using BuildFlow.
                     </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-100 p-8 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 right-0 p-8 h-full flex items-center opacity-[0.03] pointer-events-none">
                       <ShieldCheck size={200} />
                    </div>
                    
                    <div className="flex items-start justify-between relative z-10">
                      <div>
                        <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-indigo-100/50">
                          Active Now
                        </span>
                        <h2 className="text-4xl font-black text-slate-900 mt-4 leading-tight group">
                          {activeSub.planName}
                        </h2>
                        <div className="flex items-center gap-2 text-slate-400 mt-2 font-bold text-[10px] uppercase tracking-wider">
                           <Calendar size={12} className="text-indigo-400" />
                           Valid until {new Date(activeSub.endDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Monthly Billing</p>
                         <p className="text-3xl font-black text-slate-900">₹{activeSub.amountPaid.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 relative z-10">
                      {[
                        { label: 'No. of Staff', value: builder?.currentLimits?.noOfStaff || 0, max: activeSub.noOfStaff || 0, icon: Users2, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'No. of Projects', value: builder?.currentLimits?.noOfSites || 0, max: activeSub.noOfSites || 0, icon: Home, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'No. of WhatsApp', value: builder?.currentLimits?.noOfWhatsapp || 0, max: activeSub.noOfWhatsapp || 0, icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                      ].map((limit, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", limit.bg, limit.color)}>
                               <limit.icon size={22} />
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{limit.label}</p>
                               <p className="text-xl font-black text-slate-900 mt-0.5">
                                 {limit.max}
                               </p>
                            </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Invoicing Card... no changes */}
              <div className="bg-indigo-600 rounded-2xl p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-100 relative overflow-hidden group">
               <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
               <div className="relative z-10">
                 <h4 className="font-bold text-lg mb-2">Need more power?</h4>
                 <p className="text-indigo-100 text-sm leading-relaxed mb-8">Upgrading to a higher plan instantly increases your site and staff limits.</p>
                 
                 <div className="space-y-4">
                    <button 
                      onClick={() => setActiveTab('plans')}
                      className="w-full bg-white text-indigo-600 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-lg shadow-indigo-700/50"
                    >
                      View All Plans
                    </button>
                 </div>
               </div>
               
               <div className="mt-12 relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 size={16} className="text-indigo-200" />
                    <span className="text-xs font-semibold text-indigo-100">Premium Dashboards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-indigo-200" />
                    <span className="text-xs font-semibold text-indigo-100">24/7 Priority Support</span>
                  </div>
               </div>
              </div>
            </div>

            {/* Upcoming section if it exists */}
            {upcomingSubs.length > 0 && (
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Queued Renewals ({upcomingSubs.length})</p>
                {upcomingSubs.map((sub: any, idx: number) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={sub._id} 
                    className="bg-white border border-emerald-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm shadow-emerald-50/30 border-l-4 border-l-emerald-500"
                  >
                     <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <ZapIcon size={24} />
                       </div>
                       <div>
                          <p className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200 inline-block">Renewed Plan</p>
                          <h3 className="text-xl font-black text-slate-800 mt-1">{sub.planName}</h3>
                          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                             Effective from {new Date(sub.startDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </p>
                       </div>
                     </div>
                     <div className="flex items-center gap-8 pl-6 md:border-l border-slate-100">
                        <div className="text-center md:text-right">
                           <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Paid</p>
                           <p className="text-xl font-black text-emerald-600">₹{sub.amountPaid.toLocaleString()}</p>
                        </div>
                     </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'plans' && (
          <motion.div 
            key="plans"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {plansLoading ? (
               <div className="col-span-full flex flex-col items-center justify-center py-20">
                  <Loader2 className="animate-spin text-indigo-600 mb-4" size={32} />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Plans...</p>
               </div>
            ) : plans.map((plan) => (
              <div 
                key={plan._id} 
                className={cn(
                  "bg-white rounded-2xl border transition-all duration-300 overflow-hidden group hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-1 p-8 flex flex-col h-full",
                  plan._id === activeSub?.planId ? "border-indigo-600 ring-4 ring-indigo-50" : "border-slate-100"
                )}
              >
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{plan.planName}</h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{plan.duration}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                    <Package size={20} />
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black text-slate-900">₹{plan.price.toLocaleString()}</span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">/ term</span>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                   {[
                     { label: 'Staff Members', value: plan.noOfStaff, icon: Users2 },
                     { label: 'Project Sites', value: plan.noOfSites, icon: Home },
                     { label: 'WhatsApp Automation', value: 'Ready', icon: MessageSquare },
                     { label: 'Priority Support', value: 'Standard', icon: Zap }
                   ].map((feat, i) => (
                     <div key={i} className="flex items-center gap-3">
                        <feat.icon size={14} className="text-indigo-600" />
                        <span className="text-[11px] font-bold text-slate-600">{feat.value} {feat.label}</span>
                     </div>
                   ))}
                </div>

                <button 
                  disabled={loading}
                  onClick={() => handleRenew(plan)}
                  className={cn(
                    "w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    plan._id === activeSub?.planId 
                      ? "bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50" 
                      : "bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200"
                  )}
                >
                  {loading ? (
                     <Loader2 className="animate-spin mx-auto" size={16} />
                  ) : plan._id === activeSub?.planId ? "Renew Current Plan" : "Select Plan"}
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div 
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CommonTable 
              title="Billing History"
              columns={historyColumns}
              data={historySubs}
              loading={false}
              searchValue=""
              onSearchChange={() => {}}
              pagination={{
                totalItems: historySubs.length,
                totalPages: 1,
                currentPage: 1,
                limit: 100
              }}
              onPageChange={() => {}}
              searchPlaceholder="Search history..."
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
