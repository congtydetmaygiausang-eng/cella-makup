import React from 'react';
import { ScreenId, Staff } from '../types';
import { CURRENT_USER } from '../data/mockData';
import {
  X,
  Sparkles,
  Play,
  Bot,
  GraduationCap,
  MessageSquare,
  TrendingUp,
  CreditCard,
  User,
  LogOut,
  ChevronRight,
  ChevronUp,
} from 'lucide-react';

interface MoreMenuScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onBack: () => void;
  currentUser?: Staff;
  onLogout?: () => void;
}

export const MoreMenuScreen: React.FC<MoreMenuScreenProps> = ({
  onNavigate,
  onBack,
  currentUser,
  onLogout,
}) => {
  const user = currentUser || CURRENT_USER;

  const handleLogout = () => {
    if (onLogout) onLogout();
    else onNavigate('auth');
  };

  return (
    <div className="min-h-full bg-[#F8F9FA] pb-28 text-slate-900 animate-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="pt-10 pb-4 px-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white border border-blue-100 flex items-center justify-center text-[#00A3FF] font-black text-lg shadow-sm">
            C
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900 leading-none">CELLA Menu</h2>
              <span className="text-[10px] font-bold text-[#00A3FF] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                Hệ thống
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 mt-1">
              Khám phá dịch vụ & công cụ quản trị
            </p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      <div className="px-5 space-y-6">
        {/* User Card */}
        <button
          onClick={() => onNavigate('profile')}
          className="w-full bg-linear-to-r from-white to-pink-50/30 rounded-3xl p-3 flex items-center justify-between border border-slate-100 shadow-sm shadow-slate-200/50 hover:border-slate-300 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
            />
            <div className="text-left">
              <h3 className="text-[15px] font-black text-slate-900">{user.fullName}</h3>
              <p className="text-[11px] font-semibold text-[#00A3FF] mt-0.5 flex items-center gap-1">
                {user.role === 'MASTER' ? 'Master Trainer' : user.role === 'ARTIST' ? 'Makeup Artist' : 'Chuyên viên'}
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-medium">Quận 1, TP.HCM</span>
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>

        {/* Section: DỊCH VỤ & NGHỆ THUẬT */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1">
            Dịch vụ & Nghệ thuật
          </h4>
          <div className="space-y-1">
            <button
              onClick={() => onNavigate('lookbook')}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white active:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-slate-800">Lookbook Mẫu Makeup</span>
                    <span className="text-[9px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-full">Mới</span>
                  </div>
                  <span className="text-[12px] font-medium text-slate-400">Bộ sưu tập xu hướng & Aura</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('video_tutorial')}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white active:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                  <Play className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-slate-800">Video Masterclass Kỹ thuật</span>
                    <span className="text-[9px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-full">Video</span>
                  </div>
                  <span className="text-[12px] font-medium text-slate-400">Hướng dẫn video 4K chi tiết</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('ai_assistant')}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white active:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#00A3FF] text-white flex items-center justify-center shadow-md shadow-blue-200">
                  <Bot className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-slate-800">Trợ lý AI Gemini</span>
                    <span className="text-[9px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-full">AI Pro</span>
                  </div>
                  <span className="text-[12px] font-medium text-slate-400">Soi da, phân tích undertone & kịch bản</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Section: HỌC VIỆN & BẢNG TIN */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1">
            Học viện & Bảng tin
          </h4>
          <div className="space-y-1">
            <button
              onClick={() => onNavigate('academy')}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white active:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl border-2 border-teal-100 bg-teal-50 text-teal-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <span className="text-[14px] font-bold text-slate-800 block">Học viện CELLA Academy</span>
                  <span className="text-[12px] font-medium text-slate-400">Khóa học chuyên nghiệp & chứng chỉ</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('feed')}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white active:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl border-2 border-pink-100 bg-pink-50 text-pink-500 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <span className="text-[14px] font-bold text-slate-800 block">Bảng tin Studio Feed</span>
                  <span className="text-[12px] font-medium text-slate-400">Chia sẻ hoạt động & feedback khách</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Section: QUẢN TRỊ & BÁO CÁO */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1">
            Quản trị & Báo cáo
          </h4>
          <div className="space-y-1">
            <button
              onClick={() => onNavigate('revenue')}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white active:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl border-2 border-emerald-100 bg-emerald-50 text-emerald-500 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <span className="text-[14px] font-bold text-slate-800 block">Doanh thu & Báo cáo</span>
                  <span className="text-[12px] font-medium text-slate-400">Thống kê KPI & dòng tiền cơ sở</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('payroll')}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white active:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl border-2 border-amber-100 bg-amber-50 text-amber-500 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <span className="text-[14px] font-bold text-slate-800 block">Bảng lương & Hoa hồng</span>
                  <span className="text-[12px] font-medium text-slate-400">Chi tiết thu nhập & thưởng KPI</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Section: TÀI KHOẢN */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1">
            Tài khoản
          </h4>
          <div className="space-y-1">
            <button
              onClick={() => onNavigate('profile')}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white active:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-500 flex items-center justify-center">
                  <User className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <span className="text-[14px] font-bold text-slate-800 block">Hồ sơ chuyên viên</span>
                  <span className="text-[12px] font-medium text-slate-400">Thông tin cá nhân & cài đặt</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white active:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-500 flex items-center justify-center">
                  <LogOut className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <span className="text-[14px] font-bold text-slate-800 block">Đổi tài khoản / Đăng xuất</span>
                  <span className="text-[12px] font-medium text-slate-400">Quản lý phiên đăng nhập</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 pb-2 flex items-center justify-between text-slate-400">
          <span className="text-[12px] font-medium">CELLA Beauty & Academy v2.5</span>
          <button onClick={onBack} className="text-[12px] font-bold text-[#00A3FF] flex items-center gap-1">
            Thu gọn menu <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
