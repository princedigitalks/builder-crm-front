"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  Target,
  Zap,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  Star,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import LoginModal from "@/components/LoginModal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";
import Image from "next/image";

const Navbar = ({
  onLoginClick,
  onJoinClick,
  isAuthenticated,
  userRole,
}: {
  onLoginClick: () => void;
  onJoinClick: () => void;
  isAuthenticated?: boolean;
  userRole?: string;
}) => (
  <header className="fixed top-0 left-0 right-0 z-[100] px-6 sm:px-10 md:px-12 lg:px-15 py-4">
    <nav className="max-w-7xl mx-auto flex items-center justify-between p-2 px-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white/20 shadow-lg shadow-indigo-500/5">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <a href="/">
          <img src="/logo.png" alt="CRMbot" className="h-10 lg:h-20 w-auto " />
        </a>
      </div>

      <div className="hidden md:flex items-center gap-10" />

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <Link
            href={userRole === "STAFF" ? "/leads" : "/dashboard"}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-[0.1em]"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <button
              onClick={onLoginClick}
              className="text-sm font-bold text-slate-600 hover:text-slate-900 px-6 py-2.5 transition-colors uppercase tracking-[0.1em]"
            >
              Sign In
            </button>
            <button
              onClick={onJoinClick}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-slate-900/10 uppercase tracking-[0.1em]"
            >
              Join Now
            </button>
          </>
        )}
      </div>
    </nav>
  </header>
);

const JoinModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [form, setForm] = useState({ name: "", phone: "", companyName: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.companyName.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      await axios.post("/admin-leads", form);
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", phone: "", companyName: "" });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 z-10"
          >
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>

            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  We'll be in touch!
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Thanks for your interest. Our team will contact you shortly to
                  get you started with BuildFlow.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 mb-4">
                    BF
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                    Get Started with BuildFlow
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Fill in your details and our team will reach out to you.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Rahul Sharma"
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="Skyline Builders Pvt. Ltd."
                      value={form.companyName}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, companyName: e.target.value }))
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : null}
                    {loading ? "Submitting..." : "Submit Enquiry"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const FeatureCard = ({ icon: Icon, title, description, color }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
  >
    <div
      className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
        color,
      )}
    >
      <Icon size={28} className="text-white" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-snug">
      {title}
    </h3>
    <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const LayoutDashboard = ({ size, className, strokeWidth }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth || 2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

const tabs = [
  { id: "analytics", label: "Analytics", icon: "📊" },
  { id: "pipeline", label: "Pipeline", icon: "📋" },
  { id: "leads", label: "Lead Table", icon: "👥" },
  { id: "reminders", label: "Reminders", icon: "🔔" },
];

const analyticsStats = [
  {
    label: "Total Revenue",
    value: "₹4.2Cr",
    sub: "↑ 32% vs last month",
    subColor: "text-[#00bc7d]",
  },
  {
    label: "Conversion Rate",
    value: "18.4%",
    sub: "↑ 7% vs Industry avg",
    subColor: "text-[#00bc7d]",
  },
  {
    label: "Avg Response Time",
    value: "47s",
    sub: "↓ from 4.2 hours",
    subColor: "text-red-400",
  },
  {
    label: "Active Leads",
    value: "248",
    sub: "↑ 24 new this week",
    subColor: "text-[#00bc7d]",
  },
];

const barData = [
  { label: "WhatsApp", pct: 85 },
  { label: "99acres", pct: 55 },
  { label: "Facebook", pct: 65 },
  { label: "Website", pct: 45 },
  { label: "Referral", pct: 35 },
  { label: "Walk-In", pct: 25 },
];

const columns = [
  {
    title: "NEW",
    count: 12,
    leads: [
      { name: "Rohit Patel", detail: "3BHK · ₹75L · Surat" },
      { name: "Anita Singh", detail: "2BHK · ₹45L · Ahmedabad" },
      { name: "Dev Malhotra", detail: "Villa · ₹1.5Cr · Vadodara" },
    ],
    accent: null,
  },
  {
    title: "CONTACTED",
    count: 8,
    leads: [
      { name: "Neha Verma", detail: "3BHK · ₹85L · Rajkot" },
      { name: "Suresh Jain", detail: "2BHK · ₹55L · Surat" },
    ],
    accent: null,
  },
  {
    title: "SITE VISIT",
    count: 5,
    leads: [
      {
        name: "Rahul Kapoor",
        detail: "3BHK · ₹85L · Tomorrow",
        accent: "#6c5ce7",
      },
      { name: "Priya Shah", detail: "2BHK · ₹60L · Fri", accent: "#f59e0b" },
    ],
    accent: null,
  },
  {
    title: "DEAL CLOSED",
    count: 3,
    leads: [
      {
        name: "Amit Mehta ✓",
        detail: "Villa · ₹1.2Cr · Closed",
        accent: "#00bc7d",
      },
      {
        name: "Pooja Rathi ✓",
        detail: "3BHK · ₹78L · Closed",
        accent: "#00bc7d",
      },
    ],
    accent: null,
  },
];

// const pipelineLeads = [
//   {
//     initials: "RP",
//     name: "Rohit Patel",
//     project: "Skyline Heights",
//     stage: "Site Visit",
//     value: "₹75L",
//     color: "bg-indigo-500",
//   },
//   {
//     initials: "AS",
//     name: "Anita Singh",
//     project: "Green Valley",
//     stage: "Negotiation",
//     value: "₹45L",
//     color: "bg-emerald-500",
//   },
//   {
//     initials: "DM",
//     name: "Dev Malhotra",
//     project: "Royal Villas",
//     stage: "Booking",
//     value: "₹1.5Cr",
//     color: "bg-purple-500",
//   },
//   {
//     initials: "NV",
//     name: "Neha Verma",
//     project: "Sunrise Towers",
//     stage: "Enquiry",
//     value: "₹85L",
//     color: "bg-amber-500",
//   },
// ];

const pipelineLeads = [
  {
    initials: "VJ",
    name: "Vikram Joshi",
    source: "WhatsApp",
    budget: "₹65–70L",
    type: "3BHK",
    assignedTo: "Rajesh K.",
    status: "Hot",
    lastActivity: "2 hours ago",
    avatarColor: "bg-emerald-100 text-emerald-800",
  },
  {
    initials: "PS",
    name: "Priya Sharma",
    source: "Facebook",
    budget: "₹45–55L",
    type: "2BHK",
    assignedTo: "Sneha M.",
    status: "Warm",
    lastActivity: "Yesterday",
    avatarColor: "bg-blue-100 text-blue-800",
  },
  {
    initials: "RG",
    name: "Rahul Gupta",
    source: "WhatsApp",
    budget: "₹1.2Cr+",
    type: "Villa",
    assignedTo: "Amit S.",
    status: "New",
    lastActivity: "Just now",
    avatarColor: "bg-purple-100 text-purple-800",
  },
  {
    initials: "KN",
    name: "Kavita Nair",
    source: "99acres",
    budget: "₹80–90L",
    type: "3BHK",
    assignedTo: "Rajesh K.",
    status: "Warm",
    lastActivity: "3 days ago",
    avatarColor: "bg-pink-100 text-pink-800",
  },
];

const sourceBadge: Record<string, string> = {
  WhatsApp: "bg-emerald-50 text-emerald-700",
  Facebook: "bg-blue-50 text-blue-700",
  "99acres": "bg-purple-50 text-purple-700",
};

const statusBadge: Record<string, string> = {
  Hot: "bg-orange-50 text-orange-700",
  Warm: "bg-yellow-50 text-yellow-700",
  New: "bg-green-50 text-green-700",
};

const stageColor: Record<string, string> = {
  "Site Visit": "bg-blue-50 text-blue-600",
  Negotiation: "bg-yellow-50 text-yellow-600",
  Booking: "bg-green-50 text-green-600",
  Enquiry: "bg-purple-50 text-purple-600",
};

const reminders = [
  {
    icon: "bell",
    title: "Call Vikram Joshi — Site Visit Follow-up",
    detail: "Assigned to Rajesh K. · 3BHK ₹65L",
    time: "Today 2:00 PM",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-400",
  },
  {
    icon: "calendar",
    title: "Site Visit — Rahul Kapoor",
    detail: "Sunrise Heights, Tower B · 3BHK ₹85L",
    time: "Tomorrow 11:00 AM",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-400",
  },
  {
    icon: "check",
    title: "Send Brochure — Kavita Nair",
    detail: "WhatsApp message · PDF floor plans",
    time: "Fri 10:00 AM",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    icon: "phone",
    title: "Price Negotiation Call — Priya Shah",
    detail: "2BHK ₹60L · Ready to book",
    time: "Fri 3:00 PM",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-400",
  },
];

const testimonials = [
  {
    initials: "RJ",
    name: "Ramesh Joshi",
    role: "Director, Shree Sai Developers · Surat",
    review:
      "Before BuildersCRM, we were losing 60% of our WhatsApp leads because no one could respond fast enough. Now the bot qualifies everyone instantly and our sales team only handles hot leads. Our conversions went from 8% to 26% in 3 months.",
    color: "bg-[#6c5ce7]",
  },
  {
    initials: "PM",
    name: "Pooja Mehta",
    role: "CEO, Horizon Realty · Ahmedabad",
    review:
      "The WhatsApp bot is incredible. It feels like we hired 5 extra sales people who work 24 hours a day. Every lead gets a reply in seconds. My team now only does what they're best at — closing deals. Highly recommend BuildersCRM.",
    color: "bg-[#f59e0b]",
    active: true,
  },
  {
    initials: "AK",
    name: "Arvind Kulkarni",
    role: "MD, AK Constructions · Pune",
    review:
      "The mini website builder alone is worth the subscription. I launched our new project page in 20 minutes, added it to our WhatsApp ad and collected 84 qualified leads in the first week. The CRM tracked every single one automatically.",
    color: "bg-[#00bc7d]",
  },
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("analytics");

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  return (
    <>
      <style>{`
        .font-Sans { font-family: 'DM Sans', sans-serif } 
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
        <Navbar
          onLoginClick={() => setIsLoginOpen(true)}
          onJoinClick={() => setIsJoinOpen(true)}
          isAuthenticated={isAuthenticated}
          userRole={user?.role}
        />

        <main>
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 px-6 overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[1000px] h-[1000px] bg-indigo-500/10 blur-[150px] rounded-full -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 border border-indigo-100 text-indigo-600 text-xs font-bold mb-8 shadow-sm">
                    <Star size={14} className="fill-indigo-600" />
                    Trusted by 500+ Real Estate Builders
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-8">
                    The{" "}
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Powerhouse CRM
                    </span>{" "}
                    for Modern Builders
                  </h1>
                  <p className="text-lg text-slate-500 leading-relaxed max-w-xl mb-12">
                    Streamline lead capturing, automate WhatsApp follow-ups, and
                    visualize your entire property pipeline in one intelligent
                    dashboard. Designed specifically for the Indian real estate
                    landscape.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                      onClick={() => setIsJoinOpen(true)}
                      className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 group text-lg"
                    >
                      Get Started Today
                      <ChevronRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                    <button className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold transition-all text-lg">
                      Book a Demo
                    </button>
                  </div>
                  <div className="mt-12 flex items-center gap-8 grayscale opacity-50">
                    <Building2 size={32} />
                    <Target size={32} />
                    <Zap size={32} />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl blur-[100px] opacity-20 -z-10 scale-90" />
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src="/WhatsApp-Automation-1.png"
                      alt="WhatsApp Automation"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section id="features" className="py-24 px-6 bg-white relative">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-20">
                <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4">
                  Core Ecosystem
                </h2>
                <h3 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                  Everything you need to sell property faster
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard
                  icon={Users}
                  title="Lead Centralization"
                  description="Import leads automatically from WhatsApp, Facebook, Websites, and Portals like MagicBricks or Housing.com."
                  color="bg-indigo-600"
                />
                <FeatureCard
                  icon={MessageSquare}
                  title="Automated WhatsApp"
                  description="Send instant welcome messages and personalized follow-ups without lifting a finger. Built-in WhatsApp API."
                  color="bg-emerald-600"
                />
                <FeatureCard
                  icon={Target}
                  title="Sales Pipeline"
                  description="Visual kanban board to track deals from inquiry to registration. Never lose track of high-intent prospects."
                  color="bg-amber-500"
                />
                <FeatureCard
                  icon={Building2}
                  title="Inventory Tracking"
                  description="Real-time availability of units across all your projects. Sync site engineers with sales teams instantly."
                  color="bg-purple-600"
                />
                <FeatureCard
                  icon={BarChart3}
                  title="Advanced Analytics"
                  description="Detailed reports on agent performance, site visit conversions, and marketing ROI at your fingertips."
                  color="bg-blue-600"
                />
                <FeatureCard
                  icon={ShieldCheck}
                  title="Enterprise Security"
                  description="Role-based access controls and encrypted data storage. Your precious leads are always protected."
                  color="bg-slate-900"
                />
              </div>
            </div>
          </section>

          {/* Product ShowCase */}
          <section className="bg-white py-20 px-6 sm:px-10 md:px-12 lg:px-15">
            <div className="max-w-7xl mx-auto">
              {/* header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-14"
              >
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-indigo-500 mb-3">
                  Product Showcase
                </p>
                <h2 className="text-[28px] sm:text-[36px] md:text-[44px] font-Sans font-bold text-gray-900 leading-[1.15] tracking-tight mb-4">
                  Explore the Platform
                </h2>
                <p className="text-gray-400 text-[14px] sm:text-[16px] font-jakarta max-w-lg mx-auto leading-relaxed">
                  Every tool your team needs, designed to be{" "}
                  <span className="text-[#0f0e2a] font-semibold">
                    intuitive
                  </span>{" "}
                  and fast. No{" "}
                  <span className="text-[#0f0e2a] font-semibold">training</span>{" "}
                  required.
                </p>
              </motion.div>

              {/* tabs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 mb-8 flex-wrap"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`font-jakarta inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all
                ${
                  activeTab === tab.id
                    ? "bg-white shadow-sm text-[#0f0e2a] border border-slate-200"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </motion.div>

              {/* content */}
              <AnimatePresence mode="wait">
                {activeTab === "analytics" && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm"
                  >
                    <h3 className="font-Sans font-bold text-[#0f0e2a] text-[18px] sm:text-[24px] mb-1">
                      Performance Dashboard
                    </h3>
                    <p className="font-jakarta text-[#6b7280] text-[13px] sm:text-[16px] mb-6">
                      Real-time overview of your entire sales pipeline, team
                      performance, and lead sources.
                    </p>

                    {/* stat cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                      {analyticsStats.map((s, i) => (
                        <div
                          key={i}
                          className="border border-slate-100 rounded-2xl p-4"
                        >
                          <p className="font-jakarta text-[13px] text-slate-400 mb-2">
                            {s.label}
                          </p>
                          <p className="font-Sans font-extrabold text-[#0f0e2a] text-[24px] sm:text-[28px] leading-none mb-1">
                            {s.value}
                          </p>
                          <p
                            className={`font-jakarta text-[11px] font-semibold ${s.subColor}`}
                          >
                            {s.sub}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* bar chart */}
                    <p className="font-jakarta text-[12px] font-semibold text-slate-400 mb-4">
                      Lead Sources This Month
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                      {barData.map((b, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-2"
                        >
                          <div className="w-full h-24 bg-slate-50 rounded-xl flex items-end overflow-hidden">
                            <motion.div
                              initial={{ height: 0 }}
                              whileInView={{ height: `${b.pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: i * 0.1 }}
                              className="w-full bg-slate-200 rounded-xl"
                            />
                          </div>
                          <span className="font-jakarta text-[12px] text-slate-400 text-center">
                            {b.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "pipeline" && (
                  <motion.div
                    key="pipeline"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm"
                  >
                    <h3 className="font-Sans font-bold text-[#0f0e2a] text-[18px] sm:text-[24px] mb-1">
                      Lead Pipeline — Kanban View
                    </h3>
                    <p className="font-jakarta text-[#6b7280] text-[13px] sm:text-[16px] mb-6">
                      Drag and drop leads across stages. See your entire funnel
                      at a glance.
                    </p>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {columns.map((col, ci) => (
                        <div key={ci} className="bg-[#f8f7ff] rounded-2xl p-4">
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-jakarta text-[13px] font-bold tracking-[1.5px] uppercase text-slate-400">
                              {col.title}
                            </span>
                            <span className="font-jakarta text-[11px] font-bold text-[#6c5ce7] bg-[#6c5ce7]/10 px-2 py-0.5 rounded-full">
                              {col.count}
                            </span>
                          </div>
                          <div className="flex flex-col gap-3">
                            {col.leads.map(
                              (
                                lead: {
                                  name: string;
                                  detail: string;
                                  accent?: string;
                                },
                                li,
                              ) => (
                                <div
                                  key={li}
                                  className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm relative overflow-hidden"
                                >
                                  {lead.accent && (
                                    <div
                                      className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                                      style={{ background: lead.accent }}
                                    />
                                  )}
                                  <p
                                    className={`font-Sans font-bold text-[#0f0e2a] text-[14px] mb-1 ${lead.accent ? "pl-2" : ""}`}
                                  >
                                    {lead.name}
                                  </p>
                                  <p
                                    className={`font-jakarta text-slate-400 text-[13px] ${lead.accent ? "pl-2" : ""}`}
                                  >
                                    {lead.detail}
                                  </p>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "leads" && (
                  <motion.div
                    key="leads"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm overflow-x-auto"
                  >
                    <h3 className="font-Sans font-bold text-[#0f0e2a] text-[18px] sm:text-[24px] mb-1">
                      Lead Management Table
                    </h3>
                    <p className="font-jakarta text-[#6b7280] text-[13px] sm:text-[16px] mb-6">
                      Filter, search, sort and act on all your leads from one
                      clean table view.
                    </p>

                    <table className="w-full min-w-[700px]">
                      <thead>
                        <tr className="border-b border-slate-100">
                          {[
                            "Name",
                            "Source",
                            "Budget",
                            "Type",
                            "Assigned to",
                            "Status",
                            "Last activity",
                          ].map((h) => (
                            <th
                              key={h}
                              className="font-jakarta text-[12px] font-bold text-slate-400 uppercase tracking-wider text-left pb-3 pr-4"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {pipelineLeads.map((lead, i) => (
                          <tr
                            key={i}
                            className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                          >
                            {/* Name */}
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`${lead.avatarColor} w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0`}
                                >
                                  {lead.initials}
                                </div>
                                <span className="font-Sans text-[#0f0e2a] font-semibold text-[14px]">
                                  {lead.name}
                                </span>
                              </div>
                            </td>

                            {/* Source */}
                            <td className="py-3 pr-4">
                              <span
                                className={`font-jakarta text-[12px] font-semibold px-2.5 py-1 rounded-full ${sourceBadge[lead.source]}`}
                              >
                                {lead.source}
                              </span>
                            </td>

                            {/* Budget */}
                            <td className="py-3 pr-4 font-jakarta text-slate-500 text-[13px]">
                              {lead.budget}
                            </td>

                            {/* Type */}
                            <td className="py-3 pr-4 font-jakarta text-slate-500 text-[13px]">
                              {lead.type}
                            </td>

                            {/* Assigned to */}
                            <td className="py-3 pr-4 font-jakarta text-slate-500 text-[13px]">
                              {lead.assignedTo}
                            </td>

                            {/* Status */}
                            <td className="py-3 pr-4">
                              <span
                                className={`font-jakarta text-[12px] font-semibold px-2.5 py-1 rounded-full ${statusBadge[lead.status]}`}
                              >
                                {lead.status}
                                {lead.status === "Hot"
                                  ? " 🔥"
                                  : lead.status === "New"
                                    ? " ✦"
                                    : ""}
                              </span>
                            </td>

                            {/* Last activity */}
                            <td className="py-3 font-jakarta text-slate-500 text-[12px]">
                              {lead.lastActivity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}

                {activeTab === "reminders" && (
                  <motion.div
                    key="reminders"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm"
                  >
                    <h3 className="font-Sans font-bold text-[#0f0e2a] text-[18px] sm:text-[24px] mb-1">
                      Smart Follow-up Reminders
                    </h3>
                    <p className="font-jakarta text-[#6b7280] text-[13px] sm:text-[16px] mb-6">
                      Automated alerts ensure your team never misses a
                      follow-up, call, or site visit.
                    </p>
                    <div className="flex flex-col gap-3">
                      {reminders.map((r, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between border border-slate-100 rounded-2xl px-5 py-4 hover:bg-slate-50 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            {/* Icon box */}
                            <div
                              className={`${r.iconBg} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}
                            >
                              {r.icon === "bell" && (
                                <svg
                                  className={`w-5 h-5 ${r.iconColor}`}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={1.8}
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.33-5.001M9 17H4l1.405-1.405A2.032 2.032 0 006 14.158V11a6 6 0 0112 0v3.159c0 .538.214 1.055.595 1.436L20 17H9zm0 0a3 3 0 006 0H9z"
                                  />
                                </svg>
                              )}
                              {r.icon === "calendar" && (
                                <svg
                                  className={`w-5 h-5 ${r.iconColor}`}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={1.8}
                                  viewBox="0 0 24 24"
                                >
                                  <rect
                                    x="3"
                                    y="4"
                                    width="18"
                                    height="18"
                                    rx="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16 2v4M8 2v4M3 10h18"
                                  />
                                </svg>
                              )}
                              {r.icon === "check" && (
                                <svg
                                  className={`w-5 h-5 ${r.iconColor}`}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={1.8}
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12l2 2 4-4"
                                  />
                                </svg>
                              )}
                              {r.icon === "phone" && (
                                <svg
                                  className={`w-5 h-5 ${r.iconColor}`}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={1.8}
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  />
                                </svg>
                              )}
                            </div>
                            {/* Text */}
                            <div>
                              <p className="font-Sans font-semibold text-[#0f0e2a] text-[15px] mb-0.5">
                                {r.title}
                              </p>
                              <p className="font-jakarta text-slate-500 text-[12px]">
                                {r.detail}
                              </p>
                            </div>
                          </div>
                          {/* Time */}
                          <span className="font-jakarta text-[13px] font-bold text-[#6c5ce7] whitespace-nowrap ml-4">
                            {r.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative py-20 flex items-center justify-center overflow-hidden bg-[#0f0e2a]">
            {/* background glow */}
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#3b2d8a]/40 rounded-full blur-[120px]" />
              <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-[#4f3bbd]/20 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 text-center px-6 sm:px-10 max-w-5xl mx-auto">
              {/* badge */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-[#00bc7d] animate-pulse" />
                <span className="font-jakarta text-[10px] sm:text-[12px] font-semibold tracking-[2px] uppercase text-white/80">
                  Join 100+ Builders Already Closing More Deals
                </span>
              </motion.div>

              {/* heading */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="font-Sans font-bold text-white leading-[1.05] tracking-tight mb-4 text-[36px] min-[400px]:text-[44px] sm:text-[56px] md:text-[68px] lg:text-[50px] xl:text-[50px]"
              >
                Stop Missing Leads.
                <br />
                Start Closing Deals.
              </motion.h1>

              {/* subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-jakarta text-white/60 max-w-[520px] mx-auto leading-relaxed mb-8 text-[13px] min-[400px]:text-[14px] sm:text-[16px] md:text-[16px]"
              >
                Every WhatsApp message is a potential ₹50L+ deal. BuildersCRM
                makes sure you never miss one — automatically, 24/7.
              </motion.p>

              {/* buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-wrap items-center justify-center gap-4 mb-6"
              >
                {/* primary */}
                <button
                  onClick={() => setIsJoinOpen(true)}
                  className="font-jakarta inline-flex items-center gap-2.5 bg-white text-[#0f0e2a] font-bold rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl px-5 sm:px-7 py-3 sm:py-4 text-[13px] sm:text-[15px]"
                >
                  <svg
                    className="w-4 h-4 text-[#6c5ce7]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13 2L4.09 12.26a1 1 0 00.91 1.74H11v8l8.91-10.26a1 1 0 00-.91-1.74H13V2z" />
                  </svg>
                  Start Free 14-Day Trial
                </button>

                {/* secondary */}
                <button
                  onClick={() => setIsJoinOpen(true)}
                  className="font-jakarta inline-flex items-center gap-2.5 bg-white/10 border border-white/20 text-white font-bold rounded-2xl transition-all hover:-translate-y-0.5 hover:bg-white/15 px-5 sm:px-7 py-3 sm:py-4 text-[13px] sm:text-[15px]"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  Book a Live Demo
                </button>
              </motion.div>

              {/* trust line */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="font-jakarta text-white/40 text-[11px] sm:text-[13px] flex flex-wrap items-center justify-center gap-3"
              >
                <span>✓ No credit card</span>
                <span>·</span>
                <span>✓ Setup in 10 minutes</span>
                <span>·</span>
                <span>✓ Cancel anytime</span>
              </motion.p>
            </div>
          </section>

          {/* Testimonial */}
          <section className="bg-[#f5f5ff] py-20 px-6 sm:px-10 md:px-12 lg:px-15">
            <div className="max-w-7xl mx-auto">
              {/* header */}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-14"
              >
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-indigo-500 mb-3">
                  What Clients Say
                </p>
                <h2 className="text-[28px] sm:text-[36px] md:text-[44px] font-Sans font-bold text-gray-900 leading-[1.15] tracking-tight mb-4">
                  Trusted by 100+ Real Estate
                  <br className="hidden sm:block" /> Businesses Across India
                </h2>
                <p className="text-gray-400 text-[14px] sm:text-[16px] font-jakarta max-w-lg mx-auto leading-relaxed">
                  Real results from builders, developers and real estate teams
                  using BuildersCRM every day.
                </p>
              </motion.div>

              {/* 3 cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    whileHover={{ y: -6 }}
                    className={`bg-white rounded-3xl p-8 flex flex-col justify-between shadow-sm
                ${
                  item.active
                    ? "border-2 border-[#6c5ce7]"
                    : "border border-slate-100"
                }`}
                  >
                    <div>
                      {/* stars */}
                      <div className="text-[#f59e0b] text-2xl mb-3">★★★★★</div>

                      {/* quote icon */}
                      <div className="text-[#6c5ce7] text-2xl mb-2">"</div>

                      {/* text */}
                      <p className="font-jakarta text-[#374151] text-[14px] sm:text-[15px] leading-relaxed">
                        {item.review}
                      </p>
                    </div>

                    {/* author */}
                    <div className="flex items-center gap-4 mt-8">
                      <div
                        className={`${item.color} w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                      >
                        {item.initials}
                      </div>
                      <div>
                        <h4 className="font-Sans text-[#111827] font-bold text-[15px]">
                          {item.name}
                        </h4>
                        <p className="font-jakarta text-[#9ca3af] text-[13px]">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-16 px-1 sm:px-4 md:px-8 lg:px-10 pb-8 border-t border-gray-100 bg-[#110f1e]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-x-[48px] gap-y-8  md:gap-10 lg:gap-4 mb-12">
                {/* 1. Brand Section */}
                <div className="space-y-6">
                  <div className="space-y-6">
                    <div className="inline-block rounded-xl">
                      <a href="/">
                        <img
                          src="/logo.png"
                          alt="CRMbot"
                          className="h-10 lg:h-12 w-auto "
                        />
                      </a>
                    </div>
                  </div>
                  <p className="text-gray-500 text-[14px] leading-relaxed w-full sm:max-w-xs">
                    India's most powerful CRM + WhatsApp automation platform
                    built exclusively for real estate builders and developers.
                  </p>
                  <div className="flex items-center gap-2 text-[#00bc7d] cursor-pointer font-medium hover:opacity-80">
                    <span>💬</span>
                    <span>Chat with Us</span>
                  </div>
                </div>

                {/* 2. Product Links */}
                <div>
                  <h4 className="font-bold text-[#fafafab5] mb-6">Product</h4>
                  <ul className="space-y-4 text-gray-500 text-[14px]">
                    <li className="hover:text-[#fafafab5] cursor-pointer transition">
                      WhatsApp Automation
                    </li>
                    <li className="hover:text-[#fafafab5] cursor-pointer transition">
                      CRM & Pipeline
                    </li>
                    <li className="hover:text-[#fafafab5] cursor-pointer transition">
                      Team Management
                    </li>
                    <li className="hover:text-[#fafafab5] cursor-pointer transition">
                      Property Website
                    </li>
                    <li className="hover:text-[#fafafab5] cursor-pointer transition">
                      Analytics
                    </li>
                    <li className="hover:text-[#fafafab5] cursor-pointer transition">
                      Integrations
                    </li>
                  </ul>
                </div>

                {/* 3. Company Links */}
                <div>
                  <h4 className="font-bold text-[#fafafab5] mb-6">Company</h4>
                  <ul className="space-y-4 text-gray-500 text-[14px]">
                    <li className="hover:text-[#fafafab5] cursor-pointer transition">
                      <a href="#industries">About Us</a>
                    </li>
                    <li className="hover:text-[#fafafab5] cursor-pointer transition">
                      <a href="#industries">Blog</a>
                    </li>
                    <li className="hover:text-[#fafafab5] cursor-pointer transition">
                      <a href="#industries">Case Studies</a>
                    </li>
                    <li className="hover:text-[#fafafab5] cursor-pointer transition">
                      <a href="#industries">Careers</a>
                    </li>
                    <li className="hover:text-[#fafafab5] cursor-pointer transition">
                      <a href="#industries">Contact</a>
                    </li>
                  </ul>
                </div>

                {/* 4. Support Links */}
                <div>
                  <h4 className="font-bold text-[#fafafab5] mb-6">Support</h4>
                  <ul className="space-y-4 text-gray-500 text-[14px]">
                    <li className="hover:text-[#fafafab5] cursor-pointer transition">
                      <a href="#portfolio">Help Center</a>
                    </li>
                    <li className="hover:text-[#fafafab5] cursor-pointer transition">
                      <a href="#testimonials">API Docs</a>
                    </li>
                    <li className="hover:text-[#fafafab5] cursor-pointer transition">
                      <a href="#contact">Status Page</a>
                    </li>
                    <li className="hover:text-[#fafafab5] cursor-pointer transition">
                      <a href="#ContactForm">Privacy Policy</a>
                    </li>
                    <li className="hover:text-[#fafafab5] cursor-pointer transition">
                      Terms of Service
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Copyright Section */}
              <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between text-[11px] text-gray-500">
                <p>
                  © 2025 BuildersCRM. All rights reserved. Made with ❤️ in
                  India.
                </p>
                <div className="flex gap-4 mt-4 md:mt-0">
                  <span>Meta WhatsApp Official Partner</span>
                  <span>ISO 27001 Certified</span>
                </div>
              </div>
            </div>
          </footer>
        </main>

        <JoinModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
        />
      </div>
    </>
  );
}
