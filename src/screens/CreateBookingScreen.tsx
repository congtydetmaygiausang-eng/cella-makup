import React, { useState } from 'react';
import { Customer, Booking, ScreenId } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import { GlassCard } from '../components/common/GlassCard';
import { PrimaryButton } from '../components/common/PrimaryButton';
import {
  Calendar as CalendarIcon,
  User,
  Clock,
  MapPin,
  Check,
  Star,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface CreateBookingScreenProps {
  customers: Customer[];
  onBack: () => void;
  onSaveBooking: (newBooking: Partial<Booking>) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const CreateBookingScreen: React.FC<CreateBookingScreenProps> = ({
  customers,
  onBack,
  onSaveBooking,
  onNavigate,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || 'CUST-001');
  const [selectedService, setSelectedService] = useState('Tư vấn khóa học thẩm mỹ & Lộ trình Master Trainer');
  const [selectedBranch, setSelectedBranch] = useState('Cơ sở Quận 1 (Trụ sở chính CELLA)');
  const [selectedDay, setSelectedDay] = useState(25);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('09:00 – 10:30 (Sáng)');
  const [meetingType, setMeetingType] = useState<'STUDIO' | 'ONLINE'>('STUDIO');
  const [notes, setNotes] = useState('Khách cần tư vấn kỹ về lộ trình học nghề và ưu đãi học phí.');
  const [smsReminder, setSmsReminder] = useState(true);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const services = [
    'Tư vấn khóa học thẩm mỹ & Lộ trình Master Trainer',
    'Chăm sóc da chuyên sâu Glass Skin Pro',
    'Phun thêu Điêu khắc Chân mày 9D',
    'Trang điểm cô dâu Glass Skin Bridal',
  ];

  const timeSlots = [
    '09:00 – 10:30 (Sáng)',
    '10:30 – 12:00',
    '14:00 – 15:30 (Chiều)',
    '16:00 – 17:30',
  ];

  const days = [
    { name: 'T2', num: 21 },
    { name: 'T3', num: 22 },
    { name: 'T4', num: 23 },
    { name: 'T5', num: 24 },
    { name: 'T6', num: 25 },
    { name: 'T7', num: 26 },
    { name: 'CN', num: 27 },
  ];

  const handleConfirm = () => {
    const newBk: Partial<Booking> = {
      bookingCode: `#BK-${Date.now().toString().slice(-8)}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      customerVip: selectedCustomer.vipTier,
      serviceTitle: selectedService,
      artistId: 'NV-8826',
      artistName: 'Lan Anh (Master Trainer)',
      appointmentDate: `2025-04-${selectedDay}`,
      appointmentTime: selectedTimeSlot,
      branchName: selectedBranch,
      locationAddress:
        selectedBranch.includes('Quận 1')
          ? 'Tòa nhà CELLA, 128 Nguyễn Trãi, Q.1'
          : 'Chi nhánh CELLA Nam Sài Gòn, Nguyễn Thị Thập, Q.7',
      locationType: 'STUDIO',
      status: 'CONFIRMED',
      totalAmount: 18500000,
      depositAmount: 5000000,
      notes,
      smsReminder,
    };

    onSaveBooking(newBk);
  };

  return (
    <div className="min-h-full bg-[#F8F9FF] pb-24 text-slate-900">
      <MobileHeader
        showBack
        onBack={onBack}
        title="Đặt lịch hẹn mới"
        subtitle="Hệ thống Booking CELLA"
        rightAction={
          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1"
          >
            Hủy
          </button>
        }
      />

      <div className="px-4 pt-2 space-y-3.5">
        {/* KHÁCH HÀNG (Matching screenshot 12) */}
        <GlassCard className="p-3.5 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Khách hàng
            </h4>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="text-xs font-bold text-[#5850EC] bg-[#EFF4FF] px-2 py-1 rounded-lg border border-[#5850EC]/20 focus:outline-none"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F9FF] border border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#5850EC] text-white font-bold text-xs flex items-center justify-center">
                {selectedCustomer.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(-2)
                  .join('')}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900">
                    {selectedCustomer.name}
                  </span>
                  {selectedCustomer.vipTier && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                      {selectedCustomer.vipTier}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{selectedCustomer.phone}</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('create_customer')}
              className="text-xs font-semibold text-[#5850EC] hover:underline"
            >
              + Thêm mới
            </button>
          </div>
        </GlassCard>

        {/* DỊCH VỤ & CHUYÊN GIA (Matching screenshot 12) */}
        <GlassCard className="p-3.5 bg-white space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Dịch vụ & Chuyên gia
          </h4>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Loại dịch vụ / Khóa học
            </label>
            <div className="space-y-1.5">
              {services.map((svc) => {
                const isSelected = selectedService === svc;
                return (
                  <button
                    type="button"
                    key={svc}
                    onClick={() => setSelectedService(svc)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#EFF4FF] text-[#5850EC] border-2 border-[#5850EC]'
                        : 'bg-[#F8F9FF] text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{svc}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#5850EC] shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cơ sở thực hiện
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#F8F9FF] border border-slate-200 text-xs font-semibold text-slate-800"
            >
              <option value="Cơ sở Quận 1 (Trụ sở chính CELLA)">
                Cơ sở Quận 1 (Trụ sở chính CELLA - 128 Nguyễn Trãi)
              </option>
              <option value="Cơ sở Quận 7 (Chi nhánh Nam Sài Gòn)">
                Cơ sở Quận 7 (Chi nhánh Nam Sài Gòn - Nguyễn Thị Thập)
              </option>
            </select>
          </div>

          {/* Chuyên gia phụ trách */}
          <div className="p-2.5 rounded-xl bg-[#F8F9FF] border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                alt="Lan Anh"
                className="w-10 h-10 rounded-full object-cover border border-[#5850EC]/30"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Lan Anh (Master Trainer)</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>4.9 (140+ đánh giá)</span>
                </div>
              </div>
            </div>
            <span className="text-xs text-[#5850EC] font-semibold">Chuyên gia chính</span>
          </div>
        </GlassCard>

        {/* THỜI GIAN HẸN (Matching screenshot 12) */}
        <GlassCard className="p-3.5 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Thời gian hẹn
            </h4>
            <span className="text-xs font-semibold text-[#5850EC]">Tháng 4, 2025</span>
          </div>

          {/* Week days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((d) => {
              const isSelected = selectedDay === d.num;
              return (
                <button
                  type="button"
                  key={d.num}
                  onClick={() => setSelectedDay(d.num)}
                  className={`py-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#5850EC] text-white shadow-sm'
                      : 'bg-[#F8F9FF] text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] opacity-80">{d.name}</span>
                  <span className="text-xs font-bold mt-0.5">{d.num}</span>
                </button>
              );
            })}
          </div>

          {/* Time Slots Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Khung giờ còn trống
            </label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => {
                const isSelected = selectedTimeSlot === slot;
                return (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-center transition-all ${
                      isSelected
                        ? 'bg-[#5850EC] text-white shadow-sm'
                        : 'bg-[#F8F9FF] text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hình thức gặp gỡ */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Hình thức gặp gỡ
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMeetingType('STUDIO')}
                className={`p-2.5 rounded-xl text-xs font-semibold transition-all ${
                  meetingType === 'STUDIO'
                    ? 'bg-[#5850EC] text-white'
                    : 'bg-[#F8F9FF] text-slate-700 border border-slate-200'
                }`}
              >
                Trực tiếp tại cơ sở
              </button>
              <button
                type="button"
                onClick={() => setMeetingType('ONLINE')}
                className={`p-2.5 rounded-xl text-xs font-semibold transition-all ${
                  meetingType === 'ONLINE'
                    ? 'bg-[#5850EC] text-white'
                    : 'bg-[#F8F9FF] text-slate-700 border border-slate-200'
                }`}
              >
                Tư vấn Online (Video Call)
              </button>
            </div>
          </div>
        </GlassCard>

        {/* GHI CHÚ & NHẮC LỊCH (Matching screenshot 12) */}
        <GlassCard className="p-3.5 bg-white space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Ghi chú & Nhắc lịch
          </h4>

          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập ghi chú yêu cầu của khách hàng..."
            className="w-full p-2.5 rounded-xl bg-[#F8F9FF] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
          />

          <label className="flex items-center justify-between cursor-pointer pt-1">
            <span className="text-xs text-slate-700 font-medium">
              Gửi nhắc hẹn qua SMS / Zalo (Tự động gửi trước 2 giờ)
            </span>
            <input
              type="checkbox"
              checked={smsReminder}
              onChange={(e) => setSmsReminder(e.target.checked)}
              className="w-5 h-5 accent-[#5850EC] rounded"
            />
          </label>
        </GlassCard>

        {/* Submit */}
        <PrimaryButton
          size="lg"
          fullWidth
          onClick={handleConfirm}
          icon={<Check className="w-5 h-5" />}
        >
          Xác nhận đặt lịch hẹn
        </PrimaryButton>
      </div>
    </div>
  );
};
