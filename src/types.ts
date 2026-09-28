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
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'Quan trß╗ìng' | 'B├¼nh th╞░ß╗¥ng' | 'Thß║Ñp';
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
  | 'edit_customer'
  | 'customer_detail'
  | 'booking'
  | 'create_booking'
  | 'booking_detail'
  | 'tasks'
  | 'revenue'
  | 'academy'
  | 'ai_assistant'
  | 'profile'
  | 'hr'
  | 'roles'
  | 'makeup_lookbook'
  | 'instructors'
  | 'more';

export interface NewsfeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  timestamp: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  isLikedByMe?: boolean;
}

// 6. Makeup Lookbook (matching Supabase makeup_looks table)
export interface MakeupLook {
  id: string;
  title: string;
  tagline?: string;
  category: 'Cô dâu' | 'Dự tiệc' | 'Sự kiện' | 'Kỷ yếu' | 'Cá nhân' | string;
  aura_tone?: string;
  rating: number;
  saved_count?: number;
  reviews_count?: number;
  duration_minutes?: number;
  standard_price: number;
  member_price?: number;
  hero_image_url: string;
  gallery_images?: string[];
  video_tutorial_url?: string;
  author_artist_id?: string;
  artist: string;
  description?: string;
  color_breakdown?: string[];
  suitable_face_shapes?: string[];
  ideal_undertones?: string[];
  cosmetic_products?: string[];
  is_featured?: boolean;
  created_at?: string;
}

// 7. Instructor / Trainer (Đội ngũ giảng viên Học viện CELLA)
export interface Instructor {
  id: string;
  name: string;
  title: string;
  role: 'MASTER' | 'TRAINER' | 'ASSISTANT' | string;
  avatar: string;
  coverImage?: string;
  phone?: string;
  email?: string;
  experienceYears: number;
  studentsCount: number;
  rating: number;
  specialties: string[];
  achievements?: string[];
  bio?: string;
  coursesTeaching?: string[];
  zaloPhone?: string;
}
