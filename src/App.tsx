import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ScreenId,
  NavTab,
  Customer,
  Booking,
  Task,
  Course,
  Staff,
} from './types';
import {
  initialCustomers,
  initialBookings,
  initialTasks,
  initialCourses,
  CURRENT_USER,
} from './data/mockData';
import { supabase } from './config/supabase';

// Screens
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CustomersScreen } from './screens/CustomersScreen';
import { CustomerDetailScreen } from './screens/CustomerDetailScreen';
import { CreateCustomerScreen } from './screens/CreateCustomerScreen';
import { BookingScreen } from './screens/BookingScreen';
import { CreateBookingScreen } from './screens/CreateBookingScreen';
import { BookingDetailScreen } from './screens/BookingDetailScreen';
import { TasksScreen } from './screens/TasksScreen';
import { RevenueScreen } from './screens/RevenueScreen';
import { HRScreen } from './screens/HRScreen';
import { RolesScreen } from './screens/RolesScreen';
import { AIAssistantScreen } from './screens/AIAssistantScreen';
import { AcademyScreen } from './screens/AcademyScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { MoreMenuScreen } from './screens/MoreMenuScreen';
import { AuthScreen } from './screens/AuthScreen';
import { MakeupLookbookScreen } from './screens/MakeupLookbookScreen';
import { InstructorsScreen } from './screens/InstructorsScreen';
import { StudentsScreen } from './screens/StudentsScreen';
import { AboutScreen } from './screens/AboutScreen';
import { UserManagementScreen } from './screens/UserManagementScreen';

// Common Components
import { BottomNavBar } from './components/common/BottomNavBar';
import { TopDropdownMenu } from './components/common/TopDropdownMenu';
import {
  X,
  PhoneOff,
  Mic,
  Volume2,
  Sparkles,
  ChevronLeft,
  Phone,
  Calendar,
  Plus,
  Send,
} from 'lucide-react';

// ─── Draggable CELLA AI Floating Button ───────────────────────────────────────
interface CellaAIButtonProps {
  onOpen: () => void;
  isAIOpen: boolean;
}

const CellaAIButton: React.FC<CellaAIButtonProps> = ({ onOpen, isAIOpen }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const BUTTON_SIZE = 56;

  // Init position: bottom-right corner with padding
  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    setPos({
      x: rect.width - BUTTON_SIZE - 16,
      y: rect.height - BUTTON_SIZE - 100,
    });
  }, []);

  // Stop pulse after 4s
  useEffect(() => {
    const t = setTimeout(() => setIsPulsing(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const clampPos = useCallback((x: number, y: number) => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return { x, y };
    const rect = parent.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(x, rect.width - BUTTON_SIZE)),
      y: Math.max(0, Math.min(y, rect.height - BUTTON_SIZE - 70)),
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setHasMoved(false);
    dragStart.current = { x: e.clientX, y: e.clientY, posX: pos.x, posY: pos.y };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) setHasMoved(true);
    setPos(clampPos(dragStart.current.posX + dx, dragStart.current.posY + dy));
  };

  const onPointerUp = () => {
    setIsDragging(false);
    if (!hasMoved) onOpen();
  };

  if (isAIOpen) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        zIndex: 40,
        touchAction: 'none',
        userSelect: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Pulse ring */}
      {isPulsing && (
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-35" />
      )}

      {/* Main button */}
      <div
        className={`w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-xl cursor-pointer select-none transition-transform active:scale-95 ${
          isDragging ? 'scale-110' : ''
        }`}
        style={{
          background: 'linear-gradient(135deg, #2D503E 0%, #1A3326 100%)',
          boxShadow: '0 8px 24px rgba(26,51,38,0.45)',
          border: '1.5px solid rgba(164,195,178,0.4)',
        }}
      >
        <Sparkles className="w-5 h-5 text-emerald-300 mb-0.5" />
        <span className="text-[9px] font-black text-white tracking-wide leading-none">CELLA AI</span>
      </div>

      {/* Label bubble on first load */}
      {isPulsing && (
        <div
          className="absolute right-[60px] top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg px-3 py-1.5 whitespace-nowrap pointer-events-none animate-fade-in"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
        >
          <p className="text-[11px] font-bold text-slate-800">Trợ lý AI CELLA</p>
          <p className="text-[10px] text-slate-400">Hỏi tôi bất cứ điều gì!</p>
          {/* Arrow */}
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 shadow-md" />
        </div>
      )}
    </div>
  );
};

