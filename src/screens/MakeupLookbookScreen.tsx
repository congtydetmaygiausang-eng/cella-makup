import React, { useState } from 'react';
import { ScreenId } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import {
  Plus,
  X,
  Camera,
  Star,
  Search,
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  CreditCard,
  ChevronRight,
  Info,
  CalendarCheck,
  Heart
} from 'lucide-react';

interface MakeupLookbookScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
  currentUser?: any;
  onSaveBooking?: (booking: any) => void;
}

// ---------- DATA ----------
const CATEGORIES = ['Tất cả', 'Cô dâu', 'Dự tiệc', 'Sự kiện', 'Kỷ yếu', 'Cá nhân'];

const PRICE_LIST = [
  { id: 'p1', service: 'Makeup cô dâu cao cấp', price: 800000, originalPrice: 1000000, note: 'Bao gồm cả ngày & phụ kiện hoa cài', popular: true },
  { id: 'p2', service: 'Makeup dự tiệc & dạ hội', price: 350000, note: 'Tông Hàn Quốc / Thái / Sang trọng', popular: true },
  { id: 'p3', service: 'Makeup kỷ yếu sinh viên', price: 300000, note: 'Tươi tắn tự nhiên · Lớp ≥10 người giảm 10%' },
  { id: 'p4', service: 'Makeup sự kiện biểu diễn', price: 500000, note: 'Sân khấu, chụp lookbook, quay TVC' },
  { id: 'p5', service: 'Makeup cá nhân hàng ngày', price: 250000, note: 'Tự nhiên, nhẹ nhàng, trong trẻo' },
  { id: 'p6', service: 'Makeup đến tận nhà', price: 450000, note: 'TP. Thái Bình & huyện lân cận' },
];

const INITIAL_SAMPLES = [
  {
    id: 'm1',
    category: 'Cô dâu',
    title: 'Cô dâu lãng mạn nhẹ nhàng',
    image: 'https://cellamakeup.vn/blog/images/gt-1.jpg',
    price: 800000,
    rating: 5,
    artist: 'Cella Hương Phượng',
    desc: 'Lớp nền căng mọng Glass Skin, tông hồng đào lãng mạn, tôn nét duyên dáng.'
  },
  {
    id: 'm2',
    category: 'Dự tiệc',
    title: 'Dự tiệc Glamour sang trọng',
    image: 'https://cellamakeup.vn/blog/images/gt-2.jpg',
    price: 350000,
    rating: 5,
    artist: 'Cella Hương Phượng',
    desc: 'Nhấn mắt nhũ mịn, eyeliner sắc sảo, son đỏ thuần quyền lực.'
  },
  {
    id: 'm3',
    category: 'Kỷ yếu',
    title: 'Kỷ yếu thanh xuân trong trẻo',
    image: 'https://cellamakeup.vn/blog/images/gt-3.jpg',
    price: 300000,
    rating: 5,
    artist: 'Cella Team',
    desc: 'Tone cam đào tươi trẻ, bền màu ngoài trời suốt ngày dài.'
  },
  {
    id: 'm4',
    category: 'Sự kiện',
    title: 'Sự kiện & Hội nghị đẳng cấp',
    image: 'https://cellamakeup.vn/blog/images/gt-4.jpg',
    price: 500000,
    rating: 5,
    artist: 'Cella Team',
    desc: 'Phong thái tự tin, tôn vinh đường nét gương mặt dưới ánh đèn sân khấu.'
  },
  {
    id: 'm5',
    category: 'Cô dâu',
    title: 'Cô dâu hiện đại phương Tây',
    image: 'https://cellamakeup.vn/images/hero-workshop.jpg',
    price: 900000,
    rating: 5,
    artist: 'Cella Hương Phượng',
    desc: 'Tông nude thời thượng, khối mũi mắt chiều sâu hút hồn.'
  },
  {
    id: 'm6',
    category: 'Cá nhân',
    title: 'Makeup cá nhân No-makeup',
    image: 'https://cellamakeup.vn/images/gt-doi-ngu.jpg',
    price: 250000,
    rating: 4,
    artist: 'Cella Team',
    desc: 'Trang điểm như không trang điểm, nâng niu làn da tự nhiên.'
  },
];

