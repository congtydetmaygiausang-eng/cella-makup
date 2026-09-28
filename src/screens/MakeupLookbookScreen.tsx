import React, { useState, useEffect, useRef } from 'react';
import { ScreenId, MakeupLook } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import { supabase } from '../config/supabase';
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
  Heart,
  Edit2,
  Eye,
  Trash2,
  Upload,
  Image as ImageIcon,
  Check,
  User,
  Sliders,
  DollarSign
} from 'lucide-react';

interface MakeupLookbookScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
  currentUser?: any;
  onSaveBooking?: (booking: any) => void;
}

// ---------- DATA & SCHEMA CHUẨN POSTGRESQL / SUPABASE (makeup_looks) ----------
const CATEGORIES = ['Tất cả', 'Cô dâu', 'Dự tiệc', 'Sự kiện', 'Kỷ yếu', 'Cá nhân'];

const INITIAL_LOOKS: MakeupLook[] = [
  {
    id: 'm1',
    title: 'Cô dâu lãng mạn nhẹ nhàng',
    tagline: 'Glass Skin Bridal · Trong trẻo tự nhiên',
    category: 'Cô dâu',
    aura_tone: 'Hồng đào & Ánh nhũ ngọc trai',
    rating: 5,
    saved_count: 520,
    reviews_count: 48,
    duration_minutes: 90,
    standard_price: 800000,
    member_price: 720000,
    hero_image_url: 'https://cellamakeup.vn/blog/images/gt-1.jpg',
    gallery_images: [
      'https://cellamakeup.vn/blog/images/gt-1.jpg',
      'https://cellamakeup.vn/images/hero-workshop.jpg'
    ],
    artist: 'Cella Hương Phượng',
    description: 'Lớp nền căng mọng Glass Skin chuẩn Hàn, tôn vinh nét đẹp thanh tú dịu dàng của cô dâu trong ngày trọng đại. Giữ nền bền suốt 16 tiếng không xuống tone.',
    suitable_face_shapes: ['Trái xoan', 'Tròn', 'Trái tim'],
    ideal_undertones: ['Cool', 'Neutral', 'Warm'],
    cosmetic_products: ['Dior Forever Skin Glow', 'NARS Orgasm Blush', 'Charlotte Tilbury Pillow Talk'],
    is_featured: true,
    created_at: '2025-01-15T08:00:00Z',
  },
  {
    id: 'm2',
    title: 'Dự tiệc Glamour sang trọng',
    tagline: 'Sắc sảo quyến rũ · Nổi bật đêm tiệc',
    category: 'Dự tiệc',
    aura_tone: 'Nâu tây & Đỏ nhung thuần',
    rating: 5,
    saved_count: 380,
    reviews_count: 32,
    duration_minutes: 60,
    standard_price: 350000,
    member_price: 300000,
    hero_image_url: 'https://cellamakeup.vn/blog/images/gt-2.jpg',
    gallery_images: ['https://cellamakeup.vn/blog/images/gt-2.jpg'],
    artist: 'Cella Hương Phượng',
    description: 'Nhấn mắt nhũ khói sâu hút hồn, eyeliner cong vút tinh tế, phối cùng sắc son đỏ nhung quyền lực giúp bạn chiếm trọn spotlight mọi buổi tiệc dạ hội.',
    suitable_face_shapes: ['Trái xoan', 'Vuông', 'Kim cương'],
    ideal_undertones: ['Warm', 'Neutral'],
    cosmetic_products: ['MAC Studio Fix', 'Tom Ford Eye Color Quad', 'YSL Rouge Pur Couture'],
    is_featured: true,
    created_at: '2025-01-18T10:00:00Z',
  },
  {
    id: 'm3',
    title: 'Kỷ yếu thanh xuân trong trẻo',
    tagline: 'Tươi tắn ngọt ngào · Lưu giữ thanh xuân',
    category: 'Kỷ yếu',
    aura_tone: 'Cam đào san hô (Coral Glow)',
    rating: 5,
    saved_count: 460,
    reviews_count: 56,
    duration_minutes: 45,
    standard_price: 300000,
    member_price: 270000,
    hero_image_url: 'https://cellamakeup.vn/blog/images/gt-3.jpg',
    gallery_images: ['https://cellamakeup.vn/blog/images/gt-3.jpg'],
    artist: 'Cella Team',
    description: 'Tone cam đào tươi trẻ, bền màu ngoài trời suốt ngày dài chụp ảnh áo dài kỷ yếu. Lớp nền mỏng nhẹ không bí da, đánh khối mũi tự nhiên.',
    suitable_face_shapes: ['Tròn', 'Trái xoan', 'Dài'],
    ideal_undertones: ['Cool', 'Neutral', 'Warm'],
    cosmetic_products: ['Clio Kill Cover Mesh Glow', '3CE Mood Recipe', 'Romand Juicy Lasting Tint'],
    is_featured: false,
    created_at: '2025-02-01T09:00:00Z',
  },
  {
    id: 'm4',
    title: 'Sự kiện & Hội nghị đẳng cấp',
    tagline: 'Chuyên nghiệp · Tự tin tỏa sáng',
    category: 'Sự kiện',
    aura_tone: 'Nude thanh lịch (Earth Tone)',
    rating: 5,
    saved_count: 290,
    reviews_count: 25,
    duration_minutes: 60,
    standard_price: 500000,
    member_price: 450000,
    hero_image_url: 'https://cellamakeup.vn/blog/images/gt-4.jpg',
    gallery_images: ['https://cellamakeup.vn/blog/images/gt-4.jpg'],
    artist: 'Cella Team',
    description: 'Tạo hình phong thái đĩnh đạc, hiện đại, phù hợp dẫn chương trình MC, diễn giả, doanh nhân dự hội nghị hoặc chụp profile doanh nghiệp.',
    suitable_face_shapes: ['Trái xoan', 'Vuông', 'Trái tim'],
    ideal_undertones: ['Neutral', 'Warm'],
    cosmetic_products: ['Estee Lauder Double Wear', 'Bobbi Brown Shimmer Brick', 'MAC Velvet Teddy'],
    is_featured: false,
    created_at: '2025-02-10T14:00:00Z',
  },
  {
    id: 'm5',
    title: 'Cô dâu hiện đại phương Tây',
    tagline: 'Haute Couture Bridal · Khối mắt sâu',
    category: 'Cô dâu',
    aura_tone: 'Khói Nude & Nhũ Champange',
    rating: 5,
    saved_count: 610,
    reviews_count: 64,
    duration_minutes: 100,
    standard_price: 900000,
    member_price: 800000,
    hero_image_url: 'https://cellamakeup.vn/images/hero-workshop.jpg',
    gallery_images: ['https://cellamakeup.vn/images/hero-workshop.jpg'],
    artist: 'Cella Hương Phượng',
    description: 'Đỉnh cao kỹ thuật tạo khối 3D chuẩn phương Tây kết hợp bờ môi căng bóng tràn đầy sức sống. Thích hợp cho đám cưới không gian tiệc ngoài trời hoặc khách sạn 5 sao.',
    suitable_face_shapes: ['Trái xoan', 'Góc cạnh', 'Kim cương'],
    ideal_undertones: ['Cool', 'Neutral'],
    cosmetic_products: ['Giorgio Armani Luminous Silk', 'Huda Beauty Nude Palette', 'Fenty Beauty Gloss Bomb'],
    is_featured: true,
    created_at: '2025-02-15T11:00:00Z',
  },
  {
    id: 'm6',
    title: 'Makeup cá nhân No-makeup Look',
    tagline: 'Tự nhiên như mộc · Tôn đường nét',
    category: 'Cá nhân',
    aura_tone: 'Hồng Baby tự nhiên',
    rating: 4,
    saved_count: 210,
    reviews_count: 19,
    duration_minutes: 40,
    standard_price: 250000,
    member_price: 220000,
    hero_image_url: 'https://cellamakeup.vn/images/gt-doi-ngu.jpg',
    gallery_images: ['https://cellamakeup.vn/images/gt-doi-ngu.jpg'],
    artist: 'Cella Team',
    description: 'Trang điểm như không trang điểm, làm đều màu da, che khuyết điểm tinh tế và chuốt mi cong tự nhiên giúp nàng rạng rỡ khi đi làm, cà phê, dạo phố.',
    suitable_face_shapes: ['Mọi dáng mặt'],
    ideal_undertones: ['Cool', 'Neutral', 'Warm'],
    cosmetic_products: ['Missha M Perfect Cover', 'Canmake Cream Cheek', 'Dior Lip Glow'],
    is_featured: false,
    created_at: '2025-02-20T08:30:00Z',
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

const LOCAL_STORAGE_KEY = 'cella_makeup_looks_v2';

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

  // Persistent looks state
  const [looks, setLooks] = useState<MakeupLook[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load looks from localStorage', e);
    }
    return INITIAL_LOOKS;
  });

  // Save to localStorage whenever looks change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(looks));
    } catch (e) {
      console.error('Failed to save looks to localStorage', e);
    }
  }, [looks]);

  // Sync with Supabase on mount if available
  useEffect(() => {
    const fetchSupabaseLooks = async () => {
      try {
        const { data, error } = await supabase
          .from('makeup_looks')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: MakeupLook[] = data.map((d: any) => ({
            id: d.id,
            title: d.title || 'Mẫu Makeup',
            tagline: d.tagline,
            category: d.category || 'Dự tiệc',
            aura_tone: d.aura_tone,
            rating: Number(d.rating) || 5,
            saved_count: d.saved_count || 100,
            reviews_count: d.reviews_count || 10,
            duration_minutes: d.duration_minutes || 60,
            standard_price: Number(d.standard_price) || 350000,
            member_price: Number(d.member_price) || 300000,
            hero_image_url: d.hero_image_url || 'https://cellamakeup.vn/blog/images/gt-1.jpg',
            gallery_images: d.gallery_images || [],
            artist: d.artist || 'Cella Hương Phượng',
            description: d.description || '',
            suitable_face_shapes: d.suitable_face_shapes || ['Trái xoan'],
            ideal_undertones: d.ideal_undertones || ['Neutral'],
            cosmetic_products: d.cosmetic_products || [],
            is_featured: !!d.is_featured,
            created_at: d.created_at,
          }));
          setLooks(mapped);
        }
      } catch (err) {
        // Fallback gracefully to localStorage
      }
    };
    fetchSupabaseLooks();
  }, []);

  // Modal states
  const [detailLook, setDetailLook] = useState<MakeupLook | null>(null);
  const [editLook, setEditLook] = useState<MakeupLook | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // File upload refs
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Quick Booking Modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<{
    title: string;
    price: number;
    artist?: string;
  } | null>(null);

  // Booking Form fields
  const [custName, setCustName] = useState(currentUser?.name || '');
  const [custPhone, setCustPhone] = useState(currentUser?.phone || '');
  const [bookDate, setBookDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [bookTimeSlot, setBookTimeSlot] = useState(TIME_SLOTS[1]);
  const [bookLocation, setBookLocation] = useState('STUDIO');
  const [bookNotes, setBookNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // State for Add Modal
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newCategory, setNewCategory] = useState('Cô dâu');
  const [newPrice, setNewPrice] = useState('');
  const [newMemberPrice, setNewMemberPrice] = useState('');
  const [newArtist, setNewArtist] = useState('Cella Hương Phượng');
  const [newDuration, setNewDuration] = useState('60');
  const [newAuraTone, setNewAuraTone] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Filtered looks
  const filtered = looks.filter((s) => {
    const matchCat = activeCategory === 'Tất cả' || s.category === activeCategory;
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.artist && s.artist.toLowerCase().includes(search.toLowerCase())) ||
      (s.tagline && s.tagline.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Handle Image File Upload (FileReader)
  const handleImageFile = (file: File, callback: (url: string) => void) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Vui lòng chọn ảnh dung lượng dưới 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        callback(e.target.result as string);
        showToast('✓ Tải ảnh thành công!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Open booking modal prefilled
  const handleOpenBooking = (title: string, price: number, artist: string = 'Cella Hương Phượng') => {
    setSelectedServiceForBooking({ title, price, artist });
    setBookingSuccess(false);
    setBookingModalOpen(true);
  };

  // Confirm booking
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
    showToast('🎉 Đặt lịch thành công! Đã lưu vào hệ thống.');
    setTimeout(() => {
      setBookingModalOpen(false);
      setBookingSuccess(false);
    }, 2000);
  };

  // Add new look
  const handleAddSample = async () => {
    if (!newTitle || !newPrice) {
      alert('Vui lòng điền Tên mẫu và Giá dịch vụ');
      return;
    }

    const numericPrice = parseInt(newPrice.replace(/\D/g, '')) || 350000;
    const numericMemberPrice = newMemberPrice ? parseInt(newMemberPrice.replace(/\D/g, '')) : Math.round(numericPrice * 0.9);

    const newLook: MakeupLook = {
      id: 'm' + Date.now(),
      title: newTitle,
      tagline: newTagline || 'Phong cách trang điểm hiện đại',
      category: newCategory,
      aura_tone: newAuraTone || 'Tự nhiên & Tươi sáng',
      rating: 5,
      saved_count: 1,
      reviews_count: 0,
      duration_minutes: parseInt(newDuration) || 60,
      standard_price: numericPrice,
      member_price: numericMemberPrice,
      hero_image_url: newImage || 'https://cellamakeup.vn/blog/images/gt-1.jpg',
      gallery_images: newImage ? [newImage] : ['https://cellamakeup.vn/blog/images/gt-1.jpg'],
      artist: newArtist || 'Cella Hương Phượng',
      description: newDescription || 'Mẫu makeup thiết kế độc quyền tại CELLA MAKEUP ACADEMY.',
      suitable_face_shapes: ['Trái xoan', 'Tròn'],
      ideal_undertones: ['Cool', 'Neutral', 'Warm'],
      cosmetic_products: ['Dior Backstage', 'MAC Velvet', 'NARS Sheer Glow'],
      is_featured: false,
      created_at: new Date().toISOString(),
    };

    setLooks((prev) => [newLook, ...prev]);

    // Async save to Supabase if table exists
    try {
      await supabase.from('makeup_looks').insert([
        {
          title: newLook.title,
          tagline: newLook.tagline,
          category: newLook.category,
          aura_tone: newLook.aura_tone,
          rating: newLook.rating,
          duration_minutes: newLook.duration_minutes,
          standard_price: newLook.standard_price,
          member_price: newLook.member_price,
          hero_image_url: newLook.hero_image_url,
          gallery_images: newLook.gallery_images,
          description: newLook.description,
          is_featured: newLook.is_featured,
        },
      ]);
    } catch (e) {
      // Ignored if table not ready
    }

    setShowAddModal(false);
    showToast('✓ Đã thêm mẫu makeup mới thành công!');

    // Reset inputs
    setNewTitle('');
    setNewTagline('');
    setNewPrice('');
    setNewMemberPrice('');
    setNewArtist('Cella Hương Phượng');
    setNewDuration('60');
    setNewAuraTone('');
    setNewDescription('');
    setNewImage('');
  };

  // Save edited look
  const handleSaveEdit = async () => {
    if (!editLook) return;

    setLooks((prev) => prev.map((item) => (item.id === editLook.id ? editLook : item)));

    // If detailLook is currently open and is this look, update it too
    if (detailLook && detailLook.id === editLook.id) {
      setDetailLook(editLook);
    }

    // Try Supabase update
    try {
      await supabase
        .from('makeup_looks')
        .update({
          title: editLook.title,
          tagline: editLook.tagline,
          category: editLook.category,
          aura_tone: editLook.aura_tone,
          standard_price: editLook.standard_price,
          member_price: editLook.member_price,
          duration_minutes: editLook.duration_minutes,
          hero_image_url: editLook.hero_image_url,
          description: editLook.description,
          artist: editLook.artist,
        })
        .eq('id', editLook.id);
    } catch (e) {
      // Ignored
    }

    setEditLook(null);
    showToast('✓ Đã lưu thay đổi giá & thông tin mẫu!');
  };

  // Delete look
  const handleDeleteLook = (id: string, title: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa mẫu "${title}" không?`)) {
      setLooks((prev) => prev.filter((item) => item.id !== id));
      if (detailLook?.id === id) setDetailLook(null);
      if (editLook?.id === id) setEditLook(null);
      showToast('✓ Đã xóa mẫu makeup');
    }
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
            className="w-9 h-9 rounded-full bg-[#5850EC] flex items-center justify-center active:scale-95 transition-transform shadow-md"
            title="Thêm mẫu makeup mới"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        }
      />

      {/* Floating Toast notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

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

        {/* ===== TAB 1: LOOKBOOK (MẪU MAKEUP) ===== */}
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
                <p className="text-sm">Chưa có mẫu nào trong danh mục này</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-3 text-[#5850EC] text-xs font-bold"
                >
                  + Thêm mẫu mới ngay
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {filtered.map((sample) => (
                  <div
                    key={sample.id}
                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative"
                  >
                    {/* Image Container with Click for Details */}
                    <div
                      onClick={() => setDetailLook(sample)}
                      className="aspect-[4/5] bg-slate-100 relative overflow-hidden cursor-pointer"
                    >
                      <img
                        src={sample.hero_image_url}
                        alt={sample.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://cellamakeup.vn/images/og-share.jpg';
                        }}
                      />

                      {/* Category Badge */}
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-[#5850EC] shadow-sm">
                          {sample.category}
                        </span>
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute top-2 right-2">
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-black/60 text-white flex items-center gap-0.5 backdrop-blur-sm">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          {sample.rating}.0
                        </span>
                      </div>

                      {/* View Detail overlay hint */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-[11px] font-bold">
                        <Eye className="w-4 h-4" />
                        <span>Xem chi tiết</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-2.5 space-y-2 flex-1 flex flex-col justify-between">
                      {/* Title & Artist */}
                      <div onClick={() => setDetailLook(sample)} className="cursor-pointer">
                        <p className="text-[12px] font-bold text-slate-900 leading-tight line-clamp-1 hover:text-[#5850EC] transition-colors">
                          {sample.title}
                        </p>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                          {sample.artist || 'Cella Hương Phượng'}
                        </p>
                      </div>

                      {/* Bottom Row: Price + SỬA GIÁ (RED BOX AREA) + Đặt lịch */}
                      <div className="pt-1.5 border-t border-slate-50 flex items-center justify-between gap-1">
                        {/* Price */}
                        <div className="shrink-0">
                          <span className="text-[12px] font-black text-[#5850EC] tracking-tight">
                            {sample.standard_price.toLocaleString('vi-VN')}đ
                          </span>
                        </div>

                        {/* Middle Action: SỬA GIÁ & ẢNH (RED BOX REQUESTED BY USER) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditLook(sample);
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-[#5850EC]/10 hover:text-[#5850EC] text-slate-600 rounded-lg text-[10px] font-bold flex items-center gap-0.5 transition-colors active:scale-95 border border-slate-200/80"
                          title="Sửa giá & cập nhật ảnh"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                          <span>Sửa</span>
                        </button>

                        {/* Right Action: Đặt lịch */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenBooking(sample.title, sample.standard_price, sample.artist);
                          }}
                          className="px-2 py-1 bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-900 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm transition-transform shrink-0"
                        >
                          <CalendarCheck className="w-3 h-3" />
                          <span>Đặt</span>
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

            {/* Dynamic Price list from looks state */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <p className="text-[12px] font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Dịch vụ theo mẫu lookbook
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="text-[11px] text-[#5850EC] font-bold hover:underline"
                >
                  + Thêm dịch vụ
                </button>
              </div>
              {looks.map((item, idx) => (
                <div
                  key={item.id}
                  className={`px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors ${
                    idx < looks.length - 1 ? 'border-b border-slate-50' : ''
                  }`}
                >
                  <div
                    onClick={() => setDetailLook(item)}
                    className="flex-1 min-w-0 pr-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <p className="text-[12px] font-bold text-slate-800 truncate">{item.title}</p>
                      {item.is_featured && (
                        <span className="px-1.5 py-0.2 bg-rose-50 text-rose-600 rounded text-[9px] font-bold border border-rose-100">
                          HOT
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                      {item.tagline || item.aura_tone || item.category}
                    </p>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-2">
                    <div>
                      <p className="text-[13px] font-black text-[#5850EC]">
                        {item.standard_price.toLocaleString('vi-VN')}đ
                      </p>
                      {item.member_price && item.member_price < item.standard_price && (
                        <p className="text-[10px] text-slate-400">
                          VIP: {item.member_price.toLocaleString('vi-VN')}đ
                        </p>
                      )}
                    </div>

                    {/* Sửa giá */}
                    <button
                      onClick={() => setEditLook(item)}
                      className="p-1.5 bg-slate-100 hover:bg-[#5850EC]/10 hover:text-[#5850EC] text-slate-600 rounded-lg text-[10px] font-bold transition-colors"
                      title="Sửa giá"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Đặt lịch */}
                    <button
                      onClick={() => handleOpenBooking(item.title, item.standard_price, item.artist)}
                      className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-xl text-[11px] font-bold active:scale-95 transition-transform"
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
                      value={selectedServiceForBooking?.title || (looks[0]?.title ?? 'Makeup dịch vụ')}
                      onChange={(e) => {
                        const found = looks.find((p) => p.title === e.target.value);
                        setSelectedServiceForBooking({
                          title: e.target.value,
                          price: found?.standard_price || 350000,
                          artist: found?.artist || 'Cella Hương Phượng',
                        });
                      }}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                    >
                      {looks.map((p) => (
                        <option key={p.id} value={p.title}>
                          {p.title} — {p.standard_price.toLocaleString('vi-VN')}đ
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
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: XEM CHI TIẾT MẪU MAKEUP (DETAIL MODAL)               */}
      {/* ============================================================ */}
      {detailLook && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto flex flex-col shadow-2xl">
            {/* Modal Header with Hero Image */}
            <div className="relative aspect-[16/11] bg-slate-900 overflow-hidden shrink-0">
              <img
                src={detailLook.hero_image_url}
                alt={detailLook.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://cellamakeup.vn/images/og-share.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

              {/* Close button */}
              <button
                onClick={() => setDetailLook(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Badges on hero */}
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#5850EC] text-white shadow-sm">
                  {detailLook.category}
                </span>
                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-400 text-slate-900 flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-slate-900 text-slate-900" />
                  {detailLook.rating}.0 ({detailLook.reviews_count || 30}+ đánh giá)
                </span>
              </div>

              {/* Title & Tagline on bottom of hero */}
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className="text-[18px] font-black leading-tight drop-shadow-md">
                  {detailLook.title}
                </h3>
                {detailLook.tagline && (
                  <p className="text-[12px] text-amber-300 font-medium mt-0.5 drop-shadow">
                    {detailLook.tagline}
                  </p>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4 text-xs flex-1">
              {/* Price & Duration bar */}
              <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-[#EFF4FF] to-indigo-50/50 rounded-2xl border border-indigo-100/70">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Mức giá dịch vụ
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xl font-black text-[#5850EC]">
                      {detailLook.standard_price.toLocaleString('vi-VN')}đ
                    </span>
                    {detailLook.member_price && detailLook.member_price < detailLook.standard_price && (
                      <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                        VIP: {detailLook.member_price.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Thời lượng
                  </span>
                  <p className="text-xs font-bold text-slate-800 flex items-center justify-end gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#5850EC]" />
                    {detailLook.duration_minutes || 60} phút
                  </p>
                </div>
              </div>

              {/* Artist Info */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center font-black text-amber-700 text-sm overflow-hidden border border-amber-200">
                    <img
                      src="https://cellamakeup.vn/blog/images/founder.jpg"
                      alt={detailLook.artist}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://cellamakeup.vn/images/chan-dung-cella.jpg';
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-slate-900">{detailLook.artist}</p>
                    <p className="text-[10px] text-slate-500">Master Artist · Cella Academy</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  ✓ Trực tiếp thực hiện
                </span>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Đặc điểm phong cách makeup
                </h4>
                <p className="text-slate-600 leading-relaxed text-[11px] bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  {detailLook.description || 'Phong cách trang điểm độc quyền tại Cella Makeup Academy, phối hợp hài hòa giữa kỹ thuật phủ nền mỏng nhẹ và nghệ thuật tạo khối tinh tế.'}
                </p>
              </div>

              {/* Tone màu & Dáng mặt phù hợp */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Tone màu chủ đạo</p>
                  <p className="text-[11px] font-bold text-slate-800">
                    {detailLook.aura_tone || 'Tự nhiên & Tươi sáng'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Dáng mặt thích hợp</p>
                  <p className="text-[11px] font-bold text-slate-800">
                    {detailLook.suitable_face_shapes?.join(', ') || 'Mọi dáng mặt'}
                  </p>
                </div>
              </div>

              {/* Mỹ phẩm sử dụng */}
              {detailLook.cosmetic_products && detailLook.cosmetic_products.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Mỹ phẩm cao cấp khuyên dùng</p>
                  <div className="flex flex-wrap gap-1.5">
                    {detailLook.cosmetic_products.map((prod, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-indigo-50/80 text-indigo-700 rounded-lg text-[10px] font-medium border border-indigo-100"
                      >
                        💄 {prod}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {/* Sửa giá & thông tin button */}
                <button
                  onClick={() => {
                    const lk = detailLook;
                    setDetailLook(null);
                    setEditLook(lk);
                  }}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#5850EC]" />
                  <span>Sửa Giá & Mẫu</span>
                </button>

                {/* Xóa button */}
                <button
                  onClick={() => handleDeleteLook(detailLook.id, detailLook.title)}
                  className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa Mẫu</span>
                </button>
              </div>

              {/* Đặt lịch ngay button */}
              <button
                onClick={() => {
                  const lk = detailLook;
                  setDetailLook(null);
                  handleOpenBooking(lk.title, lk.standard_price, lk.artist);
                }}
                className="w-full py-3 bg-[#5850EC] hover:bg-[#4338CA] active:scale-[0.98] text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Đặt Lịch Ngay ({detailLook.standard_price.toLocaleString('vi-VN')}đ)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: SỬA GIÁ VÀ TẢI ẢNH LÊN (EDIT MODAL)                  */}
      {/* ============================================================ */}
      {editLook && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-[16px] font-black text-slate-900 flex items-center gap-1.5">
                  <Edit2 className="w-4 h-4 text-[#5850EC]" /> Sửa Giá & Thông Tin Mẫu
                </h3>
                <p className="text-[11px] text-slate-500">Cập nhật giá, ảnh đại diện và thông tin lookbook</p>
              </div>
              <button
                onClick={() => setEditLook(null)}
                className="p-1.5 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* TẢI ẢNH LÊN / ĐỔI ẢNH (FILE UPLOAD) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Hình ảnh mẫu makeup <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-3 items-center">
                  <div className="w-20 h-24 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative group">
                    <img
                      src={editLook.hero_image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://cellamakeup.vn/images/og-share.jpg';
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={editFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageFile(file, (url) => {
                            setEditLook((prev) => (prev ? { ...prev, hero_image_url: url } : null));
                          });
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="w-full py-2 bg-[#5850EC]/10 hover:bg-[#5850EC]/20 text-[#5850EC] rounded-xl font-bold flex items-center justify-center gap-1.5 border border-[#5850EC]/20 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Tải ảnh mới từ máy</span>
                    </button>
                    <p className="text-[10px] text-slate-400">Hỗ trợ JPG, PNG, WEBP (tối đa 5MB)</p>
                  </div>
                </div>

                {/* Hoặc nhập link ảnh */}
                <div className="mt-2">
                  <input
                    type="text"
                    value={editLook.hero_image_url}
                    onChange={(e) =>
                      setEditLook((prev) => (prev ? { ...prev, hero_image_url: e.target.value } : null))
                    }
                    placeholder="Hoặc dán URL link ảnh..."
                    className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-[#5850EC]"
                  />
                </div>
              </div>

              {/* SỬA GIÁ (STANDARD & MEMBER PRICE) */}
              <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-2.5">
                <p className="font-bold text-[#5850EC] flex items-center gap-1 text-xs">
                  <DollarSign className="w-3.5 h-3.5" /> Cài đặt giá dịch vụ (VNĐ)
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Giá tiêu chuẩn *
                    </label>
                    <input
                      type="number"
                      value={editLook.standard_price}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setEditLook((prev) => (prev ? { ...prev, standard_price: val } : null));
                      }}
                      className="w-full h-10 px-3 bg-white border border-indigo-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Giá thành viên / VIP
                    </label>
                    <input
                      type="number"
                      value={editLook.member_price || 0}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setEditLook((prev) => (prev ? { ...prev, member_price: val } : null));
                      }}
                      className="w-full h-10 px-3 bg-white border border-indigo-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
                    />
                  </div>
                </div>
              </div>

              {/* Tên mẫu makeup */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tên mẫu makeup <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editLook.title}
                  onChange={(e) =>
                    setEditLook((prev) => (prev ? { ...prev, title: e.target.value } : null))
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
                />
              </div>

              {/* Danh mục */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Danh mục</label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.filter((c) => c !== 'Tất cả').map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() =>
                        setEditLook((prev) => (prev ? { ...prev, category: cat } : null))
                      }
                      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                        editLook.category === cat
                          ? 'bg-[#5850EC] text-white border-[#5850EC]'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chuyên viên & Thời lượng */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chuyên viên</label>
                  <input
                    type="text"
                    value={editLook.artist}
                    onChange={(e) =>
                      setEditLook((prev) => (prev ? { ...prev, artist: e.target.value } : null))
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thời lượng (phút)</label>
                  <input
                    type="number"
                    value={editLook.duration_minutes || 60}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 60;
                      setEditLook((prev) => (prev ? { ...prev, duration_minutes: val } : null));
                    }}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Tone màu */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tone màu chủ đạo</label>
                <input
                  type="text"
                  value={editLook.aura_tone || ''}
                  onChange={(e) =>
                    setEditLook((prev) => (prev ? { ...prev, aura_tone: e.target.value } : null))
                  }
                  placeholder="VD: Hồng đào & Ánh nhũ, Nude tây..."
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Mô tả phong cách */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả chi tiết</label>
                <textarea
                  rows={3}
                  value={editLook.description || ''}
                  onChange={(e) =>
                    setEditLook((prev) => (prev ? { ...prev, description: e.target.value } : null))
                  }
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
                />
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setEditLook(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="flex-1 py-3 bg-[#5850EC] hover:bg-[#4338CA] active:scale-95 text-white rounded-2xl font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Lưu Thay Đổi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: THÊM MẪU MAKEUP MỚI (VỚI TẢI ẢNH LÊN)               */}
      {/* ============================================================ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-[16px] font-black text-slate-900 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#5850EC]" /> Thêm Mẫu Makeup Mới
                </h3>
                <p className="text-[11px] text-slate-500">Tải ảnh lên và bổ sung vào bảng giá lookbook</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* TẢI ẢNH LÊN (FILE UPLOAD) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ảnh mẫu makeup <span className="text-rose-500">*</span>
                </label>

                {newImage ? (
                  <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-200">
                    <img
                      src={newImage}
                      alt="Preview"
                      className="w-16 h-20 object-cover rounded-xl shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <p className="font-bold text-emerald-600 text-xs">✓ Đã tải ảnh lên</p>
                      <button
                        type="button"
                        onClick={() => addFileInputRef.current?.click()}
                        className="text-[11px] text-[#5850EC] font-bold hover:underline block"
                      >
                        Đổi ảnh khác
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewImage('')}
                      className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => addFileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#5850EC] rounded-2xl p-4 text-center cursor-pointer bg-slate-50 hover:bg-[#5850EC]/5 transition-all group"
                  >
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-[#5850EC] mx-auto mb-1 transition-colors" />
                    <p className="font-bold text-slate-700 text-xs">Nhấn để tải ảnh từ máy / điện thoại</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP (tối đa 5MB)</p>
                  </div>
                )}

                <input
                  type="file"
                  ref={addFileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageFile(file, setNewImage);
                  }}
                />

                {/* Hoặc nhập link ảnh */}
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Hoặc dán URL link ảnh..."
                  className="w-full mt-1.5 h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-[#5850EC]"
                />
              </div>

              {/* Tên mẫu */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tên mẫu makeup <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="VD: Cô dâu cổ điển hoàng gia..."
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Khẩu hiệu / Phong cách ngắn</label>
                <input
                  type="text"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  placeholder="VD: Lộng lẫy · Tôn vinh nét đẹp phương Đông"
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Danh mục */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Danh mục</label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.filter((c) => c !== 'Tất cả').map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setNewCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                        newCategory === cat
                          ? 'bg-[#5850EC] text-white border-[#5850EC]'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Giá tiêu chuẩn & Giá VIP */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Giá dịch vụ (VNĐ) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="VD: 500000"
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá VIP / Thành viên</label>
                  <input
                    type="text"
                    value={newMemberPrice}
                    onChange={(e) => setNewMemberPrice(e.target.value)}
                    placeholder="VD: 450000"
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none font-bold"
                  />
                </div>
              </div>

              {/* Chuyên viên & Thời lượng */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chuyên viên</label>
                  <input
                    type="text"
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    placeholder="Cella Hương Phượng"
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thời lượng (phút)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="60"
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả chi tiết phong cách</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Điểm nhấn lớp nền, kỹ thuật mắt, phong thái..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAddSample}
                disabled={!newTitle || !newPrice}
                className="flex-1 py-3 bg-[#5850EC] hover:bg-[#4338CA] active:scale-95 text-white rounded-2xl font-bold shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Mẫu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: QUICK BOOKING MODAL (ĐẶT LỊCH NHANH)                 */}
      {/* ============================================================ */}
      {bookingModalOpen && selectedServiceForBooking && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
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
              <div className="space-y-3 text-xs">
                {/* Selected service summary */}
                <div className="p-3 rounded-2xl bg-[#5850EC]/10 border border-[#5850EC]/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#5850EC] uppercase">Dịch vụ đã chọn</span>
                    <p className="text-[13px] font-black text-slate-900">{selectedServiceForBooking.title}</p>
                    <p className="text-[11px] text-slate-500">
                      Chuyên viên: {selectedServiceForBooking.artist || 'Cella Hương Phượng'}
                    </p>
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
    </div>
  );
};
