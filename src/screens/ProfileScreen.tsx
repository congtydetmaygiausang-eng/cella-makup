import React from 'react';
import { ScreenId, Staff } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { MobileHeader } from '../components/common/MobileHeader';
import {
  LogOut,
  ChevronRight,
  Shield,
  Briefcase,
  CheckCircle2,
  Lock,
  User,
} from 'lucide-react';

interface ProfileScreenProps {
  currentUser?: Staff;
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
  onLogout?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  onNavigate,
  onBack,
  onLogout,
}) => {
  const user = currentUser || CURRENT_USER;

  return (
    <div className="min-h-full bg-[#F8F9FA] pb-28 text-slate-900 animate-in fade-in duration-300">
      <MobileHeader
        title="Thông tin cá nhân"
        showBack={true}
        onBack={onBack || (() => onNavigate('home'))}
        rightAction={
          <button className="text-[14px] font-black text-[#544CDE] px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors">
            Lưu
          </button>
        }
      />

      <div className="px-4 pt-4 space-y-4">
        {/* TOP PROFILE CARD */}
        <div className="bg-white rounded-[24px] pt-8 pb-5 px-5 shadow-sm border border-slate-100 text-center">
          <div className="relative inline-block mb-3">
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-20 h-20 rounded-full object-cover ring-[3px] ring-indigo-50"
            />
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#544CDE] text-white flex items-center justify-center border-2 border-white shadow-xs">
              <User className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 mb-2">
            <h2 className="text-[16px] font-black text-slate-900">{user.fullName}</h2>
            <CheckCircle2 className="w-4.5 h-4.5 text-[#544CDE] fill-[#544CDE]/10 stroke-[2.5]" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-6 text-[12px] font-semibold text-slate-500">
            <span className="px-2 py-1 rounded-md bg-indigo-50 text-[#544CDE]">Sales Specialist</span>
            <span>•</span>
            <span>Mã NV: <strong className="text-slate-700">{user.employeeCode || user.id}</strong></span>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 pt-5">
            <div className="flex flex-col items-center">
              <span className="text-[16px] font-black text-slate-900">128</span>
              <span className="text-[11px] font-medium text-slate-400 mt-1">Khách hàng</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <span className="text-[16px] font-black text-slate-900">4.9</span>
                <span className="text-amber-400 text-sm">★</span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 mt-1">Đánh giá</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[16px] font-black text-slate-900">15</span>
              <span className="text-[11px] font-medium text-slate-400 mt-1">Tháng gắn bó</span>
            </div>
          </div>
        </div>

        {/* THÔNG TIN CHUNG (Đã gộp & Rút gọn) */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-bold text-slate-900">Thông tin cơ bản</h3>
            <button className="text-[12px] font-bold text-[#544CDE] hover:underline">Sửa</button>
          </div>

          <div className="space-y-3 border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-slate-500">Số điện thoại</span>
              <span className="text-[13px] font-medium text-slate-800">{user.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-slate-500">Email</span>
              <span className="text-[13px] font-medium text-slate-800">{user.email || 'Chưa cập nhật'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-slate-500">Ngày sinh</span>
              <span className="text-[13px] font-medium text-slate-800">12/08/1996</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-slate-500">Chi nhánh</span>
              <span className="text-[13px] font-medium text-slate-800">{user.branch || 'Trụ sở chính'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-slate-500">Phòng ban</span>
              <span className="text-[13px] font-medium text-slate-800">Tư vấn & CSKH</span>
            </div>
          </div>
        </div>

        {/* SECURITY & SETTINGS */}
        <div className="bg-white rounded-[24px] p-2 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Lock className="w-5 h-5 text-amber-500 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-slate-900">Đổi mật khẩu</h4>
                <p className="text-[11px] text-slate-400">Cập nhật lần cuối 45 ngày trước</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>

          <div className="h-px bg-slate-100 mx-3"></div>

          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-500 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-slate-900">Xác thực 2 yếu tố (2FA)</h4>
                <p className="text-[11px] font-bold text-emerald-500">Đang kích hoạt</p>
              </div>
            </div>
            {/* Toggle switch mock */}
            <div className="w-11 h-6 bg-[#544CDE] rounded-full relative shadow-inner">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <div className="pt-2">
          <button
            onClick={() => {
              if (onLogout) onLogout();
              else onNavigate('auth');
            }}
            className="w-full h-14 bg-white border border-rose-200 text-rose-500 rounded-2xl flex items-center justify-center gap-2 font-bold text-[14px] hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất tài khoản
          </button>
        </div>
      </div>
    </div>
  );
};
