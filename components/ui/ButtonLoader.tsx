'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonLoaderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function ButtonLoader({ loading = false, children, className, disabled, ...props }: ButtonLoaderProps) {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={cn(className, (loading || disabled) && 'opacity-60 cursor-not-allowed')}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 size={14} className="animate-spin shrink-0" />
          {children}
        </span>
      ) : children}
    </button>
  );
}
