import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { AuraBadge } from '../components/common/AuraBadge';
import { MobileHeader } from '../components/common/MobileHeader';
import { PWAInstallButton } from '../components/common/PWAInstallButton';
import { Task, ScreenId, Staff } from '../types';
import { CURRENT_USER } from '../data/mockData';
import {
  UserPlus,
  CalendarPlus,
  CheckSquare,
  Sparkles,
  TrendingUp,
  Search,
  Bell,
  ArrowRight,
  GraduationCap,
  Calendar,
  Users,
  Check,
  ChevronRight,
  Menu,
  ChevronDown,
  Clock,
  Briefcase,
} from 'lucide-react';

interface HomeScreenProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onNavigate: (screen: ScreenId) => void;
  unreadNotificationsCount?: number;
  currentUser?: Staff;
  onToggleMenu?: () => void;
  isMenuOpen?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  tasks,
  onToggleTask,
  onNavigate,
  unreadNotificationsCount = 3,
  currentUser,
  onToggleMenu,
  isMenuOpen = false,
}) => {
  const user = currentUser || CURRENT_USER;
  const roleLabel =
    user.role === 'MASTER'
      ? 'Master Trainer'
      : user.role === 'ARTIST'
      ? 'Makeup Artist'
      : user.role === 'ACADEMY_TRAINER'
      ? 'Academy Trainer'
      : 'Sales Lead';

  return (
    <div className="min-h-full bg-transparent pb-28 text-slate-900">
      {/* Top Header with Floating Circular Buttons */}
      <MobileHeader
        title="Dashboard"
        subtitle="Hệ thống vận hành CELLA CRM"
        showBack={false}
        onMenuClick={onToggleMenu || (() => onNavigate('more'))}
        isMenuOpen={isMenuOpen}
        rightAction={
          <div className="flex items-center gap-2">
            <PWAInstallButton variant="compact" />
            <button
              onClick={() => onNavigate('customers')}
              className="w-10 h-10 rounded-full bg-white/95 shadow-sm border border-white/90 text-slate-700 flex items-center justify-center transition-all duration-150 active:scale-90 hover:bg-white"
              title="Tìm kiếm khách hàng"
            >
              <Search className="w-4.5 h-4.5 stroke-[2.2]" />
            </button>
          </div>
        }
      />

      <div className="px-4 pt-3 space-y-4">
        {/* Welcome Greeting Section matching reference layout */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Xin chào, {user.fullName.split(' ').slice(-1)[0]}!
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Cập nhật hoạt động studio & học viện hôm nay
            </p>
          </div>

          <div
            onClick={() => onNavigate('profile')}
            className="relative cursor-pointer group"
          >
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
          </div>
        </div>

        {/* PWA Install Banner */}
        <PWAInstallButton variant="banner" />

        {/* HERO KPI CARD: Inspired by "Time Saved This Week" with soft cyan curve wave */}
        <div
          onClick={() => onNavigate('revenue')}
          className="card-pastel p-5 relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_16px_36px_-6px_rgba(0,163,255,0.12)] group"
        >
          {/* Subtle glowing radial background inside the card */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br from-sky-200/40 via-cyan-100/30 to-transparent blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-semibold text-slate-500">
              Doanh thu tuần này
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/80">
              <span>+56.4%</span>
              <span className="text-slate-400 font-normal">30 ngày</span>
              <ChevronDown className="w-3 h-3 text-emerald-600" />
            </span>
          </div>

          <div className="mt-2 relative z-10 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
              48.5M
            </span>
            <span className="text-sm font-semibold text-slate-400">VNĐ</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1 relative z-10">
            <span className="text-[#00A3FF]">↑ +28%</span>
            <span className="text-slate-400 font-normal">so với tuần trước</span>
          </div>

          {/* Cyan wave chart visualization matching reference */}
          <div className="mt-3 -mx-2 h-16 relative">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 320 60"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="cyanWaveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00A3FF" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#00A3FF" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Fill area */}
              <path
                d="M0,45 C50,42 90,30 140,32 C190,34 230,12 320,8 L320,60 L0,60 Z"
                fill="url(#cyanWaveGrad)"
              />
              {/* Stroke line */}
              <path
                d="M0,45 C50,42 90,30 140,32 C190,34 230,12 320,8"
                fill="none"
                stroke="#00A3FF"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Active data point dot */}
              <circle cx="230" cy="18" r="4" fill="#00A3FF" />
              <circle cx="230" cy="18" r="7" fill="#00A3FF" opacity="0.25" />
            </svg>

            {/* Little tooltip badge on point */}
            <div className="absolute right-14 -top-1 bg-white/95 px-2 py-0.5 rounded-full border border-sky-200 text-[10px] font-bold text-slate-800 shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A3FF]" />
              <span>28 Booking</span>
            </div>
          </div>
        </div>

        {/* 2 SIDE-BY-SIDE METRIC CARDS matching reference "Workflows" & "Tasks Automated" */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Lịch hẹn Booking */}
          <div
            onClick={() => onNavigate('booking')}
            className="card-pastel p-4 relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md group"
          >
            {/* Subtle blue aura blur spot in corner */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-sky-200/50 blur-xl pointer-events-none" />

            <span className="text-xs font-semibold text-slate-500 block">
              Lịch Booking
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                28
              </span>
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <span>↑ +4%</span>
              <span className="text-slate-400 font-normal">tuần này</span>
            </p>
          </div>

          {/* Card 2: Khách hàng CRM */}
          <div
            onClick={() => onNavigate('customers')}
            className="card-pastel p-4 relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md group"
          >
            {/* Subtle cyan-mint aura blur spot in corner */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-teal-200/50 blur-xl pointer-events-none" />

            <span className="text-xs font-semibold text-slate-500 block">
              Khách hàng CRM
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                1,243
              </span>
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <span>↑ +32%</span>
              <span className="text-slate-400 font-normal">tuần này</span>
            </p>
          </div>
        </div>

        {/* QUICK ACTION ROW: Pill buttons as in reference */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => onNavigate('create_customer')}
            className="px-4 py-2.5 rounded-full bg-white/90 border border-white/90 shadow-xs hover:bg-white text-xs font-bold text-slate-800 flex items-center gap-2 shrink-0 active:scale-95 transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-sky-100 text-[#00A3FF] flex items-center justify-center">
              <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span>Thêm khách mới</span>
          </button>

          <button
            onClick={() => onNavigate('create_booking')}
            className="px-4 py-2.5 rounded-full bg-white/90 border border-white/90 shadow-xs hover:bg-white text-xs font-bold text-slate-800 flex items-center gap-2 shrink-0 active:scale-95 transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-[#5850EC] flex items-center justify-center">
              <CalendarPlus className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span>Đặt lịch hẹn</span>
          </button>

          <button
            onClick={() => onNavigate('ai_assistant')}
            className="px-4 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-[#00A3FF] text-white shadow-sm text-xs font-bold flex items-center gap-2 shrink-0 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Trợ lý AI</span>
          </button>
        </div>

        {/* LIST SECTION: Recent Workflows / Tasks Style directly matched from Reference */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">
              Nhiệm vụ & Quy trình gần đây
            </h3>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs font-bold text-[#00A3FF] hover:underline"
            >
              Xem tất cả
            </button>
          </div>

          <div className="space-y-2">
            {tasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className="card-pastel-interactive p-3.5 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Left rounded-2xl icon container with soft pastel tint */}
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      task.completed
                        ? 'bg-emerald-50 text-emerald-600'
                        : task.priority === 'HIGH'
                        ? 'bg-rose-50 text-rose-500'
                        : 'bg-sky-50 text-[#00A3FF]'
                    }`}
                  >
                    {task.completed ? (
                      <Check className="w-5 h-5 stroke-[2.8]" />
                    ) : (
                      <CheckSquare className="w-5 h-5 stroke-[2.2]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-bold truncate ${
                        task.completed
                          ? 'text-slate-400 line-through'
                          : 'text-slate-800'
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {task.customerName || 'Khách hàng VIP'} • {task.dueTime}
                    </p>
                  </div>
                </div>

                {/* Right status badge pill as seen in reference ("Running", "Paused") */}
                <div className="shrink-0 ml-2">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      task.completed
                        ? 'bg-slate-100 text-slate-500'
                        : task.priority === 'HIGH'
                        ? 'bg-rose-50 text-rose-600 border border-rose-200/60'
                        : 'bg-sky-50 text-[#00A3FF] border border-sky-200/60'
                    }`}
                  >
                    {task.completed
                      ? 'Đã xong'
                      : task.priority === 'HIGH'
                      ? 'Khẩn cấp'
                      : 'Đang làm'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning & Academy Banner matching rounded card dimensions */}
        <div
          onClick={() => onNavigate('academy')}
          className="card-pastel p-4 relative overflow-hidden cursor-pointer group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <GraduationCap className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00A3FF]">
                Học viện Đào tạo CELLA
              </span>
              <h4 className="text-sm font-bold text-slate-900 truncate">
                Khóa Masterclass Nghệ thuật Trang điểm K25
              </h4>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                Khai giảng 25/04/2026 • Giảng viên chuyên gia
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#00A3FF] group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};
