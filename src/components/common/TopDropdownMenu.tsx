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
      group: 'Dịch vụ & Nghệ thuật',
      items: [
        {
          id: 'ai_assistant' as ScreenId,
          title: 'Trợ lý AI Gemini',
          desc: 'Soi da, phân tích undertone & kịch bản',
          icon: Bot,
          iconBg: 'bg-gradient-to-tr from-sky-400 to-[#00A3FF] text-white shadow-xs',
          badge: 'AI Pro',
        },
      ],
    },
    {
      group: 'Học viện',
      items: [
        {
          id: 'academy' as ScreenId,
          title: 'Học viện CELLA Academy',
          desc: 'Khóa học chuyên nghiệp & chứng chỉ',
          icon: GraduationCap,
          iconBg: 'bg-teal-50 text-teal-600 border border-teal-200/80',
        },
      ],
    },
    {
      group: 'Quản trị & Báo cáo',
      items: [
        {
          id: 'revenue' as ScreenId,
          title: 'Doanh thu & Báo cáo',
          desc: 'Thống kê KPI & dòng tiền cơ sở',
          icon: TrendingUp,
          iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80',
        },
      ],
    },
    {
      group: 'Tài khoản',
      items: [
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
          <div className="w-10 h-1.2 rounded-full bg-slate-200" />
        </div>

        {/* Dropdown Header Bar */}
        <div className="px-5 py-2.5 flex items-center justify-between border-b border-slate-100/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-sky-50 text-[#00A3FF] flex items-center justify-center font-black text-sm border border-sky-100 shadow-2xs">
              C
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900">CELLA Menu</span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-sky-50 text-[#00A3FF] border border-sky-200/80">
                  Hệ thống
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Khám phá dịch vụ & công cụ quản trị
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
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shrink-0 shadow-2xs"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {user.fullName}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                  <span className="font-semibold text-[#00A3FF]">
                    {user.role === 'MASTER'
                      ? 'Master Trainer'
                      : user.role === 'ARTIST'
                      ? 'Artist'
                      : 'Sales Lead'}
                  </span>
                  <span>•</span>
                  <span>Quận 1, TP.HCM</span>
                </div>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
          </div>
        </div>

        {/* Scrollable Menu Items */}
        <div className="px-5 py-2 overflow-y-auto no-scrollbar space-y-4 flex-1">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
                {section.group}
              </h5>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isCurrent = currentScreen === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`p-2.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-sky-50/80 border border-sky-200/80 text-[#00A3FF]'
                          : 'hover:bg-slate-50/80 active:scale-[0.98] text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}
                        >
                          <Icon className="w-4.5 h-4.5 stroke-[2.2]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold truncate ${
                                isCurrent ? 'text-[#00A3FF]' : 'text-slate-800'
                              }`}
                            >
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isCurrent ? 'text-[#00A3FF] translate-x-0.5' : 'text-slate-300'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Dropdown Footer with Quick Close Button */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 px-5">
          <span className="text-[11px] font-medium">CELLA Beauty & Academy v2.5</span>
          <button
            onClick={onClose}
            className="text-[11px] font-bold text-[#00A3FF] hover:underline flex items-center gap-1"
          >
            <span>Thu gọn menu</span>
            <ChevronDown className="w-3.5 h-3.5 transform rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
