import React, { useState, useRef, useEffect } from 'react';
import { ScreenId, Staff, UserAccount } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { supabase } from '../config/supabase';
import {
  ChevronLeft, Camera, Phone, Mail, MapPin, Building2, Briefcase,
  Calendar, Shield, Award, Star, CheckCircle2, QrCode, Edit3, X,
  Save, Check, Lock, LogOut, Share2, Sparkles, DollarSign,
  TrendingUp, Clock, FileText, AlertCircle, Heart, Eye, Users,
  ExternalLink, Key, Smartphone, MessageCircle, ChevronRight, Copy,
  Menu, ChevronDown, Wallet, Crown, CheckCircle
} from 'lucide-react';

interface ProfileScreenProps {
  currentUser?: Staff | UserAccount;
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
  onLogout?: () => void;
  onSwitchAccount?: () => void;
  onBookPost?: (post: any) => void;
  bookings?: any[];
}

const STORAGE_KEY = 'cella_staff_profile_data_v3';

const ROLE_DISPLAY_NAMES: Record<string, { label: string; badgeBg: string; textColor: string }> = {
  SUPER_ADMIN: { label: 'Ban Quản Trị • Sáng Lập', badgeBg: 'bg-amber-50 border-amber-200', textColor: 'text-amber-800' },
  ADMIN: { label: 'Quản Lý Điều Hành Cơ Sở', badgeBg: 'bg-emerald-50 border-emerald-200', textColor: 'text-emerald-800' },
  MASTER_ARTIST: { label: 'Master Trainer • Nghệ Nhân Trưởng', badgeBg: 'bg-[#EAF2EC] border-[#264736]/30', textColor: 'text-[#264736]' },
  MASTER: { label: 'Master Trainer • Nghệ Nhân Trưởng', badgeBg: 'bg-[#EAF2EC] border-[#264736]/30', textColor: 'text-[#264736]' },
  ARTIST: { label: 'Senior Artist • Nghệ Sĩ Makeup', badgeBg: 'bg-rose-50 border-rose-200', textColor: 'text-rose-700' },
  SALES_CONSULTANT: { label: 'Chuyên Viên Tư Vấn & Tuyển Sinh', badgeBg: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700' },
  SALES: { label: 'Chuyên Viên Tư Vấn & Tuyển Sinh', badgeBg: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700' },
  ACADEMY_TRAINER: { label: 'Giảng Viên Đào Tạo Học Viện', badgeBg: 'bg-purple-50 border-purple-200', textColor: 'text-purple-700' },
  CUSTOMER: { label: 'Khách Hàng Thành Viên', badgeBg: 'bg-slate-50 border-slate-200', textColor: 'text-slate-700' },
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  onNavigate,
  onBack,
  onLogout,
  onSwitchAccount,
}) => {
  const baseUser = currentUser || CURRENT_USER;

  // Profile data initial state (aligned with current database schema)
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${baseUser.id || 'default'}`);
      if (saved) return JSON.parse(saved);
    } catch {}

    return {
      id: baseUser.id || 'NV-8826',
      employeeCode: baseUser.employeeCode || 'CELLA-8826',
      fullName: baseUser.fullName || 'Hương Phượng CELLA',
      role: baseUser.role || 'SUPER_ADMIN',
      title: 'Nhà Sáng Lập & Giám Đốc Nghệ Thuật CELLA',
      phone: baseUser.phone || '0908 654 321',
      email: baseUser.email || 'huongphuong@cellamakeup.vn',
      avatarUrl: baseUser.avatarUrl || 'https://cellamakeup.vn/images/chan-dung-cella.jpg',
      coverUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80',
      department: baseUser.department || 'Ban Điều Hành & Học Viện CELLA',
      branch: baseUser.branch || '37–39 Phan Bội Châu, P. Lê Hồng Phong, TP. Thái Bình',
      joinedDate: baseUser.joinedDate || '15/03/2021',
      birthday: '18/06/1994',
      gender: 'Nữ',
      idCard: '079194008826',
      idCardDate: '20/08/2021',
      idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
      address: '37–39 Phan Bội Châu, P. Lê Hồng Phong, TP. Thái Bình',
      emergencyContact: '0912 345 678 (Người thân)',
      bankName: 'Techcombank - CN Thái Bình',
      bankAccount: '1903 8888 6666 99',
      bankHolder: (baseUser.fullName || 'HƯƠNG PHƯỢNG CELLA').toUpperCase(),
      contractType: 'Hợp đồng lao động dài hạn / Ban Điều Hành',
      contractNumber: 'HĐLĐ-CELLA/2021-01',
      socialInsurance: 'Đã tham gia BHXH / BHYT đầy đủ',
      bio: 'Nhà sáng lập CELLA MAKEUP ACADEMY với hơn 9 năm kinh nghiệm đào tạo hàng trăm nghệ sĩ trang điểm thành danh trên cả nước.',
      skills: [
        'Bàn Tay Vàng Châu Á 2025',
        'Makeup Cô Dâu Cao Cấp VIP',
        'Tone Thái Sang Chảnh & Sắc Nét',
        'Layout Trong Veo Hàn Quốc Glowy',
        'Tạo Kiểu Tóc Cô Dâu Nghệ Thuật',
        'Đào Tạo Chuyên Nghiệp Master 1-1',
        'Định Hình Phong Cách Cá Nhân',
      ],
      kpiScore: 99,
      rating: 5.0,
      totalServices: 850,
      totalStudents: 320,
      monthlyRevenue: 120000000,
      baseSalary: 25000000,
      commissionRate: 15,
      bonusAmount: 5000000,
      workDays: '26/26',
      experienceYears: 9,
    };
  });

  const [activeTab, setActiveTab] = useState<'info' | 'payroll' | 'skills' | 'kpi' | 'security'>('info');
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Form edit state
  const [editForm, setEditForm] = useState({ ...profile });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync profile data from Supabase on mount
  useEffect(() => {
    const fetchProfileFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .or(`id.eq.${baseUser.id},email.eq.${baseUser.email}`)
          .maybeSingle();

        if (!error && data) {
          setProfile(prev => {
            const updated = {
              ...prev,
              id: data.id || prev.id,
              fullName: data.full_name || prev.fullName,
              phone: data.phone || prev.phone,
              email: data.email || prev.email,
              avatarUrl: data.avatar_url || prev.avatarUrl,
              coverUrl: data.cover_url || prev.coverUrl,
              role: data.role || prev.role,
              bio: data.bio || prev.bio,
              branch: data.branch_studio || prev.branch,
              baseSalary: Number(data.base_salary) || prev.baseSalary,
              commissionRate: data.commission_rate
                ? Math.round(Number(data.commission_rate) * (Number(data.commission_rate) < 1 ? 100 : 1))
                : prev.commissionRate,
              rating: data.kpi_score ? Number(data.kpi_score) : prev.rating,
            };
            try {
              localStorage.setItem(`${STORAGE_KEY}_${baseUser.id || 'default'}`, JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }
      } catch (err) {
        console.warn('Lấy hồ sơ Supabase:', err);
      }
    };

    fetchProfileFromSupabase();
  }, [baseUser.id, baseUser.email]);

  const handleSaveProfile = async () => {
    setProfile(editForm);
    try {
      localStorage.setItem(`${STORAGE_KEY}_${baseUser.id || 'default'}`, JSON.stringify(editForm));

      // Sync to Supabase profiles table
      await supabase.from('profiles').upsert({
        id: editForm.id,
        full_name: editForm.fullName,
        phone: editForm.phone,
        email: editForm.email,
        avatar_url: editForm.avatarUrl,
        cover_url: editForm.coverUrl,
        role: editForm.role,
        bio: editForm.bio,
        branch_studio: editForm.branch,
        base_salary: editForm.baseSalary,
        commission_rate: (editForm.commissionRate || 10) / 100,
        is_active: true,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Lỗi lưu profile vào Supabase:', e);
    }
    setIsEditModalOpen(false);
    showToast('Đã lưu thông tin hồ sơ nhân viên thành công!');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const updated = { ...profile, avatarUrl: url };
        setProfile(updated);
        try {
          localStorage.setItem(`${STORAGE_KEY}_${baseUser.id || 'default'}`, JSON.stringify(updated));
        } catch {}
        showToast('Đã cập nhật ảnh đại diện nhân viên!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const updated = { ...profile, coverUrl: url };
        setProfile(updated);
        try {
          localStorage.setItem(`${STORAGE_KEY}_${baseUser.id || 'default'}`, JSON.stringify(updated));
        } catch {}
        showToast('Đã cập nhật ảnh bìa mới!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      alert('Mật khẩu mới phải từ 6 ký tự trở lên!');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Xác nhận mật khẩu mới không trùng khớp!');
      return;
    }
    setIsPasswordModalOpen(false);
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    showToast('Đổi mật khẩu tài khoản thành công!');
  };

  // Mock certifications
  const certifications = [
    {
      id: 'cert_1',
      title: 'Bàn Tay Vàng Nghệ Thuật Trang Điểm Châu Á 2025',
      issuer: 'Hiệp hội Làm đẹp Quốc tế Châu Á - Asian Beauty Federation',
      year: '2025',
      grade: 'Huy Chương Vàng Master',
      badge: 'Bàn Tay Vàng 2025',
    },
    {
      id: 'cert_2',
      title: 'Chứng chỉ Nghiệp vụ Sư phạm Dạy nghề Thẩm mỹ',
      issuer: 'Tổng cục Giáo dục Nghề nghiệp - Bộ LĐ-TB&XH',
      year: '2022',
      grade: 'Giảng viên Chuẩn Quốc Gia',
      badge: 'Sư Phạm Dạy Nghề',
    },
    {
      id: 'cert_3',
      title: 'Chứng chỉ Master Bridal Makeup Hàn Quốc',
      issuer: 'K-Beauty Professional Academy Seoul',
      year: '2023',
      grade: 'Hạng Xuất Sắc',
      badge: 'Master Quốc Tế',
    },
  ];

  // Mock Portfolio Lookbook
  const portfolioItems = [
    {
      id: 'pf_1',
      title: 'Cô dâu Tone Thái Sang Chảnh & Sắc Nét',
      category: 'Bridal VIP',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      likes: 384,
      date: 'Mùa cưới 2026',
    },
    {
      id: 'pf_2',
      title: 'Layout Trong Veo Glowy Hàn Quốc',
      category: 'Clean Girl',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
      likes: 420,
      date: 'Tháng 09/2026',
    },
    {
      id: 'pf_3',
      title: 'Dạ Tiệc Thảm Đỏ Douyin Sexy',
      category: 'Event Red Carpet',
      imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
      likes: 512,
      date: 'Tháng 08/2026',
    },
    {
      id: 'pf_4',
      title: 'Áo Dài Ăn Hỏi Cổ Điển Truyền Thống',
      category: 'Dạm Ngõ & Ăn Hỏi',
      imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=80',
      likes: 298,
      date: 'Tháng 08/2026',
    },
  ];

  // Mock Customer Reviews
  const reviews = [
    {
      id: 'rev_1',
      customer: 'Chị Mai Lan (Cô dâu tháng 9)',
      service: 'Gói Cô Dâu VIP Ngày Cưới',
      rating: 5,
      date: '15/09/2026',
      content: 'Chị Hương Phượng makeup siêu có tâm, nền mỏng mịn căng bóng suốt 14 tiếng từ sáng đến tối không mốc phấn chút nào. Khách dự tiệc ai cũng khen nức nở!',
    },
    {
      id: 'rev_2',
      customer: 'Học viên Thu Thảo (Khóa Pro Artist K28)',
      service: 'Khóa Đào Tạo Makeup Chuyên Nghiệp 3 Tháng',
      rating: 5,
      date: '02/09/2026',
      content: 'Master kèm 1:1 siêu nhiệt tình, chỉnh từng nét cọ và góc cầm mút. Giáo trình thực chiến giúp em tự tin ra mở tiệm riêng ngay tại TP. Thái Bình.',
    },
    {
      id: 'rev_3',
      customer: 'Chị Doanh nhân Phương Thảo',
      service: 'Makeup Profile Doanh Nhân & Dạ Hội',
      rating: 5,
      date: '28/08/2026',
      content: 'Rất chuyên nghiệp, đúng giờ và phong thái đỉnh cao. Layout thanh lịch, lên hình chụp flash studio cực kỳ nổi bật.',
    },
  ];

  const roleMeta = ROLE_DISPLAY_NAMES[profile.role] || {
    label: profile.role,
    badgeBg: 'bg-emerald-50 border-emerald-200',
    textColor: 'text-[#264736]',
  };

  const calculatedCommission = Math.round(profile.monthlyRevenue * (profile.commissionRate / 100));
  const estimatedTotalSalary = profile.baseSalary + calculatedCommission + profile.bonusAmount;

  return (
    <div className="min-h-screen bg-[#F4F7F4] pb-28 text-slate-800 animate-in fade-in duration-300 select-none">
      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#1E3A2F]/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold border border-emerald-400/20 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── TOP NAV HEADER (CELLA BRANDING) ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack || (() => onNavigate('home'))}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors active:scale-95"
            title="Quay lại"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-[15px] font-black text-[#1A2820] leading-tight">Hồ Sơ Nhân Viên</h1>
            <p className="text-[10.5px] font-medium text-[#3D5A48]">Mã NV: {profile.employeeCode} • Chi nhánh Thái Bình</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="w-9 h-9 rounded-full bg-[#EAF2EC] text-[#264736] border border-[#264736]/20 hover:bg-[#d8e8dc] flex items-center justify-center transition-colors active:scale-95"
            title="Mã thẻ nhân viên"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setEditForm({ ...profile });
              setIsEditModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#264736] text-white hover:bg-[#1E3A2F] transition-all shadow-xs text-xs font-bold active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Sửa hồ sơ</span>
          </button>
        </div>
      </div>

      {/* ── HERO BANNER & AVATAR CARD ── */}
      <div className="relative bg-white border-b border-slate-200 shadow-xs">
        {/* Cover Photo */}
        <div className="relative h-44 sm:h-52 w-full bg-[#1A2820] overflow-hidden">
          <img
            src={profile.coverUrl}
            alt="Cover"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Change cover button */}
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/45 hover:bg-black/65 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/20 transition-all active:scale-95"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Đổi ảnh bìa</span>
          </button>
          <input
            type="file"
            ref={coverInputRef}
            onChange={handleCoverChange}
            accept="image/*"
            className="hidden"
          />

          {/* ── NÚT MENU THẢ XUỐNG HỒ SƠ NHÂN VIÊN ── */}
          <div className="absolute top-12 right-3 z-30">
            <button
              type="button"
              onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
              className="flex items-center gap-1.5 bg-[#264736]/90 hover:bg-[#1E3A2F] backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-emerald-400/30 transition-all active:scale-95 shadow-md"
            >
              <Menu className="w-3.5 h-3.5 text-amber-300" />
              <span>Menu hồ sơ</span>
              <ChevronDown className={`w-3 h-3 text-white/90 transition-transform duration-200 ${isMenuDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Popup */}
            {isMenuDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-30 bg-black/30 backdrop-blur-2xs" 
                  onClick={() => setIsMenuDropdownOpen(false)} 
                />
                <div className="absolute right-0 top-9 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2 z-40 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10.5px] font-black text-slate-400 uppercase tracking-wider">Danh mục hồ sơ</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800">5 mục</span>
                  </div>

                  <div className="py-1 space-y-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => { setActiveTab('info'); setIsMenuDropdownOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-bold transition-colors ${
                        activeTab === 'info' ? 'bg-[#264736] text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <FileText className={`w-4 h-4 ${activeTab === 'info' ? 'text-white' : 'text-[#264736]'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">Hồ sơ cá nhân & Liên hệ</div>
                        <div className={`text-[10px] font-normal truncate ${activeTab === 'info' ? 'text-emerald-100' : 'text-slate-400'}`}>Họ tên, SĐT, Email, CCCD, Tiểu sử</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveTab('payroll'); setIsMenuDropdownOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-bold transition-colors ${
                        activeTab === 'payroll' ? 'bg-[#264736] text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <DollarSign className={`w-4 h-4 ${activeTab === 'payroll' ? 'text-white' : 'text-amber-600'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">Lương căn bản & Thu nhập</div>
                        <div className={`text-[10px] font-normal truncate ${activeTab === 'payroll' ? 'text-emerald-100' : 'text-slate-400'}`}>Lương CB, hoa hồng, thưởng nóng</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveTab('skills'); setIsMenuDropdownOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-bold transition-colors ${
                        activeTab === 'skills' ? 'bg-[#264736] text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Award className={`w-4 h-4 ${activeTab === 'skills' ? 'text-white' : 'text-amber-500'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">Kỹ năng & Tác phẩm Makeup</div>
                        <div className={`text-[10px] font-normal truncate ${activeTab === 'skills' ? 'text-emerald-100' : 'text-slate-400'}`}>Bàn Tay Vàng, Lookbook, Bằng cấp</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveTab('kpi'); setIsMenuDropdownOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-bold transition-colors ${
                        activeTab === 'kpi' ? 'bg-[#264736] text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <TrendingUp className={`w-4 h-4 ${activeTab === 'kpi' ? 'text-white' : 'text-blue-600'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">Hiệu suất & Chấm công KPI</div>
                        <div className={`text-[10px] font-normal truncate ${activeTab === 'kpi' ? 'text-emerald-100' : 'text-slate-400'}`}>Đánh giá 5.0★, 850+ ca, 26/26 công</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveTab('security'); setIsMenuDropdownOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-bold transition-colors ${
                        activeTab === 'security' ? 'bg-[#264736] text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Shield className={`w-4 h-4 ${activeTab === 'security' ? 'text-white' : 'text-slate-600'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="truncate">Bảo mật & Cài đặt tài khoản</div>
                        <div className={`text-[10px] font-normal truncate ${activeTab === 'security' ? 'text-emerald-100' : 'text-slate-400'}`}>Mật khẩu, mã PIN, phiên làm việc</div>
                      </div>
                    </button>
                  </div>

                  <div className="pt-1.5 mt-1 border-t border-slate-100 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditForm({ ...profile });
                        setIsEditModalOpen(true);
                        setIsMenuDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 font-bold text-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Chỉnh sửa thông tin & Lương</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsQrModalOpen(true);
                        setIsMenuDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 font-bold text-xs"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#264736]" />
                      <span>Xem thẻ số nhân viên</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Branch badge on bottom of cover */}
          <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-white/95 text-[11px] font-medium bg-black/45 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
            <Building2 className="w-3 h-3 text-amber-300" />
            <span>{profile.branch}</span>
          </div>
        </div>

        {/* Avatar & Main Info */}
        <div className="px-5 pt-0 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-14 mb-3.5 gap-3">
            <div className="relative inline-block w-28 h-28 shrink-0">
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-28 h-28 rounded-full object-cover ring-4 ring-white shadow-xl bg-white"
              />
              {/* Online pulse status */}
              <span className="absolute bottom-1 right-2 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full ring-2 ring-emerald-400/40 animate-pulse" title="Đang trong ca trực" />

              {/* Change Avatar Button */}
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#264736] text-white flex items-center justify-center border-2 border-white shadow-md hover:bg-[#1E3A2F] transition-colors"
                title="Đổi ảnh đại diện"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Quick Action Contact Pills */}
            <div className="flex items-center gap-2 mt-2 sm:mt-0 flex-wrap">
              <a
                href={`tel:${profile.phone}`}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#264736]" />
                <span>Gọi điện</span>
              </a>
              <a
                href={`https://zalo.me/${profile.phone.replace(/\s+/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors border border-blue-200/60"
              >
                <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Zalo</span>
              </a>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EAF2EC] hover:bg-[#d8e8dc] text-[#264736] font-bold text-xs transition-colors border border-[#264736]/20"
              >
                <QrCode className="w-3.5 h-3.5 text-[#264736]" />
                <span>Thẻ số</span>
              </button>
            </div>
          </div>

          {/* Name & Title (Chuẩn cấu trúc dữ liệu thực tế) */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{profile.fullName}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
                <Crown className="w-3 h-3 text-amber-600" />
                <span>Master Artist</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-600 font-semibold">
              <span className="font-extrabold text-[#264736]">{profile.title}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">{profile.department}</span>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                {profile.employeeCode}
              </span>
            </div>

            {/* Khối Highlight Lương Căn Bản & Chế Độ Đãi Ngộ */}
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div 
                onClick={() => setActiveTab('payroll')}
                className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 cursor-pointer hover:bg-amber-100/70 transition-all"
              >
                <span className="text-[10.5px] text-amber-800 font-bold block">💵 Lương căn bản</span>
                <span className="text-sm font-black text-slate-900 mt-0.5 block">
                  {profile.baseSalary.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div 
                onClick={() => setActiveTab('payroll')}
                className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 cursor-pointer hover:bg-emerald-100/70 transition-all"
              >
                <span className="text-[10.5px] text-emerald-800 font-bold block">🎯 Hoa hồng DV</span>
                <span className="text-sm font-black text-emerald-700 mt-0.5 block">
                  {profile.commissionRate}% doanh số
                </span>
              </div>

              <div 
                onClick={() => setActiveTab('kpi')}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-all"
              >
                <span className="text-[10.5px] text-slate-500 font-bold block">⭐ Đánh giá</span>
                <span className="text-sm font-black text-amber-600 mt-0.5 block">
                  {profile.rating} / 5.0
                </span>
              </div>

              <div 
                onClick={() => setActiveTab('kpi')}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-all"
              >
                <span className="text-[10.5px] text-slate-500 font-bold block">🏆 Hoàn thành</span>
                <span className="text-sm font-black text-[#264736] mt-0.5 block">
                  {profile.totalServices}+ ca
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── THANH MENU RIÊNG CỦA HỒ SƠ NHÂN VIÊN (DROPDOWN MENU BAR) ── */}
      <div className="sticky top-[61px] z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-2.5 shadow-xs">
        <div className="flex items-center justify-between gap-2 max-w-4xl mx-auto">
          {/* Dropdown Selector Button */}
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 font-bold text-xs text-slate-800 transition-all border border-slate-200/60 active:scale-98 shadow-2xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Mục đang xem:</span>
                <span className="flex items-center gap-1.5 text-[#264736] font-black truncate">
                  {activeTab === 'info' && <><FileText className="w-3.5 h-3.5" /> 1. Hồ sơ cá nhân & Liên hệ</>}
                  {activeTab === 'payroll' && <><DollarSign className="w-3.5 h-3.5 text-amber-600" /> 2. Lương căn bản & Thu nhập</>}
                  {activeTab === 'skills' && <><Award className="w-3.5 h-3.5 text-amber-500" /> 3. Kỹ năng & Tác phẩm Makeup</>}
                  {activeTab === 'kpi' && <><TrendingUp className="w-3.5 h-3.5 text-blue-600" /> 4. Hiệu suất & Chấm công KPI</>}
                  {activeTab === 'security' && <><Shield className="w-3.5 h-3.5 text-slate-600" /> 5. Bảo mật & Cài đặt tài khoản</>}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform duration-200 ${isMenuDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Quick Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#264736] text-white hover:bg-[#1E3A2F] transition-all font-bold text-xs shadow-xs active:scale-95 shrink-0"
          >
            <Menu className="w-3.5 h-3.5 text-amber-300" />
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: HỒ SƠ CÁ NHÂN & LIÊN HỆ ── */}
      {activeTab === 'info' && (
        <div className="p-4 sm:p-5 space-y-4 max-w-4xl mx-auto animate-in fade-in duration-200">
          {/* Card: Thông tin định danh cá nhân */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#264736]" />
                <span>Thông tin cá nhân & Liên lạc</span>
              </h3>
              <button
                onClick={() => {
                  setEditForm({ ...profile });
                  setIsEditModalOpen(true);
                }}
                className="text-xs font-bold text-[#264736] hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Họ và tên đầy đủ:</span>
                <span className="font-bold text-slate-800 text-sm">{profile.fullName}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Số điện thoại liên lạc:</span>
                <span className="font-bold text-slate-800 text-sm text-[#264736] font-mono">{profile.phone}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Email công vụ:</span>
                <span className="font-bold text-slate-800 text-sm break-all font-mono">{profile.email}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Ngày sinh & Giới tính:</span>
                <span className="font-bold text-slate-800 text-sm">{profile.birthday} • {profile.gender}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Số CCCD / Định danh:</span>
                <span className="font-bold text-slate-800 text-sm font-mono">{profile.idCard} (Cấp: {profile.idCardDate})</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Liên hệ khẩn cấp:</span>
                <span className="font-bold text-slate-800 text-sm">{profile.emergencyContact}</span>
              </div>
              <div className="sm:col-span-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Địa chỉ thường trú / Nơi ở hiện tại:</span>
                <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  {profile.address}
                </span>
              </div>
              <div className="sm:col-span-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Tiểu sử & Giới thiệu ngắn:</span>
                <p className="font-medium text-slate-700 text-xs leading-relaxed italic">"{profile.bio}"</p>
              </div>
            </div>
          </div>

          {/* Card: Thông tin công tác & Hợp đồng */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Briefcase className="w-4 h-4 text-emerald-700" />
              <span>Hợp đồng lao động & Cơ cấu tổ chức</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Mã nhân sự CELLA:</span>
                <span className="font-black text-[#264736] text-sm font-mono">{profile.employeeCode}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Loại hợp đồng:</span>
                <span className="font-bold text-emerald-700 text-sm">{profile.contractType}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Số hợp đồng:</span>
                <span className="font-bold text-slate-800 text-sm font-mono">{profile.contractNumber}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Ngày gia nhập chính thức:</span>
                <span className="font-bold text-slate-800 text-sm">{profile.joinedDate}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Cơ sở công tác chính:</span>
                <span className="font-bold text-slate-800 text-sm">{profile.branch}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-medium block mb-0.5">Bảo hiểm xã hội / Y tế:</span>
                <span className="font-bold text-teal-700 text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  {profile.socialInsurance}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: LƯƠNG CĂN BẢN & THU NHẬP ── */}
      {activeTab === 'payroll' && (
        <div className="p-4 sm:p-5 space-y-4 max-w-4xl mx-auto animate-in fade-in duration-200">
          {/* Card: Bảng tính thu nhập tháng */}
          <div className="bg-gradient-to-br from-[#1E3A2F] via-[#264736] to-[#12241A] rounded-3xl p-5 text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">Ước tính thu nhập kỳ này</span>
                <h3 className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5">
                  {estimatedTotalSalary.toLocaleString('vi-VN')} VNĐ
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-emerald-200 border border-white/20">
                Tháng 09/2026
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
                <span className="text-emerald-200/80 block text-[11px]">Lương căn bản cố định:</span>
                <span className="text-base font-black text-white mt-1 block">
                  {profile.baseSalary.toLocaleString('vi-VN')} đ
                </span>
                <span className="text-[10px] text-emerald-300/70 block mt-0.5">Chi trả ngày 05 hàng tháng</span>
              </div>
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
                <span className="text-emerald-200/80 block text-[11px]">Hoa hồng doanh thu ({profile.commissionRate}%):</span>
                <span className="text-base font-black text-amber-300 mt-1 block">
                  +{calculatedCommission.toLocaleString('vi-VN')} đ
                </span>
                <span className="text-[10px] text-emerald-300/70 block mt-0.5">Từ {profile.monthlyRevenue.toLocaleString('vi-VN')} đ doanh thu</span>
              </div>
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
                <span className="text-emerald-200/80 block text-[11px]">Thưởng KPI xuất sắc:</span>
                <span className="text-base font-black text-emerald-300 mt-1 block">
                  +{profile.bonusAmount.toLocaleString('vi-VN')} đ
                </span>
                <span className="text-[10px] text-emerald-300/70 block mt-0.5">Vượt KPI mùa cưới</span>
              </div>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl border border-white/15 flex items-center justify-between text-xs text-white/90">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-300" />
                <span>Doanh số dịch vụ mang về tháng này:</span>
              </span>
              <strong className="text-white font-mono text-sm">{profile.monthlyRevenue.toLocaleString('vi-VN')} đ</strong>
            </div>
          </div>

          {/* Card: Cơ chế chính sách lương */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <DollarSign className="w-4 h-4 text-emerald-700" />
              <span>Chính sách lương căn bản & Cơ chế hoa hồng</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/70">
                <span className="text-amber-900 font-bold block mb-1">Mức lương căn bản:</span>
                <span className="text-base font-black text-slate-900">{profile.baseSalary.toLocaleString('vi-VN')} đ / tháng</span>
                <span className="text-[11px] text-slate-500 block mt-1">Hưởng cố định theo cấp bậc chuyên môn Master Artist</span>
              </div>

              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/60">
                <span className="text-emerald-800 font-bold block mb-1">Tỷ lệ hoa hồng dịch vụ:</span>
                <span className="text-base font-black text-emerald-700">{profile.commissionRate}% trên doanh thu cá nhân</span>
                <span className="text-[11px] text-emerald-600 block mt-1">Hưởng trực tiếp trên từng ca khách makeup hoàn thành</span>
              </div>
            </div>
          </div>

          {/* Card: Tài khoản ngân hàng nhận lương */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#264736]" />
                <span className="text-sm font-black text-slate-900">Tài khoản Ngân hàng nhận lương</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-[#EAF2EC] px-2.5 py-0.5 rounded-full border border-[#264736]/20">
                Chính thức
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-[11px] mb-1">Số tài khoản ngân hàng:</span>
                <div className="text-base font-mono font-black text-slate-900 flex items-center justify-between">
                  <span>{profile.bankAccount}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(profile.bankAccount);
                      showToast('Đã sao chép số tài khoản!');
                    }}
                    className="p-1 hover:bg-slate-200 rounded-lg text-slate-500"
                    title="Sao chép"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-[11px] mb-1">Ngân hàng thụ hưởng & Chủ tài khoản:</span>
                <span className="text-sm font-bold text-slate-900 block">{profile.bankName}</span>
                <span className="text-xs font-semibold text-slate-600 block mt-0.5">{profile.bankHolder}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: KỸ NĂNG & TÁC PHẨM MAKEUP ── */}
      {activeTab === 'skills' && (
        <div className="p-4 sm:p-5 space-y-4 max-w-4xl mx-auto animate-in fade-in duration-200">
          {/* Card: Kỹ năng chuyên môn */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Kỹ thuật chuyên môn sở trường</span>
            </h3>
            <p className="text-xs text-slate-500">Các layout và kỹ thuật chuyên môn khẳng định thương hiệu CELLA MAKEUP ACADEMY:</p>

            <div className="flex flex-wrap gap-2 pt-1">
              {profile.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-xl bg-[#EAF2EC] text-[#264736] font-bold text-xs border border-[#264736]/20 shadow-2xs flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#264736]" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Card: Bằng cấp & Chứng chỉ */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Bằng cấp & Chứng chỉ Nghề nghiệp</span>
            </h3>

            <div className="space-y-2.5">
              {certifications.map((cert) => (
                <div key={cert.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{cert.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{cert.issuer}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-400">Năm: {cert.year}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          {cert.grade}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
                    Đã xác minh
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Lookbook Tác phẩm */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#264736]" />
                <span>Lookbook tác phẩm makeup nổi bật</span>
              </h3>
              <span className="text-xs font-bold text-slate-400">{portfolioItems.length} tác phẩm</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {portfolioItems.map((item) => (
                <div key={item.id} className="group relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs aspect-3/4">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-2.5 text-white">
                    <span className="text-[9px] font-bold bg-[#264736] px-1.5 py-0.5 rounded-md w-max mb-1">
                      {item.category}
                    </span>
                    <h5 className="text-xs font-bold leading-tight line-clamp-1">{item.title}</h5>
                    <div className="flex items-center justify-between text-[10px] text-white/80 mt-1">
                      <span className="flex items-center gap-1 text-rose-400">
                        <Heart className="w-2.5 h-2.5 fill-rose-400" />
                        {item.likes}
                      </span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: HIỆU SUẤT & CHẤM CÔNG KPI ── */}
      {activeTab === 'kpi' && (
        <div className="p-4 sm:p-5 space-y-4 max-w-4xl mx-auto animate-in fade-in duration-200">
          {/* Card: 4 Ô Chỉ số KPI tổng quan */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#264736]" />
                <span>Tổng hợp Chỉ số Hiệu suất & Đánh giá</span>
              </h3>
              <span className="text-xs font-bold text-emerald-800 bg-[#EAF2EC] px-2.5 py-1 rounded-full border border-[#264736]/20">
                Tháng 09/2026
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/70">
                <div className="flex items-center justify-center gap-1 text-amber-600 font-black text-xl">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{profile.rating}</span>
                </div>
                <div className="text-[11px] font-bold text-amber-700 mt-1">Đánh giá sao TB</div>
              </div>

              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/70">
                <div className="text-xl font-black text-[#264736]">{profile.totalServices}+</div>
                <div className="text-[11px] font-bold text-emerald-800 mt-1">Ca dịch vụ makeup</div>
              </div>

              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/70">
                <div className="text-xl font-black text-emerald-700">{profile.kpiScore}%</div>
                <div className="text-[11px] font-bold text-emerald-800 mt-1">KPI hoàn thành</div>
              </div>

              <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-200/70">
                <div className="text-xl font-black text-purple-700">{profile.workDays}</div>
                <div className="text-[11px] font-bold text-purple-700 mt-1">Ngày công tháng</div>
              </div>
            </div>
          </div>

          {/* Card: Chỉ số KPI & Chấm công */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Clock className="w-4 h-4 text-[#264736]" />
              <span>Chỉ số Chấm công & Tác phong làm việc</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="text-lg font-black text-emerald-700">26 / 26</div>
                <div className="text-[11px] font-bold text-emerald-600 mt-0.5">Ngày công chuẩn</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="text-lg font-black text-blue-700">0 Lần</div>
                <div className="text-[11px] font-bold text-blue-600 mt-0.5">Đi trễ / Về sớm</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="text-lg font-black text-purple-700">12 Ca</div>
                <div className="text-[11px] font-bold text-purple-600 mt-0.5">Ca trực cuối tuần VIP</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="text-lg font-black text-amber-700">100%</div>
                <div className="text-[11px] font-bold text-amber-600 mt-0.5">Đánh giá 5 sao</div>
              </div>
            </div>
          </div>

          {/* Card: Đánh giá gần nhất của khách hàng */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Nhận xét thực tế từ khách hàng</span>
              </h3>
              <span className="text-xs font-bold text-emerald-700">Điểm TB: 5.0 / 5.0</span>
            </div>

            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{rev.customer}</h4>
                      <span className="text-[10px] text-[#264736] font-semibold">{rev.service}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <span>{'★'.repeat(rev.rating)}</span>
                      <span className="text-[10px] text-slate-400 ml-1">{rev.date}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">"{rev.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: BẢO MẬT & CÀI ĐẶT ── */}
      {activeTab === 'security' && (
        <div className="p-4 sm:p-5 space-y-4 max-w-4xl mx-auto animate-in fade-in duration-200">
          {/* Card: Bảo mật tài khoản */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Lock className="w-4 h-4 text-[#264736]" />
              <span>Bảo mật đăng nhập & Tài khoản</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EAF2EC] text-[#264736] flex items-center justify-center">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Mật khẩu đăng nhập</h4>
                    <p className="text-[11px] text-slate-400">Đổi định kỳ 90 ngày để bảo vệ dữ liệu</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 shadow-2xs transition-colors"
                >
                  Đổi mật khẩu
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Xác thực 2 bước (2FA OTP)</h4>
                    <p className="text-[11px] text-slate-400">Bảo vệ phiên làm việc qua SMS OTP</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setTwoFactorEnabled(!twoFactorEnabled);
                    showToast(!twoFactorEnabled ? 'Đã kích hoạt xác thực 2 bước!' : 'Đã tắt xác thực 2 bước');
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative ${twoFactorEnabled ? 'bg-[#264736]' : 'bg-slate-300'}`}
                >
                  <span className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${twoFactorEnabled ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Card: Thẻ nhân viên số */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF2EC] text-[#264736] flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Thẻ Nhân Viên Kỹ Thuật Số (Digital ID)</h4>
                <p className="text-[11px] text-slate-400">Dùng quét chấm công và check-in đón khách tại chi nhánh</p>
              </div>
            </div>
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#264736] text-white font-bold text-xs hover:bg-[#1E3A2F] transition-colors shadow-xs"
            >
              Mở thẻ
            </button>
          </div>

          {/* Card: Đăng xuất & Chuyển tài khoản */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quản lý phiên làm việc</h4>
            <button
              onClick={onSwitchAccount || (() => onNavigate('auth'))}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#264736]" />
                <span>Chuyển đổi tài khoản khác</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={onLogout || (() => onNavigate('auth'))}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors border border-rose-100"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất khỏi hệ thống</span>
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: CHỈNH SỬA HỒ SƠ & LƯƠNG CĂN BẢN ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#264736]" />
                <span>Chỉnh Sửa Hồ Sơ & Lương Căn Bản</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs no-scrollbar">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Họ và tên nhân viên *</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#264736] font-semibold text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số điện thoại *</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#264736] font-medium font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email công vụ</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#264736] font-medium"
                  />
                </div>
              </div>

              {/* KHỐI LƯƠNG CĂN BẢN VÀ HOA HỒNG (NỔI BẬT) */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-3">
                <span className="text-[12px] font-black uppercase tracking-wider text-amber-900 block">
                  💵 Chính sách Lương căn bản & Hoa hồng
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Lương căn bản (VNĐ) *</label>
                    <input
                      type="number"
                      value={editForm.baseSalary}
                      onChange={(e) => setEditForm({ ...editForm, baseSalary: Number(e.target.value) || 0 })}
                      step="500000"
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:border-[#264736] font-black text-slate-900 text-sm bg-white"
                    />
                    <span className="text-[10.5px] font-bold text-emerald-800 block mt-1">
                      = {Number(editForm.baseSalary || 0).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Tỷ lệ hoa hồng (%) *</label>
                    <input
                      type="number"
                      value={editForm.commissionRate}
                      onChange={(e) => setEditForm({ ...editForm, commissionRate: Number(e.target.value) || 0 })}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:border-[#264736] font-black text-[#264736] text-sm bg-white"
                    />
                    <span className="text-[10.5px] font-bold text-slate-500 block mt-1">
                      = {editForm.commissionRate}% doanh số
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ngày sinh</label>
                  <input
                    type="text"
                    value={editForm.birthday}
                    onChange={(e) => setEditForm({ ...editForm, birthday: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#264736] font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số CCCD / CMND</label>
                  <input
                    type="text"
                    value={editForm.idCard}
                    onChange={(e) => setEditForm({ ...editForm, idCard: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#264736] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Chức danh chuyên môn</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#264736] font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cơ sở / Chi nhánh làm việc</label>
                <input
                  type="text"
                  value={editForm.branch}
                  onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#264736] font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Địa chỉ thường trú</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#264736] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số tài khoản nhận lương</label>
                  <input
                    type="text"
                    value={editForm.bankAccount}
                    onChange={(e) => setEditForm({ ...editForm, bankAccount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#264736] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tên ngân hàng</label>
                  <input
                    type="text"
                    value={editForm.bankName}
                    onChange={(e) => setEditForm({ ...editForm, bankName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#264736] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tiểu sử & Giới thiệu</label>
                <textarea
                  value={editForm.bio || ''}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#264736] font-medium resize-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50/60">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-5 py-2.5 rounded-xl bg-[#264736] hover:bg-[#1E3A2F] text-white font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Lưu thay đổi hồ sơ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: MÃ QR THẺ NHÂN VIÊN SỐ ── */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-[#264736]/20 shadow-md mb-3">
              <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
            </div>

            <h3 className="text-base font-black text-slate-900">{profile.fullName}</h3>
            <p className="text-xs text-[#264736] font-bold mt-0.5">{profile.title}</p>
            <span className="mt-1 px-3 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-[#EAF2EC] text-[#264736] border border-[#264736]/20">
              {profile.employeeCode}
            </span>

            {/* QR Code Canvas Mockup */}
            <div className="my-5 p-4 bg-white rounded-2xl border-2 border-dashed border-[#264736]/30 shadow-inner flex flex-col items-center justify-center">
              <div className="w-44 h-44 bg-slate-900 rounded-xl p-2 flex items-center justify-center relative">
                <div className="w-full h-full bg-white rounded-lg p-2.5 flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                      JSON.stringify({
                        id: profile.id,
                        code: profile.employeeCode,
                        name: profile.fullName,
                        phone: profile.phone,
                        branch: profile.branch,
                      })
                    )}`}
                    alt="Employee QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold mt-2.5">Quét để chấm công & định danh nhân viên</p>
            </div>

            <div className="w-full flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(profile.employeeCode);
                  showToast('Đã sao chép mã nhân viên!');
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép mã</span>
              </button>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#264736] text-white hover:bg-[#1E3A2F] font-bold text-xs transition-colors shadow-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: ĐỔI MẬT KHẨU ── */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 p-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-[#264736]" />
                <span>Đổi Mật Khẩu Tài Khoản</span>
              </h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#264736]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mật khẩu mới (tối thiểu 6 ký tự)</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#264736]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nhập lại mật khẩu mới</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#264736]"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#264736] text-white font-bold hover:bg-[#1E3A2F] transition-colors shadow-xs"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
