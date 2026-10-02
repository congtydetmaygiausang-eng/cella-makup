import React, { useState, useMemo } from 'react';
import { Booking, ScreenId } from '../types';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  CalendarPlus,
  Phone,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';

interface BookingScreenProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
  onUpdateBookingStatus?: (id: string, status: Booking['status']) => void;
}

export const BookingScreen: React.FC<BookingScreenProps> = ({
  bookings,
  onSelectBooking,
  onNavigate,
  onBack,
  onUpdateBookingStatus,
}) => {
  const [selectedDay, setSelectedDay] = useState(24);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'list'>('day');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'PENDING'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const daysOfWeek = [
    { dayName: 'T2', dayNum: 21 },
    { dayName: 'T3', dayNum: 22 },
    { dayName: 'T4', dayNum: 23 },
    { dayName: 'T5', dayNum: 24 },
    { dayName: 'T6', dayNum: 25 },
    { dayName: 'T7', dayNum: 26 },
    { dayName: 'CN', dayNum: 27 },
  ];

  // Filter bookings based on selected day, view mode, status and search
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // 1. Search filter
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.includes(q) ||
        b.serviceTitle.toLowerCase().includes(q) ||
        b.bookingCode.toLowerCase().includes(q) ||
        (b.artistName && b.artistName.toLowerCase().includes(q));

      // 2. Status filter
      let matchStatus = true;
      if (statusFilter !== 'ALL') {
        matchStatus = b.status === statusFilter;
      }

      // 3. Date / View mode filter
      let matchDate = true;
      const dayStr = String(selectedDay).padStart(2, '0');
      const bDate = b.appointmentDate || '';

      if (viewMode === 'day') {
        // Match specific day, e.g. 2025-04-24 or contains 24
        matchDate = bDate.includes(`-${dayStr}`) || bDate.includes(`${dayStr}/04`) || bDate.endsWith(`-${selectedDay}`);
      } else if (viewMode === 'week') {
        // Match days 21 to 27
        matchDate = true;
      } else {
        // 'list' -> show all
        matchDate = true;
      }

      return matchSearch && matchStatus && matchDate;
    });
  }, [bookings, selectedDay, viewMode, statusFilter, searchTerm]);

  // Counts for UI summary
  const dayBookingsCount = bookings.filter((b) => {
    const dayStr = String(selectedDay).padStart(2, '0');
    const bDate = b.appointmentDate || '';
    return bDate.includes(`-${dayStr}`) || bDate.includes(`${dayStr}/04`) || bDate.endsWith(`-${selectedDay}`);
  }).length;

  return (
    <div className="min-h-full bg-[#F0F2F5] pb-28 text-slate-900 animate-in fade-in duration-300">
      {/* ── HEADER (Giữ trọn vẹn phong cách tím gradient nguyên bản) ── */}
      <div className="bg-gradient-to-r from-[#264736] via-[#1E3A2F] to-[#12241A] px-4 pt-12 pb-6 text-white rounded-b-3xl shadow-lg border-b border-emerald-900/30">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-1.5">
              <span>✦</span> Lịch hẹn Artist
            </div>
            <h1 className="text-2xl font-black tracking-tight">Quản lý Lịch hẹn</h1>
            <p className="text-[13px] text-emerald-100/80 font-medium">
              Theo dõi slot dịch vụ & Nghệ nhân CELLA
            </p>
          </div>
          <button
            onClick={() => onNavigate('create_booking')}
            className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center transition-all duration-150 active:scale-90 hover:bg-emerald-500 hover:text-white shadow-sm border border-white/20"
            title="Đặt lịch mới"
          >
            <CalendarPlus className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Month Navigator & Segmented View Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 active:scale-90 transition-all">
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <span className="text-[14px] font-bold text-white px-1">Tháng 4, 2025</span>
            <button className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 active:scale-90 transition-all">
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Segmented Pill Selector (Ngày / Tuần / Tất cả) */}
          <div className="flex items-center p-1 bg-black/25 border border-white/10 rounded-full text-[11px] font-bold backdrop-blur-xs">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                viewMode === 'day'
                  ? 'bg-emerald-400 text-[#12241A] font-extrabold shadow-sm'
                  : 'text-emerald-100/70 hover:text-white'
              }`}
            >
              Ngày
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                viewMode === 'week'
                  ? 'bg-emerald-400 text-[#12241A] font-extrabold shadow-sm'
                  : 'text-emerald-100/70 hover:text-white'
              }`}
            >
              Tuần
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                viewMode === 'list'
                  ? 'bg-emerald-400 text-[#12241A] font-extrabold shadow-sm'
                  : 'text-emerald-100/70 hover:text-white'
              }`}
            >
              Tất cả
            </button>
          </div>
        </div>

        {/* Week Days Strip (T2 21 - CN 27) */}
        <div className="grid grid-cols-7 gap-1.5 mt-4">
          {daysOfWeek.map((d) => {
            const isSelected = selectedDay === d.dayNum && viewMode === 'day';
            const hasDots = bookings.some((b) => (b.appointmentDate || '').includes(`-${d.dayNum}`));

            return (
              <button
                key={d.dayNum}
                onClick={() => {
                  setSelectedDay(d.dayNum);
                  setViewMode('day');
                }}
                className={`flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all duration-150 ${
                  isSelected
                    ? 'bg-emerald-400 text-[#12241A] shadow-lg shadow-emerald-950/40 scale-105 ring-2 ring-emerald-300'
                    : 'bg-white/10 text-emerald-100 border border-white/10 hover:bg-white/20 active:scale-95'
                }`}
              >
                <span
                  className={`text-[11px] font-bold ${
                    isSelected ? 'text-[#12241A]' : 'text-emerald-200/80'
                  }`}
                >
                  {d.dayName}
                </span>
                <span
                  className={`text-[15px] font-black mt-0.5 ${
                    isSelected ? 'text-[#12241A]' : 'text-white'
                  }`}
                >
                  {d.dayNum}
                </span>
                <span
                  className={`w-1 h-1 rounded-full mt-1 ${
                    isSelected
                      ? 'bg-[#12241A]'
                      : hasDots
                      ? 'bg-amber-300'
                      : 'bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 mt-4 space-y-3.5">
        {/* Search bar & quick filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm khách hàng, số điện thoại, dịch vụ, artist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#264736]/30 shadow-xs"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'CONFIRMED', label: 'Đã xác nhận' },
              { id: 'IN_PROGRESS', label: 'Đang phục vụ' },
              { id: 'COMPLETED', label: 'Hoàn tất' },
              { id: 'PENDING', label: 'Chờ duyệt' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                  statusFilter === tab.id
                    ? 'bg-[#264736] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Timeline Header */}
        <div className="flex items-center justify-between px-1 pt-1">
          <span className="text-[13px] font-black text-slate-800 tracking-wide uppercase">
            {viewMode === 'day'
              ? `Lịch hẹn (${selectedDay}/04)`
              : viewMode === 'week'
              ? 'Lịch hẹn tuần (21 - 27/04)'
              : 'Tất cả lịch hẹn CELLA'}
          </span>
          <span className="text-[12px] font-bold text-[#264736] bg-[#EAF2EC] px-2.5 py-0.5 rounded-full border border-[#264736]/20">
            {filteredBookings.length} cuộc hẹn
          </span>
        </div>

        {/* Booking Cards List */}
        <div className="space-y-3">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-2.5">
              <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Chưa có lịch hẹn nào</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Không tìm thấy lịch hẹn phù hợp. Bạn có thể bấm nút bên dưới để tạo lịch hẹn mới.
              </p>
              <button
                onClick={() => onNavigate('create_booking')}
                className="px-4 py-2 bg-[#264736] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#1E3A2F] transition-all"
              >
                + Đặt lịch hẹn mới
              </button>
            </div>
          ) : (
            filteredBookings.map((booking) => {
              const isConfirmed = booking.status === 'CONFIRMED';
              const isInProgress = booking.status === 'IN_PROGRESS';
              const isCompleted = booking.status === 'COMPLETED';

              return (
                <div
                  key={booking.id}
                  onClick={() => onSelectBooking(booking)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 cursor-pointer hover:shadow-md hover:border-[#264736]/40 transition-all relative overflow-hidden"
                >
                  {/* Left Accent Bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                      isConfirmed
                        ? 'bg-emerald-500'
                        : isInProgress
                        ? 'bg-[#264736]'
                        : isCompleted
                        ? 'bg-slate-400'
                        : 'bg-amber-400'
                    }`}
                  />

                  {/* Top Bar: Time slot & Status badge */}
                  <div className="flex items-center justify-between mb-2.5 pl-2">
                    <div className="flex items-center gap-1.5 text-[13px] font-black text-slate-800">
                      <div className="w-6 h-6 rounded-full bg-[#EAF2EC] text-[#264736] flex items-center justify-center font-bold">
                        <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span>{booking.appointmentTime}</span>
                      {viewMode !== 'day' && booking.appointmentDate && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          ({booking.appointmentDate})
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isConfirmed
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isInProgress
                          ? 'bg-[#EAF2EC] text-[#264736] border-[#264736]/25'
                          : isCompleted
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {isConfirmed
                        ? 'Đã xác nhận'
                        : isInProgress
                        ? 'Đang phục vụ'
                        : isCompleted
                        ? 'Hoàn tất'
                        : 'Chờ duyệt'}
                    </span>
                  </div>

                  {/* Service Title */}
                  <h4 className="text-[15px] font-black text-slate-900 truncate pl-2 mb-2 leading-snug">
                    {booking.serviceTitle}
                  </h4>

                  {/* Địa điểm nếu có */}
                  {booking.locationAddress && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 pl-2 mb-2.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{booking.locationAddress}</span>
                    </div>
                  )}

                  {/* Customer info & Artist info */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-[12px] pl-2">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                      <User className="w-4 h-4 text-slate-400 stroke-[2.2]" />
                      <span className="truncate max-w-[130px]">{booking.customerName}</span>
                      {booking.customerVip && (
                        <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-sm border border-amber-200 uppercase">
                          VIP
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg text-[11px]">
                        Artist: <strong className="text-slate-800 font-bold">{booking.artistName?.split(' ')[0] || 'CELLA'}</strong>
                      </span>

                      {/* Quick Call Button */}
                      <a
                        href={`tel:${booking.customerPhone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-7 h-7 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 flex items-center justify-center transition-colors"
                        title="Gọi điện"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Floating Action Button (+) */}
      <button
        id="btn-create-booking-fab"
        onClick={() => onNavigate('create_booking')}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-gradient-to-tr from-[#264736] to-[#3D5A48] text-white flex items-center justify-center shadow-lg shadow-[#264736]/40 hover:brightness-110 active:scale-90 transition-all z-20"
        title="Đặt lịch hẹn mới"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>
    </div>
  );
};
