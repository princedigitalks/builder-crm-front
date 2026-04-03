export interface Lead {
  id: string;
  name: string;
  phone: string;
  site: string;
  source: 'WhatsApp' | 'Facebook' | 'Website' | 'Walk-in' | 'Referral';
  budget: string;
  stage: 'New' | 'Contacted' | 'Interested' | 'Site Visit' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  agent: string;
  createdAt: string;
}

export const LEADS: Lead[] = [
  { id: '1', name: 'Amit Sharma', phone: '+91 99001 23456', site: 'Skyline Heights', source: 'WhatsApp', budget: '₹80L', stage: 'Interested', agent: 'Kavya R.', createdAt: '2024-03-20' },
  { id: '2', name: 'Pooja Verma', phone: '+91 98102 34567', site: 'Skyline Grand', source: 'Facebook', budget: '₹1.2Cr', stage: 'Site Visit', agent: 'Nikhil M.', createdAt: '2024-03-21' },
  { id: '3', name: 'Ravi Gupta', phone: '+91 97203 45678', site: 'Skyline Heights', source: 'Website', budget: '₹65L', stage: 'Negotiation', agent: 'Kavya R.', createdAt: '2024-03-22' },
  { id: '4', name: 'Sunita Patel', phone: '+91 96304 56789', site: 'Skyline Grand', source: 'WhatsApp', budget: '₹90L', stage: 'Contacted', agent: 'Priya S.', createdAt: '2024-03-23' },
  { id: '5', name: 'Deepak Nair', phone: '+91 95405 67890', site: 'Skyline Heights', source: 'Facebook', budget: '₹55L', stage: 'New', agent: 'Nikhil M.', createdAt: '2024-03-24' },
  { id: '6', name: 'Meera Joshi', phone: '+91 94506 78901', site: 'Skyline Grand', source: 'WhatsApp', budget: '₹1.5Cr', stage: 'Closed Won', agent: 'Kavya R.', createdAt: '2024-03-25' },
];

export const STAGES = [
  { id: 'New', label: 'New Lead', color: 'bg-indigo-500' },
  { id: 'Contacted', label: 'Contacted', color: 'bg-blue-500' },
  { id: 'Interested', label: 'Interested', color: 'bg-cyan-500' },
  { id: 'Site Visit', label: 'Site Visit', color: 'bg-emerald-500' },
  { id: 'Negotiation', label: 'Negotiation', color: 'bg-amber-500' },
  { id: 'Closed Won', label: 'Closed Won', color: 'bg-green-600' },
];
