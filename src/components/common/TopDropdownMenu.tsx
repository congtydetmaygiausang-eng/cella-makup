import React, { useEffect, useRef } from 'react';
import { ScreenId, Staff } from '../../types';
import { CURRENT_USER } from '../../data/mockData';
import {
  Sparkles,
  Play,
  Calendar,
  Users,
  CheckSquare,
  Bot,
  GraduationCap,
  MessageSquare,
  TrendingUp,
  CreditCard,
  User,
  X,
  ChevronRight,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Building2,
  Users2,
  UserCheck
} from 'lucide-react';

interface TopDropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenId) => void;
  currentUser?: Staff;
  currentScreen?: ScreenId;
}

export const TopDropdownMenu: React.FC<TopDropdownMenuProps> = ({
  isOpen,
  onClose,
  onNavigate,
  currentUser,
  currentScreen,
}) => {
  const user = currentUser || CURRENT_USER;
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleItemClick = (screen: ScreenId) => {
    onNavigate(screen);
    onClose();
  };

  const menuSections = [
    {
      group: 'Danh bạ & Quản lý',
      items: [
        {
          id: 'hr' as ScreenId,
          title: 'Danh sách nhân sự',
          desc: 'Quản lý nghệ sĩ, sales, admin',
          icon: Users2,
          iconBg: 'bg-indigo-50 text-[#544CDE] border border-indigo-200/80',
        },
        {
          id: 'customers' as ScreenId,
          title: 'Danh sách khách hàng',
          desc: 'Quản lý khách hàng dịch vụ',
          icon: UserCheck,
          iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80',
        },
        {
          id: 'instructors' as ScreenId,
          title: 'Danh sách giảng viên',
          desc: 'Quản lý giảng viên Academy',
          icon: GraduationCap,
          iconBg: 'bg-amber-50 text-amber-600 border border-amber-200/80',
        },
        {
          id: 'students' as ScreenId,
          title: 'Danh sách học viên',
          desc: 'Quản lý học viên các khóa',
          icon: Users,
          iconBg: 'bg-rose-50 text-rose-600 border border-rose-200/80',
        },
      ],
    },
    {
      group: 'Hệ thống & Cài đặt',
      items: [
        {
          id: 'roles' as ScreenId,
          title: 'Phân quyền & Vai trò',
          desc: 'Quản lý quyền và phân công nhiệm vụ',
          icon: ShieldCheck,
          iconBg: 'bg-slate-100 text-slate-700 border border-slate-200/80',
        },
        {
          id: 'profile' as ScreenId,
          title: 'Hồ sơ chuyên viên',
          desc: 'Thông tin cá nhân & cài đặt',
          icon: User,
          iconBg: 'bg-slate-100 text-slate-700 border border-slate-200/80',
        },
        {
          id: 'auth' as ScreenId,
          title: 'Đổi tài khoản / Đăng xuất',
          desc: 'Quản lý phiên đăng nhập',
          icon: LogOut,
          iconBg: 'bg-slate-100 text-slate-700 border border-slate-200/80',
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex flex-col justify-start select-none">
      {/* Dimmed Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Floating Dropdown Sheet sliding down from the top */}
      <div
        ref={menuRef}
        className="relative z-10 w-full max-w-md mx-auto bg-white/95 backdrop-blur-2xl border-b border-x border-white/90 rounded-b-[36px] shadow-[0_20px_50px_rgba(15,23,42,0.18)] max-h-[86vh] flex flex-col transform transition-transform duration-300 animate-in slide-in-from-top duration-300"
      >
        {/* Top Handle / Grab bar */}
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1.5 rounded-full bg-slate-200" />
        </div>

        {/* Dropdown Header Bar */}
        <div className="px-5 py-2.5 flex items-center justify-between border-b border-slate-100/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-[#544CDE] flex items-center justify-center font-black text-sm border border-indigo-100 shadow-sm">
              C
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900">CELLA Menu</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-[#544CDE] border border-indigo-200/80">
                  Hệ thống
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Menu nhanh
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all active:scale-90"
            title="Đóng menu"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* User Card inside dropdown */}
        <div className="px-5 pt-3 pb-2">
          <div
            onClick={() => handleItemClick('profile')}
            className="p-3 rounded-2xl bg-gradient-to-r from-sky-50/90 via-indigo-50/70 to-pink-50/60 border border-sky-100/80 flex items-center justify-between cursor-pointer hover:shadow-xs transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shrink-0 shadow-sm"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {user.fullName}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                  <span className="font-semibold text-[#544CDE]">
                    {user.role}
                  </span>
                  <span>•</span>
                  <span className="truncate">{user.branch || 'Trụ sở chính'}</span>
                </div>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
          </div>
        </div>

        {/* Scrollable Menu Items */}
        <div className="px-5 py-2 overflow-y-auto no-scrollbar space-y-4 flex-1 pb-10">
          {menuSections.map((section, idx) => (
            <div key={idx}>
              <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2.5 ml-1">
                {section.group}
              </h5>
              <div className="bg-slate-50/80 rounded-3xl border border-slate-100 p-1.5 flex flex-col gap-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  return (
                    <div
                      key={item.id + item.title}
                      onClick={() => handleItemClick(item.id)}
                      className={`group flex items-center justify-between p-2.5 pr-4 rounded-2xl cursor-pointer transition-all duration-200 active:scale-[0.98] ${
                        isActive
                          ? 'bg-white shadow-sm ring-1 ring-slate-200/60'
                          : 'hover:bg-white/60 hover:shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${item.iconBg}`}
                        >
                          <Icon className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-slate-800">
                              {item.title}
                            </span>
                            {/* @ts-ignore */}
                            {item.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-600">
                                {/* @ts-ignore */}
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-medium text-slate-400 line-clamp-1 mt-0.5 leading-tight">
                            {item.desc}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-400" />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom curve / decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent rounded-b-[36px] pointer-events-none" />
      </div>
    </div>
  );
};
