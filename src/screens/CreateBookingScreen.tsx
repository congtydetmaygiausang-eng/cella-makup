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
  QrCode,
  DollarSign,
  Phone,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

interface CreateBookingScreenProps {
  customers: Customer[];
  onBack: () => void;
  onSaveBooking: (newBooking: Partial<Booking>) => void;
  onNavigate: (screen: ScreenId) => void;
}

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  price: number;
  deposit: number;
  duration: string;
}

const CELLA_SERVICES: ServiceItem[] = [
  {
    id: 's1',
    name: 'Makeup Cô Dâu VIP (Lễ Cưới Trọn Gói)',
    category: 'Cô dâu',
    price: 2500000,
    deposit: 1000000,
    duration: '90 - 120 phút',
  },
  {
    id: 's2',
    name: 'Makeup Cô Dâu Ăn Hỏi & Áo Dài Truyền Thống',
    category: 'Cô dâu',
    price: 1800000,
    deposit: 800000,
    duration: '90 phút',
  },
  {
    id: 's3',
    name: 'Thử Makeup & Làm Tóc Cô Dâu (Trial Bridal)',
    category: 'Cô dâu',
    price: 1200000,
    deposit: 500000,
    duration: '90 phút',
  },
  {
    id: 's4',
    name: 'Makeup Dự Tiệc & Dạ Hội Sang Trọng',
    category: 'Dự tiệc',
    price: 800000,
    deposit: 300000,
    duration: '60 phút',
  },
  {
    id: 's5',
    name: 'Makeup Kỷ Yếu & Học Sinh / Sinh Viên',
    category: 'Kỷ yếu',
    price: 600000,
    deposit: 200000,
    duration: '45 - 60 phút',
  },
  {
    id: 's6',
    name: 'Makeup Sự Kiện & Chụp Ảnh Lookbook Ngoài Trời',
    category: 'Sự kiện',
    price: 1500000,
    deposit: 500000,
    duration: '90 phút',
  },
  {
    id: 's7',
    name: 'Makeup Tận Nơi / Tại Nhà (Thái Bình & lân cận)',
    category: 'Tận nơi',
    price: 1500000,
    deposit: 500000,
    duration: '90 phút',
  },
];

const ARTISTS_LIST = [
  {
    id: 'ins-1',
    name: 'Master Cella Hương Phượng',
    role: 'Nhà sáng lập · Master Trainer',
    rating: 5.0,
    avatar: 'https://cellamakeup.vn/blog/images/founder.jpg',
  },
  {
    id: 'ins-2',
    name: 'Trần Thị Lan Anh',
    role: 'Chuyên gia Makeup Cô Dâu',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'ins-3',
    name: 'Nguyễn Thu Trang',
    role: 'Chuyên gia High Fashion & Editorial',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'ins-4',
    name: 'Hoàng Minh Anh',
    role: 'Chuyên gia Makeup Cá Nhân & Tiệc',
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'ins-5',
    name: 'Lê Mai Phương',
    role: 'Trợ giảng cao cấp',
    rating: 5.0,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
  },
];