const TIME_SLOTS = [
  '06:00 - 07:30 (Sáng sớm)',
  '07:30 - 09:00',
  '09:00 - 10:30',
  '10:30 - 12:00',
  '13:30 - 15:00 (Chiều)',
  '15:00 - 16:30',
  '16:30 - 18:00',
  '18:00 - 19:30 (Tối)',
  '19:30 - 21:00',
];

// ---------- MAIN COMPONENT ----------
export const MakeupLookbookScreen: React.FC<MakeupLookbookScreenProps> = ({
  onNavigate,
  onBack,
  currentUser,
  onSaveBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'lookbook' | 'price' | 'booking'>('lookbook');
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [samples, setSamples] = useState(INITIAL_SAMPLES);
  const [showAddModal, setShowAddModal] = useState(false);

  // Quick Booking Modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<{
    title: string;
    price: number;
    artist?: string;
  } | null>(null);

  // Form states for booking
  const [custName, setCustName] = useState(currentUser?.name || '');
  const [custPhone, setCustPhone] = useState(currentUser?.phone || '');
  const [bookDate, setBookDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [bookTimeSlot, setBookTimeSlot] = useState(TIME_SLOTS[1]);
  const [bookLocation, setBookLocation] = useState('STUDIO'); // STUDIO or HOME
  const [bookNotes, setBookNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Add sample modal state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Cô dâu');
  const [newPrice, setNewPrice] = useState('');
  const [newArtist, setNewArtist] = useState('Cella Team');
  const [newImage, setNewImage] = useState('');

  const filtered = samples.filter((s) => {
    const matchCat = activeCategory === 'Tất cả' || s.category === activeCategory;
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.artist.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleOpenBooking = (title: string, price: number, artist: string = 'Cella Hương Phượng') => {
    setSelectedServiceForBooking({ title, price, artist });
    setBookingSuccess(false);
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!custName || !custPhone) {
      alert('Vui lòng nhập Họ tên và Số điện thoại để hoàn tất đặt lịch.');
      return;
    }

    const svc = selectedServiceForBooking || {
      title: 'Makeup dịch vụ CELLA',
      price: 350000,
      artist: 'Cella Hương Phượng',
    };

    const newBookingObj = {
      bookingCode: `#BK-${Date.now().toString().slice(-8)}`,
      customerId: currentUser?.id || 'CUST-GUEST',
      customerName: custName,
      customerPhone: custPhone,
      serviceTitle: svc.title,
      artistName: svc.artist || 'Cella Hương Phượng',
      appointmentDate: bookDate,
      appointmentTime: bookTimeSlot,
      branchName:
        bookLocation === 'STUDIO'
          ? 'CELLA Studio Thái Bình (37–39 Phan Bội Châu, TP. Thái Bình)'
          : 'Trang điểm tận nơi / Tại nhà (Thái Bình)',
      locationAddress:
        bookLocation === 'STUDIO'
          ? '37–39 Phan Bội Châu, P. Lê Hồng Phong, TP. Thái Bình'
          : 'Trang điểm tận nhà theo yêu cầu',
      locationType: bookLocation,
      status: 'CONFIRMED',
      totalAmount: svc.price,
      depositAmount: Math.round(svc.price * 0.3),
      notes: bookNotes || 'Đặt lịch qua Lookbook Mẫu Makeup',
    };

    if (onSaveBooking) {
      onSaveBooking(newBookingObj);
    }

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingModalOpen(false);
      setBookingSuccess(false);
    }, 2200);
  };

  const handleAddSample = () => {
    if (!newTitle || !newPrice) return;
    const sample = {
      id: 'm' + Date.now(),
      category: newCategory,
      title: newTitle,
      image: newImage || 'https://cellamakeup.vn/blog/images/gt-1.jpg',
      price: parseInt(newPrice.replace(/\D/g, '')) || 0,
      rating: 5,
      artist: newArtist,
      desc: 'Mẫu makeup thiết kế riêng bởi ' + newArtist,
    };
    setSamples((prev) => [sample, ...prev]);
    setShowAddModal(false);
    setNewTitle('');
    setNewPrice('');
    setNewArtist('Cella Team');
    setNewImage('');
  };

  return (
    <div className="min-h-full bg-[#F8F9FF] pb-24 text-slate-900 relative">
      <MobileHeader
        title="Mẫu Makeup & Đặt Lịch"
        subtitle="CELLA MAKEUP ACADEMY"
        showBack={true}
        onBack={onBack || (() => onNavigate('home'))}
        rightAction={
          <button
            onClick={() => setShowAddModal(true)}
            className="w-9 h-9 rounded-full bg-[#5850EC] flex items-center justify-center active:scale-95 transition-transform"
            title="Thêm mẫu makeup"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        }
      />

      <div className="px-4 pt-1 space-y-3">
        {/* Tab switcher: 3 tabs */}
        <div className="flex bg-white rounded-2xl border border-slate-100 p-1 gap-1 shadow-sm">
          {[
            { id: 'lookbook', label: '📸 Mẫu Makeup' },
            { id: 'price', label: '💰 Bảng Giá' },
            { id: 'booking', label: '📅 Đặt Lịch' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#5850EC] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== TAB 1: LOOKBOOK ===== */}
        {activeTab === 'lookbook' && (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm mẫu makeup hoặc chuyên viên..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                    activeCategory === cat
                      ? 'bg-[#5850EC] text-white border-[#5850EC]'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid mẫu makeup */}
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Camera className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Chưa có mẫu phù hợp</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-3 text-[#5850EC] text-sm font-semibold"
                >
                  + Thêm mẫu mới
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {filtered.map((sample) => (
                  <div
                    key={sample.id}
                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col justify-between group"
                  >
                    <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                      <img
                        src={sample.image}
                        alt={sample.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://cellamakeup.vn/images/og-share.jpg';
                        }}
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-[#5850EC] shadow-sm">
                          {sample.category}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-black/60 text-white flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          {sample.rating}.0
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[12px] font-bold text-slate-900 leading-tight line-clamp-1">
                          {sample.title}
                        </p>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{sample.artist}</p>
                      </div>

                      <div className="pt-1 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[12px] font-black text-[#5850EC]">
                          {sample.price.toLocaleString('vi-VN')}đ
                        </span>
                        <button
                          onClick={() => handleOpenBooking(sample.title, sample.price, sample.artist)}
                          className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-900 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm transition-transform"
                        >
                          <CalendarCheck className="w-3 h-3" />
                          Đặt lịch
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===== TAB 2: BẢNG GIÁ ===== */}
        {activeTab === 'price' && (
          <>
            {/* Hero banner */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#0A0A0C] via-[#1E1B4B] to-[#312E81] text-white p-5 space-y-3 relative shadow-md">
              <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                  CELLA MAKEUP ACADEMY
                </p>
                <h2 className="text-[18px] font-black mt-0.5">Bảng Giá Dịch Vụ Trang Điểm</h2>
                <p className="text-[11px] text-slate-300 mt-1">
                  Đã bao gồm 100% mỹ phẩm chính hãng (Dior, MAC, NARS...) & phụ kiện
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="tel:0961161994"
                  className="py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-xl text-[12px] font-black text-center flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Gọi 096 116 1994
                </a>
                <button
                  onClick={() => setActiveTab('booking')}
                  className="py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-[12px] font-bold text-center border border-white/20 flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-300" />
                  Đặt lịch online
                </button>
              </div>
            </div>

            {/* Price list */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <p className="text-[12px] font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Dịch vụ trang điểm chuyên nghiệp
                </p>
                <span className="text-[10px] text-slate-400">Cập nhật 2025</span>
              </div>
              {PRICE_LIST.map((item, idx) => (
                <div
                  key={item.id}
                  className={`px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors ${
                    idx < PRICE_LIST.length - 1 ? 'border-b border-slate-50' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[12px] font-bold text-slate-800 truncate">{item.service}</p>
                      {item.popular && (
                        <span className="px-1.5 py-0.2 bg-rose-50 text-rose-600 rounded text-[9px] font-bold border border-rose-100">
                          HOT
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.note}</p>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-2.5">
                    <div>
                      <p className="text-[13px] font-black text-[#5850EC]">
                        {item.price.toLocaleString('vi-VN')}đ
                      </p>
                      {item.originalPrice && (
                        <p className="text-[10px] text-slate-400 line-through">
                          {item.originalPrice.toLocaleString('vi-VN')}đ
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleOpenBooking(item.service, item.price, 'Cella Hương Phượng')}
                      className="px-2.5 py-1.5 bg-[#5850EC] hover:bg-[#4338CA] text-white rounded-xl text-[11px] font-bold active:scale-95 transition-transform"
                    >
                      Đặt
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Khoá học */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                <p className="text-[12px] font-bold text-slate-800">🎓 Khóa đào tạo nghề makeup</p>
              </div>
              {[
                { name: 'Makeup cá nhân cơ bản (3 buổi)', price: 'Liên hệ' },
                { name: 'Makeup cá nhân nâng cao (5 buổi)', price: 'Liên hệ' },
                { name: 'Dự Án 0 Đồng - Khóa Nền Tảng (20 buổi)', price: 'Miễn phí' },
                { name: 'Makeup Chuyên Nghiệp (40 buổi)', price: 'Liên hệ' },
                { name: 'Workshop Doanh Nghiệp / Nhóm', price: 'Liên hệ' },
              ].map((kh, idx, arr) => (
                <div
                  key={idx}
                  className={`px-4 py-3 flex items-center justify-between ${
                    idx < arr.length - 1 ? 'border-b border-slate-50' : ''
                  }`}
                >
                  <p className="text-[12px] font-semibold text-slate-700 flex-1 mr-3">{kh.name}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[12px] font-black shrink-0 ${
                        kh.price === 'Miễn phí' ? 'text-emerald-600' : 'text-[#5850EC]'
                      }`}
                    >
                      {kh.price}
                    </span>
                    <button
                      onClick={() => handleOpenBooking(kh.name, 0, 'Cella Hương Phượng')}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-semibold"
                    >
                      Tư vấn
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Note & Cam kết */}
            <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Cam kết chất lượng tại CELLA</span>
              </div>
              <ul className="text-[11px] text-slate-700 space-y-1 list-disc pl-4">
                <li>Sử dụng mỹ phẩm chính hãng 100% an toàn cho da nhạy cảm.</li>
                <li>Lớp nền mỏng mịn, kiềm dầu, chống nước giữ 12-16 tiếng.</li>
                <li>Tặng kèm dán mi gân trong tự nhiên + dán kích mí.</li>
                <li>Nhận makeup sáng sớm (từ 05:00) cho cô dâu và đám cưới.</li>
              </ul>
            </div>
          </>
        )}

        {/* ===== TAB 3: THÔNG TIN ĐẶT LỊCH ===== */}
        {activeTab === 'booking' && (
          <div className="space-y-3.5">
            {/* 1. Hotline & Trực Tiếp */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white p-5 space-y-3.5 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Hotline & Đặt hẹn
                  </span>
                  <h3 className="text-[17px] font-black mt-0.5">Đặt Lịch Hẹn Ngay</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                  <CalendarCheck className="w-5 h-5 text-amber-400" />
                </div>
              </div>

              <div className="space-y-2 text-xs bg-white/10 rounded-xl p-3 border border-white/15">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Studio CELLA Thái Bình</p>
                    <p className="text-[11px] text-slate-300">
                      37–39 Phan Bội Châu, P. Lê Hồng Phong, TP. Thái Bình
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <p className="text-slate-200">
                    Giờ mở cửa: <strong className="text-white">06:30 – 21:00</strong> (Nhận lịch từ 05:00 cho cô dâu)
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <p className="text-slate-200">
                    Hotline:{' '}
                    <a href="tel:0961161994" className="font-bold text-amber-300 underline">
                      096 116 1994
                    </a>{' '}
                    ·{' '}
                    <a href="tel:0766311313" className="font-bold text-amber-300 underline">
                      0766 311 313
                    </a>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="tel:0961161994"
                  className="py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-xl text-xs font-black text-center flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Gọi đặt lịch
                </a>
                <a
                  href="https://zalo.me/g/ofmzpu576"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Nhắn Zalo tư vấn
                </a>
              </div>
            </div>

            {/* 2. FORM ĐẶT LỊCH TRỰC TUYẾN NGAY */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <h4 className="text-[14px] font-black text-slate-900">Form Đặt Lịch Nhanh</h4>
                  <p className="text-[11px] text-slate-500">
                    Điền thông tin, chuyên viên CELLA sẽ liên hệ xác nhận trong 5 phút
                  </p>
                </div>
                <Sparkles className="w-5 h-5 text-[#5850EC]" />
              </div>

              {bookingSuccess ? (
                <div className="py-6 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-100 p-4">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-black text-emerald-900">Đặt Lịch Thành Công!</h4>
                  <p className="text-xs text-emerald-700">
                    CELLA Makeup đã nhận được thông tin của bạn. Chúng tôi sẽ gọi xác nhận ngay.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Họ và tên của bạn <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Nguyễn Thuỳ Linh"
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Số điện thoại liên hệ <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="VD: 0961 161 994"
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Dịch vụ makeup</label>
                    <select
                      value={selectedServiceForBooking?.title || PRICE_LIST[0].service}
                      onChange={(e) => {
                        const found = PRICE_LIST.find((p) => p.service === e.target.value);
                        setSelectedServiceForBooking({
                          title: e.target.value,
                          price: found?.price || 350000,
                          artist: 'Cella Hương Phượng',
                        });
                      }}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                    >
                      {PRICE_LIST.map((p) => (
                        <option key={p.id} value={p.service}>
                          {p.service} — {p.price.toLocaleString('vi-VN')}đ
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Ngày làm dịch vụ</label>
                      <input
                        type="date"
                        value={bookDate}
                        onChange={(e) => setBookDate(e.target.value)}
                        className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Khung giờ hẹn</label>
                      <select
                        value={bookTimeSlot}
                        onChange={(e) => setBookTimeSlot(e.target.value)}
                        className="w-full h-10 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                      >
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Địa điểm thực hiện</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBookLocation('STUDIO')}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          bookLocation === 'STUDIO'
                            ? 'border-[#5850EC] bg-[#5850EC]/10 text-[#5850EC] font-bold'
                            : 'border-slate-200 bg-slate-50 text-slate-600'
                        }`}
                      >
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="text-[11px] leading-tight">Tại Studio CELLA</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookLocation('HOME')}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          bookLocation === 'HOME'
                            ? 'border-[#5850EC] bg-[#5850EC]/10 text-[#5850EC] font-bold'
                            : 'border-slate-200 bg-slate-50 text-slate-600'
                        }`}
                      >
                        <Heart className="w-4 h-4 shrink-0" />
                        <span className="text-[11px] leading-tight">Tận nơi / Tại nhà</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ghi chú yêu cầu thêm</label>
                    <textarea
                      rows={2}
                      placeholder="VD: Da dễ mụn, cần tone cam đào tự nhiên, địa chỉ nếu makeup tại nhà..."
                      value={bookNotes}
                      onChange={(e) => setBookNotes(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
                    />
                  </div>

                  <button
                    onClick={handleConfirmBooking}
                    className="w-full py-3 bg-[#5850EC] hover:bg-[#4338CA] active:scale-[0.98] text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Xác Nhận Đặt Lịch Ngay
                  </button>
                </div>
              )}
            </div>

            {/* 3. QUY TRÌNH 4 BƯỚC ĐẶT LỊCH */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3 shadow-sm">
              <h4 className="text-[13px] font-black text-slate-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#5850EC]" /> Quy Trình Đặt Lịch Chuyên Nghiệp
              </h4>

              <div className="space-y-2.5">
                {[
                  {
                    step: '1',
                    title: 'Chọn mẫu & Tư vấn phong cách',
                    desc: 'Tham khảo lookbook hoặc gửi hình mẫu mong muốn. Chuyên viên sẽ gợi ý tone màu phù hợp nhất với trang phục và gương mặt.',
                  },
                  {
                    step: '2',
                    title: 'Chọn thời gian & Địa điểm',
                    desc: 'Lựa chọn khung giờ (từ 05:00 sáng đến 21:00 tối) tại Studio CELLA Thái Bình hoặc chuyên viên đến tận nhà bạn.',
                  },
                  {
                    step: '3',
                    title: 'Xác nhận & Cọc lịch giữ chỗ',
                    desc: 'Studio gọi điện xác nhận và hướng dẫn cọc 30% để đảm bảo lịch hẹn của bạn không bị trùng với khách hàng khác.',
                  },
                  {
                    step: '4',
                    title: 'Trải nghiệm dịch vụ hoàn hảo',
                    desc: 'Đúng giờ hẹn, chuyên viên tiến hành dưỡng ẩm da chuyên sâu và makeup với 100% mỹ phẩm chính hãng cao cấp.',
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-[#5850EC] text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      {item.step}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-800 leading-tight">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. THÔNG TIN CHUYỂN KHOẢN ĐẶT CỌC */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 p-4 space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <CreditCard className="w-4 h-4 text-amber-700" />
                <span>Thông Tin Thanh Toán / Đặt Cọc (30%)</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Để đảm bảo giữ lịch vào mùa cao điểm cưới hỏi & lễ hội, quý khách vui lòng cọc 30% giá trị dịch vụ:
              </p>
              <div className="bg-white rounded-xl p-3 border border-amber-200 space-y-1 text-xs text-slate-800 font-medium">
                <p>
                  🏦 Ngân hàng: <strong className="text-slate-900 font-bold">MB Bank (Ngân hàng Quân Đội)</strong>
                </p>
                <p>
                  💳 Số tài khoản:{' '}
                  <strong className="text-amber-700 font-mono font-bold tracking-wider text-sm select-all">
                    0961161994
                  </strong>
                </p>
                <p>
                  👤 Chủ tài khoản: <strong className="text-slate-900 font-bold">TRAN THI HUONG PHUONG</strong>
                </p>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  📝 Cú pháp: <span className="font-mono font-semibold">[Họ Tên] [SĐT] [Ngày makeup]</span>
                </p>
              </div>
            </div>

            {/* 5. CHÍNH SÁCH ĐỔI LỊCH */}
            <div className="bg-slate-100/80 rounded-2xl p-3.5 space-y-1 text-[11px] text-slate-600">
              <p className="font-bold text-slate-800">🛡️ Chính sách hỗ trợ khách hàng:</p>
              <p>• Hỗ trợ dời ngày/giờ hẹn miễn phí nếu thông báo trước ít nhất 24 giờ.</p>
              <p>• Makeup tận nhà miễn phí di chuyển trong bán kính 5km trung tâm TP. Thái Bình.</p>
              <p>• Luôn sẵn sàng tư vấn phong cách trang phục và kiểu tóc đồng bộ.</p>
            </div>
          </div>
        )}
      </div>

      {/* QUICK BOOKING MODAL (Triggered from Lookbook or Price List) */}
      {bookingModalOpen && selectedServiceForBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-[15px] font-black text-slate-900">Đặt Lịch Trang Điểm</h3>
                <p className="text-[11px] text-slate-500">CELLA MAKEUP ACADEMY · THÁI BÌNH</p>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-black text-slate-900">Đặt Lịch Thành Công!</h4>
                <p className="text-xs text-slate-600">
                  Dịch vụ: <strong>{selectedServiceForBooking.title}</strong>
                </p>
                <p className="text-xs text-slate-500">
                  Chúng tôi sẽ liên hệ lại qua SĐT <strong>{custPhone}</strong> để xác nhận.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs">
                {/* Selected service summary */}
                <div className="p-3 rounded-2xl bg-[#5850EC]/10 border border-[#5850EC]/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#5850EC] uppercase">Dịch vụ đã chọn</span>
                    <p className="text-[13px] font-black text-slate-900">{selectedServiceForBooking.title}</p>
                    <p className="text-[11px] text-slate-500">Chuyên viên: {selectedServiceForBooking.artist || 'Cella Hương Phượng'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-black text-[#5850EC]">
                      {selectedServiceForBooking.price > 0
                        ? `${selectedServiceForBooking.price.toLocaleString('vi-VN')}đ`
                        : 'Tư vấn miễn phí'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Họ và tên của bạn <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder="VD: Thuỳ Linh"
                    className="w-full h-10 px-3.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Số điện thoại liên hệ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="VD: 0961 161 994"
                    className="w-full h-10 px-3.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ngày làm</label>
                    <input
                      type="date"
                      value={bookDate}
                      onChange={(e) => setBookDate(e.target.value)}
                      className="w-full h-10 px-2.5 border border-slate-200 rounded-xl text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Khung giờ</label>
                    <select
                      value={bookTimeSlot}
                      onChange={(e) => setBookTimeSlot(e.target.value)}
                      className="w-full h-10 px-2 border border-slate-200 rounded-xl text-xs font-semibold"
                    >
                      {TIME_SLOTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Địa điểm</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBookLocation('STUDIO')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        bookLocation === 'STUDIO'
                          ? 'border-[#5850EC] bg-[#5850EC]/10 text-[#5850EC] font-bold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Tại Studio Thái Bình
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookLocation('HOME')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        bookLocation === 'HOME'
                          ? 'border-[#5850EC] bg-[#5850EC]/10 text-[#5850EC] font-bold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Tận nơi / Tại nhà
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ghi chú</label>
                  <input
                    type="text"
                    value={bookNotes}
                    onChange={(e) => setBookNotes(e.target.value)}
                    placeholder="Yêu cầu riêng hoặc địa chỉ cụ thể..."
                    className="w-full h-10 px-3.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={handleConfirmBooking}
                    className="w-full py-3 bg-[#5850EC] hover:bg-[#4338CA] active:scale-[0.98] text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Xác Nhận Đặt Lịch
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="tel:0961161994"
                      className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-[11px] font-bold text-center flex items-center justify-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                      Gọi 096 116 1994
                    </a>
                    <a
                      href="https://zalo.me/g/ofmzpu576"
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-[11px] font-bold text-center flex items-center justify-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
                      Zalo tư vấn
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD MODAL (Thêm mẫu makeup) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-black text-slate-900">Thêm Mẫu Makeup</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Tên mẫu *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="VD: Cô dâu cổ điển..."
                  className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Danh mục
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {CATEGORIES.filter((c) => c !== 'Tất cả').map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNewCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                        newCategory === cat
                          ? 'bg-[#5850EC] text-white border-[#5850EC]'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Giá dịch vụ (VNĐ) *
                </label>
                <input
                  type="text"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="VD: 500000"
                  className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Makeup Artist
                </label>
                <input
                  type="text"
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  placeholder="Tên Makeup Artist"
                  className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Link ảnh (tùy chọn)
                </label>
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
                />
              </div>
            </div>

            <button
              onClick={handleAddSample}
              disabled={!newTitle || !newPrice}
              className="w-full py-3 bg-[#5850EC] text-white rounded-2xl font-bold text-[13px] disabled:opacity-50 active:scale-95 transition-transform shadow-md"
            >
              ✓ Thêm Vào Lookbook
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
