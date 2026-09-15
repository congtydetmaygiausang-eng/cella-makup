import React, { useState } from 'react';
import { Booking, Customer, ScreenId } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import { GlassCard } from '../components/common/GlassCard';
import { AuraBadge } from '../components/common/AuraBadge';
import { PrimaryButton } from '../components/common/PrimaryButton';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  QrCode,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  MoreVertical,
  User,
} from 'lucide-react';

interface BookingDetailScreenProps {
  booking: Booking;
  onBack: () => void;
  onNavigate: (screen: ScreenId) => void;
  onQuickCall: (customer: Partial<Customer>) => void;
  onQuickMessage: (customer: Partial<Customer>) => void;
  onUpdateStatus?: (status: Booking['status']) => void;
}

export const BookingDetailScreen: React.FC<BookingDetailScreenProps> = ({
  booking,
  onBack,
  onNavigate,
  onQuickCall,
  onQuickMessage,
  onUpdateStatus,
}) => {
  const [isCheckedIn, setIsCheckedIn] = useState(booking.status === 'IN_PROGRESS');

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    if (onUpdateStatus) onUpdateStatus('IN_PROGRESS');
  };

  return (
    <div className="min-h-full bg-[#F8F9FF] pb-28 text-slate-900">
      <MobileHeader
        showBack
        onBack={onBack}
        title="Chi tiết Booking"
        subtitle={booking.bookingCode}
        rightAction={
          <button className="p-2 rounded-full hover:bg-slate-100 text-slate-600">
            <MoreVertical className="w-5 h-5" />
          </button>
        }
      />

      <div className="px-4 pt-2 space-y-3.5">
        {/* Status Badges Header (Matching screenshot 13) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <AuraBadge variant="success" size="sm">
              {isCheckedIn ? 'Đang phục vụ tại tiệm' : 'Đã xác nhận'}
            </AuraBadge>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
            Sắp tới (2 ngày nữa)
          </span>
        </div>

        {/* Thời gian & Địa điểm (Matching screenshot 13) */}
        <GlassCard className="p-4 bg-white space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFF4FF] text-[#5850EC] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Thời gian lịch hẹn
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {booking.appointmentDate} • {booking.appointmentTime}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Địa điểm & Cơ sở
              </span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {booking.branchName}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {booking.locationAddress}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => onNavigate('create_booking')}
              className="py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Đổi lịch hẹn
            </button>
            <button
              onClick={() => alert('Đã gửi yêu cầu hủy lịch tới quản trị viên.')}
              className="py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
            >
              Hủy lịch
            </button>
          </div>
        </GlassCard>

        {/* Khách hàng card (Matching screenshot 13) */}
        <GlassCard className="p-4 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Khách hàng
            </h4>
            <button
              onClick={() => onNavigate('customer_detail')}
              className="text-xs font-bold text-[#5850EC] hover:underline flex items-center gap-0.5"
            >
              <span>Hồ sơ chi tiết</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#5850EC] text-white font-bold text-sm flex items-center justify-center">
                {booking.customerName
                  .split(' ')
                  .map((n) => n[0])
                  .slice(-2)
                  .join('')}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900">
                    {booking.customerName}
                  </h4>
                  {booking.customerVip && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                      {booking.customerVip}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{booking.customerPhone}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() =>
                  onQuickCall({
                    name: booking.customerName,
                    phone: booking.customerPhone,
                  })
                }
                className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center border border-emerald-100"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  onQuickMessage({
                    name: booking.customerName,
                    phone: booking.customerPhone,
                  })
                }
                className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100 flex items-center justify-center border border-sky-100"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Dịch vụ & Chi phí (Matching screenshot 13) */}
        <GlassCard className="p-4 bg-white space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Dịch vụ & Thanh toán
          </h4>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5850EC] bg-[#EFF4FF] px-2 py-0.5 rounded">
              {booking.serviceCategory || 'Tư vấn đào tạo'}
            </span>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {booking.serviceTitle}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Chuyên viên phụ trách: <strong>{booking.artistName}</strong>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Tổng giá trị dịch vụ:</span>
              <span className="font-bold text-slate-900">
                {booking.totalAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Đã đặt cọc giữ chỗ:</span>
              <span className="font-semibold text-emerald-600">
                - {booking.depositAmount.toLocaleString('vi-VN')} đ (Đã nhận)
              </span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-slate-100 text-sm font-extrabold text-slate-900">
              <span>Còn lại thanh toán tại quầy:</span>
              <span className="text-[#5850EC]">
                {(booking.totalAmount - booking.depositAmount).toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Fixed Bottom Check-in Bar (Matching screenshot 13) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30">
        <PrimaryButton
          size="lg"
          fullWidth
          variant={isCheckedIn ? 'secondary' : 'primary'}
          onClick={handleCheckIn}
          icon={isCheckedIn ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <QrCode className="w-5 h-5" />}
        >
          {isCheckedIn ? 'Đã Check-in đón tiếp khách' : 'Check-in đón tiếp khách'}
        </PrimaryButton>
      </div>
    </div>
  );
};
