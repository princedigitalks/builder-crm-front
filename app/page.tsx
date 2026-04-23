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

const navLinks = [
  { name: "Features", href: "#Features" },
  { name: "How It Works", href: "#howitworks" },
  { name: "Product", href: "#Product" },
  { name: "Testimonials", href: "#Testimonials" },
];

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
        <img src="/logo.png" alt="CRMbot" className="h-10 lg:h-12 w-auto " />
      </div>

      <div className="md:flex items-center gap-10">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="hover:text-indigo-600 transition"
          >
            {link.name}
          </a>
        ))}
      </div>

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

export default function LandingPage() {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // stat section data

  const stats = [
    { value: "100+", label: "Real Estate Builders" },
    { value: "3.2X", label: "Average Lead Conversion Increase" },
    { value: "47s", label: "Average First Response Time" },
    { value: "₹180Cr+", label: "Deals Closed via Platform" },
  ];

  // badge data
  const badges = [
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      iconColor: "text-green-500",
      label: "Meta WhatsApp Official API",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
          />
        </svg>
      ),
      iconColor: "text-indigo-500",
      label: "100+ Real Estate Builders",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
      ),
      iconColor: "text-red-400",
      label: "Gujarat · Maharashtra · Rajasthan · Karnataka",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      iconColor: "text-yellow-400",
      label: "4.9/5 Average Rating",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      ),
      iconColor: "text-yellow-500",
      label: "ISO 27001 Data Security",
    },
  ];

  // feature section data
  const features = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
      ),
      title: "WhatsApp AI Automation",
      desc: "Qualify every lead automatically the moment they message you. Our AI bot asks the right questions — budget, property type, location — 24/7 without human effort.",
      points: [
        "Meta Official WhatsApp Business API",
        "AI chatbot for instant lead qualification",
        "Automated broadcast & follow-up messages",
        "Custom reply flows for each property",
        "Real-time message notifications",
      ],
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
          />
        </svg>
      ),
      title: "Smart Lead CRM Pipeline",
      desc: "Visualize every lead's journey from first contact to site visit to final deal. Never let a hot lead go cold with intelligent pipeline management.",
      points: [
        "Drag-and-drop Kanban lead pipeline",
        "Lead scoring & priority tagging (Hot/Warm/Cold)",
        "Import leads from IndiaMART, Facebook, 99acres",
        "Complete lead history & interaction log",
        "One-click WhatsApp from lead profile",
      ],
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
          />
        </svg>
      ),
      title: "Team & Staff Management",
      desc: "Assign leads to your sales team based on location, budget, or project. Track every staff member's performance in real-time and never miss a follow-up.",
      points: [
        "Role-based access (Admin / Manager / Sales)",
        "Automatic & manual lead assignment rules",
        "Individual staff performance dashboard",
        "Smart follow-up reminder alerts",
        "Target vs achievement tracking",
      ],
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3.284 14.253A8.959 8.959 0 013 12c0-.778.099-1.533.284-2.253"
          />
        </svg>
      ),
      title: "Mini Property Website Builder",
      desc: "Launch a stunning property showcase page in minutes — no code needed. Share it on WhatsApp and social media to capture leads directly from your listing page.",
      points: [
        "Beautiful pre-built property page templates",
        "Photo gallery, floor plans & brochure upload",
        "Direct WhatsApp inquiry button built-in",
        "Lead form integrated with your CRM",
        "Custom domain & SEO-ready pages",
      ],
    },
  ];

  // how it works data

  const steps = [
    {
      number: 1,
      title: "Customer Messages on WhatsApp",
      desc: "Prospect sends a message to your WhatsApp Business number — from your ad, brochure, or property website.",
    },
    {
      number: 2,
      title: "AI Bot Qualifies the Lead",
      desc: "Our intelligent chatbot instantly asks for name, budget, preferred property type, location, and timeline — politely and naturally.",
    },
    {
      number: 3,
      title: "Lead Auto-Created in CRM",
      desc: "All captured information is automatically added as a new lead in your BuildersCRM pipeline — zero manual data entry.",
    },
    {
      number: 4,
      title: "Assigned to the Right Salesperson",
      desc: "Lead is automatically or manually assigned to the best-fit sales executive based on your assignment rules.",
    },
    {
      number: 5,
      title: "Smart Follow-ups Tracked",
      desc: "Automated reminders ensure no lead is forgotten. Log calls, site visits, and notes right from the CRM.",
    },
    {
      number: 6,
      title: "Deal Closed & Reported",
      desc: "Mark deals as won, generate reports, and celebrate. Full analytics show you exactly what's working.",
    },
  ];

  const chatMessages = [
    {
      from: "bot",
      text: "Hello! Welcome to Skyline Builders. I'm here to help you find your dream home. May I know your name?",
    },
    { from: "customer", text: "Hi I'm Vikram Joshi" },
    {
      from: "bot",
      text: "Nice to meet you, Vikram! 😊 What's your budget range for the property?",
    },
    { from: "customer", text: "Around 60–70 lakhs" },
    {
      from: "bot",
      text: "Great budget! Are you looking for a 2BHK, 3BHK, or a Villa? 🏠",
    },
    { from: "customer", text: "3BHK preferably" },
  ];

  return (
    <>
      <style>{`
        .font-Sans { font-family: 'DM Sans', sans-serif } 
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
         @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.65);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
          .a-top-badge {
          animation: popIn 0.45s 0.85s ease both;
        }

         @keyframes bounceSlow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
         .c-bounce {
          animation: bounceSlow 3s ease-in-out infinite;
        }

          .a-bot-badge {
          animation: popIn 0.45s 1.05s ease both;
        }

         @keyframes floatDown {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(8px);
          }
        }
         .c-float {
          animation: floatDown 3.5s ease-in-out infinite;
        }
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
          <section className="relative pt-32 pb-20 overflow-hidden px-6 sm:px-10 md:px-12 lg:px-15">
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
                    Now with AI Lead Qualification — Powered by Meta WhatsApp
                    API
                  </div>
                  <h1 className="text-5xl md:text-[55px] font-Sans font-bold text-slate-900 leading-[1.1] tracking-tight mb-8">
                    Manage leads and close deals with{" "}
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      speed and ease.{" "}
                    </span>{" "}
                  </h1>
                  <p className="text-[18px] font-jakarta text-slate-500 leading-relaxed max-w-xl mb-6">
                    From lead capture to deal closure, automate your workflow
                    and manage everything in one powerful, easy-to-use platform.
                    Gain complete visibility into your pipeline and close deals
                    faster with smart insights.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                      onClick={() => setIsJoinOpen(true)}
                      className="w-full sm:w-auto font-jakarta  bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 group"
                    >
                      Book demo
                    </button>
                    <button className="w-full font-jakarta text-[15px] sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200  px-6 py-4 rounded-2xl font-bold transition-all text-lg">
                      Watch demo
                    </button>
                  </div>
                  {/* Trust Badges */}
                  <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
                    {[
                      {
                        icon: (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        ),
                        label: "100+ Builders",
                      },
                      {
                        icon: (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                            />
                          </svg>
                        ),
                        label: "Meta Official API",
                      },
                      {
                        icon: (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                            />
                          </svg>
                        ),
                        label: "3x Lead Conversion",
                      },
                      {
                        icon: (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                            />
                          </svg>
                        ),
                        label: "GDPR Compliant",
                      },
                    ].map((badge, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="text-indigo-500">{badge.icon}</span>
                        <span className="text-[13px] text-slate-500 font-medium font-jakarta">
                          {badge.label}
                        </span>
                        {i < 2 && (
                          <span className="ml-4 text-slate-200 hidden sm:inline">
                            |
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>

                <div className="a-dashboard relative flex justify-center px-0 sm:px-6 lg:px-0 w-full mt-10 lg:mt-0">
                  {/* Lead Captured Badge */}
                  <div className="a-top-badge c-bounce absolute -top-6 left-0 sm:left-[1%] md:-left-[1%] lg:-left-4 z-30 bg-white shadow-xl rounded-xl p-3 flex items-center gap-2 border border-green-50">
                    <span className="text-xs text-indigo-600 font-bold text-gray-700 whitespace-nowrap">
                      1+ new whatsapp lead
                    </span>
                  </div>

                  {/* Dashboard Window */}
                  <div className="c-glow bg-[#f0f2f9] w-full max-w-full h-auto rounded-[24px] shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Window Header */}

                    <div className="p-4 md:p-5 space-y-3">
                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-2 md:gap-3">
                        {[
                          {
                            label: "Total Leads",
                            val: "1,248",
                            trend: "↑ 24% this week",
                            trendColor: "text-green-600",
                          },
                          {
                            label: "Deals Closed",
                            val: "84",
                            trend: "↑ 18% this month",
                            trendColor: "text-green-600",
                          },
                          {
                            label: "Follow-ups",
                            val: "32",
                            trend: "⏰ Due today",
                            trendColor: "text-orange-500",
                          },
                        ].map((stat, i) => (
                          <div
                            key={i}
                            className="bg-white rounded-2xl p-3 md:p-4 border border-gray-100 shadow-sm"
                          >
                            <div className="text-[9px] md:text-[11px] text-gray-400 font-medium mb-1">
                              {stat.label}
                            </div>
                            <div className="text-xl md:text-2xl font-black text-gray-900 leading-none mb-1">
                              {stat.val}
                            </div>
                            <div
                              className={`text-[9px] md:text-[10px] font-semibold ${stat.trendColor}`}
                            >
                              {stat.trend}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Lead List */}
                      <div className="space-y-2">
                        {[
                          {
                            name: "Rahul Kapoor",
                            sub: "via WhatsApp · 3BHK · ₹85L",
                            tag: "Hot 🔥",
                            tagColor: "bg-red-50 text-red-500",
                            initial: "RK",
                            bg: "bg-indigo-500",
                          },
                          {
                            name: "Priya Sharma",
                            sub: "via WhatsApp · 2BHK · ₹52L",
                            tag: "Warm",
                            tagColor: "bg-orange-50 text-orange-500",
                            initial: "PS",
                            bg: "bg-orange-400",
                          },
                          {
                            name: "Amit Mehta",
                            sub: "via WhatsApp · Villa · ₹1.2Cr",
                            tag: "New ✨",
                            tagColor: "bg-green-50 text-green-600",
                            initial: "AM",
                            bg: "bg-green-600",
                          },
                        ].map((lead, i) => (
                          <div
                            key={i}
                            className="bg-white rounded-2xl px-3 py-2.5 flex items-center justify-between border border-gray-100 shadow-sm hover:shadow-md hover:translate-x-0.5 transition-all duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 md:w-10 md:h-10 ${lead.bg} rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0`}
                              >
                                {lead.initial}
                              </div>
                              <div>
                                <div className="text-[12px] md:text-[13px] font-bold text-gray-800">
                                  {lead.name}
                                </div>
                                <div className="text-[10px] text-gray-400">
                                  {lead.sub}
                                </div>
                              </div>
                            </div>
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${lead.tagColor}`}
                            >
                              {lead.tag}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Auto-qualified message */}
                      <div className="bg-green-50 border border-green-100 rounded-2xl px-3 py-2.5 flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </div>
                        <p className="text-[10px] md:text-[11px] text-gray-600 leading-relaxed">
                          <span className="font-bold text-gray-800">
                            Auto-qualified:
                          </span>{" "}
                          New lead from WhatsApp — Vikram Joshi, Budget ₹70L,
                          Looking for 3BHK in Surat. Assigned to Rajesh.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Deal Closed Badge */}
                  <div className="a-bot-badge c-float absolute bottom-5 right-0 sm:right-[1%] md:-right-[1%] lg:-right-4 z-30 bg-white shadow-xl rounded-full px-4 py-2 flex items-center gap-2 border border-gray-100">
                    <svg
                      className="w-4 h-4 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs font-bold text-indigo-700 whitespace-nowrap">
                      Deal Closed! ₹85L 🎉
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Trust section */}
          <section className="bg-[#f4f5fb] border-y border-indigo-50 py-5 px-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-6xl mx-auto"
            >
              {/* Scrollable row on mobile, flex wrap on desktop */}
              <div className="flex flex-wrap justify-center items-center gap-x-0 gap-y-3">
                {badges.map((badge, i) => (
                  <div key={i} className="flex items-center">
                    {/* Badge item */}
                    <div className="flex items-center gap-2 px-5 py-1">
                      <span className={badge.iconColor}>{badge.icon}</span>
                      <span className="text-[13px] font-medium text-slate-500 whitespace-nowrap">
                        {badge.label}
                      </span>
                    </div>

                    {/* Divider — hide after last item */}
                    {i < badges.length - 1 && (
                      <div className="hidden sm:block h-5 w-px bg-slate-200 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </section>

          <section>
            <div className="max-w-7xl bg-white py-10 px-6 sm:px-10 md:px-12 lg:px-15 mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex flex-col items-center text-center   border-white-400 border-white  hover:border-indigo-600 rounded-2xl py-6 px-4 shadow-[0_4px_20px_rgba(79,70,229,0.18)]"
                  >
                    <span
                      className="font-Sans font-extrabold text-indigo-600  leading-none mb-3
        text-[40px] min-[400px]:text-[30px] sm:text-[32px] md:text-[30px] lg:text-[35px]"
                    >
                      {stat.value}
                    </span>
                    <span
                      className="font-jakarta text-[#6b7280] leading-snug
        text-[12px] sm:text-[14px] md:text-[15px] max-w-[160px]"
                    >
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          {/* Features Grid */}
          {/* <section id="features" className="py-24 px-6 bg-white relative">
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
          </section> */}

          {/* featrures  section*/}
          <section
            className="bg-white py-20 px-6 sm:px-10 md:px-12 lg:px-15"
            id="Features"
          >
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-14"
              >
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-indigo-500 mb-3">
                  Core Features
                </p>
                <h2 className="text-[28px] sm:text-[36px] md:text-[44px] font-Sans font-bold text-gray-900 leading-[1.15] tracking-tight mb-4">
                  A Smarter Approach to
                  <br />
                  Lead-to-Deal Conversion
                </h2>
                <p className="text-gray-400 text-[14px] sm:text-[16px] font-jakarta max-w-lg mx-auto leading-relaxed">
                  OHandle conversations, track leads, and manage your team
                  efficiently without juggling multiple tools.
                </p>
              </motion.div>

              {/* 2x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {features.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm hover:shadow-[0_8px_30px_rgba(79,70,229,0.15)] hover:border-indigo-600 transition-all duration-300 group"
                  >
                    {/* Icon */}
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-5 group-hover:bg-indigo-100 transition-colors">
                      {f.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-[20px] font-bold text-gray-900 mb-2 leading-snug">
                      {f.title}
                    </h3>

                    {/* Desc */}
                    <p className="text-[14px] text-gray-400 leading-relaxed mb-5">
                      {f.desc}
                    </p>

                    {/* Checklist */}
                    <ul className="space-y-2">
                      {f.points.map((point, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-[14px] text-gray-500 leading-snug">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* How it works section */}
          <section className="bg-[#f4f5fb] py-20 px-6 sm:px-10" id="howitworks">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* ── LEFT: Steps ── */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Label */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-px bg-indigo-400" />
                    <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-indigo-500">
                      How It Works
                    </span>
                  </div>

                  {/* Heading */}
                  <h2 className="text-[28px] sm:text-[34px] md:text-[40px] font-Sans font-bold text-gray-900 leading-[1.15] tracking-tight mb-5">
                    From First Message to Final Deal — Fully Automated
                  </h2>

                  {/* Sub */}
                  <p className="text-[14px] sm:text-[15px]  .font-jakarta text-gray-400 leading-relaxed mb-10 max-w-md">
                    From capture to conversion, BuildersCRM simplifies the
                    process so your team can sell more.
                  </p>

                  {/* Steps */}
                  <div className="space-y-5">
                    {steps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        onClick={() => setActiveStep(i)}
                        className={`flex items-start gap-4 cursor-pointer group transition-all duration-200`}
                      >
                        {/* Number circle */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-all duration-200 ${
                            activeStep === i
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                              : "bg-white border border-gray-200 text-indigo-500 group-hover:border-indigo-300"
                          }`}
                        >
                          {step.number}
                        </div>

                        {/* Content */}
                        <div>
                          <h3
                            className={`text-[17px] font-bold leading-snug mb-1 transition-colors ${
                              activeStep === i
                                ? "text-indigo-600"
                                : "text-gray-800 group-hover:text-indigo-500"
                            }`}
                          >
                            {step.title}
                          </h3>
                          <p className="text-[15px] text-gray-400 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* ── RIGHT: WhatsApp Chat Mockup ── */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="lg:sticky lg:top-24"
                >
                  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Chat Header */}
                    <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-gray-900">
                          BuildersCRM Bot
                        </p>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <p className="text-[10px] text-gray-400">
                            Online · Powered by AI
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="px-5 py-5 space-y-4 bg-[#f8fafc] min-h-[360px]">
                      {chatMessages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: i * 0.12 }}
                          className={`flex ${msg.from === "customer" ? "justify-end flex-col items-end" : "flex-col items-start"}`}
                        >
                          {msg.from === "bot" && (
                            <span className="text-[9px] text-gray-400 font-medium mb-1 ml-1">
                              Bot
                            </span>
                          )}
                          {msg.from === "customer" && (
                            <span className="text-[9px] text-gray-400 font-medium mb-1 mr-1">
                              Customer
                            </span>
                          )}
                          <div
                            className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[12px] leading-relaxed ${
                              msg.from === "bot"
                                ? "bg-white border border-gray-100 text-gray-700 rounded-tl-sm shadow-sm"
                                : "bg-indigo-600 text-white rounded-tr-sm"
                            }`}
                          >
                            {msg.text}
                          </div>
                        </motion.div>
                      ))}

                      {/* Typing indicator */}
                      <div className="flex flex-col items-start">
                        <span className="text-[9px] text-gray-400 font-medium mb-1 ml-1">
                          Bot
                        </span>
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                          <div
                            className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <div
                            className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <div
                            className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Lead auto-created banner */}
                    <div className="px-5 py-3 bg-white border-t border-gray-100 flex items-center justify-end">
                      <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5">
                        <svg
                          className="w-3.5 h-3.5 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-[11px] font-bold text-indigo-600">
                          Lead auto-created in CRM ✓
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
          {/* Footer */}
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