export const CreateBookingScreen: React.FC<CreateBookingScreenProps> = ({
  customers,
  onBack,
  onSaveBooking,
  onNavigate,
}) => {
  const [useExistingCustomer, setUseExistingCustomer] = useState(true);
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || 'CUST-001');
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');

  const [selectedService, setSelectedService] = useState<ServiceItem>(CELLA_SERVICES[0]);
  const [selectedArtist, setSelectedArtist] = useState(ARTISTS_LIST[0]);
  const [selectedBranch, setSelectedBranch] = useState('CELLA Studio (37–39 Phan Bội Châu, TP. Thái Bình)');
  const [selectedDay, setSelectedDay] = useState(25);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('09:00 – 10:30 (Sáng)');
  const [notes, setNotes] = useState('');
  const [smsReminder, setSmsReminder] = useState(true);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0] || {
    id: 'CUST-TEMP',
    name: customName || 'Khách hàng',
    phone: customPhone || '0988 123 456',
  };

  const timeSlots = [
    '07:00 – 08:30 (Sớm)',
    '08:30 – 10:00 (Sáng)',
    '10:00 – 11:30 (Sáng)',
    '13:30 – 15:00 (Chiều)',
    '15:00 – 16:30 (Chiều)',
    '17:00 – 18:30 (Tối)',
    '19:00 – 20:30 (Tối)',
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
    const custName = useExistingCustomer ? selectedCustomer.name : customName.trim();
    const custPhone = useExistingCustomer ? selectedCustomer.phone : customPhone.trim();

    if (!custName || !custPhone) {
      alert('Vui lòng nhập tên và số điện thoại khách hàng!');
      return;
    }

    const newBk: Partial<Booking> = {
      bookingCode: `#BK-202504${selectedDay}-${Date.now().toString().slice(-4)}`,
      customerId: useExistingCustomer ? selectedCustomer.id : `CUST-${Date.now().toString().slice(-4)}`,
      customerName: custName,
      customerPhone: custPhone,
      customerVip: useExistingCustomer ? selectedCustomer.vipTier : 'Khách mới',
      serviceTitle: selectedService.name,
      artistId: selectedArtist.id,
      artistName: selectedArtist.name,
      appointmentDate: `2025-04-${selectedDay}`,
      appointmentTime: selectedTimeSlot,
      branchName: selectedBranch,
      locationAddress: selectedBranch.includes('Thái Bình')
        ? '37–39 Phan Bội Châu, P. Lê Hồng Phong, TP. Thái Bình'
        : 'Trang điểm tận nơi theo địa chỉ khách yêu cầu',
      locationType: selectedBranch.includes('tận nơi') ? 'HOME' : 'STUDIO',
      status: 'CONFIRMED',
      totalAmount: selectedService.price,
      depositAmount: selectedService.deposit,
      notes: notes || 'Đặt lịch qua ứng dụng CELLA',
      smsReminder,
    };

    onSaveBooking(newBk);
  };

  return (
    <div className="min-h-full bg-[#F8F9FF] pb-24 text-slate-900 animate-in fade-in duration-200">
      <MobileHeader
        showBack
        onBack={onBack}
        title="Đặt lịch hẹn mới"
        subtitle="Hệ thống Booking CELLA Makeup"
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
        {/* 1. KHÁCH HÀNG */}
        <GlassCard className="p-4 bg-white space-y-3 rounded-2xl shadow-xs border border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">
              1. Khách hàng đặt lịch
            </h4>
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setUseExistingCustomer(true)}
                className={`px-2 py-1 rounded-md transition-all ${
                  useExistingCustomer ? 'bg-white text-[#544CDE] shadow-xs' : 'text-slate-500'
                }`}
              >
                Chọn có sẵn
              </button>
              <button
                type="button"
                onClick={() => setUseExistingCustomer(false)}
                className={`px-2 py-1 rounded-md transition-all ${
                  !useExistingCustomer ? 'bg-white text-[#544CDE] shadow-xs' : 'text-slate-500'
                }`}
              >
                Khách mới
              </button>
            </div>
          </div>

          {useExistingCustomer ? (
            <div className="space-y-2">
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full text-xs font-bold text-slate-800 bg-[#F8F9FF] p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#544CDE]/30"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.phone} {c.vipTier ? `(${c.vipTier})` : ''}
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#544CDE] text-white font-black text-xs flex items-center justify-center">
                    {selectedCustomer.name
                      ? selectedCustomer.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(-2)
                          .join('')
                      : 'KH'}
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
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ tên khách *</label>
                <input
                  type="text"
                  placeholder="Nguyễn Thị Lan"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  placeholder="0988 123 456"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 font-bold"
                />
              </div>
            </div>
          )}
        </GlassCard>

        {/* 2. CHỌN DỊCH VỤ MAKEUP */}
        <GlassCard className="p-4 bg-white space-y-3 rounded-2xl shadow-xs border border-slate-100">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">
            2. Dịch vụ Trang điểm CELLA
          </h4>

          <div className="space-y-1.5">
            {CELLA_SERVICES.map((svc) => {
              const isSelected = selectedService.id === svc.id;
              return (
                <div
                  key={svc.id}
                  onClick={() => setSelectedService(svc)}
                  className={`p-3 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-indigo-50/70 border-2 border-[#544CDE] text-slate-900'
                      : 'bg-slate-50/80 border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold">{svc.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Thời lượng: {svc.duration} · Cọc: {svc.deposit.toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-[#544CDE] block">
                      {svc.price.toLocaleString('vi-VN')} đ
                    </span>
                    {isSelected && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 justify-end mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Đã chọn
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Địa điểm thực hiện
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
            >
              <option value="CELLA Studio (37–39 Phan Bội Châu, TP. Thái Bình)">
                CELLA Studio (37–39 Phan Bội Châu, TP. Thái Bình)
              </option>
              <option value="Trang điểm tận nơi / Tại nhà (TP. Thái Bình & huyện lân cận)">
                Trang điểm tận nơi / Tại nhà (Thái Bình)
              </option>
            </select>
          </div>
        </GlassCard>

        {/* 3. NGHỆ NHÂN MAKEUP (ARTIST) */}
        <GlassCard className="p-4 bg-white space-y-3 rounded-2xl shadow-xs border border-slate-100">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">
            3. Nghệ nhân thực hiện (Artist)
          </h4>

          <div className="grid grid-cols-1 gap-2">
            {ARTISTS_LIST.map((art) => {
              const isSelected = selectedArtist.id === art.id;
              return (
                <div
                  key={art.id}
                  onClick={() => setSelectedArtist(art)}
                  className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-purple-50/70 border-2 border-purple-600 text-slate-900'
                      : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={art.avatar}
                      alt={art.name}
                      className="w-10 h-10 rounded-full object-cover border border-purple-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{art.name}</p>
                      <p className="text-[10px] text-slate-500">{art.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-700">{art.rating}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* 4. THỜI GIAN HẸN */}
        <GlassCard className="p-4 bg-white space-y-3 rounded-2xl shadow-xs border border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">
              4. Thời gian hẹn
            </h4>
            <span className="text-xs font-bold text-[#544CDE]">Tháng 4, 2025</span>
          </div>

          {/* Week days selector */}
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
                      ? 'bg-[#544CDE] text-white shadow-sm font-bold'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] opacity-80">{d.name}</span>
                  <span className="text-xs font-bold mt-0.5">{d.num}</span>
                </button>
              );
            })}
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Khung giờ slot hẹn
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {timeSlots.map((slot) => {
                const isSelected = selectedTimeSlot === slot;
                return (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`py-2 px-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#544CDE] text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ghi chú yêu cầu đặc biệt
            </label>
            <input
              type="text"
              placeholder="VD: Da mụn, cần trang điểm tone Thái, đến trước 15 phút..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs"
            />
          </div>
        </GlassCard>

        {/* TỔNG KẾT CHI PHÍ & NÚT XÁC NHẬN */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-md">
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Giá dịch vụ:</span>
              <strong className="text-slate-900">{selectedService.price.toLocaleString('vi-VN')} đ</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tiền đặt cọc giữ chỗ:</span>
              <strong className="text-emerald-600">{selectedService.deposit.toLocaleString('vi-VN')} đ</strong>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-black">
              <span>Còn lại thanh toán tại tiệm:</span>
              <span className="text-[#544CDE]">
                {(selectedService.price - selectedService.deposit).toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          <PrimaryButton
            size="lg"
            fullWidth
            onClick={handleConfirm}
            icon={<CheckCircle2 className="w-5 h-5" />}
          >
            Xác nhận tạo Lịch hẹn ({selectedService.deposit.toLocaleString('vi-VN')} đ cọc)
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
