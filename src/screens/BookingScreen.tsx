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
    <div className="min-h-full bg-transparent pb-32 text-slate-900 relative">
      {/* Header with Circular Floating Back Button */}
      <MobileHeader
        title="Lịch hẹn"
        subtitle="Quản lý slot & Nghệ nhân CELLA"
        showBack={false}
        onMenuClick={() => onNavigate('more')}
        rightAction={
          <button
            onClick={() => onNavigate('create_booking')}
            className="w-10 h-10 rounded-full bg-white/95 shadow-sm border border-white/90 text-[#00A3FF] flex items-center justify-center transition-all duration-150 active:scale-90 hover:bg-white"
            title="Đặt lịch mới"
          >
            <CalendarPlus className="w-4.5 h-4.5 stroke-[2.2]" />
          </button>
        }
      />

      <div className="px-4 pt-2 space-y-3.5">
        {/* Month Navigator & Segmented View Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-full bg-white/90 border border-white shadow-2xs text-slate-700 flex items-center justify-center hover:bg-white active:scale-90 transition-all">
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <span className="text-sm font-bold text-slate-900 px-1">Tháng 4, 2025</span>
            <button className="w-8 h-8 rounded-full bg-white/90 border border-white shadow-2xs text-slate-700 flex items-center justify-center hover:bg-white active:scale-90 transition-all">
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Segmented Pill Selector */}
          <div className="flex items-center p-1 bg-white/80 rounded-full border border-white text-xs font-semibold">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-full transition-all ${
                viewMode === 'day'
                  ? 'bg-[#00A3FF] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Ngày
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-full transition-all ${
                viewMode === 'week'
                  ? 'bg-[#00A3FF] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tuần
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-full transition-all ${
                viewMode === 'list'
                  ? 'bg-[#00A3FF] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tất cả
            </button>
          </div>
        </div>

        {/* Week Days Strip with rounded-[20px] pill style */}
        <div className="grid grid-cols-7 gap-1.5 py-0.5">
          {daysOfWeek.map((d) => {
            const isSelected = selectedDay === d.dayNum;
            return (
              <button
                key={d.dayNum}
                onClick={() => setSelectedDay(d.dayNum)}
                className={`flex flex-col items-center justify-center py-2.5 rounded-[20px] transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#00A3FF] text-white shadow-sm scale-105 ring-2 ring-white'
                    : 'bg-white/80 text-slate-700 border border-white hover:bg-white'
                }`}
              >
                <span className={`text-[11px] font-semibold ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                  {d.dayName}
                </span>
                <span className="text-sm font-black mt-0.5">{d.dayNum}</span>
                {d.dayNum === 24 || d.dayNum === 25 ? (
                  <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-[#00A3FF]'}`} />
                ) : (
                  <span className="w-1.5 h-1.5 mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Schedule Timeline Header */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1 pt-1">
          <span>LỊCH HẸN NGÀY {selectedDay}/04/2025</span>
          <span className="text-[#00A3FF]">{bookings.length} cuộc hẹn</span>
        </div>

        {/* Booking Cards in Reference Style */}
        <div className="space-y-2.5">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => onSelectBooking(booking)}
              className="card-pastel-interactive p-4 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <div className="w-6 h-6 rounded-full bg-sky-50 text-[#00A3FF] flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span>{booking.appointmentTime}</span>
                </div>

                <AuraBadge
                  variant={
                    booking.status === 'CONFIRMED'
                      ? 'success'
                      : booking.status === 'IN_PROGRESS'
                      ? 'primary'
                      : 'warning'
                  }
                  size="xs"
                >
                  {booking.status === 'CONFIRMED'
                    ? 'Đã xác nhận'
                    : booking.status === 'IN_PROGRESS'
                    ? 'Đang phục vụ'
                    : 'Chờ duyệt'}
                </AuraBadge>
              </div>

              <h4 className="text-xs font-bold text-slate-900 truncate">
                {booking.serviceTitle}
              </h4>

              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-semibold">
                  <User className="w-3.5 h-3.5 text-slate-400 stroke-[2.2]" />
                  <span>{booking.customerName}</span>
                  {booking.customerVip && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.2 rounded-full border border-amber-200">
                      {booking.customerVip}
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-slate-400 font-medium">
                  Artist: <strong className="text-slate-700 font-bold">{booking.artistName.split(' ')[0]}</strong>
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
        className="fixed bottom-24 right-5 w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 to-[#00A3FF] text-white flex items-center justify-center shadow-[0_10px_25px_rgba(0,163,255,0.4)] hover:brightness-105 active:scale-90 transition-all z-20"
        title="Đặt lịch hẹn mới"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
};
