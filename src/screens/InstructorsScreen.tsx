import React, { useState, useEffect, useRef } from 'react';
import { ScreenId, Instructor } from '../types';
import { MobileHeader } from '../components/common/MobileHeader';
import {
  GraduationCap,
  Star,
  Search,
  Award,
  BookOpen,
  Calendar,
  Phone,
  MessageCircle,
  Plus,
  X,
  Edit2,
  Trash2,
  Upload,
  Check,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Clock,
  Heart,
  User,
  Users,
  Eye,
  Camera
} from 'lucide-react';

interface InstructorsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
  currentUser?: any;
}

const INITIAL_INSTRUCTORS: Instructor[] = [
  {
    id: 'ins-1',
    name: 'Cella Hương Phượng',
    title: 'Nhà Sáng Lập & Master Trainer Trưởng',
    role: 'MASTER',
    avatar: 'https://cellamakeup.vn/blog/images/founder.jpg',
    phone: '096 116 1994',
    email: 'huongphuong@cellamakeup.vn',
    experienceYears: 9,
    studentsCount: 520,
    rating: 5.0,
    specialties: [
      'Makeup Cô dâu Haute Couture',
      'Nền Glass Skin 16h kiềm dầu',
      'Khóa Chuyên Nghiệp 40 buổi',
      'Dự Án 0 Đồng - Khóa Nền Tảng'
    ],
    achievements: [
      '🏆 Bàn Tay Vàng Makeup Châu Á 2025 (Asia Beauty Festival)',
      '⭐ #1 Google Thái Bình với 5.0★ và 32 đánh giá thực',
      '🎓 Tốt nghiệp QTKD — Đại học Thái Bình (2024)',
      '📜 Chứng chỉ Sư phạm dạy nghề — CĐ Nghề số 1, Bộ Quốc Phòng'
    ],
    bio: 'Tôi không sinh ra trong một gia đình làm nghề đẹp. Tôi đến với cây cọ vì một lý do rất đời: cần một cái nghề nuôi được mình và thích nhìn thấy một người phụ nữ sáng lên khi soi gương. Nhiều năm sau, cái nghề ấy trở thành CELLA MAKEUP ACADEMY — nơi dạy lại đúng những gì mình đã đi qua.',
    coursesTeaching: [
      'Khóa Đào Tạo Nghề Makeup Chuyên Nghiệp (40 buổi)',
      'Dự Án 0 Đồng - Khóa Nền Tảng Cho Người Mới (20 buổi)',
      'Workshop Nâng Cao Kỹ Thuật Đánh Nền & Tạo Khối'
    ],
    zaloPhone: '0961161994',
  },
  {
    id: 'ins-2',
    name: 'Trần Thị Lan Anh',
    title: 'Master Trainer · Kỹ Thuật Nền & Điêu Khắc',
    role: 'MASTER',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    phone: '0766 311 313',
    email: 'lananh@cellamakeup.vn',
    experienceYears: 6,
    studentsCount: 280,
    rating: 4.9,
    specialties: [
      'Điêu khắc chân mày 9D Microblading',
      'Kỹ thuật đánh nền chống nước bền 16h',
      'Makeup tiệc & dạ hội sang trọng',
      'Đào tạo thực hành 1 kèm 1'
    ],
    achievements: [
      '🏆 Giải Nhì Makeup Phong Cách Á Đông 2023',
      '📜 Chứng chỉ Master PMU & Makeup Quốc Tế',
      '⭐ Đào tạo hơn 280 học viên thành nghề tại miền Bắc'
    ],
    bio: 'Luôn tỉ mỉ đến từng chi tiết và coi việc truyền nghề là trách nhiệm lớn lao. Lan Anh đồng hành kèm cặp từng học viên từ cách cầm cọ chuẩn xác đến kỹ thuật xử lý da khuyết điểm phức tạp.',
    coursesTeaching: [
      'Khóa Makeup Chuyên Nghiệp (Học phần Kỹ thuật Cốt lõi)',
      'Khóa Makeup Dự Tiệc & Sự Kiện Nâng Cao'
    ],
    zaloPhone: '0766311313',
  },
  {
    id: 'ins-3',
    name: 'Nguyễn Thu Trang',
    title: 'Giảng Viên · Makeup Cá Nhân & Phong Thái',
    role: 'TRAINER',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    phone: '096 116 1994',
    email: 'thutrang@cellamakeup.vn',
    experienceYears: 5,
    studentsCount: 190,
    rating: 5.0,
    specialties: [
      'Makeup cá nhân hàng ngày (Clean Girl / No-makeup)',
      'Chăm sóc da & phục hồi trước trang điểm',
      'Định hình phong cách cá nhân',
      'Workshop Doanh Nghiệp'
    ],
    achievements: [
      '🌟 Chuyên gia đào tạo Workshop cho hơn 20 doanh nghiệp',
      '📜 Chứng nhận Chuyên viên Skincare & Color Analysis Hàn Quốc'
    ],
    bio: 'Thu Trang giúp hàng trăm chị em phụ nữ vượt qua sự tự ti khi nhìn vào gương. Học trang điểm cùng Trang nhẹ nhàng, dễ hiểu và ứng dụng được ngay vào cuộc sống hàng ngày.',
    coursesTeaching: [
      'Khóa Makeup Cá Nhân Cơ Bản (3 buổi)',
      'Khóa Makeup Cá Nhân Nâng Cao (5 buổi)',
      'Workshop Makeup & Phong Thái Công Sở'
    ],
    zaloPhone: '0961161994',
  },
  {
    id: 'ins-4',
    name: 'Hoàng Minh Anh',
    title: 'Giảng Viên · Kỹ Thuật Khối 3D & Eyeliner',
    role: 'TRAINER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    phone: '096 116 1994',
    email: 'minhanh@cellamakeup.vn',
    experienceYears: 5,
    studentsCount: 160,
    rating: 4.9,
    specialties: [
      'Makeup Khói Tây Western Glam',
      'Kỹ thuật tạo khối 3D góc cạnh',
      'Trang điểm biểu diễn & Lookbook thời trang',
      'Bắt trend phong cách Y2K & Douyin'
    ],
    achievements: [
      '🎨 Makeup Artist chính cho 15+ sàn diễn thời trang Fashion Week',
      '⭐ Chuyên gia tạo hình cho MC và KOLs miền Bắc'
    ],
    bio: 'Đam mê sự phá cách và sắc sảo, Minh Anh hướng dẫn học viên cách tạo điểm nhấn nổi bật trên gương mặt để tự tin làm việc tại các studio áo cưới và đoàn làm phim.',
    coursesTeaching: [
      'Học phần Khói Tây & Fashion Look trong Khóa Chuyên Nghiệp',
      'Khóa Nâng Cao Tạo Khối & Eyeliner'
    ],
    zaloPhone: '0961161994',
  },
  {
    id: 'ins-5',
    name: 'Lê Mai Phương',
    title: 'Trợ Giảng Cao Cấp · Quản Lý Thực Hành',
    role: 'ASSISTANT',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    phone: '096 116 1994',
    email: 'maiphuong@cellamakeup.vn',
    experienceYears: 3,
    studentsCount: 120,
    rating: 5.0,
    specialties: [
      'Kèm cặp thực hành trên mẫu thật 1:1',
      'Vệ sinh & bảo quản cọ mỹ phẩm chuẩn y khoa',
      'Hỗ trợ học viên Dự Án 0 Đồng',
      'Quản trị dụng cụ cốp đồ nghề'
    ],
    achievements: [
      '⭐ Cựu thủ khoa Khóa K18 CELLA MAKEUP ACADEMY',
      '📜 Chứng nhận Thực hành chuẩn sư phạm dạy nghề'
    ],
    bio: 'Từng là học viên trưởng thành từ chính chiếc nôi CELLA, Mai Phương hiểu rõ từng khó khăn bỡ ngỡ của các bạn mới bắt đầu để tận tình chỉ dẫn và hỗ trợ suốt quá trình học tập.',
    coursesTeaching: [
      'Trợ giảng Khóa Nền Tảng - Dự Án 0 Đồng',
      'Phụ trách phòng thực hành Studio'
    ],
    zaloPhone: '0961161994',
  }
];

