import { Staff, Customer, Booking, Task, Course, NotificationItem } from '../types';

export const CURRENT_USER: Staff = {
  id: 'NV-8826',
  employeeCode: 'CELLA-8826',
  fullName: 'Nguyễn Thị Lan',
  email: 'lan.nguyen@cellabeaute.vn',
  password: '123',
  role: 'SALES_CONSULTANT',
  phone: '0908 654 321',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  department: 'Khối Tuyển sinh & CSKH',
  branch: 'Cơ sở Quận 1 - Trụ sở chính CELLA',
  joinedDate: '15/03/2023',
};

export const SAMPLE_ACCOUNTS: Staff[] = [
  CURRENT_USER,
  {
    id: 'NV-9912',
    employeeCode: 'CELLA-9912',
    fullName: 'Trần Minh Phúc',
    email: 'phuc.tran@cellabeaute.vn',
    password: '123',
    role: 'ARTIST',
    phone: '0912 345 678',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    department: 'Khối Dịch vụ',
    branch: 'Cơ sở Quận 3',
    joinedDate: '01/08/2023',
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Nguyễn Thị Mai',
    phone: '0901 234 567',
    email: 'mai.tran@gmail.com',
    source: 'TIKTOK',
    status: 'LEAD',
    crmStage: 'LEAD_NEW',
    vipTier: 'VIP 1',
    assignedStaffId: 'NV-8826',
    lastContactText: '2 giờ trước',
    totalSpent: 0,
    contactCount: 5,
    notesHistory: [
      {
        id: 'n1',
        author: 'Lan Anh',
        timestamp: '2 giờ trước',
        content: 'Khách hẹn sáng mai qua trung tâm tư vấn.',
      },
    ],
  },
  {
    id: 'CUST-002',
    name: 'Trần Văn Nam',
    phone: '0902 345 678',
    email: 'nam.tran@gmail.com',
    source: 'FACEBOOK',
    status: 'CONSULTING',
    crmStage: 'CONSULTING',
    vipTier: 'Thành viên',
    lastContactText: '1 ngày trước',
    totalSpent: 2500000,
    contactCount: 3,
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-1',
    bookingCode: '#BK-20250425-01',
    customerId: 'CUST-001',
    customerName: 'Nguyễn Thị Mai',
    customerPhone: '0901 234 567',
    serviceTitle: 'Tư vấn thẩm mỹ',
    artistId: 'NV-8826',
    artistName: 'Lan Anh',
    appointmentDate: '2025-04-25',
    appointmentTime: '09:00 – 10:30 (Sáng)',
    locationAddress: 'Cơ sở Quận 1',
    status: 'CONFIRMED',
    totalAmount: 18500000,
    depositAmount: 5000000,
    notes: 'Khách cần tư vấn kỹ về lộ trình.',
  },
  {
    id: 'bk-2',
    bookingCode: '#BK-20250424-02',
    customerId: 'CUST-002',
    customerName: 'Trần Văn Nam',
    customerPhone: '0902 345 678',
    serviceTitle: 'Chăm sóc da',
    artistId: 'st-2',
    artistName: 'Minh Đức',
    appointmentDate: '2025-04-24',
    appointmentTime: '11:00 – 12:00',
    locationAddress: 'Cơ sở Quận 1',
    status: 'CONFIRMED',
    totalAmount: 2500000,
    depositAmount: 500000,
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Gọi lại khách hàng Trần Thị Mai',
    time: '09:00 — Khách tiềm năng',
    priority: 'Quan trọng',
    completed: false,
  },
  {
    id: 't-2',
    title: 'Gửi báo giá cho Anh Nam',
    time: '10:00 — Email',
    priority: 'Bình thường',
    completed: false,
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs-1',
    title: 'Kỹ thuật Cấy vi chất Meso Extra',
    category: 'Chuyên nghiệp',
    code: 'MESO-K25',
    instructor: 'BS. Hoàng Long',
    instructorTitle: 'Chuyên khoa Da liễu',
    instructorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
    totalLessons: 12,
    highlights: ['Thực hành 80% trên mẫu'],
    startDate: '15/05/2025',
    schedule: 'Thứ 3, 5, 7 từ 18:30 - 21:00',
    registeredCount: 14,
    maxStudents: 18,
    price: 18500000,
    originalPrice: 22000000,
    isHot: true,
    syllabus: [],
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'BOOKING',
    title: 'Lịch hẹn mới: Khách Đặng Thanh Hương',
    subtitle: 'Dịch vụ: Trẻ hóa da',
    timestamp: '10 phút trước',
    unread: true,
    actionText: 'Xem lịch',
  },
];

export const initialCustomers = INITIAL_CUSTOMERS;
export const initialBookings = INITIAL_BOOKINGS;
export const initialTasks = INITIAL_TASKS;
export const initialCourses = INITIAL_COURSES;
export const initialNotifications = INITIAL_NOTIFICATIONS;
