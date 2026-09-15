/**
 * CELLA Core Database & Application Interfaces (PHASE 1 - MINIMAL SCHEMA)
 */

// 1. User & Staff (profiles)
export interface Staff {
  id: string;
  fullName: string;
  email?: string;
  password?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MASTER_ARTIST' | 'ARTIST' | 'SALES_CONSULTANT' | 'ACADEMY_TRAINER' | 'CUSTOMER';
  phone: string;
  avatarUrl: string;
  department?: string;
  branch?: string;
  employeeCode?: string;
  joinedDate?: string;
}

export type UserAccount = Staff;

// 2. Customer & Lead (customers)
export interface Customer {
  id: string;
  customerCode?: string;
  name: string; // Map to full_name in DB
  phone: string;
  email?: string;
  avatarUrl?: string;
  source: 'TIKTOK' | 'FACEBOOK' | 'ZALO' | 'REFERRAL' | 'HOTLINE' | 'WALK_IN' | 'WEBSITE';
  status: 'LEAD' | 'CONSULTING' | 'BOOKED' | 'VIP' | 'RE_CARE'; // Legacy mapping
  crmStage: 'LEAD_NEW' | 'CONSULTING' | 'BOOKED' | 'PURCHASED' | 'FOLLOW_UP'; // New Phase 1 Stage
  assignedStaffId?: string;
  lastContactAt?: string;
  totalSpent?: number;
  contactCount?: number;
  vipTier?: string; 
  lastContactText?: string; 
  notesHistory?: any[];
}

// 3. Booking (bookings)
export interface Booking {
  id: string;
  bookingCode: string; // e.g. #BK-20250425-01
  customerId: string;
  customerName: string; // Derived from join
  customerPhone: string; // Derived from join
  serviceTitle: string; // Maps to service_name / look_id
  artistId?: string;
  artistName?: string;
  appointmentTime: string; // Derived from booking_date and start_time
  appointmentDate?: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  depositAmount?: number;
  notes?: string;
  locationAddress?: string;
}

// 4. Tasks (tasks)
export interface Task {
  id: string;
  title: string;
  description?: string;
  taskType?: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'Quan tr?ng' | 'Bình thu?ng' | 'Th?p';
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  time: string; // Map to due_at for UI
  dueTime?: string;
  dueAt?: string;
  assignedTo?: string;
  completed: boolean; // Derived from status === 'DONE'
  customerName?: string; // UI friendly
}

// Course (Minimal)
export interface Course {
  id: string;
  title: string;
  category: string;
  code: string;
  instructor: string;
  instructorTitle: string;
  instructorAvatar: string;
  totalLessons: number;
  highlights: string[];
  startDate: string;
  schedule: string;
  registeredCount: number;
  maxStudents: number;
  price: number;
  originalPrice?: number;
  isHot?: boolean;
  syllabus: any[];
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  timestamp: string;
  unread: boolean;
  actionText?: string;
  secondaryActionText?: string;
}

// 5. Navigation Screens & Tabs (Minimal Phase 1)
export type NavTab = 'home' | 'tasks' | 'customers' | 'booking' | 'more';

export type ScreenId =
  | 'splash'
  | 'auth'
  | 'home'
  | 'customers'
  | 'create_customer'
  | 'customer_detail'
  | 'booking'
  | 'create_booking'
  | 'booking_detail'
  | 'tasks'
  | 'revenue'
  | 'academy'
  | 'ai_assistant'
  | 'profile'
  | 'more';