const LOCAL_STORAGE_KEY = 'cella_instructors_v1';

export const InstructorsScreen: React.FC<InstructorsScreenProps> = ({
  onNavigate,
  onBack,
  currentUser,
}) => {
  const [instructors, setInstructors] = useState<Instructor[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load instructors from localStorage', e);
    }
    return INITIAL_INSTRUCTORS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(instructors));
    } catch (e) {
      console.error('Failed to save instructors to localStorage', e);
    }
  }, [instructors]);

  const [activeTab, setActiveTab] = useState<'ALL' | 'MASTER' | 'TRAINER' | 'ASSISTANT'>('ALL');
  const [search, setSearch] = useState('');

  // Modals
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [editInstructor, setEditInstructor] = useState<Instructor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add modal state
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newRole, setNewRole] = useState<'MASTER' | 'TRAINER' | 'ASSISTANT'>('TRAINER');
  const [newExp, setNewExp] = useState('5');
  const [newStudents, setNewStudents] = useState('100');
  const [newPhone, setNewPhone] = useState('096 116 1994');
  const [newEmail, setNewEmail] = useState('');
  const [newSpecialties, setNewSpecialties] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newAvatar, setNewAvatar] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Filtered instructors
  const filtered = instructors.filter((ins) => {
    const matchTab = activeTab === 'ALL' || ins.role === activeTab;
    const matchSearch =
      ins.name.toLowerCase().includes(search.toLowerCase()) ||
      ins.title.toLowerCase().includes(search.toLowerCase()) ||
      ins.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchTab && matchSearch;
  });

  // Handle avatar upload
  const handleAvatarFile = (file: File, callback: (url: string) => void) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Vui lòng chọn ảnh dung lượng dưới 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        callback(e.target.result as string);
        showToast('✓ Tải ảnh giảng viên thành công!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Add instructor
  const handleAddInstructor = () => {
    if (!newName || !newTitle) {
      alert('Vui lòng điền Họ tên và Chức danh giảng viên');
      return;
    }

    const created: Instructor = {
      id: 'ins-' + Date.now(),
      name: newName,
      title: newTitle,
      role: newRole,
      avatar: newAvatar || 'https://cellamakeup.vn/blog/images/founder.jpg',
      experienceYears: parseInt(newExp) || 3,
      studentsCount: parseInt(newStudents) || 50,
      rating: 5.0,
      phone: newPhone || '096 116 1994',
      email: newEmail || 'contact@cellamakeup.vn',
      specialties: newSpecialties
        ? newSpecialties.split(',').map((s) => s.trim()).filter(Boolean)
        : ['Makeup chuyên nghiệp', 'Thực hành 1 kèm 1'],
      achievements: ['Chứng chỉ Giảng viên Chuyên Nghiệp CELLA'],
      bio: newBio || 'Giảng viên giàu kinh nghiệm và tận tâm tại CELLA MAKEUP ACADEMY.',
      coursesTeaching: ['Khóa Đào Tạo Nghề Makeup Chuyên Nghiệp'],
      zaloPhone: newPhone.replace(/\s+/g, ''),
    };

    setInstructors((prev) => [created, ...prev]);
    setShowAddModal(false);
    showToast('✓ Đã thêm giảng viên mới thành công!');

    // Reset
    setNewName('');
    setNewTitle('');
    setNewExp('5');
    setNewStudents('100');
    setNewSpecialties('');
    setNewBio('');
    setNewAvatar('');
  };

  // Save edit
  const handleSaveEdit = () => {
    if (!editInstructor) return;
    setInstructors((prev) =>
      prev.map((ins) => (ins.id === editInstructor.id ? editInstructor : ins))
    );
    if (selectedInstructor?.id === editInstructor.id) {
      setSelectedInstructor(editInstructor);
    }
    setEditInstructor(null);
    showToast('✓ Đã lưu thay đổi thông tin giảng viên!');
  };

  // Delete
  const handleDeleteInstructor = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa giảng viên "${name}" không?`)) {
      setInstructors((prev) => prev.filter((i) => i.id !== id));
      if (selectedInstructor?.id === id) setSelectedInstructor(null);
      if (editInstructor?.id === id) setEditInstructor(null);
      showToast('✓ Đã xóa giảng viên');
    }
  };

  return (
    <div className="min-h-full bg-[#F8F9FF] pb-24 text-slate-900 relative">
      <MobileHeader
        title="Đội Ngũ Giảng Viên"
        subtitle="CELLA MAKEUP ACADEMY"
        showBack={true}
        onBack={onBack || (() => onNavigate('academy'))}
        rightAction={
          <button
            onClick={() => setShowAddModal(true)}
            className="w-9 h-9 rounded-full bg-[#5850EC] flex items-center justify-center text-white active:scale-95 transition-transform shadow-md"
            title="Thêm giảng viên mới"
          >
            <Plus className="w-5 h-5" />
          </button>
        }
      />

      {/* Floating Toast */}
      {toast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      <div className="px-4 pt-1 space-y-3.5">
        {/* Hero banner */}
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#0A0A0C] via-[#1E1B4B] to-[#312E81] text-white p-5 space-y-3 relative shadow-md">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-bold uppercase tracking-widest">
              <GraduationCap className="w-4 h-4" />
              <span>Học Viện CELLA Thái Bình</span>
            </div>
            <h2 className="text-[18px] font-black mt-1 leading-snug">
              Đội Ngũ Master & Giảng Viên
            </h2>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Trực tiếp đào tạo thực chiến 1 kèm 1 · Cầm tay chỉ việc · Cam kết 100% ra nghề tự tin mở tiệm.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
            <div>
              <span className="text-base font-black text-amber-400 block">9+ Năm</span>
              <span className="text-[9px] text-slate-300 uppercase tracking-wider">Kinh nghiệm</span>
            </div>
            <div>
              <span className="text-base font-black text-amber-400 block">500+</span>
              <span className="text-[9px] text-slate-300 uppercase tracking-wider">Học viên tốt nghiệp</span>
            </div>
            <div>
              <span className="text-base font-black text-amber-400 block">100%</span>
              <span className="text-[9px] text-slate-300 uppercase tracking-wider">Có nghề vững</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên, chuyên môn, chức danh..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30 shadow-sm"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {[
            { id: 'ALL', label: 'Tất cả giảng viên' },
            { id: 'MASTER', label: 'Master Trainer' },
            { id: 'TRAINER', label: 'Giảng viên chính' },
            { id: 'ASSISTANT', label: 'Trợ giảng' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                activeTab === t.id
                  ? 'bg-[#5850EC] text-white border-[#5850EC] shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* List of Instructors */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-6 text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-xs">Không tìm thấy giảng viên phù hợp</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-3 text-[#5850EC] text-xs font-bold"
              >
                + Thêm giảng viên mới
              </button>
            </div>
          ) : (
            filtered.map((ins) => (
              <div
                key={ins.id}
                className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                {/* Top: Avatar, Name, Title, Badges */}
                <div className="flex items-start gap-3.5">
                  <div
                    onClick={() => setSelectedInstructor(ins)}
                    className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 cursor-pointer relative group/img shadow-sm"
                  >
                    <img
                      src={ins.avatar}
                      alt={ins.name}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://cellamakeup.vn/images/chan-dung-cella.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          ins.role === 'MASTER'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : ins.role === 'TRAINER'
                            ? 'bg-indigo-50 text-[#5850EC] border border-indigo-100'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}
                      >
                        {ins.role === 'MASTER' ? 'Master' : ins.role === 'TRAINER' ? 'Giảng viên' : 'Trợ giảng'}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[10px]">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{ins.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => setSelectedInstructor(ins)}
                      className="text-[14px] font-black text-slate-900 mt-1 truncate cursor-pointer hover:text-[#5850EC] transition-colors"
                    >
                      {ins.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">{ins.title}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-xl text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-[#5850EC]" />
                    <span><strong>{ins.experienceYears}</strong> năm kinh nghiệm</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span><strong>{ins.studentsCount}+</strong> học viên đã học</span>
                  </div>
                </div>

                {/* Specialties pills */}
                <div className="flex flex-wrap gap-1">
                  {ins.specialties.slice(0, 3).map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-[#5850EC]/10 text-[#5850EC]"
                    >
                      {spec}
                    </span>
                  ))}
                  {ins.specialties.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded-lg text-[10px] text-slate-400">
                      +{ins.specialties.length - 3}
                    </span>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${ins.phone?.replace(/\s+/g, '') || '0961161994'}`}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center gap-1 transition-colors"
                      title="Gọi điện tư vấn"
                    >
                      <Phone className="w-3 h-3 text-amber-600" />
                      <span>Gọi</span>
                    </a>
                    <a
                      href={`https://zalo.me/${ins.zaloPhone || '0961161994'}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                      title="Chat Zalo"
                    >
                      <MessageCircle className="w-3 h-3 text-blue-600" />
                      <span>Zalo</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Sửa */}
                    <button
                      onClick={() => setEditInstructor(ins)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold"
                      title="Sửa thông tin"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Xem chi tiết */}
                    <button
                      onClick={() => setSelectedInstructor(ins)}
                      className="px-3 py-1.5 bg-[#5850EC] hover:bg-[#4338CA] text-white rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
                    >
                      <span>Hồ sơ</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ======================================================= */}
      {/* MODAL 1: XEM CHI TIẾT HỒ SƠ GIẢNG VIÊN                 */}
      {/* ======================================================= */}
      {selectedInstructor && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto flex flex-col shadow-2xl">
            {/* Header Hero */}
            <div className="relative p-5 bg-gradient-to-br from-[#0A0A0C] via-[#1E1B4B] to-[#312E81] text-white">
              <button
                onClick={() => setSelectedInstructor(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3.5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-lg shrink-0">
                  <img
                    src={selectedInstructor.avatar}
                    alt={selectedInstructor.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://cellamakeup.vn/images/chan-dung-cella.jpg';
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 inline-block mb-1">
                    {selectedInstructor.role === 'MASTER'
                      ? 'Master Trainer'
                      : selectedInstructor.role === 'TRAINER'
                      ? 'Giảng Viên Chính'
                      : 'Trợ Giảng Cao Cấp'}
                  </span>
                  <h3 className="text-[17px] font-black truncate">{selectedInstructor.name}</h3>
                  <p className="text-[11px] text-indigo-200 truncate mt-0.5">
                    {selectedInstructor.title}
                  </p>

                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-amber-300">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <strong>{selectedInstructor.rating.toFixed(1)}</strong> (150+ đánh giá)
                    </span>
                    <span>•</span>
                    <span>{selectedInstructor.experienceYears} năm KN</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 text-xs flex-1">
              {/* Thành tích & Giải thưởng */}
              {selectedInstructor.achievements && selectedInstructor.achievements.length > 0 && (
                <div className="space-y-1.5 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-100">
                  <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" /> Giải thưởng & Bằng cấp chuyên môn
                  </h4>
                  <ul className="space-y-1 text-[11px] text-slate-700">
                    {selectedInstructor.achievements.map((ach, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tiểu sử / Lời chia sẻ */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#5850EC]" /> Triết lý đào tạo & Tiểu sử
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100 italic">
                  "{selectedInstructor.bio || 'Luôn đồng hành cùng từng học viên trên con đường chinh phục đam mê làm đẹp.'}"
                </p>
              </div>

              {/* Chuyên môn thế mạnh */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Chuyên môn thế mạnh
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedInstructor.specialties.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-[#5850EC]/10 text-[#5850EC] border border-[#5850EC]/20"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Các khóa học đang phụ trách */}
              {selectedInstructor.coursesTeaching && selectedInstructor.coursesTeaching.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#5850EC]" /> Khóa học đang trực tiếp giảng dạy
                  </h4>
                  <div className="space-y-1.5">
                    {selectedInstructor.coursesTeaching.map((c, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                      >
                        <span className="text-[11px] font-semibold text-slate-800">{c}</span>
                        <span className="text-[10px] font-bold text-[#5850EC]">Đang mở</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${selectedInstructor.phone?.replace(/\s+/g, '') || '0961161994'}`}
                  className="py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi {selectedInstructor.phone || '096 116 1994'}</span>
                </a>
                <a
                  href={`https://zalo.me/${selectedInstructor.zaloPhone || '0961161994'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Nhắn Zalo tư vấn</span>
                </a>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const ins = selectedInstructor;
                    setSelectedInstructor(null);
                    setEditInstructor(ins);
                  }}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Sửa thông tin</span>
                </button>
                <button
                  onClick={() =>
                    handleDeleteInstructor(selectedInstructor.id, selectedInstructor.name)
                  }
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL 2: THÊM GIẢNG VIÊN MỚI                           */}
      {/* ======================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-[16px] font-black text-slate-900 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#5850EC]" /> Thêm Giảng Viên Mới
                </h3>
                <p className="text-[11px] text-slate-500">Cập nhật vào danh sách đội ngũ học viện CELLA</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Ảnh đại diện */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ảnh chân dung giảng viên</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    <img
                      src={newAvatar || 'https://cellamakeup.vn/blog/images/founder.jpg'}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAvatarFile(file, setNewAvatar);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-[#5850EC]/10 text-[#5850EC] rounded-xl font-bold flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Chọn ảnh từ máy</span>
                    </button>
                    <p className="text-[10px] text-slate-400">JPG, PNG, WEBP tối đa 5MB</p>
                  </div>
                </div>
              </div>

              {/* Tên & Chức danh */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Họ và tên giảng viên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="VD: Cella Hương Phượng"
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5850EC]/30"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Chức danh / Vị trí <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="VD: Master Trainer · Chuyên viên Cô dâu"
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Vai trò */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cấp bậc giảng viên</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'MASTER', label: 'Master Trainer' },
                    { id: 'TRAINER', label: 'Giảng viên' },
                    { id: 'ASSISTANT', label: 'Trợ giảng' },
                  ].map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setNewRole(r.id as any)}
                      className={`py-2 rounded-xl border text-[11px] font-bold transition-all ${
                        newRole === r.id
                          ? 'bg-[#5850EC] text-white border-[#5850EC]'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kinh nghiệm & Học viên */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số năm kinh nghiệm</label>
                  <input
                    type="number"
                    value={newExp}
                    onChange={(e) => setNewExp(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số học viên đã dạy</label>
                  <input
                    type="number"
                    value={newStudents}
                    onChange={(e) => setNewStudents(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* SĐT */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại / Zalo</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="096 116 1994"
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Chuyên môn */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Chuyên môn thế mạnh (ngăn cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={newSpecialties}
                  onChange={(e) => setNewSpecialties(e.target.value)}
                  placeholder="Makeup Cô Dâu, Đánh Nền Glass Skin, Eyeliner..."
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Tiểu sử */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiểu sử & Triết lý nghề</label>
                <textarea
                  rows={2}
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  placeholder="Giới thiệu kinh nghiệm và phong cách giảng dạy..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAddInstructor}
                disabled={!newName || !newTitle}
                className="flex-1 py-3 bg-[#5850EC] hover:bg-[#4338CA] text-white rounded-2xl font-bold shadow-md disabled:opacity-50"
              >
                ✓ Thêm Giảng Viên
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL 3: SỬA THÔNG TIN GIẢNG VIÊN                      */}
      {/* ======================================================= */}
      {editInstructor && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-[16px] font-black text-slate-900 flex items-center gap-1.5">
                  <Edit2 className="w-4 h-4 text-[#5850EC]" /> Sửa Thông Tin Giảng Viên
                </h3>
                <p className="text-[11px] text-slate-500">Cập nhật hồ sơ giảng viên học viện</p>
              </div>
              <button
                onClick={() => setEditInstructor(null)}
                className="p-1.5 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Ảnh đại diện */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ảnh chân dung</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    <img
                      src={editInstructor.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      ref={editFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleAvatarFile(file, (url) =>
                            setEditInstructor((prev) => (prev ? { ...prev, avatar: url } : null))
                          );
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-[#5850EC]/10 text-[#5850EC] rounded-xl font-bold flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Đổi ảnh chân dung</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tên */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={editInstructor.name}
                  onChange={(e) =>
                    setEditInstructor((prev) => (prev ? { ...prev, name: e.target.value } : null))
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Chức danh */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chức danh</label>
                <input
                  type="text"
                  value={editInstructor.title}
                  onChange={(e) =>
                    setEditInstructor((prev) => (prev ? { ...prev, title: e.target.value } : null))
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Vai trò */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cấp bậc</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'MASTER', label: 'Master' },
                    { id: 'TRAINER', label: 'Giảng viên' },
                    { id: 'ASSISTANT', label: 'Trợ giảng' },
                  ].map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() =>
                        setEditInstructor((prev) => (prev ? { ...prev, role: r.id } : null))
                      }
                      className={`py-2 rounded-xl border text-[11px] font-bold ${
                        editInstructor.role === r.id
                          ? 'bg-[#5850EC] text-white border-[#5850EC]'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kinh nghiệm & Học viên */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số năm kinh nghiệm</label>
                  <input
                    type="number"
                    value={editInstructor.experienceYears}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setEditInstructor((prev) =>
                        prev ? { ...prev, experienceYears: val } : null
                      );
                    }}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số học viên</label>
                  <input
                    type="number"
                    value={editInstructor.studentsCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setEditInstructor((prev) =>
                        prev ? { ...prev, studentsCount: val } : null
                      );
                    }}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* SĐT */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại / Zalo</label>
                <input
                  type="text"
                  value={editInstructor.phone || ''}
                  onChange={(e) =>
                    setEditInstructor((prev) => (prev ? { ...prev, phone: e.target.value } : null))
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Tiểu sử */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiểu sử</label>
                <textarea
                  rows={3}
                  value={editInstructor.bio || ''}
                  onChange={(e) =>
                    setEditInstructor((prev) => (prev ? { ...prev, bio: e.target.value } : null))
                  }
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setEditInstructor(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="flex-1 py-3 bg-[#5850EC] hover:bg-[#4338CA] text-white rounded-2xl font-bold shadow-md"
              >
                ✓ Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
