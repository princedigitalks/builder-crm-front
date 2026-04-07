'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Activity, 
  Database, 
  Globe, 
  MessageSquare, 
  Server,
  TrendingUp,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  RefreshCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import StatusModal from '@/components/modals/StatusModal';

const SYSTEM_STATUS = [
  { name: 'Core API Server', status: 'operational', uptime: '99.98%', latency: '42ms', icon: Server },
  { name: 'Real-time Database', status: 'operational', uptime: '100%', latency: '12ms', icon: Database },
  { name: 'WhatsApp Bot Node', status: 'warning', uptime: '98.5%', latency: '156ms', icon: MessageSquare },
  { name: 'Storage Cluster', status: 'operational', uptime: '99.99%', latency: '24ms', icon: Globe },
];

const METRICS = [
  { label: 'System Load', value: '24%', trend: '-4%', status: 'optimal' },
  { label: 'Memory Usage', value: '3.2GB', trend: '+2%', status: 'optimal' },
  { label: 'Active Webhooks', value: '1,240', trend: '+12%', status: 'high' },
  { label: 'Error Rate', value: '0.02%', trend: '-0.01%', status: 'optimal' },
];

const StatusBadge = ({ status }: { status: string }) => (
  <span className={cn(
    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5",
    status === 'operational' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
    status === 'warning' ? "bg-amber-50 text-amber-600 border border-amber-100" :
    "bg-rose-50 text-rose-600 border border-rose-100"
  )}>
    <div className={cn(
      "w-1.5 h-1.5 rounded-full",
      status === 'operational' ? "bg-emerald-500 animate-pulse" :
      status === 'warning' ? "bg-amber-500 animate-bounce" : "bg-rose-500"
    )} />
    {status}
  </span>
);

export default function StatusPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8  mx-auto">
      

      <StatusModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
          // logic here
        }}
      />

 
    </div>
  );
}
