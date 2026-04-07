'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, User, Mail, Lock, Building, MapPin, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface Plan {
  _id: string;
  planName: string;
  price: number;
  duration: string;
  noOfStaff: number;
  noOfSites: number;
  noOfWhatsapp: number;
}

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
}

const RegistrationModal = ({ isOpen, onClose, plan }: RegistrationModalProps) => {
  const [step, setStep] = useState(1); // 1: Phone, 2: Payment, 3: Details, 4: Success
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    fullName: '',
    email: '',
    password: '',
    projectName: '',
    builderName: '',
    companyName: '',
    address: '',
    razorpayOrderId: '',
    razorpayPaymentId: '',
    razorpaySignature: '',
  });
  const [activePlan, setActivePlan] = useState<Plan | null>(plan);

  // Sync prop plan to activePlan when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActivePlan(plan);
    }
  }, [isOpen, plan]);

  const handleClose = () => {
    setStep(1);
    setFormData({
      phone: '',
      fullName: '',
      email: '',
      password: '',
      projectName: '',
      builderName: '',
      companyName: '',
      address: '',
      razorpayOrderId: '',
      razorpayPaymentId: '',
      razorpaySignature: '',
    });
    setLoading(false);
    onClose();
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone || formData.phone.replace(/\D/g, '').length !== 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post('/builder/check-phone-status', { phone: formData.phone });
      const { status, data } = response.data;

      if (status === "ALREADY_REGISTERED") {
        toast.error("This number is already registered. Please log in.");
        onClose();
        return;
      }

      if (status === "PAYMENT_DONE_PENDING_DETAILS") {
        // Resume registration from Step 3
        setActivePlan(data.planId); // Set the plan from saved data
        setFormData({
          ...formData,
          razorpayOrderId: data.razorpayOrderId,
          razorpayPaymentId: data.razorpayPaymentId,
          razorpaySignature: data.razorpaySignature,
        });
        setStep(3);
      } else {
        // New User
        // If we don't have a plan yet, we should ideally ask to pick one, 
        // but for now we'll assume they'll pick one if they came from a pricing card
        if (!activePlan) {
          toast.error("Please select a plan first.");
          onClose();
          return;
        }
        setStep(2);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error checking status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!plan) return;
    setLoading(true);
    
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load.');
        setLoading(false);
        return;
      }

      const response = await axios.post('/builder/create-order', {
        amount: plan.price,
        planId: plan._id,
        phone: formData.phone, // Pass phone for security and tracking
      });
      const orderData = response.data;

      if (!orderData.success) {
        if (orderData.resume) {
          toast.success("Payment already verified! Please complete your details.");
          setStep(3);
          return;
        }
        toast.error(orderData.message || 'Could not create order.');
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'BuildFlow CRM',
        description: `${plan.planName} Subscription`,
        order_id: orderData.order.id,
        handler: async (paymentResponse: any) => {
          setLoading(true);
          try {
            // Save payment info IMMEDIATELY to support resume flow
            await axios.post('/builder/save-payment-info', {
              phone: formData.phone,
              planId: activePlan?._id,
              amountPaid: activePlan?.price,
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
            });

            setFormData({
              ...formData,
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
            });
            setStep(3);
          } catch (err) {
            console.error("Error saving payment info:", err);
            // Even if save fails locally, we might want to try proceeding
            setStep(3);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          contact: formData.phone,
        },
        theme: { color: '#4f46e5' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error('Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  const handeDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('/builder/register', {
        ...formData,
        planId: activePlan?._id,
        amountPaid: activePlan?.price,
      });

      if (response.data.success) {
        setStep(4);
        toast.success("Account registered successfully!");
      } else {
        toast.error(response.data.message || 'Something went wrong');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
               <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider">
                 Step {step} of 3
               </span>
               <span className="text-slate-300 font-bold">•</span>
               <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                 {activePlan?.planName} Plan
               </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              {step === 1 && "Let's get started"}
              {step === 2 && "Secure Payment"}
              {step === 3 && (activePlan ? `Finish ${activePlan.planName} Setup` : "Final Details")}
              {step === 4 && "Welcome Aboard!"}
            </h2>
            <p className="text-slate-500 text-sm">
              {step === 1 && "Enter your phone number to proceed with the subscription."}
              {step === 2 && "Complete the payment via Razorpay to activate your plan."}
              {step === 3 && "Tell us a bit more about your profile."}
              {step === 4 && "Your subscription is now active. You can log in to your dashboard."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handlePhoneSubmit}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="tel" 
                      required
                      maxLength={10}
                      pattern="\d{10}"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-900 font-medium tracking-[0.1em]"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                    />
                  </div>
                </div>
                <button 
                  disabled={loading}
                  className="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 transition-all disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Continue"}
                  <ArrowRight size={20} />
                </button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Payable</p>
                    <p className="text-2xl font-black text-slate-900">₹{activePlan?.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-sm font-bold text-slate-600">{activePlan?.duration}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={handleRazorpayPayment}
                    disabled={loading}
                    className="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 transition-all disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Pay with Razorpay"}
                  </button>
                  <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-tighter">
                    Secure 256-bit SSL Encrypted Payment
                  </p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.form 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handeDetailsSubmit}
                className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                        required
                        className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none focus:border-indigo-500 transition-all"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                        type="email"
                        required
                        className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none focus:border-indigo-500 transition-all"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="password"
                      required
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none focus:border-indigo-500 transition-all"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Company Name</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none focus:border-indigo-500 transition-all"
                      placeholder="Sam Infra Projects Ltd."
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Office Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 text-slate-400" size={14} />
                    <textarea 
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none focus:border-indigo-500 transition-all resize-none h-20"
                      placeholder="123, Skyline Hub, Mumbai..."
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 mt-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 transition-all disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Complete Registration"}
                </button>
              </motion.form>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Registration Successful!</h3>
                <p className="text-slate-500 mb-8 max-w-[280px] mx-auto text-sm">
                  Your builder account has been created successfully. You can now login to your dashboard.
                </p>
                <button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xl transition-all"
                >
                  Go to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationModal;