// ─── Customer Chat Modal ─────────────────────────────────────────────────────
const CustomerChatModal = ({ customer, onClose }: { customer: any, onClose: () => void }) => {
  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      sender: 'me',
      text: 'Chào anh/chị, em thấy lịch booking của mình sắp đến hạn. Không biết mình có cần hỗ trợ gì thêm không ạ?',
      time: 'Vừa xong',
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, {
      id: Date.now(),
      sender: 'me',
      text: inputText.trim(),
      time: 'Vừa xong'
    }]);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#e5e7eb] flex flex-col animate-in slide-in-from-bottom-full duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#544CDE] to-[#7C3AED] px-4 py-3 flex items-center justify-between text-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center -ml-2">
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
          <div className="w-9 h-9 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm">
            {customer.name?.split(' ').map((n: string) => n[0]).slice(-2).join('') || 'KH'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-bold truncate">{customer.name}</h3>
            <p className="text-[11px] opacity-80">Đang hoạt động</p>
          </div>
        </div>
        <button className="w-8 h-8 flex items-center justify-center">
          <Phone className="w-5 h-5 fill-white" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Booking Context Card */}
        <div className="flex flex-col items-start">
          <div className="w-[85%] bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mt-2 mb-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Calendar className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="flex-1">
                <h4 className="text-[14px] font-black text-slate-900">Chi tiết Lịch Hẹn</h4>
              </div>
            </div>
            <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex justify-between text-[13px]">
                <span className="text-slate-500 font-medium">Khách hàng:</span>
                <span className="font-bold text-slate-800">{customer.name}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-slate-500 font-medium">SĐT:</span>
                <span className="font-bold text-slate-800">{customer.phone}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-slate-500 font-medium">Thời gian:</span>
                <span className="font-bold text-[#544CDE]">Sắp tới</span>
              </div>
            </div>
            <button className="w-full mt-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[13px] font-bold hover:bg-indigo-100 transition-colors">
              Xem chi tiết lịch
            </button>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 mx-1">Hệ thống tự động nhắc lịch</span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl shadow-sm ${msg.sender === 'me' ? 'bg-[#544CDE] text-white rounded-tr-sm' : 'bg-white text-slate-800 rounded-tl-sm'}`}>
              <p className="text-[14px]">{msg.text}</p>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 mx-1">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white px-3 py-3 border-t border-slate-200 flex items-center gap-2">
        <button className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors shrink-0">
          <Plus className="w-6 h-6" />
        </button>
        <div className="flex-1 relative">
          <input 
            type="text"
            placeholder="Tin nhắn..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
            className="w-full bg-slate-100 rounded-full pl-4 pr-10 py-2.5 text-[14px] focus:outline-none"
          />
          <button 
            onClick={handleSend}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#544CDE] hover:bg-[#544CDE]/10 rounded-full transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
// ──────────────────────────────────────────────────────────────────────────────

