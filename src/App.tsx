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
import { AIAssistantScreen } from './screens/AIAssistantScreen';
import { AcademyScreen } from './screens/AcademyScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { MoreMenuScreen } from './screens/MoreMenuScreen';
import { AuthScreen } from './screens/AuthScreen';

// Common Components
import { BottomNavBar } from './components/common/BottomNavBar';
import { TopDropdownMenu } from './components/common/TopDropdownMenu';
import {
  X,
  PhoneOff,
  Mic,
  Volume2,
  Sparkles,
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
        <span className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-30" />
      )}

      {/* Main button */}
      <div
        className={`w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-xl cursor-pointer select-none transition-transform active:scale-95 ${
          isDragging ? 'scale-110' : ''
        }`}
        style={{
          background: 'linear-gradient(135deg, #544CDE 0%, #7C3AED 100%)',
          boxShadow: '0 8px 24px rgba(84,76,222,0.45)',
        }}
      >
        <Sparkles className="w-5 h-5 text-white mb-0.5" />
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
// ──────────────────────────────────────────────────────────────────────────────

export default function App() {
  // Splash screen state
  const [showSplash, setShowSplash] = useState(true);

  // App Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [screenHistory, setScreenHistory] = useState<ScreenId[]>(['home']);

  // App Data State
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [courses] = useState<Course[]>(initialCourses);

  // Selected Entities
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(initialCustomers[0]);
  const [selectedBooking, setSelectedBooking] = useState<Booking>(initialBookings[0]);

  // Current Logged-in Staff / User Account
  const [currentUser, setCurrentUser] = useState<Staff>(() => {
    try {
      const saved = localStorage.getItem('cella_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading saved user', e);
    }
    return CURRENT_USER;
  });

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
    if (screenHistory.length > 1) {
      handleBack();
    } else {
      navigateTo('home');
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('cella_current_user');
    } catch (e) {
      console.error('Error removing user', e);
    }
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
  };

  const handleUpdateBookingStatus = (status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === selectedBooking.id ? { ...b, status } : b))
    );
    setSelectedBooking((prev) => ({ ...prev, status }));
  };

  // Task handlers
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
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
        {showSplash ? (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        ) : (
          <div className="flex-1 overflow-y-auto relative no-scrollbar">
            {/* Screen Router */}
            {currentScreen === 'home' && (
              <HomeScreen
                currentUser={currentUser}
                customers={customers}
                bookings={bookings}
                tasks={tasks}
                onNavigate={navigateTo}
                onSelectCustomer={handleSelectCustomer}
                onSelectBooking={handleSelectBooking}
                onToggleTask={handleToggleTask}
                onToggleMenu={() => setIsMenuDropdownOpen((prev) => !prev)}
                isMenuOpen={isMenuDropdownOpen}
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
              <AcademyScreen courses={courses} onNavigate={navigateTo} onBack={handleBack} />
            )}

            {currentScreen === 'profile' && (
              <ProfileScreen
                currentUser={currentUser}
                onNavigate={navigateTo}
                onBack={handleBack}
                onLogout={handleLogout}
                onSwitchAccount={() => navigateTo('auth')}
              />
            )}

            {currentScreen === 'ai_assistant' && (
              <AIAssistantScreen
                onNavigate={navigateTo}
                onBack={handleBack}
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

        {/* Quick Message Template Modal */}
        {messageModalData && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-5 w-full max-w-sm space-y-3.5 shadow-2xl text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Gửi tin nhắn cho {messageModalData.name}
                  </h3>
                  <p className="text-xs text-slate-400">{messageModalData.phone}</p>
                </div>
                <button
                  onClick={() => setMessageModalData(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Mẫu tin nhắn nhanh CELLA Pro
                </label>
                {[
                  'Chào chị, CELLA xin xác nhận lịch hẹn tư vấn thẩm mỹ của chị vào 09:00 ngày mai tại cơ sở Q.1 ạ.',
                  'Dạ chị yêu ơi, sau liệu trình Meso Extra hôm nay, chị lưu ý không rửa mặt với nước nóng và thoa kem chống nắng kỹ nhé!',
                  'CELLA Academy kính gửi chị thông tin học bổng 30% khóa Master Trainer K25 khai giảng ngày 05/05 tới ạ.',
                ].map((tpl, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      alert(`Đã gửi tin nhắn thành công qua Zalo/SMS tới ${messageModalData.phone}!`);
                      setMessageModalData(null);
                    }}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#5850EC] hover:bg-[#EFF4FF] cursor-pointer text-xs text-slate-700 leading-snug transition-colors"
                  >
                    {tpl}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
