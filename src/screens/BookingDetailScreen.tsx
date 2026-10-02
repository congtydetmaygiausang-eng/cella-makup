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
  CreditCard,
  Copy,
  Check,
  X,
  FileText,
  DollarSign
} from 'lucide-react';

interface BookingDetailScreenProps {
  booking: Booking;
  onBack: () => void;
  onNavigate: (screen: ScreenId) => void;
  onQuickCall?: (customer: Partial<Customer>) => void;
  onQuickMessage?: (customer: Partial<Customer>) => void;
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
  const [currentStatus, setCurrentStatus] = useState<Booking['status']>(booking.status || 'CONFIRMED');
  const [showQRModal, setShowQRModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const remainingAmount = Math.max(0, (booking.totalAmount || 0) - (booking.depositAmount || 0));

  const handleUpdateStatus = (newStatus: Booking['status']) => {
    setCurrentStatus(newStatus);
    if (onUpdateStatus) {
      onUpdateStatus(newStatus);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-full bg-[#F4F7F4] pb-28 text-slate-900 animate-in fade-in duration-200">
      <MobileHeader
        showBack
        onBack={onBack}
        title="Chi tiết Lịch hẹn"
        subtitle={booking.bookingCode}
        rightAction={
          <button
            onClick={() => setShowReceiptModal(true)}
            className="p-2 rounded-full hover:bg-slate-100 text-[#264736]"
            title="Biên lai dịch vụ"
          >
            <FileText className="w-5 h-5" />
          </button>
        }
      />

      <div className="px-4 pt-2 space-y-3.5">
        {/* Status Badges Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                currentStatus === 'CONFIRMED'
                  ? 'bg-emerald-500 animate-pulse'
                  : currentStatus === 'IN_PROGRESS'
                  ? 'bg-[#264736] animate-ping'
                  : currentStatus === 'COMPLETED'
                  ? 'bg-slate-400'
                  : 'bg-amber-400'
              }`}
            />
            <AuraBadge
              variant={
                currentStatus === 'CONFIRMED'
                  ? 'success'
                  : currentStatus === 'IN_PROGRESS'
                  ? 'primary'
                  : 'neutral'
              }
              size="sm"
            >
              {currentStatus === 'CONFIRMED'
                ? 'Đã xác nhận lịch'
                : currentStatus === 'IN_PROGRESS'
                ? 'Đang phục vụ makeup'
                : currentStatus === 'COMPLETED'
                ? 'Đã hoàn tất dịch vụ'
                : 'Chờ duyệt'}
            </AuraBadge>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EAF2EC] text-[#264736] border border-[#264736]/20 font-mono">
            {booking.bookingCode}
          </span>
        </div>

        {/* Thời gian & Địa điểm */}
        <GlassCard className="p-4 bg-white space-y-3 rounded-2xl shadow-xs border border-slate-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF2EC] text-[#264736] flex items-center justify-center shrink-0">
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
                {booking.branchName || 'CELLA Studio Thái Bình'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {booking.locationAddress || '37–39 Phan Bội Châu, P. Lê Hồng Phong, TP. Thái Bình'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => onNavigate('create_booking')}
              className="py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Đổi giờ / Đặt lại
            </button>
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này không?')) {
                  handleUpdateStatus('CANCELLED');
                }
              }}
              className="py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
            >
              Hủy lịch hẹn
            </button>
          </div>
        </GlassCard>

        {/* Khách hàng card */}
        <GlassCard className="p-4 bg-white space-y-3 rounded-2xl shadow-xs border border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Khách hàng
            </h4>
            <button
              onClick={() => onNavigate('customers')}
              className="text-xs font-bold text-[#264736] hover:underline flex items-center gap-0.5"
            >
              <span>Xem CRM</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#264736] to-[#3D5A48] text-white font-black text-sm flex items-center justify-center shadow-sm">
                {booking.customerName
                  ? booking.customerName
                      .split(' ')
                      .map((n) => n[0])
                      .slice(-2)
                      .join('')
                  : 'KH'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-black text-slate-900">
                    {booking.customerName}
                  </h4>
                  {booking.customerVip && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                      {booking.customerVip}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{booking.customerPhone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${booking.customerPhone}`}
                className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center border border-emerald-100 transition-colors"
                title="Gọi điện"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`https://zalo.me/${booking.customerPhone}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center border border-blue-100 transition-colors"
                title="Nhắn Zalo"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {booking.notes && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
              <strong className="text-slate-800">Ghi chú:</strong> {booking.notes}
            </div>
          )}
        </GlassCard>

        {/* Dịch vụ & Chi phí */}
        <GlassCard className="p-4 bg-white space-y-3 rounded-2xl shadow-xs border border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Dịch vụ & Thanh toán
            </h4>
            <button
              onClick={() => setShowQRModal(true)}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 flex items-center gap-1 hover:bg-emerald-100"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Quét VietQR</span>
            </button>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#264736] bg-[#EAF2EC] px-2 py-0.5 rounded border border-[#264736]/20">
              Dịch vụ Makeup CELLA
            </span>
            <p className="text-sm font-black text-slate-900 mt-1">
              {booking.serviceTitle}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Nghệ nhân phụ trách: <strong className="text-slate-800">{booking.artistName}</strong>
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
              <span className="font-bold text-emerald-600">
                - {(booking.depositAmount || 0).toLocaleString('vi-VN')} đ (Đã nhận)
              </span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-slate-100 text-sm font-black text-slate-900">
              <span>Còn lại thanh toán tại tiệm:</span>
              <span className="text-[#264736] font-bold">
                {remainingAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Nút hành động nhanh trạng thái */}
        <div className="space-y-2 pt-1">
          {currentStatus === 'CONFIRMED' && (
            <button
              onClick={() => handleUpdateStatus('IN_PROGRESS')}
              className="w-full py-3 rounded-2xl bg-[#264736] text-white font-black text-xs shadow-md shadow-[#264736]/25 hover:bg-[#1E3A2F] transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Khách đã đến tiệm — Bắt đầu phục vụ (Check-in)</span>
            </button>
          )}

          {currentStatus === 'IN_PROGRESS' && (
            <button
              onClick={() => handleUpdateStatus('COMPLETED')}
              className="w-full py-3 rounded-2xl bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-900/20 hover:bg-emerald-800 transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Hoàn tất makeup & Thu nốt {remainingAmount.toLocaleString('vi-VN')} đ</span>
            </button>
          )}

          {currentStatus === 'COMPLETED' && (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Dịch vụ đã hoàn tất thành công</span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          MODAL QUÉT VIETQR THANH TOÁN SỐ TIỀN CÒN LẠI
      ======================================================== */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-3.5 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900">
                Quét VietQR Thanh Toán Lịch Hẹn
              </h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center space-y-0.5">
              <span className="text-[11px] text-slate-400">Số tiền cần thanh toán:</span>
              <div className="text-lg font-black text-emerald-600">
                {remainingAmount.toLocaleString('vi-VN')} đ
              </div>
            </div>

            {/* QR Image */}
            <div className="w-44 h-44 mx-auto bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
              <img
                src={`https://api.vietqr.io/image/970422-0984556712-compact.jpg?amount=${remainingAmount}&addInfo=${encodeURIComponent(
                  `CELLA ${booking.bookingCode}`
                )}&accountName=TRAN%20THI%20HUONG%20PHUONG`}
                alt="VietQR CELLA"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-1.5 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Ngân hàng:</span>
                <strong className="text-slate-900">MB Bank (Quân Đội)</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">STK:</span>
                <div className="flex items-center gap-1">
                  <strong className="font-mono text-[#264736]">0984556712</strong>
                  <button
                    onClick={() => handleCopy('0984556712', 'stk')}
                    className="p-1 rounded bg-white border border-slate-200"
                  >
                    {copiedField === 'stk' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chủ TK:</span>
                <strong className="text-slate-900">TRAN THI HUONG PHUONG</strong>
              </div>
            </div>

            <button
              onClick={() => {
                setShowQRModal(false);
                handleUpdateStatus('COMPLETED');
              }}
              className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow hover:bg-emerald-700"
            >
              ✓ Xác nhận đã thu nốt tiền tại quầy
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL BIÊN LAI DỊCH VỤ (E-RECEIPT)
      ======================================================== */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-3.5 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">
                Phiếu Thu Dịch Vụ CELLA
              </h3>
              <p className="text-xs text-slate-400 font-mono">{booking.bookingCode}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl text-xs space-y-2 text-left border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Khách hàng:</span>
                <strong className="text-slate-900">{booking.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Số điện thoại:</span>
                <strong className="text-slate-900">{booking.customerPhone}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dịch vụ:</span>
                <strong className="text-slate-900 text-right">{booking.serviceTitle}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nghệ nhân thực hiện:</span>
                <strong className="text-[#264736]">{booking.artistName}</strong>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold">
                <span>Tổng chi phí:</span>
                <strong className="text-slate-900">{booking.totalAmount.toLocaleString('vi-VN')} đ</strong>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Đã đặt cọc:</span>
                <span>- {(booking.depositAmount || 0).toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between text-[#264736] font-black border-t border-slate-200 pt-1 text-sm">
                <span>Thanh toán nốt:</span>
                <span>{remainingAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            <button
              onClick={() => setShowReceiptModal(false)}
              className="w-full py-2.5 bg-[#264736] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#1E3A2F]"
            >
              Đóng phiếu thu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
