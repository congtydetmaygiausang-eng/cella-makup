/**
 * CELLA Core Database & Application Interfaces
 */

// 1. User & Staff
export interface Staff {
  id: string;
  fullName: string;
  email?: string;
  password?: string;
  role: 'MASTER' | 'ARTIST' | 'SALES' | 'ACADEMY_TRAINER';
  phone: string;
  avatarUrl: string;
  baseSalary: number;
  commissionRate: number;
  kpiScore: number;
  title?: string;
  department?: string;
  branch?: string;
  employeeCode?: string;
  joinedDate?: string;
}

export type UserAccount = Staff;

// 2. Customer & Lead
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  source: 'TIKTOK' | 'FACEBOOK' | 'ZALO' | 'REFERRAL' | 'HOTLINE' | 'WALK_IN';
  status: 'LEAD' | 'CONSULTING' | 'BOOKED' | 'VIP' | 'RE_CARE';
  vipTier?: string; // 'VIP 1', 'VIP Gold', etc.
  assignedStaff?: string;
  assignedStaffId?: string;
  lastContactText?: string;
  totalSpent?: number;
  contactCount?: number;
  birthDate?: string;
  address?: string;
  interests?: string[];
  skinProfile?: {
    skinType: 'DRY' | 'OILY' | 'COMBINATION' | 'NORMAL';
    undertone: 'COOL' | 'WARM' | 'NEUTRAL';
    faceShape: 'OVAL' | 'ROUND' | 'SQUARE' | 'HEART';
    notes?: string;
  };
  notesHistory?: {
    id: string;
    author: string;
    timestamp: string;
    content: string;
  }[];
}

// 3. Makeup Look / Lookbook
export interface MakeupLook {
  id: string;
  title: string;
  category: 'BRIDAL' | 'EDITORIAL' | 'KOREAN_GLOW' | 'Y2K' | 'AURA_ART';
  price: number;
  memberPrice: number;
  durationMinutes: number;
  artistId: string;
  artistName: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  description: string;
  faceShapeFit: string[];
  undertoneFit: string[];
  swatches: {
    name: string;
    colorCode: string;
    type: 'LIP' | 'EYE' | 'BLUSH' | 'GLOW';
  }[];
  productsUsed: string[];
  videoTutorialUrl?: string;
  steps?: {
    title: string;
    duration: string;
    description: string;
    proTip: string;
  }[];
}

// 4. Booking
export interface Booking {
  id: string;
  bookingCode: string; // e.g. #BK-20250425-01
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerVip?: string;
  serviceTitle: string;
  serviceCategory?: string;
  lookId?: string;
  artistId: string;
  artistName: string;
  appointmentTime: string; // e.g. "09:00 - 10:30"
  appointmentDate: string; // e.g. "2025-04-25"
  branchName: string; // e.g. "Cơ sở Quận 1"
  locationAddress: string;
  locationType: 'STUDIO' | 'HOME_VISIT';
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  depositAmount: number;
  notes?: string;
  smsReminder?: boolean;
}

// 5. Tasks
export interface Task {
  id: string;
  title: string;
  time: string;
  category: string;
  priority: 'Quan trọng' | 'Bình thường' | 'Thấp';
  completed: boolean;
  dueDate: string;
}

// 6. Academy Course
export interface Course {
  id: string;
  title: string;
  category: 'Chuyên nghiệp' | 'Nâng cao' | 'Cơ bản';
  code: string;
  instructor: string;
  instructorTitle: string;
  instructorAvatar?: string;
  totalLessons: number;
  highlights: string[];
  startDate: string;
  schedule: string;
  registeredCount: number;
  maxStudents: number;
  price: number;
  originalPrice?: number;
  isHot?: boolean;
  isEarlyBird?: boolean;
  syllabus: { lesson: number; title: string; duration: string }[];
}

// 7. Feed Post (Social & Activity Feed)
export interface FeedPost {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  timestamp: string;
  privacy: string;
  category: string;
  content: string;
  customerTag?: string;
  serviceTag?: string;
  branchTag?: string;
  treatmentResult?: {
    beforeImg: string;
    afterImg: string;
    treatmentLabel: string;
    customerName: string;
    customerId: string;
  };
  images?: string[];
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  sharesCount: number;
  comments?: {
    id: string;
    author: string;
    text: string;
    time: string;
  }[];
}

// 8. Notification Item
export interface NotificationItem {
  id: string;
  type: 'BOOKING' | 'LEAD' | 'TASK' | 'COMMENT';
  title: string;
  subtitle: string;
  timestamp: string;
  unread: boolean;
  details?: string;
  actionText?: string;
  secondaryActionText?: string;
}

// 8.1 Payroll Record
export interface PayrollRecord {
  month: string;
  netSalary: number;
  baseSalary: number;
  commissionService: number;
  commissionAcademy: number;
  bonusKpi: number;
  allowances: number;
  deductions: number;
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
}

// 9. Navigation Screens & Tabs
export type NavTab = 'home' | 'booking' | 'customers' | 'feed' | 'profile' | 'tasks' | 'more';

export type ScreenId =
  | 'splash'
  | 'home'
  | 'tasks'
  | 'customers'
  | 'customer_detail'
  | 'create_customer'
  | 'booking'
  | 'create_booking'
  | 'booking_detail'
  | 'lookbook'
  | 'lookbook_detail'
  | 'video_tutorial'
  | 'feed'
  | 'create_post'
  | 'academy'
  | 'attendance'
  | 'payroll'
  | 'revenue'
  | 'ai_assistant'
  | 'profile'
  | 'notifications'
  | 'more'
  | 'auth';
