

export interface InvoiceDesignSettings {
  font: string;
  headerColor: string;
  logoSize: number; // height in pixels (40 - 160)
  alignment: 'left' | 'center' | 'right';
}

export interface PayrollSettings {
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  anchorDate: string; // YYYY-MM-DD start of a period
}

export interface BusinessProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  logoUrl: string | null;
  currency: string;
  locale: string;
  country: string;
  state?: string;
  defaultTaxRate?: number;
  theme?: 'royal' | 'blue' | 'eco' | 'industrial' | 'midnight' | 'crimson' | 'safety' | 'ocean' | 'earth' | 'berry' | 'sunset' | 'mint';
  design?: InvoiceDesignSettings;
  laborRate?: number;
  termsTemplate?: string;
  payrollSettings?: PayrollSettings; // NEW
}

export interface ClientDetails {
  id?: string;
  companyName?: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  notes?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  taxable?: boolean;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: 'Material' | 'Labor' | 'Subcontractor' | 'Other';
  receiptUrl?: string;
  items?: { description: string; amount: number }[];
}

export interface ReceiptItem {
  description: string;
  amount: number;
}

export interface ReceiptData {
  merchant: string;
  date: string;
  category: 'Material' | 'Labor' | 'Subcontractor' | 'Other';
  items: ReceiptItem[];
}

export interface InvoiceSnapshot {
  versionId: string;
  timestamp: string;
  data: InvoiceData;
  note: string;
}


export interface PaymentRecord {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  method?: 'cash' | 'cheque' | 'etransfer' | 'card' | 'other';
  note?: string;
}

export interface InvoiceData {
  id: string;
  projectId?: string;
  number: string;
  status: 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue';
  date: string;
  dueDate: string;
  taxRate: number;
  currency?: string;
  items: LineItem[];
  expenses: Expense[];
  notes: string;
  terms: string;
  photos: string[];
  client: ClientDetails;
  history?: InvoiceSnapshot[];
  payments?: PaymentRecord[];
  signature?: string;
}

export type ProjectStatus = 'active' | 'completed' | 'archived' | 'lead';
export type AppMode = 'easy' | 'advanced';

export interface Project {
  id: string;
  title: string;
  client: ClientDetails;
  status: ProjectStatus;
  startDate: string;
  deadline?: string;
  invoices: InvoiceData[]; 
  estimates: ProjectEstimate[]; 
  timeline?: JobTimeline; // Single timeline per project
  photos: string[]; // Before / Progress photos
  afterPhotos?: string[]; // After / Completed photos
  notes: string;
  teamMembers: string[];
  events?: CalendarEvent[];
}

// Context passed to tools to scope them to a specific project
export interface ProjectContext {
  id: string;
  title: string;
  clientName: string;
  startDate: string;
}

export interface ProductRecommendation {
  name: string;
  vendor: string;
  price: number;
  currency: string;
  isBulk: boolean;
  bulkQuantity?: number;
  bulkPrice?: number;
}

export interface PriceTier {
  grade: 'Budget' | 'Standard' | 'Premium';
  unitPrice: number;
  total: number;
  description: string;
  products?: ProductRecommendation[];
}

export interface EstimateItem {
  category: 'Material' | 'Labor' | 'Other';
  name: string;
  quantity: number;
  unit: string;
  reasoning: string;
  tiers: {
    budget: PriceTier;
    standard: PriceTier;
    premium: PriceTier;
  };
}

export interface ItemState {
  isSelected: boolean;
  selectedTier: 'budget' | 'standard' | 'premium';
  discountPercent: number;
  overrideQuantity?: number;
  overridePrice?: number;
}

export interface ProjectEstimate {
  id: string;
  title?: string; // NEW: User-defined title for the estimate (e.g. "Master Bath")
  timestamp: string;
  summary: string;
  items: EstimateItem[];
  savedSelections?: Record<number, ItemState>; // Persist user choices (checkboxes, tiers)
}

export type PlanType = 'free' | 'pro' | 'enterprise';

export interface UserSubscription {
  plan: PlanType;
  credits: number;
  billingCycle?: 'monthly' | 'yearly';
  status: 'active' | 'past_due' | 'cancelled';
  joinedDate: string;
}

export interface AIProviderConfig {
  provider: 'gemini' | 'openai' | 'claude';
  apiKey: string;
  isActive: boolean;
}

export interface PricingConfig {
  monthlyPro: number;
  yearlyPro: number;
  creditPackSmall: { credits: number; price: number };
  creditPackMedium: { credits: number; price: number };
  creditPackLarge: { credits: number; price: number };
}

export interface PlatformAnalytics {
  totalRevenue: number;
  totalApiCosts: number;
  totalRequests: number;
  activeSubscribers: number;
  netProfit: number;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  plan: PlanType;
  status: 'active' | 'banned';
  joined: string;
  credits: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'admin' | 'member' | 'viewer';
  email: string;
  phone?: string;
  status: 'active' | 'invited';
  avatar?: string;
  // NEW FIELDS FOR CREW MANAGEMENT
  specialty?: string; // e.g. "Electrician", "Laborer"
  hourlyRate?: number;
  currentStatus?: 'on_site' | 'available' | 'off';
}

export interface TimeLog {
  id: string;
  projectId: string;
  memberId: string;
  memberName: string;
  date: string;
  startTime?: string; // e.g. "09:00"
  endTime?: string;   // e.g. "17:00"
  hours: number;
  description: string;
  cost: number; // hours * rate
}

export interface CalendarEvent {
  id: string;
  title: string;
  clientName?: string;
  date: string;
  time?: string;
  location?: string;
  type: 'job_start' | 'deadline' | 'payment' | 'meeting';
  invoiceId?: string;
  notes?: string;
  color?: string;
}

export interface JobTemplate {
  id: string;
  name: string;
  description: string;
  items: LineItem[];
  laborHours: number;
  notes: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}

export interface TimelineStage {
  id: string;
  name: string;
  description?: string;
  status: 'pending' | 'current' | 'completed';
  date?: string;
  deadline?: string;
}

export interface JobTimeline {
  id: string;
  title: string;
  projectId?: string;
  startDate: string;
  stages: TimelineStage[];
}

export interface SupportTicket {
  id: string;
  user: string;
  message: string;
  status: 'open' | 'closed';
  timestamp: string;
}