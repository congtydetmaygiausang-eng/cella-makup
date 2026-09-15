import React, { useState } from 'react';
import { ScreenId, Staff } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { MobileHeader } from '../components/common/MobileHeader';
import { GlassCard } from '../components/common/GlassCard';
import { AuraBadge } from '../components/common/AuraBadge';
import {
  User,
  Star,
  DollarSign,
  Briefcase,
  Clock,
  CreditCard,
  CheckSquare,
  TrendingUp,
  GraduationCap,
  Sparkles,
  Palette,
  Bell,
  Moon,
  LogOut,
  ChevronRight,
  Shield,
  UserCheck,
  RefreshCw,
  Phone,
  Mail,
  X,
  Download,
  Smartphone,
} from 'lucide-react';
import { PWAInstallModal } from '../components/common/PWAInstallModal';

interface ProfileScreenProps {
  currentUser?: Staff;
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
  onLogout?: () => void;
  onSwitchAccount?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  onNavigate,
  onBack,
  onLogout,
  onSwitchAccount,
}) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const user = currentUser || CURRENT_USER;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'MASTER':
        return { label: 'Master Trainer', bg: 'bg-indigo-100 text-[#4338CA] border border-indigo-300' };
      case 'ARTIST':
        return { label: 'Makeup Artist', bg: 'bg-rose-100 text-rose-800 border border-rose-300' };
      case 'ACADEMY_TRAINER':
        return { label: 'Academy Trainer', bg: 'bg-indigo-100 text-indigo-800 border border-indigo-300' };
      case 'SALES':
        return { label: 'Sales Lead', bg: 'bg-emerald-100 text-emerald-800 border border-emerald-300' };
      default:
        return { label: 'Nhân sự', bg: 'bg-slate-200 text-slate-800 border border-slate-300' };
    }
  };

  const roleInfo = getRoleBadge(user.role);

  return (
    <div className="min-h-full bg-[#F8F9FF] pb-28 text-slate-900">
      <MobileHeader
        title="Hồ sơ cá nhân"
        subtitle="Thông tin chuyên viên & Phân quyền"
        showBack={true}
        onBack={onBack || (() => onNavigate('home'))}
        rightAction={
          <button
            onClick={onSwitchAccount || (() => onNavigate('auth'))}
            className="p-2 px-3 rounded-xl bg-indigo-100 text-[#4338CA] text-xs font-black flex items-center gap-1.5 hover:bg-indigo-200 transition-colors border border-indigo-200 shadow-2xs"
            title="Đổi tài khoản"
          >
            <RefreshCw className="w-4 h-4 stroke-[2.5]" />
            <span>Đổi TK</span>
          </button>
        }
      />

      <div className="px-4 pt-2 space-y-4">
        {/* User Card */}
        <GlassCard className="p-4 bg-white border border-slate-200/90 shadow-xs space-y-3.5">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-18 h-18 rounded-2xl object-cover ring-2 ring-[#4338CA]/40 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-950">
                  {user.fullName}
                </h3>
                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${roleInfo.bg}`}>
                  {roleInfo.label}
                </span>
              </div>
              <p className="text-sm text-slate-600 font-semibold mt-0.5">
                {user.title || 'Chuyên viên CELLA'} • Mã: {user.employeeCode || user.id}
              </p>
              <p className="text-xs text-[#4338CA] font-bold mt-0.5">
                {user.branch || 'Cơ sở Quận 1 - Trụ sở chính CELLA'}
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 text-sm">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <Phone className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>{user.phone}</span>
            </div>
            {user.email && (
              <div className="flex items-center gap-2 text-slate-700 font-semibold truncate">
                <Mail className="w-4 h-4 text-sky-600 stroke-[2.5] shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
            )}
          </div>

          {/* 3 Performance metrics */}
          <div className="grid grid-cols-3 gap-2.5 pt-3.5 border-t border-slate-200 text-center">
            <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
              <span className="text-base font-black text-slate-950 block">18</span>
              <span className="text-xs text-slate-600 font-bold">Khách phục vụ</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center justify-center gap-1 text-base font-black text-amber-700">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500 stroke-[2]" />
                <span>4.9</span>
              </div>
              <span className="text-xs text-amber-800 font-bold">140+ Đánh giá</span>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200">
              <span className="text-base font-black text-[#4338CA] block">28.5M</span>
              <span className="text-xs text-indigo-800 font-bold">Hoa hồng tháng</span>
            </div>
          </div>
        </GlassCard>

        {/* TÀI KHOẢN & PHÂN QUYỀN with Saturated Bold Icons */}
        <GlassCard className="p-3.5 bg-white border border-slate-200/90 shadow-xs space-y-1">
          <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider px-2 py-1.5">
            Tài khoản & Phân quyền
          </h4>

          <div
            onClick={() => onNavigate('payroll')}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shadow-emerald-200">
                <CreditCard className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">Phiếu lương & Hoa hồng</span>
                <span className="text-xs text-slate-500 font-medium">Xem thu nhập tháng 03/2026</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 stroke-[2.5]" />
          </div>

          <div
            onClick={() => onNavigate('attendance')}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shadow-indigo-200">
                <Clock className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">Chấm công & Ca trực</span>
                <span className="text-xs text-slate-500 font-medium">Đã chấm vào ca: 08:00</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 stroke-[2.5]" />
          </div>

          <div
            onClick={() => onNavigate('revenue')}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs shadow-purple-200">
                <TrendingUp className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">Báo cáo Doanh thu</span>
                <span className="text-xs text-slate-500 font-medium">Biểu đồ & Hiệu suất KPI</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 stroke-[2.5]" />
          </div>
        </GlassCard>

        {/* CHUYÊN MÔN ATELIER with Saturated Bold Icons */}
        <GlassCard className="p-3.5 bg-white border border-slate-200/90 shadow-xs space-y-1">
          <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider px-2 py-1.5">
            Không gian chuyên môn
          </h4>

          <div
            onClick={() => onNavigate('academy')}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shadow-amber-200">
                <GraduationCap className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-sm font-bold text-slate-900">Học viện Đào tạo CELLA</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 stroke-[2.5]" />
          </div>

          <div
            onClick={() => onNavigate('lookbook')}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs shadow-rose-200">
                <Palette className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-sm font-bold text-slate-900">Lookbook Makeup Nghệ Thuật</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 stroke-[2.5]" />
          </div>

          <div
            onClick={() => onNavigate('ai_assistant')}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shadow-indigo-200">
                <Sparkles className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-sm font-bold text-slate-900">Trợ lý AI CELLA (Gemini)</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 stroke-[2.5]" />
          </div>
        </GlassCard>

        {/* CÀI ĐẶT & ĐĂNG XUẤT */}
        <GlassCard className="p-3.5 bg-white border border-slate-200/90 shadow-xs space-y-1">
          <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider px-2 py-1.5">
            Cài đặt & Tài khoản
          </h4>

          <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center">
                <Bell className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-sm font-bold text-slate-900">Thông báo & Nhắc hẹn</span>
            </div>
            <span className="text-xs text-[#4338CA] font-black bg-indigo-100 px-2.5 py-1 rounded-full border border-indigo-200">
              Đang bật
            </span>
          </div>

          {/* Cài đặt App ra Màn hình chính */}
          <button
            onClick={() => setShowInstallModal(true)}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-indigo-50/80 text-slate-900 cursor-pointer transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1E1B4B] to-[#4F46E5] text-white flex items-center justify-center shadow-xs">
                <Download className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-sm font-bold block flex items-center gap-2">
                  <span>Cài đặt ứng dụng về máy</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-[#4338CA]">
                    PWA
                  </span>
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Đưa biểu tượng ra màn hình chính, mở nhanh không cần trình duyệt
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 stroke-[2.5] group-hover:text-indigo-600 transition-colors" />
          </button>

          <button
            onClick={onSwitchAccount || (() => onNavigate('auth'))}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-indigo-50 text-indigo-800 cursor-pointer transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shadow-indigo-200">
                <UserCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-sm font-bold block">Đổi tài khoản khác</span>
                <span className="text-xs text-slate-500 font-medium">Đăng nhập tài khoản chuyên viên khác</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 stroke-[2.5]" />
          </button>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-rose-50 text-rose-700 cursor-pointer transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs shadow-rose-200">
                <LogOut className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-sm font-bold block">Đăng xuất tài khoản</span>
                <span className="text-xs text-rose-500 font-medium">Thoát phiên làm việc trên thiết bị này</span>
              </div>
            </div>
          </button>
        </GlassCard>
      </div>

      {/* Confirmation Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full space-y-4 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <LogOut className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-950">
                Đăng xuất tài khoản?
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Bạn có chắc muốn đăng xuất khỏi tài khoản <strong>{user.fullName}</strong>?
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-300 text-xs font-black text-slate-700 hover:bg-slate-100"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  if (onLogout) onLogout();
                  else onNavigate('auth');
                }}
                className="flex-1 py-3 rounded-xl bg-rose-600 text-white text-xs font-black hover:bg-rose-700 shadow-md shadow-rose-300"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PWA Install Modal */}
      <PWAInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
};