export default function App() {
  // Splash screen state
  const [showSplash, setShowSplash] = useState(true);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        fetchUserProfile(session.user.id);
      } else {
        const saved = localStorage.getItem('cella_current_user');
        if (saved) {
          setCurrentUser(JSON.parse(saved));
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
        setIsAuthLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        fetchUserProfile(session.user.id);
      } else {
        const saved = localStorage.getItem('cella_current_user');
        if (!saved) {
          setIsAuthenticated(false);
          setCurrentUser(null as any);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      setCurrentUser({
        id: userId,
        employeeCode: 'CELLA-USER',
        fullName: data.full_name || 'Người dùng',
        email: '',
        password: '',
        role: data.role || 'CUSTOMER',
        phone: data.phone || '',
        avatarUrl: data.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        department: '',
        branch: data.branch_studio || '',
        joinedDate: new Date(data.created_at).toLocaleDateString('vi-VN'),
      });
    }
    setIsAuthLoading(false);
  };

  // App Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [screenHistory, setScreenHistory] = useState<ScreenId[]>(['home']);

  // App Data State
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('cella_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('cella_bookings');
    return saved ? JSON.parse(saved) : initialBookings;
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('cella_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });
  const [courses] = useState<Course[]>(initialCourses);

  useEffect(() => {
    localStorage.setItem('cella_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('cella_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('cella_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Đồng bộ 2 chiều dữ liệu từ Supabase khi mở ứng dụng
  useEffect(() => {
    const fetchCloudData = async () => {
      try {
        // 1. Tải khách hàng từ Supabase
        const { data: custData, error: custError } = await supabase
          .from('customers')
          .select('*')
          .order('created_at', { ascending: false });

        if (!custError && custData && custData.length > 0) {
          const mappedCustomers: Customer[] = custData.map((c: any) => ({
            id: c.id,
            name: c.full_name || 'Khách hàng',
            phone: c.phone || '',
            email: c.email || '',
            source: c.source || 'TIKTOK',
            status: c.status || 'LEAD',
            crmStage: 'LEAD_NEW',
            vipTier: c.is_member_pass ? 'VIP Diamond' : 'Thành viên mới',
            lastContactText: 'Vừa đồng bộ',
            totalSpent: Number(c.total_spent) || 0,
            contactCount: 1,
            notesHistory: c.skin_notes ? [c.skin_notes] : [],
          }));
          setCustomers(mappedCustomers);
        }

        // 2. Tải lịch hẹn dịch vụ từ Supabase
        const { data: bkData, error: bkError } = await supabase
          .from('bookings')
          .select('*')
          .order('appointment_time', { ascending: true });

        if (!bkError && bkData && bkData.length > 0) {
          const mappedBookings: Booking[] = bkData.map((b: any) => ({
            id: b.id,
            bookingCode: b.booking_code || `#BK-${b.id.slice(0, 6)}`,
            customerId: b.customer_id || 'CUST-001',
            customerName: b.customer_name || 'Khách hàng',
            customerPhone: b.customer_phone || '',
            serviceTitle: b.service_title || 'Dịch vụ Makeup',
            artistId: b.artist_id || 'ARTIST-01',
            artistName: b.artist_name || 'Cella Artist',
            appointmentDate: b.appointment_time ? new Date(b.appointment_time).toISOString().split('T')[0] : '2026-10-01',
            appointmentTime: b.appointment_time ? new Date(b.appointment_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '09:00',
            locationAddress: b.destination_address || '37–39 Phan Bội Châu, TP. Thái Bình',
            status: b.status || 'CONFIRMED',
            totalAmount: Number(b.total_amount) || 350000,
            depositAmount: Number(b.deposit_amount) || 100000,
            notes: b.notes,
          }));
          setBookings(mappedBookings);
        }

        // 3. Tải danh sách công việc từ Supabase
        const { data: taskData, error: taskError } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (!taskError && taskData && taskData.length > 0) {
          const mappedTasks: Task[] = taskData.map((t: any) => ({
            id: t.id,
            title: t.title,
            priority: (t.priority || 'NORMAL') as Task['priority'],
            dueDate: t.due_date || (t.due_time ? new Date(t.due_time).toLocaleDateString('vi-VN') : 'Hôm nay'),
            assignedTo: t.assigned_name || 'Đội ngũ CELLA',
            completed: Boolean(t.is_completed),
          }));
          setTasks(mappedTasks);
        }
      } catch (err) {
        console.warn('Sync with Supabase skipped, using local cache:', err);
      }
    };

    fetchCloudData();
  }, []);

  // Selected Entities
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(initialCustomers[0]);
  const [selectedBooking, setSelectedBooking] = useState<Booking>(initialBookings[0]);

  // Current Logged-in Staff / User Account
  const [currentUser, setCurrentUser] = useState<Staff>(CURRENT_USER);

  // Modal States
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [callModalData, setCallModalData] = useState<Partial<Customer> | null>(null);
  const [messageModalData, setMessageModalData] = useState<Partial<Customer> | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  // Authentication Handlers
  const handleLoginSuccess = (user: Staff) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('cella_current_user', JSON.stringify(user));
    } catch (e) {
      console.error('Error saving user', e);
    }
    setIsAuthenticated(true);
    if (screenHistory.length > 1) {
      handleBack();
    } else {
      navigateTo('home');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentUser(null as any);
    localStorage.removeItem('cella_current_user');
    navigateTo('auth');
  };

  // Automatically dismiss splash after 1.8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Call duration counter simulation
  useEffect(() => {
    let interval: any;
    if (callModalData) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [callModalData]);

  // Screen Navigation Handlers
  const navigateTo = (screen: ScreenId) => {
    if (screen === 'more') {
      setIsMenuDropdownOpen((prev) => !prev);
      return;
    }

    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);

    // Sync tab when navigating to a primary tab screen
    if (screen === 'home') setCurrentTab('home');
    else if (screen === 'booking') setCurrentTab('booking');
    else if (screen === 'customers') setCurrentTab('customers');
    else if (screen === 'tasks') setCurrentTab('tasks');
    else if (screen === 'profile') setCurrentTab('profile');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: NavTab) => {
    setCurrentTab(tab);
    navigateTo(tab);
  };

  const handleBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop();
      const prevScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(prevScreen);

      if (['home', 'booking', 'customers', 'tasks', 'more', 'profile'].includes(prevScreen)) {
        setCurrentTab(prevScreen as NavTab);
      }
    } else {
      setScreenHistory(['home']);
      setCurrentScreen('home');
      setCurrentTab('home');
    }
  };

  // Customer handlers
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    navigateTo('customer_detail');
  };

  const handleCreateCustomer = (newCust: Partial<Customer>) => {
    const created: Customer = {
      id: `CUST-${Date.now().toString().slice(-4)}`,
      name: newCust.name || 'Khách hàng mới',
      phone: newCust.phone || '0901 000 000',
      email: newCust.email,
      source: newCust.source || 'TIKTOK',
      status: newCust.status || 'LEAD',
      crmStage: newCust.crmStage || 'LEAD_NEW',
      vipTier: newCust.vipTier || 'Thành viên mới',
      lastContactText: 'Vừa tạo',
      totalSpent: 0,
      contactCount: 1,
      notesHistory: newCust.notesHistory || [],
    };
    setCustomers((prev) => [created, ...prev]);
    setSelectedCustomer(created);
    navigateTo('customer_detail');

    // Lưu trực tiếp lên Supabase
    supabase.from('customers').insert([{
      full_name: created.name,
      phone: created.phone,
      email: created.email || null,
      source: created.source,
      status: 'NEW_LEAD',
    }]).then(({ error }) => {
      if (error) console.warn('Supabase customer insert notice:', error.message);
    });
  };

  // Booking handlers
  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    navigateTo('booking_detail');
  };

  const handleCreateBooking = (newBk: Partial<Booking>) => {
    const created: Booking = {
      id: `BK-${Date.now().toString().slice(-4)}`,
      bookingCode: newBk.bookingCode || `#BK-${Date.now().toString().slice(-8)}`,
      customerId: newBk.customerId || 'CUST-001',
      customerName: newBk.customerName || 'Khách hàng',
      customerPhone: newBk.customerPhone || '0901 234 567',
      serviceTitle: newBk.serviceTitle || 'Tư vấn dịch vụ',
      artistId: 'NV-8826',
      artistName: newBk.artistName || 'Lan Anh',
      appointmentDate: newBk.appointmentDate || '2025-04-25',
      appointmentTime: newBk.appointmentTime || '09:00 - 10:30',
      locationAddress: newBk.locationAddress || 'Tòa nhà CELLA',
      status: 'CONFIRMED',
      totalAmount: newBk.totalAmount || 18500000,
      depositAmount: newBk.depositAmount || 5000000,
      notes: newBk.notes,
    };
    setBookings((prev) => [created, ...prev]);
    setSelectedBooking(created);
    navigateTo('booking_detail');

    // Lưu trực tiếp lên Supabase
    const appointmentDateStr = created.appointmentDate || new Date().toISOString().split('T')[0];
    const appointmentTimeStr = (created.appointmentTime || '09:00').split(' ')[0] || '09:00';
    supabase.from('bookings').insert([{
      booking_code: created.bookingCode,
      customer_name: created.customerName,
      customer_phone: created.customerPhone,
      service_title: created.serviceTitle,
      artist_name: created.artistName,
      appointment_time: new Date(`${appointmentDateStr}T${appointmentTimeStr.length === 5 ? appointmentTimeStr + ':00' : '09:00:00'}`).toISOString(),
      destination_address: created.locationAddress,
      status: created.status,
      total_amount: created.totalAmount,
      deposit_amount: created.depositAmount,
      notes: created.notes || null,
    }]).then(({ error }) => {
      if (error) console.warn('Supabase booking insert notice:', error.message);
    });
  };

  const handleUpdateBookingStatus = (status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === selectedBooking.id ? { ...b, status } : b))
    );
    setSelectedBooking((prev) => ({ ...prev, status }));

    // Cập nhật trạng thái lên Supabase
    if (selectedBooking.id && !selectedBooking.id.startsWith('BK-')) {
      supabase.from('bookings').update({ status }).eq('id', selectedBooking.id).then(({ error }) => {
        if (error) console.warn('Supabase booking update notice:', error.message);
      });
    }
  };

  // Task handlers
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updatedCompleted = !t.completed;
          if (!id.startsWith('task-')) {
            supabase.from('tasks').update({ is_completed: updatedCompleted }).eq('id', id).then(({ error }) => {
              if (error) console.warn('Supabase task update notice:', error.message);
            });
          }
          return { ...t, completed: updatedCompleted };
        }
        return t;
      })
    );
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);

    // Lưu công việc mới lên Supabase
    supabase.from('tasks').insert([{
      title: newTask.title,
      priority: newTask.priority,
      due_date: newTask.dueDate,
      assigned_name: newTask.assignedTo,
      is_completed: false,
    }]).then(({ error }) => {
      if (error) console.warn('Supabase task insert notice:', error.message);
    });
  };

  // Format call duration MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Determine if bottom navigation bar should be visible
  const showBottomNav = ['home', 'tasks', 'customers', 'booking', 'profile'].includes(
    currentScreen
  );

  // Show floating AI button on all screens except AI screen itself, splash, auth
  const showAIFloat = !showSplash && !['ai_assistant', 'auth', 'splash'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-slate-950/90 flex justify-center items-center sm:p-4 selection:bg-[#00A3FF] selection:text-white">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md h-screen sm:h-[890px] bg-pastel-mesh sm:rounded-[44px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,30,60,0.25)] relative flex flex-col border sm:border-white/90 ring-1 sm:ring-slate-900/10">

        {/* Splash screen transition */}
        {showSplash || isAuthLoading ? (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        ) : !isAuthenticated ? (
          <div className="flex-1 overflow-y-auto relative no-scrollbar">
            <AuthScreen onLoginSuccess={handleLoginSuccess} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto relative no-scrollbar">
            {/* Screen Router */}
            {currentScreen === 'home' && (
              <HomeScreen
                currentUser={currentUser}
                onNavigate={navigateTo}
                onToggleMenu={() => setIsMenuDropdownOpen((prev) => !prev)}
                isMenuOpen={isMenuDropdownOpen}
                onQuickMessage={(c) => setMessageModalData(c)}
              />
            )}

            {currentScreen === 'customers' && (
              <CustomersScreen
                customers={customers}
                onSelectCustomer={handleSelectCustomer}
                onNavigate={navigateTo}
                onBack={handleBack}
                onQuickCall={(c) => setCallModalData(c)}
                onQuickMessage={(c) => setMessageModalData(c)}
              />
            )}

            {currentScreen === 'customer_detail' && (
              <CustomerDetailScreen
                customer={selectedCustomer}
                onBack={handleBack}
                onNavigate={navigateTo}
                onQuickCall={(c) => setCallModalData(c)}
                onQuickMessage={(c) => setMessageModalData(c)}
              />
            )}

            {currentScreen === 'create_customer' && (
              <CreateCustomerScreen
                onBack={handleBack}
                onSave={handleCreateCustomer}
              />
            )}

            {currentScreen === 'edit_customer' && (
              <CreateCustomerScreen
                initialData={selectedCustomer}
                onBack={handleBack}
                onSave={(updatedCust) => {
                  const merged = { ...selectedCustomer, ...updatedCust } as Customer;
                  setCustomers(prev => prev.map(c => c.id === merged.id ? merged : c));
                  setSelectedCustomer(merged);
                  navigateTo('customer_detail');
                }}
              />
            )}

            {currentScreen === 'booking' && (
              <BookingScreen
                bookings={bookings}
                onSelectBooking={handleSelectBooking}
                onNavigate={navigateTo}
                onBack={handleBack}
              />
            )}

            {currentScreen === 'create_booking' && (
              <CreateBookingScreen
                customers={customers}
                onBack={handleBack}
                onSaveBooking={handleCreateBooking}
                onNavigate={navigateTo}
              />
            )}

            {currentScreen === 'booking_detail' && (
              <BookingDetailScreen
                booking={selectedBooking}
                onBack={handleBack}
                onNavigate={navigateTo}
                onQuickCall={(c) => setCallModalData(c)}
                onQuickMessage={(c) => setMessageModalData(c)}
                onUpdateStatus={handleUpdateBookingStatus}
              />
            )}

            {currentScreen === 'tasks' && (
              <TasksScreen
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onNavigate={navigateTo}
                onBack={handleBack}
              />
            )}

            {currentScreen === 'revenue' && (
              <RevenueScreen onNavigate={navigateTo} onBack={handleBack} />
            )}

            {currentScreen === 'academy' && (
              <AcademyScreen courses={courses} onNavigate={navigateTo} onBack={handleBack} currentUser={currentUser} />
            )}

            {currentScreen === 'hr' && (
              <HRScreen currentUser={currentUser} onNavigate={navigateTo} onBack={handleBack} />
            )}

            {currentScreen === 'roles' && (
              <RolesScreen
                onNavigate={navigateTo}
                onBack={handleBack}
                currentUser={currentUser}
                onSwitchRole={(newRole) => {
                  setCurrentUser((prev) => ({
                    ...prev,
                    role: newRole as any,
                  }));
                }}
              />
            )}

            {currentScreen === 'makeup_lookbook' && (
              <MakeupLookbookScreen
                onNavigate={navigateTo}
                onBack={handleBack}
                currentUser={currentUser}
                onSaveBooking={handleCreateBooking}
              />
            )}

            {currentScreen === 'instructors' && (
              <InstructorsScreen
                onNavigate={navigateTo}
                onBack={handleBack}
                currentUser={currentUser}
              />
            )}

            {currentScreen === 'students' && (
              <StudentsScreen
                onNavigate={navigateTo}
                onBack={handleBack}
                currentUser={currentUser}
              />
            )}

            {currentScreen === 'profile' && (
              <ProfileScreen
                currentUser={currentUser}
                bookings={bookings}
                onNavigate={navigateTo}
                onBack={handleBack}
                onLogout={handleLogout}
                onSwitchAccount={() => navigateTo('auth')}
                onBookPost={(post) => {
                  handleCreateBooking({
                    serviceTitle: 'Makeup Demo theo bài viết',
                    appointmentDate: '24/04/2025',
                    appointmentTime: '14:00',
                    customerName: 'Khách hàng quan tâm',
                    artistName: currentUser.fullName,
                    status: 'PENDING'
                  });
                }}
              />
            )}

            {currentScreen === 'about' && (
              <AboutScreen
                onNavigate={navigateTo}
                onBack={handleBack}
                currentUser={currentUser}
              />
            )}

            {currentScreen === 'user_management' && (
              <UserManagementScreen
                onNavigate={navigateTo}
                onBack={handleBack}
                currentUser={currentUser}
              />
            )}

            {currentScreen === 'ai_assistant' && (
              <AIAssistantScreen
                onNavigate={navigateTo}
                onBack={handleBack}
                currentUser={currentUser}
                customerContext={
                  screenHistory[screenHistory.length - 2] === 'customer_detail'
                    ? {
                        name: selectedCustomer.name,
                        source: selectedCustomer.source,
                        crmStage: selectedCustomer.crmStage,
                        contactCount: selectedCustomer.contactCount,
                        lastContactText: selectedCustomer.lastContactText,
                        totalSpent: selectedCustomer.totalSpent,
                        notesHistory: selectedCustomer.notesHistory,
                      }
                    : undefined
                }
              />
            )}

            {currentScreen === 'more' && (
              <MoreMenuScreen
                currentUser={currentUser}
                onNavigate={navigateTo}
                onBack={handleBack}
                onLogout={handleLogout}
              />
            )}

            {currentScreen === 'auth' && (
              <AuthScreen
                onLoginSuccess={handleLoginSuccess}
                onContinueAsGuest={() => navigateTo('home')}
                onBack={handleBack}
              />
            )}

            {/* ── CELLA AI Floating Draggable Button ── */}
            {showAIFloat && (
              <CellaAIButton
                onOpen={() => navigateTo('ai_assistant')}
                isAIOpen={currentScreen === 'ai_assistant'}
              />
            )}
          </div>
        )}

        {/* Global Bottom Navigation Bar */}
        {showBottomNav && !showSplash && (
          <BottomNavBar
            currentTab={currentTab}
            onTabChange={handleTabChange}
            badgeCount={tasks.filter((t) => !t.completed).length}
          />
        )}

        {/* Top Dropdown Menu */}
        <TopDropdownMenu
          isOpen={isMenuDropdownOpen}
          onClose={() => setIsMenuDropdownOpen(false)}
          onNavigate={(screen) => {
            setIsMenuDropdownOpen(false);
            navigateTo(screen);
          }}
          currentUser={currentUser}
          currentScreen={currentScreen}
        />

        {/* Simulated Phone Call Overlay */}
        {callModalData && (
          <div className="fixed inset-0 z-50 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white flex flex-col justify-between p-8 animate-fade-in">
            <div className="flex flex-col items-center pt-10 text-center space-y-3">
              <div className="w-24 h-24 rounded-full bg-[#5850EC] border-4 border-white/20 flex items-center justify-center text-2xl font-bold shadow-2xl">
                {callModalData.name
                  ? callModalData.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(-2)
                      .join('')
                  : 'KH'}
              </div>
              <div>
                <h3 className="text-xl font-bold">{callModalData.name}</h3>
                <p className="text-sm text-indigo-200 mt-1">{callModalData.phone}</p>
                <p className="text-xs text-emerald-400 font-mono mt-2 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Đang kết nối qua tổng đài CELLA ({formatTime(callDuration)})
                </p>
              </div>
            </div>

            <div className="space-y-6 pb-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <button className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/10 hover:bg-white/20">
                  <Mic className="w-6 h-6 text-white" />
                  <span className="text-[11px] text-indigo-200">Tắt tiếng</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/10 hover:bg-white/20">
                  <Volume2 className="w-6 h-6 text-white" />
                  <span className="text-[11px] text-indigo-200">Loa ngoài</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/10 hover:bg-white/20">
                  <Sparkles className="w-6 h-6 text-amber-300" />
                  <span className="text-[11px] text-indigo-200">Ghi chú AI</span>
                </button>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setCallModalData(null)}
                  className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 flex items-center justify-center shadow-lg shadow-rose-600/50 active:scale-95 transition-all"
                >
                  <PhoneOff className="w-8 h-8 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Interface Modal */}
        {messageModalData && (
          <CustomerChatModal 
            customer={messageModalData} 
            onClose={() => setMessageModalData(null)} 
          />
        )}
      </div>
    </div>
  );
}
