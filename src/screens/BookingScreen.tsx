import React, { useState } from 'react';
import { Booking, ScreenId } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import { AuraBadge } from '../components/common/AuraBadge';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  CalendarPlus,
} from 'lucide-react';

interface BookingScreenProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
}

export const BookingScreen: React.FC<BookingScreenProps> = ({
  bookings,
  onSelectBooking,
  onNavigate,
  onBack,
}) => {
  const [selectedDay, setSelectedDay] = useState(24);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'list'>('day');

  const daysOfWeek = [
    { dayName: 'T2', dayNum: 21 },
    { dayName: 'T3', dayNum: 22 },
    { dayName: 'T4', dayNum: 23 },
    { dayName: 'T5', dayNum: 24 },
    { dayName: 'T6', dayNum: 25 },
    { dayName: 'T7', dayNum: 26 },
    { dayName: 'CN', dayNum: 27 },
  ];

  return (
    <div className="min-h-full bg-[#F0F2F5] pb-28 text-slate-900 animate-in fade-in duration-300">
      {/* ── HEADER ── */}
      <div className="bg-gradient-to-r from-[#544CDE] to-[#7C3AED] px-4 pt-12 pb-6 text-white rounded-b-3xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black">Lịch hẹn</h1>
            <p className="text-[13px] text-indigo-100 font-medium mt-1">Quản lý slot & Nghệ nhân CELLA</p>
          </div>
          <button
            onClick={() => onNavigate('create_booking')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all duration-150 active:scale-90 hover:bg-white/30"
            title="Đặt lịch mới"
          >
            <CalendarPlus className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-2 space-y-3.5">
        {/* Month Navigator & Segmented View Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 active:scale-90 transition-all">
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <span className="text-[14px] font-bold text-white px-1">Tháng 4, 2025</span>
            <button className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 active:scale-90 transition-all">
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Segmented Pill Selector */}
          <div className="flex items-center p-1 bg-white/20 rounded-full text-[11px] font-bold">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-full transition-all ${viewMode === 'day' ? 'bg-white text-[#544CDE] shadow-sm' : 'text-indigo-100'}`}
            >
              Ngày
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-full transition-all ${viewMode === 'week' ? 'bg-white text-[#544CDE] shadow-sm' : 'text-indigo-100'}`}
            >
              Tuần
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-white text-[#544CDE] shadow-sm' : 'text-indigo-100'}`}
            >
              Tất cả
            </button>
          </div>
        </div>

        {/* Week Days Strip */}
        <div className="grid grid-cols-7 gap-1.5 mt-4">
          {daysOfWeek.map((d) => {
            const isSelected = selectedDay === d.dayNum;
            return (
              <button
                key={d.dayNum}
                onClick={() => setSelectedDay(d.dayNum)}
                className={`flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all duration-150 ${isSelected ? 'bg-white text-[#544CDE] shadow-md scale-105' : 'bg-white/20 text-indigo-50 border border-transparent hover:bg-white/30'}`}
              >
                <span className={`text-[11px] font-bold ${isSelected ? 'text-[#544CDE]' : 'text-indigo-200'}`}>
                  {d.dayName}
                </span>
                <span className={`text-[15px] font-black mt-0.5 ${isSelected ? 'text-[#544CDE]' : 'text-white'}`}>{d.dayNum}</span>
                <span className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-[#544CDE]' : 'bg-transparent'}`} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 mt-6 space-y-4">
        {/* Schedule Timeline Header */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[13px] font-bold text-slate-800">LỊCH HẸN ({selectedDay}/04)</span>
          <span className="text-[12px] font-bold text-[#544CDE] bg-indigo-50 px-2 py-0.5 rounded-full">{bookings.length} cuộc hẹn</span>
        </div>

        {/* Booking Cards */}
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => onSelectBooking(booking)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Left Accent Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${booking.status === 'CONFIRMED' ? 'bg-emerald-500' : booking.status === 'IN_PROGRESS' ? 'bg-[#544CDE]' : 'bg-amber-400'}`} />

              <div className="flex items-center justify-between mb-3 pl-2">
                <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-800">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 text-[#544CDE] flex items-center justify-center">
                    <Clock className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>{booking.appointmentTime}</span>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : booking.status === 'IN_PROGRESS' ? 'bg-indigo-50 text-[#544CDE] border-indigo-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                  {booking.status === 'CONFIRMED' ? 'Đã xác nhận' : booking.status === 'IN_PROGRESS' ? 'Đang phục vụ' : 'Chờ duyệt'}
                </span>
              </div>

              <h4 className="text-[15px] font-black text-slate-900 truncate pl-2 mb-3">
                {booking.serviceTitle}
              </h4>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[12px] pl-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <User className="w-4 h-4 text-slate-400 stroke-[2.2]" />
                  <span>{booking.customerName}</span>
                  {booking.customerVip && (
                    <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-sm border border-amber-200 uppercase">
                      VIP
                    </span>
                  )}
                </div>

                <span className="text-slate-500 font-medium flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                  Artist: <strong className="text-slate-800 font-bold">{booking.artistName.split(' ')[0]}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button (+) */}
      <button
        id="btn-create-booking-fab"
        onClick={() => onNavigate('create_booking')}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-gradient-to-tr from-[#544CDE] to-[#7C3AED] text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 hover:brightness-110 active:scale-90 transition-all z-20"
        title="Đặt lịch hẹn mới"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>
    </div>
  );
};
