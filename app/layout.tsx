import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit'
});

export const metadata: Metadata = {
  title: 'builderscrm.in | Real Estate Management Platform',
  description: 'Empowering real estate builders with lead centralization, WhatsApp automation, and visual pipelines.',
  icons: {
    icon: '/favicon.png',
  },
};

import { Providers } from '@/redux/Providers';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body suppressHydrationWarning className="font-outfit">
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-center" />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}
