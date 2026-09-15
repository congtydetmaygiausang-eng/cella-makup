import React from 'react';
import { ScreenId, Staff } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import { GlassCard } from '../components/common/GlassCard';
import { CURRENT_USER } from '../data/mockData';
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
  ChevronRight,
  ChevronLeft,
  X,
  LogIn,
  RefreshCw,
} from 'lucide-react';

interface MoreMenuScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onBack: () => void;
  currentUser?: Staff;
}

export const MoreMenuScreen: React.FC<MoreMenuScreenProps> = ({
  onNavigate,
  onBack,
  currentUser,
}) => {
  const user = currentUser || CURRENT_USER;

  const menuSections = [
    {
      title: 'Nghệ thuật & Dịch vụ Studio',
      items: [
        {
          id: 'lookbook' as ScreenId,
          title: 'Lookbook Mẫu Makeup',
          desc: 'Bộ sưu tập mẫu trang điểm cao cấp & Aura Finishes',
          icon: Sparkles,
          iconBg: 'bg-rose-600 text-white shadow-xs shadow-rose-200',
          badge: 'Mới',
        },
        {
          id: 'video_tutorial' as ScreenId,
          title: 'Video Masterclass Kỹ thuật',
          desc: 'Phân đoạn video timeline và mẹo chuyên gia',
          icon: Play,
          iconBg: 'bg-indigo-600 text-white shadow-xs shadow-indigo-200',
          badge: '4K',
        },
        {
          id: 'booking' as ScreenId,
          title: 'Lịch hẹn & Booking',
          desc: 'Xếp lịch trang điểm tại studio & tận nơi',
          icon: Calendar,
          iconBg: 'bg-blue-600 text-white shadow-xs shadow-blue-200',
        },
      ],
    },
    {
      title: 'Khách hàng & Vận hành CRM',
      items: [
        {
          id: 'customers' as ScreenId,
          title: 'Quản lý Khách hàng & Leads',
          desc: 'Phễu tư vấn, hồ sơ undertone & lịch sử chi tiêu',
          icon: Users,
          iconBg: 'bg-emerald-600 text-white shadow-xs shadow-emerald-200',
        },
        {
          id: 'tasks' as ScreenId,
          title: 'Danh sách Công việc & Checklist',
          desc: 'Nhắc hẹn, gọi lại và nhiệm vụ hàng ngày',
          icon: CheckSquare,
          iconBg: 'bg-amber-500 text-white shadow-xs shadow-amber-200',
        },
        {
          id: 'ai_assistant' as ScreenId,
          title: 'Trợ lý AI Làm Đẹp & Soi Da',
          desc: 'Gợi ý kịch bản chốt đơn & tư vấn dáng mặt',
          icon: Bot,
          iconBg: 'bg-purple-600 text-white shadow-xs shadow-purple-200',
          badge: 'AI Pro',
        },
      ],
    },
    {
      title: 'Học viện & Bảng tin',
      items: [
        {
          id: 'academy' as ScreenId,
          title: 'Học viện Đào tạo Academy',
          desc: 'Khóa chuyên nghiệp, cá nhân & Masterclass',
          icon: GraduationCap,
          iconBg: 'bg-indigo-700 text-white shadow-xs shadow-indigo-200',
        },
        {
          id: 'feed' as ScreenId,
          title: 'Bảng tin Nội bộ & Feed',
          desc: 'Chia sẻ tác phẩm và khoảnh khắc studio',
          icon: MessageSquare,
          iconBg: 'bg-pink-600 text-white shadow-xs shadow-pink-200',
        },
      ],
    },
    {
      title: 'Tài chính & Quản trị',
      items: [
        {
          id: 'revenue' as ScreenId,
          title: 'Báo cáo Doanh thu & Tăng trưởng',
          desc: 'Thống kê nguồn thu dịch vụ, khóa học & sản phẩm',
          icon: TrendingUp,
          iconBg: 'bg-teal-600 text-white shadow-xs shadow-teal-200',
        },
        {
          id: 'payroll' as ScreenId,
          title: 'Bảng lương & Hoa hồng cá nhân',
          desc: 'Chi tiết thu nhập, thưởng KPI & khấu trừ',
          icon: CreditCard,
          iconBg: 'bg-amber-600 text-white shadow-xs shadow-amber-200',
        },
        {
          id: 'profile' as ScreenId,
          title: 'Hồ sơ Chuyên viên & Tài khoản',
          desc: 'Thông tin nhân sự, kỹ năng & phân quyền',
          icon: User,
          iconBg: 'bg-slate-800 text-white shadow-xs',
        },
        {
          id: 'auth' as ScreenId,
          title: 'Đăng nhập & Đổi tài khoản',
          desc: 'Quản lý phiên làm việc & phân quyền hệ thống',
          icon: LogIn,
          iconBg: 'bg-indigo-600 text-white shadow-xs shadow-indigo-200',
          badge: 'Tài khoản',
        },
      ],
    },
  ];

  return (
    <div className="min-h-full bg-linear-to-b from-[#F0F3FF]/70 via-[#F8F9FF] to-[#F8F9FF] pb-28 text-slate-900">
      {/* Header with clear Back Arrow */}
      <MobileHeader
        title="Menu Điều Hướng"
        subtitle="Hệ sinh thái tính năng & Quản lý CELLA"
        showBack={true}
        onBack={onBack}
        rightAction={
          <button
            onClick={onBack}
            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 transition-all flex items-center gap-1.5"
          >
            <span>Đóng</span>
          </button>
        }
      />

      <div className="px-4 pt-2 space-y-4">
        {/* Quick Artist Profile Banner */}
        <GlassCard className="p-4 bg-linear-to-r from-indigo-950 via-[#1F1B4E] to-slate-900 text-white flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-rose-400/60 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full ring-2 ring-slate-900 shadow-xs" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black">{user.fullName}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-200 font-bold border border-rose-500/40">
                  {user.role === 'MASTER' ? 'Master' : user.role === 'ARTIST' ? 'Artist' : user.role === 'ACADEMY_TRAINER' ? 'Academy' : 'Sales'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">
                {user.branch || 'CELLA Flagship Q.1, TP.HCM'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('auth')}
              className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all text-xs font-bold flex items-center gap-1"
              title="Đổi tài khoản"
            >
              <RefreshCw className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all text-xs font-bold flex items-center gap-1"
            >
              <span>Hồ sơ</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </GlassCard>

        {/* Quick Back to Home Button with prominent font and icon */}
        <button
          onClick={onBack}
          className="w-full py-3 px-4 rounded-2xl bg-white border border-slate-200/90 hover:bg-slate-50 transition-all flex items-center justify-between text-slate-800 shadow-xs active:scale-[0.99]"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-[#4338CA] flex items-center justify-center border border-indigo-200">
              <ChevronLeft className="w-5 h-5 stroke-[3]" />
            </div>
            <span className="text-sm font-black text-slate-900">Quay lại màn hình trước</span>
          </div>
          <span className="text-xs text-slate-500 font-semibold">Nhấn để quay lại</span>
        </button>

        {/* Menu Sections with Bold Saturated Colored Icons and Larger Text */}
        {menuSections.map((sec, secIdx) => (
          <div key={secIdx} className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 px-1">
              {sec.title}
            </h4>
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden">
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className="w-full p-3.5 flex items-center justify-between hover:bg-indigo-50/50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                        <Icon className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-slate-900 group-hover:text-[#4338CA] transition-colors">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-linear-to-r from-rose-600 to-indigo-600 text-white shadow-2xs">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 stroke-[2.5] group-hover:text-[#4338CA] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
